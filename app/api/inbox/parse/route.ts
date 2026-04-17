import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractTextFromImageWithOcr, extractTextFromPdf, isImageMimeType, isPdfMimeType } from "@/lib/inbox/ocr";
import { InboxSource, parseInboxRawInput } from "@/lib/inbox/parse";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });

  try {
    let rawInput = "";
    let source: InboxSource = "manual_text";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      rawInput = (formData.get("rawInput")?.toString() ?? "").trim();
      const file = formData.get("file") as File | null;

      if (file && file.size > 0) {
        const mimeType = file.type || "application/octet-stream";
        const buffer = Buffer.from(await file.arrayBuffer());

        if (isImageMimeType(mimeType)) {
          rawInput = await extractTextFromImageWithOcr(buffer.toString("base64"), mimeType);
          source = "via_ocr";
        } else if (isPdfMimeType(mimeType)) {
          rawInput = await extractTextFromPdf(buffer);
          source = "via_pdf";
        } else {
          return NextResponse.json({ error: "Formato de arquivo não suportado" }, { status: 400 });
        }
      }
    } else {
      const body = await req.json();
      rawInput = (body?.rawInput ?? "").trim();
      source = body?.source === "via_ocr" || body?.source === "via_pdf" || body?.source === "email_text" || body?.source === "whatsapp_text"
        ? body.source
        : "manual_text";
    }

    if (!rawInput) {
      return NextResponse.json({ error: "Nenhum conteúdo para processar" }, { status: 400 });
    }

    const result = await parseInboxRawInput({
      userId: user.id,
      householdId: dbUser?.householdId ?? null,
      rawInput,
      source,
    });

    return NextResponse.json({
      ...result,
      source,
    });
  } catch (error: any) {
    console.error("[api/inbox/parse] erro:", error);
    return NextResponse.json({ error: error?.message || "Falha no parse" }, { status: 500 });
  }
}
