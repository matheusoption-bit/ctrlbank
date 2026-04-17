import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractTextFromImageWithOcr, extractTextFromPdf, isImageMimeType, isPdfMimeType } from "@/lib/inbox/ocr";
import { InboxChannel, InboxDocumentKind, InboxInputType } from "@/lib/inbox/parse";
import { processCaptureBatch } from "@/lib/inbox/pipeline";

export const runtime = "nodejs";

type PreparedInput = {
  rawInput: string;
  inputType: InboxInputType;
  documentKind: InboxDocumentKind;
  fileName?: string | null;
};

function detectDocumentKind(rawInput: string, fallback: InboxDocumentKind): InboxDocumentKind {
  if (fallback !== "unknown") return fallback;
  const normalized = rawInput.toLowerCase();
  if (/fatura|invoice|cart[aã]o/.test(normalized)) return "invoice";
  if (/comprovante|recibo|pix/.test(normalized)) return "receipt";
  if (/extrato|saldo|lan[çc]amento|statement/.test(normalized)) return "statement";
  return "unknown";
}

async function prepareFromFile(file: File, forcedKind: InboxDocumentKind): Promise<PreparedInput> {
  const mimeType = file.type || "application/octet-stream";
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name?.toLowerCase() || "upload";

  let rawInput = "";
  let inputType: InboxInputType = "text";
  let documentKind: InboxDocumentKind = forcedKind;

  if (fileName.endsWith(".ofx") || mimeType === "application/x-ofx") {
    rawInput = buffer.toString("utf-8");
    inputType = "ofx";
    documentKind = documentKind === "unknown" ? "statement" : documentKind;
  } else if (fileName.endsWith(".csv") || mimeType === "text/csv") {
    rawInput = buffer.toString("utf-8");
    inputType = "csv";
    documentKind = documentKind === "unknown" ? "statement" : documentKind;
  } else if (isImageMimeType(mimeType)) {
    rawInput = await extractTextFromImageWithOcr(buffer.toString("base64"), mimeType);
    inputType = "image";
  } else if (isPdfMimeType(mimeType)) {
    rawInput = await extractTextFromPdf(buffer);
    inputType = "pdf";
  } else {
    throw new Error(`Formato não suportado: ${file.name}`);
  }

  return {
    rawInput: rawInput.trim(),
    inputType,
    documentKind: detectDocumentKind(rawInput, documentKind),
    fileName: file.name,
  };
}

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
    const contentType = req.headers.get("content-type") || "";
    const batchInputs: Array<PreparedInput & { channel: InboxChannel }> = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const rawInput = (formData.get("rawInput")?.toString() ?? "").trim();
      const providedKind = (formData.get("documentKind")?.toString() as InboxDocumentKind) || "unknown";
      const channel = (formData.get("channel")?.toString() as InboxChannel) || "manual";

      if (rawInput) {
        batchInputs.push({
          rawInput,
          inputType: "text",
          documentKind: detectDocumentKind(rawInput, providedKind),
          channel,
          fileName: null,
        });
      }

      const files = formData
        .getAll("files")
        .filter((value): value is File => value instanceof File && value.size > 0);

      const singleFile = formData.get("file");
      if (singleFile instanceof File && singleFile.size > 0) {
        files.push(singleFile);
      }

      for (const file of files) {
        const prepared = await prepareFromFile(file, providedKind);
        batchInputs.push({ ...prepared, channel: "import" });
      }
    } else {
      const body = await req.json();
      const rawInput = (body?.rawInput ?? "").trim();
      if (rawInput) {
        batchInputs.push({
          rawInput,
          channel: body?.channel || "manual",
          inputType: body?.inputType || "text",
          documentKind: detectDocumentKind(rawInput, body?.documentKind || "unknown"),
          fileName: null,
        });
      }
    }

    if (batchInputs.length === 0) {
      return NextResponse.json({ error: "Nenhum conteúdo para processar" }, { status: 400 });
    }

    const result = await processCaptureBatch({
      userId: user.id,
      householdId: dbUser?.householdId ?? null,
      inputs: batchInputs.map((item) => ({
        rawInput: item.rawInput,
        channel: item.channel,
        inputType: item.inputType,
        documentKind: item.documentKind,
        fileName: item.fileName,
      })),
    });

    return NextResponse.json({
      message: `Lote processado: ${result.processed} itens, ${result.possibleDuplicates} possíveis duplicidades.`,
      ...result,
    });
  } catch (error: any) {
    console.error("[api/inbox/parse] erro:", error);
    return NextResponse.json({ error: error?.message || "Falha no parse" }, { status: 500 });
  }
}
