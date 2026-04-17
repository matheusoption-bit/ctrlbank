import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractTextFromImageWithOcr, extractTextFromPdf, isPdfMimeType } from "@/lib/inbox/ocr";
import { InboxSource, parseInboxRawInput } from "@/lib/inbox/parse";
import { verifyTwilioSignature } from "@/lib/inbox/security";

export const runtime = "nodejs";

function twiml(message: string, status = 200) {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`, {
    status,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

function normalizeWhatsappNumber(value: string | null) {
  if (!value) return null;
  const normalized = value.replace(/^whatsapp:/i, "").trim();
  return /^\+[1-9]\d{7,14}$/.test(normalized) ? normalized : null;
}

async function fetchMediaAsBase64(url: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const headers: HeadersInit = {};

  if (accountSid && authToken) {
    headers.Authorization = `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error("Falha ao baixar mídia do WhatsApp");
  }

  const mimeType = response.headers.get("content-type") ?? "image/jpeg";
  const buffer = Buffer.from(await response.arrayBuffer());
  return {
    mimeType,
    base64: buffer.toString("base64"),
    buffer,
  };
}

function formatAmount(amount: number | null | undefined) {
  if (typeof amount !== "number" || Number.isNaN(amount)) return null;
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const params = Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, value.toString()]));

  const isValidSignature = verifyTwilioSignature({
    signature: req.headers.get("x-twilio-signature"),
    authToken: process.env.TWILIO_AUTH_TOKEN,
    url: req.url,
    params,
  });

  if (!isValidSignature) {
    return twiml("Assinatura inválida.", 401);
  }

  const from = normalizeWhatsappNumber(params.From ?? null);
  const body = (params.Body ?? "").trim();
  const mediaUrl = params.MediaUrl0;

  if (!from) {
    return twiml("Número inválido.", 400);
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ phone: from }, { whatsappNumber: from }],
    },
    select: { id: true, householdId: true },
  });

  if (!user) {
    return twiml("Número não cadastrado no CtrlBank. Acesse o app para vincular.");
  }

  try {
    let rawInput = body;
    let source: InboxSource = "whatsapp_text";

    if (mediaUrl) {
      const media = await fetchMediaAsBase64(mediaUrl);
      if (isPdfMimeType(media.mimeType)) {
        rawInput = await extractTextFromPdf(media.buffer);
        source = "via_pdf";
      } else {
        rawInput = await extractTextFromImageWithOcr(media.base64, media.mimeType);
        source = "via_ocr";
      }
    }

    if (!rawInput) {
      return twiml("⚠️ Não consegui identificar. Abra a Inbox no app para revisar.");
    }

    const parsed = await parseInboxRawInput({
      userId: user.id,
      householdId: user.householdId,
      rawInput,
      source,
    });

    const draft = parsed.transactionDraft;
    const amount = formatAmount(draft?.amount ?? null);

    if (draft?.description && amount && draft?.categoryName) {
      return twiml(`✅ Registrado: ${draft.description} — R$ ${amount} em ${draft.categoryName}. Abra o app para confirmar.`);
    }

    return twiml("⚠️ Não consegui identificar. Abra a Inbox no app para revisar.");
  } catch (error) {
    console.error("[whatsapp-webhook] erro:", error);
    return twiml("⚠️ Não consegui identificar. Abra a Inbox no app para revisar.");
  }
}
