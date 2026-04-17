import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractTextFromImageWithOcr, extractTextFromPdf, isImageMimeType, isPdfMimeType } from "@/lib/inbox/ocr";
import { InboxSource, parseInboxRawInput } from "@/lib/inbox/parse";
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
  const match = from.match(/<([^>]+)>/);
  return (match?.[1] ?? from).trim().toLowerCase();
}

function htmlToText(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
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
    let source: InboxSource = "email_text";

    const attachment = payload.Attachments?.find((item) => {
      const mimeType = item.ContentType ?? "";
      return isImageMimeType(mimeType) || isPdfMimeType(mimeType);
    });

    if (attachment?.Content && attachment.ContentType) {
      const buffer = Buffer.from(attachment.Content, "base64");

      if (isImageMimeType(attachment.ContentType)) {
        rawInput = await extractTextFromImageWithOcr(buffer.toString("base64"), attachment.ContentType);
        source = "via_ocr";
      } else if (isPdfMimeType(attachment.ContentType)) {
        rawInput = await extractTextFromPdf(buffer);
        source = "via_pdf";
      }
    }

    if (!rawInput) {
      rawInput = payload.TextBody?.trim() || htmlToText(payload.HtmlBody || "");
    }

    if (!rawInput) {
      return NextResponse.json({ ok: true });
    }

    await parseInboxRawInput({
      userId: user.id,
      householdId: user.householdId,
      rawInput,
      source,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[email-webhook] erro:", error);
    return NextResponse.json({ ok: true });
  }
}
