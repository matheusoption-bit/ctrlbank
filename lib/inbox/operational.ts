import { IngestionStage, IngestionStatus, Prisma, QualityFlagCode, QualityFlagSeverity } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function createCorrelationId() {
  return crypto.randomUUID();
}

export async function appendIngestionLog(input: {
  correlationId: string;
  stage: IngestionStage;
  status: IngestionStatus;
  sourceDocumentId?: string | null;
  aiCaptureEventId?: string | null;
  transactionId?: string | null;
  channel?: string | null;
  actorType?: "system" | "user";
  actorId?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  retryCount?: number;
  startedAt?: Date;
  finishedAt?: Date;
}) {
  return prisma.ingestionLog.create({
    data: {
      correlationId: input.correlationId,
      stage: input.stage,
      status: input.status,
      sourceDocumentId: input.sourceDocumentId ?? null,
      aiCaptureEventId: input.aiCaptureEventId ?? null,
      transactionId: input.transactionId ?? null,
      channel: input.channel ?? null,
      actorType: input.actorType ?? "system",
      actorId: input.actorId ?? null,
      errorCode: input.errorCode ?? null,
      errorMessage: input.errorMessage ?? null,
      metadata: input.metadata,
      retryCount: input.retryCount ?? 0,
      startedAt: input.startedAt,
      finishedAt: input.finishedAt,
    },
  });
}

export async function createQualityFlag(input: {
  code: QualityFlagCode;
  severity: QualityFlagSeverity;
  status?: "OPEN" | "RESOLVED" | "DISMISSED";
  transactionId?: string | null;
  aiCaptureEventId?: string | null;
  sourceDocumentId?: string | null;
  metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
}) {
  return prisma.transactionQualityFlag.create({
    data: {
      code: input.code,
      severity: input.severity,
      status: input.status ?? "OPEN",
      transactionId: input.transactionId ?? null,
      aiCaptureEventId: input.aiCaptureEventId ?? null,
      sourceDocumentId: input.sourceDocumentId ?? null,
      metadata: input.metadata,
    },
  });
}

export function sanitizeErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Falha não identificada";
  return message.slice(0, 280);
}
