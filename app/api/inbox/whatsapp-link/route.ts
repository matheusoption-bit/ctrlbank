import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTwilioSignature } from "@/lib/inbox/security";
import { enforceRateLimit } from "@/lib/security/rate-limit";

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

function extractLinkToken(body: string) {
  const match = body.match(/CTRL-([A-Z0-9]{6})/i);
  if (match?.[1]) return match[1].toUpperCase();
  const direct = body.trim().toUpperCase();
  return /^[A-Z0-9]{6}$/.test(direct) ? direct : null;
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
  const token = extractLinkToken(body);

  const rate = await enforceRateLimit({
    key: `whatsapp:link:${from ?? "unknown"}:${token ?? "invalid"}`,
    limit: 20,
    windowSeconds: 60 * 30,
  });
  if (!rate.allowed) {
    return twiml("⚠️ Muitas tentativas. Aguarde alguns minutos e tente novamente.", 429);
  }

  if (!from || !token) {
    return twiml("⚠️ Código inválido. Envie no formato CTRL-XXXXXX.");
  }

  const user = await prisma.user.findFirst({
    where: {
      whatsappLinkToken: token,
      whatsappLinkTokenExpiresAt: { gt: new Date() },
    },
    select: { id: true },
  });

  if (!user) {
    return twiml("⚠️ Código inválido ou expirado. Gere um novo código no app.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      whatsappNumber: from,
      whatsappLinkToken: null,
      whatsappLinkTokenExpiresAt: null,
    },
  });

  return twiml("📱 Número vinculado com sucesso ao CtrlBank! Agora você pode enviar comprovantes diretamente por aqui.");
}
