import { createHash, randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { InboxChannel, InboxDocumentKind, InboxInputType, parseInboxRawInput } from "@/lib/inbox/parse";
import { AIComposerBatchDraftItem, AIComposerTransactionDraft } from "@/lib/ai/contracts";

type CaptureInput = {
  rawInput: string;
  channel: InboxChannel;
  inputType: InboxInputType;
  documentKind: InboxDocumentKind;
  fileName?: string | null;
};

type CaptureItemResult = {
  index: number;
  fileName: string | null;
  channel: InboxChannel;
  inputType: InboxInputType;
  documentKind: InboxDocumentKind;
  status: "ready" | "duplicate" | "conflict" | "review" | "error";
  message: string;
  eventId: string | null;
  createdTransactionId: string | null;
  duplicateReason: string | null;
};

export type CaptureBatchResult = {
  batchId: string;
  processed: number;
  possibleDuplicates: number;
  readyToSave: number;
  conflicts: number;
  items: CaptureItemResult[];
};

type DuplicateHint = {
  reason: string;
  eventId: string | null;
  transactionId: string | null;
};

function makeInputHash(input: string) {
  return createHash("sha256").update(input.trim().toLowerCase()).digest("hex");
}

function draftFromResult(result: unknown): AIComposerTransactionDraft | null {
  if (!result || typeof result !== "object") return null;

  const maybeResult = result as {
    transactionDraft?: unknown;
    batchDrafts?: unknown;
  };

  if (maybeResult.transactionDraft && typeof maybeResult.transactionDraft === "object" && "amount" in maybeResult.transactionDraft) {
    return maybeResult.transactionDraft as AIComposerTransactionDraft;
  }

  if (Array.isArray(maybeResult.batchDrafts) && maybeResult.batchDrafts.length === 1) {
    const item = maybeResult.batchDrafts[0] as AIComposerBatchDraftItem;
    return item?.draft ?? null;
  }

  return null;
}

function scopeOr(userId: string, householdId: string | null) {
  return [{ userId }, ...(householdId ? [{ householdId }] : [])];
}

async function findDuplicateByHash(params: {
  userId: string;
  householdId: string | null;
  inputHash: string;
  ignoreEventId?: string | null;
}): Promise<DuplicateHint | null> {
  const existing = await prisma.aiCaptureEvent.findFirst({
    where: {
      OR: scopeOr(params.userId, params.householdId),
      rawText: { startsWith: `[HASH:${params.inputHash}]` },
      ...(params.ignoreEventId ? { id: { not: params.ignoreEventId } } : {}),
    },
    select: { id: true, createdTransactionId: true },
    orderBy: { createdAt: "desc" },
  });

  if (!existing) return null;

  return {
    reason: "Arquivo/conteúdo já processado anteriormente",
    eventId: existing.id,
    transactionId: existing.createdTransactionId,
  };
}

async function findDuplicateByTransactionSimilarity(params: {
  userId: string;
  householdId: string | null;
  draft: AIComposerTransactionDraft | null;
}): Promise<DuplicateHint | null> {
  if (!params.draft?.amount || !params.draft?.date || !params.draft.transactionType) return null;

  const baseDate = new Date(params.draft.date);
  if (Number.isNaN(baseDate.getTime())) return null;

  const from = new Date(baseDate);
  from.setDate(from.getDate() - 1);
  const to = new Date(baseDate);
  to.setDate(to.getDate() + 1);

  const maybeTx = await prisma.transaction.findFirst({
    where: {
      OR: scopeOr(params.userId, params.householdId),
      amount: params.draft.amount,
      type: params.draft.transactionType as TransactionType,
      date: { gte: from, lte: to },
      ...(params.draft.description
        ? { description: { contains: params.draft.description.slice(0, 20), mode: "insensitive" } }
        : {}),
    },
    select: { id: true },
    orderBy: { date: "desc" },
  });

  if (!maybeTx) return null;

  return {
    reason: "Movimento muito semelhante já existe no caixa",
    eventId: null,
    transactionId: maybeTx.id,
  };
}

export async function processCaptureBatch(params: {
  userId: string;
  householdId: string | null;
  inputs: CaptureInput[];
}): Promise<CaptureBatchResult> {
  const batchId = randomUUID();
  const items: CaptureItemResult[] = [];

  for (let index = 0; index < params.inputs.length; index++) {
    const input = params.inputs[index];

    try {
      const inputHash = makeInputHash(input.rawInput);

      const duplicateByHash = await findDuplicateByHash({
        userId: params.userId,
        householdId: params.householdId,
        inputHash,
      });

      if (duplicateByHash) {
        items.push({
          index,
          fileName: input.fileName ?? null,
          channel: input.channel,
          inputType: input.inputType,
          documentKind: input.documentKind,
          status: "duplicate",
          message: duplicateByHash.reason,
          eventId: duplicateByHash.eventId,
          createdTransactionId: duplicateByHash.transactionId,
          duplicateReason: duplicateByHash.reason,
        });
        continue;
      }

      const result = await parseInboxRawInput({
        userId: params.userId,
        householdId: params.householdId,
        rawInput: input.rawInput,
        channel: input.channel,
        inputType: input.inputType,
        documentKind: input.documentKind,
        inputHash,
        captureBatchId: batchId,
      });

      const duplicateBySimilarity = await findDuplicateByTransactionSimilarity({
        userId: params.userId,
        householdId: params.householdId,
        draft: draftFromResult(result),
      });

      if (duplicateBySimilarity && result.eventId) {
        await prisma.aiCaptureEvent.updateMany({
          where: { id: result.eventId },
          data: { decision: "possible_duplicate" },
        });
      }

      const status: CaptureItemResult["status"] = duplicateBySimilarity
        ? "duplicate"
        : result.requiresReview
          ? "review"
          : result.autoSaved
            ? "ready"
            : "conflict";

      items.push({
        index,
        fileName: input.fileName ?? null,
        channel: input.channel,
        inputType: input.inputType,
        documentKind: input.documentKind,
        status,
        message: duplicateBySimilarity?.reason ?? result.message,
        eventId: result.eventId ?? null,
        createdTransactionId: result.createdTransactionId ?? null,
        duplicateReason: duplicateBySimilarity?.reason ?? null,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Falha ao processar item";
      items.push({
        index,
        fileName: input.fileName ?? null,
        channel: input.channel,
        inputType: input.inputType,
        documentKind: input.documentKind,
        status: "error",
        message,
        eventId: null,
        createdTransactionId: null,
        duplicateReason: null,
      });
    }
  }

  return {
    batchId,
    processed: items.length,
    possibleDuplicates: items.filter((item) => item.status === "duplicate").length,
    readyToSave: items.filter((item) => item.status === "ready").length,
    conflicts: items.filter((item) => item.status === "conflict" || item.status === "error").length,
    items,
  };
}
