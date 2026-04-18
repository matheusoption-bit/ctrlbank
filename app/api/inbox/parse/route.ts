import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { extractTextFromImageWithOcr, extractTextFromPdf, isImageMimeType, isPdfMimeType } from "@/lib/inbox/ocr";
import { parseInboxText } from "@/lib/inbox/parser";

export const runtime = "nodejs";

async function getRawInputFromFile(file: File) {
  const mimeType = file.type || "application/octet-stream";
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isImageMimeType(mimeType)) {
    const base64 = buffer.toString("base64");
    return extractTextFromImageWithOcr(base64, mimeType);
  }

  if (isPdfMimeType(mimeType)) {
    return extractTextFromPdf(buffer);
  }

  if (mimeType.startsWith("text/") || file.name.toLowerCase().endsWith(".txt")) {
    return buffer.toString("utf-8");
  }

  throw new Error("Formato não suportado. Envie imagem, PDF ou texto.");
}

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let rawInput = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      rawInput = (formData.get("rawInput")?.toString() || "").trim();

      if (!rawInput) {
        const file = formData.get("file");
        if (!(file instanceof File) || file.size === 0) {
          return NextResponse.json({ error: "Envie um arquivo ou texto para processar." }, { status: 400 });
        }
        rawInput = (await getRawInputFromFile(file)).trim();
      }
    } else {
      const body = await req.json().catch(() => ({}));
      rawInput = (body?.rawInput || "").trim();
    }

    if (!rawInput) {
      return NextResponse.json({ error: "Envie um arquivo ou texto para processar." }, { status: 400 });
    }

    const items = parseInboxText(rawInput);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[api/inbox/parse] erro:", error);
    return NextResponse.json(
      { error: "Não consegui interpretar. Tente outro arquivo." },
      { status: 422 }
    );
  }
}
