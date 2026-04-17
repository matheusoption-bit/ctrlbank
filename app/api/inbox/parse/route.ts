import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractTextFromImageWithOcr, extractTextFromPdf, isImageMimeType, isPdfMimeType } from "@/lib/inbox/ocr";
import { InboxChannel, InboxInputType, InboxDocumentKind, parseInboxRawInput } from "@/lib/inbox/parse";

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
    let channel: InboxChannel = "manual";
    let inputType: InboxInputType = "text";
    let documentKind: InboxDocumentKind = "unknown";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      rawInput = (formData.get("rawInput")?.toString() ?? "").trim();
      const file = formData.get("file") as File | null;
      documentKind = (formData.get("documentKind")?.toString() as InboxDocumentKind) || "unknown";
      channel = (formData.get("channel")?.toString() as InboxChannel) || "manual";

      if (file && file.size > 0) {
        const mimeType = file.type || "application/octet-stream";
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith(".ofx") || mimeType === "application/x-ofx") {
          rawInput = buffer.toString("utf-8"); // deterministic parser would handle this later
          inputType = "ofx";
          documentKind = documentKind === "unknown" ? "statement" : documentKind;
        } else if (fileName.endsWith(".csv") || mimeType === "text/csv") {
          rawInput = buffer.toString("utf-8"); // deterministic parser would handle this later
          inputType = "csv";
          documentKind = documentKind === "unknown" ? "statement" : documentKind;
        } else if (isImageMimeType(mimeType)) {
          rawInput = await extractTextFromImageWithOcr(buffer.toString("base64"), mimeType);
          inputType = "image";
        } else if (isPdfMimeType(mimeType)) {
          rawInput = await extractTextFromPdf(buffer);
          inputType = "pdf";
        } else {
          return NextResponse.json({ error: "Formato de arquivo não suportado" }, { status: 400 });
        }
      } else {
         inputType = "text";
      }
    } else {
      const body = await req.json();
      rawInput = (body?.rawInput ?? "").trim();
      channel = body?.channel || "manual";
      inputType = body?.inputType || "text";
      documentKind = body?.documentKind || "unknown";
    }

    if (!rawInput) {
      return NextResponse.json({ error: "Nenhum conteúdo para processar" }, { status: 400 });
    }

    const result = await parseInboxRawInput({
      userId: user.id,
      householdId: dbUser?.householdId ?? null,
      rawInput,
      channel,
      inputType,
      documentKind,
    });

    return NextResponse.json({
      ...result,
      source: channel,
      inputType,
      documentKind,
    });
  } catch (error: any) {
    console.error("[api/inbox/parse] erro:", error);
    return NextResponse.json({ error: error?.message || "Falha no parse" }, { status: 500 });
  }
}
