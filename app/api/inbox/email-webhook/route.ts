import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractTextFromImageWithOcr, extractTextFromPdf, isImageMimeType, isPdfMimeType } from "@/lib/inbox/ocr";
import { InboxChannel, InboxInputType, InboxDocumentKind, parseInboxRawInput } from "@/lib/inbox/parse";
import { verifyPostmarkWebhook } from "@/lib/inbox/security";

export const runtime = "nodejs";

type PostmarkAttachment = {
  Name?: string;
  ContentType?: string;
  Content?: string;
};

type PostmarkInboundPayload = {
  From?: string;
  Subject?: string;
  TextBody?: string;
  HtmlBody?: string;
  Attachments?: PostmarkAttachment[];
};

function extractEmail(from: string | undefined) {
  if (!from) return null;
  const start = from.indexOf("<");
  const end = from.lastIndexOf(">");
  const value = start >= 0 && end > start ? from.slice(start + 1, end) : from;
  return value.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  if (!verifyPostmarkWebhook(req.headers)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const payload = (await req.json()) as PostmarkInboundPayload;
    const senderEmail = extractEmail(payload.From);

    if (!senderEmail) {
      return NextResponse.json({ ok: true });
    }

    const user = await prisma.user.findUnique({
      where: { email: senderEmail },
      select: { id: true, householdId: true },
    });

    if (!user) {
      console.info("[email-webhook] remetente sem usuário:", senderEmail);
      return NextResponse.json({ ok: true });
    }

    let rawInput = "";
    let inputType: InboxInputType = "text";
    let documentKind: InboxDocumentKind = "unknown";

    const attachment = payload.Attachments?.find((item) => {
      const mimeType = item.ContentType ?? "";
      return isImageMimeType(mimeType) || isPdfMimeType(mimeType) || mimeType === "text/csv" || mimeType === "application/x-ofx" || item.Name?.toLowerCase().endsWith(".ofx") || item.Name?.toLowerCase().endsWith(".csv");
    });

    if (attachment?.Content && attachment.ContentType) {
      const buffer = Buffer.from(attachment.Content, "base64");
      const name = attachment.Name?.toLowerCase() || "";

      if (name.endsWith(".ofx") || attachment.ContentType === "application/x-ofx") {
        rawInput = buffer.toString("utf-8");
        inputType = "ofx";
        documentKind = "statement";
      } else if (name.endsWith(".csv") || attachment.ContentType === "text/csv") {
        rawInput = buffer.toString("utf-8");
        inputType = "csv";
        documentKind = "statement";
      } else if (isImageMimeType(attachment.ContentType)) {
        rawInput = await extractTextFromImageWithOcr(buffer.toString("base64"), attachment.ContentType);
        inputType = "image";
      } else if (isPdfMimeType(attachment.ContentType)) {
        rawInput = await extractTextFromPdf(buffer);
        inputType = "pdf";
      }
    }

    if (!rawInput) {
      rawInput = payload.TextBody?.trim() || (payload.HtmlBody ?? "").trim();
    }

    if (!rawInput) {
      return NextResponse.json({ ok: true });
    }

    await parseInboxRawInput({
      userId: user.id,
      householdId: user.householdId,
      rawInput,
      channel: "email",
      inputType,
      documentKind,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[email-webhook] erro:", error);
    return NextResponse.json({ ok: true });
  }
}
