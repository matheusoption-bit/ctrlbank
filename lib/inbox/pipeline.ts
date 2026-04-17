import { createHash, randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { InboxChannel, InboxDocumentKind, InboxInputType, parseInboxRawInput } from "@/lib/inbox/parse";
import { AIComposerTransactionDraft } from "@/lib/ai/contracts";

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

function makeInputHash(input: string) {
  return createHash("sha256").update(input.trim().toLowerCase()).digest("hex");
}

function draftFromResult(result: any): AIComposerTransactionDraft | null {
  if (result?.transactionDraft && typeof result.transactionDraft === "object") {
    return result.transactionDraft as AIComposerTransactionDraft;
  }

  if (Array.isArray(result?.batchDrafts) && result.batchDrafts.length === 1) {
    return result.batchDrafts[0]?.draft ?? null;
  }

  return null;
}

async function findPossibleDuplicate(params: {
  userId: string;
  householdId: string | null;
  inputHash: string;
  draft: AIComposerTransactionDraft | null;
}) {
  const scopeOr = [{ userId: params.userId }, ...(params.householdId ? [{ householdId: params.householdId }] : [])];

  const duplicateByHash = await prisma.aiCaptureEvent.findFirst({
    where: {
      OR: scopeOr,
      rawText: { startsWith: `[HASH:${params.inputHash}]` },
    },
    select: { id: true, createdTransactionId: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  if (duplicateByHash) {
    return {
      reason: "Arquivo/conteúdo já processado anteriormente",
      eventId: duplicateByHash.id,
      transactionId: duplicateByHash.createdTransactionId,
    };
  }

  if (!params.draft?.amount || !params.draft?.date) return null;

  const baseDate = new Date(params.draft.date);
  if (Number.isNaN(baseDate.getTime())) return null;

  const from = new Date(baseDate);
  from.setDate(from.getDate() - 1);
  const to = new Date(baseDate);
  to.setDate(to.getDate() + 1);

  const maybeTx = await prisma.transaction.findFirst({
    where: {
      OR: scopeOr,
      amount: params.draft.amount,
      type: params.draft.transactionType as any,
      date: { gte: from, lte: to },
      ...(params.draft.description
        ? { description: { contains: params.draft.description.slice(0, 20), mode: "insensitive" } }
        : {}),
    },
    select: { id: true },
    orderBy: { date: "desc" },
  });

  if (maybeTx) {
    return {
      reason: "Movimento muito semelhante já existe no caixa",
      eventId: null,
      transactionId: maybeTx.id,
    };
  }

  return null;
}

export async function processCaptureBatch(params: {
  userId: string;
  householdId: string | null;
  inputs: CaptureInput[];
}) : Promise<CaptureBatchResult> {
  const batchId = randomUUID();
  const items: CaptureItemResult[] = [];

  for (let index = 0; index < params.inputs.length; index++) {
    const input = params.inputs[index];

    try {
      const inputHash = makeInputHash(input.rawInput);
      const duplicate = await findPossibleDuplicate({
        userId: params.userId,
        householdId: params.householdId,
        inputHash,
        draft: null,
      });

      if (duplicate) {
        items.push({
          index,
          fileName: input.fileName ?? null,
          channel: input.channel,
          inputType: input.inputType,
          documentKind: input.documentKind,
          status: "duplicate",
          message: duplicate.reason,
          eventId: duplicate.eventId,
          createdTransactionId: duplicate.transactionId,
          duplicateReason: duplicate.reason,
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

      const draft = draftFromResult(result);
      const postDuplicate = await findPossibleDuplicate({
        userId: params.userId,
        householdId: params.householdId,
        inputHash,
        draft,
      });

      if (postDuplicate && result.eventId) {
        await prisma.aiCaptureEvent.updateMany({
          where: { id: result.eventId },
          data: { decision: "possible_duplicate" },
        });
      }

      const status: CaptureItemResult["status"] = postDuplicate
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
        message: postDuplicate?.reason ?? result.message,
        eventId: result.eventId ?? null,
        createdTransactionId: result.createdTransactionId ?? null,
        duplicateReason: postDuplicate?.reason ?? null,
      });
    } catch (error: any) {
      items.push({
        index,
        fileName: input.fileName ?? null,
        channel: input.channel,
        inputType: input.inputType,
        documentKind: input.documentKind,
        status: "error",
        message: error?.message || "Falha ao processar item",
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
