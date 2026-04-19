import { NextRequest, NextResponse } from "next/server";
import { IngestionStage, IngestionStatus, QualityFlagCode, QualityFlagSeverity, ReviewState, SourceChannel, SourceType } from "@prisma/client";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractTextFromImageWithOcr, extractTextFromPdf, isImageMimeType, isPdfMimeType } from "@/lib/inbox/ocr";
import { parseInboxText } from "@/lib/inbox/parser";
import { normalizeInboxItems } from "@/lib/finance/normalize";
import { appendIngestionLog, createQualityFlag, sanitizeErrorMessage } from "@/lib/inbox/operational";
import { canonicalizeTextPayload, computeSha256, sealCapturePayload } from "@/lib/security/checksum";
import { scopeWhere } from "@/lib/security/scope";
import { shouldRequireReview } from "@/lib/inbox/processing-state";

export const runtime = "nodejs";

const PARSER_VERSION = "wave2-parser-v1";
const NORMALIZER_VERSION = "wave2-normalizer-v1";

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

function mapSourceType(inputType: string): SourceType {
  if (inputType === "image") return SourceType.IMAGE;
  if (inputType === "pdf") return SourceType.PDF;
  if (inputType === "csv") return SourceType.CSV;
  if (inputType === "ofx") return SourceType.OFX;
  if (inputType === "audio") return SourceType.AUDIO;
  return SourceType.TEXT;
}

function mapSourceChannel(channel: string): SourceChannel {
  if (channel === "email") return SourceChannel.EMAIL;
  if (channel === "whatsapp") return SourceChannel.WHATSAPP;
  if (channel === "import") return SourceChannel.IMPORT;
  if (channel === "api") return SourceChannel.API;
  if (channel === "composer") return SourceChannel.COMPOSER;
  return SourceChannel.MANUAL;
}

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let correlationId = crypto.randomUUID();

  try {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { householdId: true } });
    const contentType = req.headers.get("content-type") || "";
    let rawInput = "";
    let inputType = "text";
    let mimeType: string | null = null;
    let originalName: string | null = null;
    let sizeBytes: number | null = null;
    let sourceChannel = "manual";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      rawInput = (formData.get("rawInput")?.toString() || "").trim();
      sourceChannel = formData.get("channel")?.toString() || "manual";

      if (!rawInput) {
        const file = formData.get("file");
        if (!(file instanceof File) || file.size === 0) {
          return NextResponse.json({ error: "Envie um arquivo ou texto para processar." }, { status: 400 });
        }
        mimeType = file.type || "application/octet-stream";
        originalName = file.name;
        sizeBytes = file.size;
        if (isImageMimeType(mimeType)) inputType = "image";
        else if (isPdfMimeType(mimeType)) inputType = "pdf";
        else inputType = "text";
        rawInput = (await getRawInputFromFile(file)).trim();
      }
    } else {
      const body = await req.json().catch(() => ({}));
      rawInput = (body?.rawInput || "").trim();
      sourceChannel = body?.channel || "manual";
    }

    if (!rawInput) {
      return NextResponse.json({ error: "Envie um arquivo ou texto para processar." }, { status: 400 });
    }

    const canonicalInput = canonicalizeTextPayload(rawInput);
    const sha256 = computeSha256(canonicalInput);
    const contentHash = computeSha256(`${inputType}:${canonicalInput.toLowerCase()}`);
    const householdId = dbUser?.householdId ?? null;

    const existingSource = await prisma.sourceDocument.findFirst({
      where: {
        sha256,
        ...scopeWhere({ userId: user.id, householdId }),
      },
      orderBy: { createdAt: "asc" },
    });

    const sourceDocument = existingSource
      ? await prisma.sourceDocument.update({
          where: { id: existingSource.id },
          data: {
            lastSeenAt: new Date(),
            correlationId,
          },
        })
      : await prisma.sourceDocument.create({
          data: {
            userId: user.id,
            householdId,
            correlationId,
            sourceChannel: mapSourceChannel(sourceChannel),
            sourceType: mapSourceType(inputType),
            mimeType,
            originalName,
            sizeBytes,
            sha256,
            contentHash,
            extractionMethod: inputType === "image" ? "ocr" : inputType === "pdf" ? "pdf_extract" : "direct_text",
            parserVersion: PARSER_VERSION,
            taintLevel: "LOW",
          },
        });

    await appendIngestionLog({
      correlationId,
      sourceDocumentId: sourceDocument.id,
      stage: IngestionStage.RECEIVED,
      status: IngestionStatus.SUCCESS,
      channel: sourceChannel,
      actorType: "user",
      actorId: user.id,
    });

    const items = parseInboxText(canonicalInput);
    const normalized = normalizeInboxItems(items);

    await appendIngestionLog({
      correlationId,
      sourceDocumentId: sourceDocument.id,
      stage: IngestionStage.PARSED,
      status: IngestionStatus.SUCCESS,
      channel: sourceChannel,
      metadata: { candidates: normalized.length },
    });

    const duplicateCommitted = await prisma.ingestionLog.findFirst({
      where: {
        sourceDocumentId: sourceDocument.id,
        stage: IngestionStage.COMMITTED,
        status: IngestionStatus.SUCCESS,
      },
      orderBy: { createdAt: "desc" },
    });

    const reviewRequired = shouldRequireReview({ normalizedCount: normalized.length, hasCommittedDuplicate: Boolean(duplicateCommitted) });

    const payload = {
      items: normalized,
      parserVersion: PARSER_VERSION,
      normalizerVersion: NORMALIZER_VERSION,
      sourceDocumentId: sourceDocument.id,
      correlationId,
    };
    const sealed = sealCapturePayload(payload);

    const event = await prisma.aiCaptureEvent.create({
      data: {
        userId: user.id,
        householdId,
        sourceDocumentId: sourceDocument.id,
        correlationId,
        captureGroupId: correlationId,
        source: sourceChannel,
        inputType,
        rawText: canonicalInput,
        normalizedDraft: payload,
        confidenceOverall: normalized.length > 0 ? 0.8 : 0.4,
        decision: reviewRequired ? "clarification_needed" : "transaction_draft",
        processingStage: reviewRequired ? IngestionStage.REVIEW_REQUIRED : IngestionStage.NORMALIZED,
        reviewState: reviewRequired ? ReviewState.REQUIRED : ReviewState.NOT_REQUIRED,
        decisionReason: reviewRequired ? "Itens vazios ou entrada duplicada" : "Draft normalizado com staging seguro",
        taintLevel: "LOW",
        parserVersion: PARSER_VERSION,
        normalizerVersion: NORMALIZER_VERSION,
        sealedPayload: sealed.sealedPayload,
        signature: sealed.signature,
        signatureKeyId: sealed.signatureKeyId,
      },
    });

    await appendIngestionLog({
      correlationId,
      sourceDocumentId: sourceDocument.id,
      aiCaptureEventId: event.id,
      stage: reviewRequired ? IngestionStage.REVIEW_REQUIRED : IngestionStage.NORMALIZED,
      status: IngestionStatus.SUCCESS,
      channel: sourceChannel,
      metadata: { reviewRequired, flagsCandidate: reviewRequired ? 1 : 0 },
      finishedAt: new Date(),
    });

    const qualityFlags: Array<{ code: string; severity: string }> = [];

    if (duplicateCommitted) {
      await createQualityFlag({
        code: QualityFlagCode.DUPLICATE_CONFIRMED,
        severity: QualityFlagSeverity.HIGH,
        aiCaptureEventId: event.id,
        sourceDocumentId: sourceDocument.id,
        metadata: { previousCorrelationId: duplicateCommitted.correlationId },
      });
      qualityFlags.push({ code: QualityFlagCode.DUPLICATE_CONFIRMED, severity: QualityFlagSeverity.HIGH });

      await appendIngestionLog({
        correlationId,
        sourceDocumentId: sourceDocument.id,
        aiCaptureEventId: event.id,
        stage: IngestionStage.DUPLICATE_SKIPPED,
        status: IngestionStatus.SKIPPED,
        channel: sourceChannel,
      });
    }

    if (normalized.length === 0) {
      await createQualityFlag({
        code: QualityFlagCode.REVIEW_REQUIRED,
        severity: QualityFlagSeverity.MEDIUM,
        aiCaptureEventId: event.id,
        sourceDocumentId: sourceDocument.id,
        metadata: { reason: "no_candidates" },
      });
      qualityFlags.push({ code: QualityFlagCode.REVIEW_REQUIRED, severity: QualityFlagSeverity.MEDIUM });
    }

    return NextResponse.json({
      ok: true,
      correlationId,
      sourceDocumentId: sourceDocument.id,
      captureEventId: event.id,
      stage: reviewRequired ? IngestionStage.REVIEW_REQUIRED : IngestionStage.NORMALIZED,
      status: IngestionStatus.SUCCESS,
      items: normalized,
      candidateSummary: { total: normalized.length },
      reviewRequired,
      qualityFlags,
      message: reviewRequired
        ? "Entrada processada com revisão obrigatória antes de confirmar."
        : "Entrada processada e staged no servidor.",
    });
  } catch (error) {
    const message = sanitizeErrorMessage(error);
    console.error("[api/inbox/parse] erro:", error);
    await appendIngestionLog({
      correlationId,
      stage: IngestionStage.FAILED,
      status: IngestionStatus.ERROR,
      errorCode: "PARSE_FAILED",
      errorMessage: message,
      finishedAt: new Date(),
    }).catch(() => null);

    return NextResponse.json({ error: "Não consegui interpretar. Tente outro arquivo." }, { status: 422 });
  }
}
