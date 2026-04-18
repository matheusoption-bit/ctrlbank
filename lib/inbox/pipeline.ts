import { createHash, randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { AIComposerBatchDraftItem, AIComposerTransactionDraft } from "@/lib/ai/contracts";
import { InboxChannel, InboxDocumentKind, InboxInputType, parseInboxRawInput } from "@/lib/inbox/parse";
import { DeduplicationResult, detectDuplicateTransaction, NormalizedIngestedTransaction } from "@/lib/finance/deduplication";

type CaptureInput = {
  rawInput: string;
  channel: InboxChannel;
  inputType: InboxInputType;
  documentKind: InboxDocumentKind;
  fileName?: string | null;
};

type DetectedType = "bank_statement" | "receipt" | "invoice";
type DetectedSource = "nubank" | "itau" | "unknown";

type IngestionItem = {
  index: number;
  fileName: string | null;
  detectedType: DetectedType;
  source: DetectedSource;
  normalized: NormalizedIngestedTransaction | null;
  status: "new" | "duplicate" | "review" | "error";
  existingId: string | null;
  message: string;
  eventId: string | null;
  createdTransactionId: string | null;
};

export type CaptureBatchResult = {
  batchId: string;
  processed: number;
  possibleDuplicates: number;
  readyToSave: number;
  conflicts: number;
  detectedType: DetectedType;
  source: DetectedSource;
  items: IngestionItem[];
};

function makeInputHash(input: string) {
  return createHash("sha256").update(input.trim().toLowerCase()).digest("hex");
}

function inferDetectedType(kind: InboxDocumentKind, input: string): DetectedType {
  if (kind === "statement") return "bank_statement";
  if (kind === "invoice") return "invoice";
  if (kind === "receipt") return "receipt";

  const raw = input.toLowerCase();
  if (/fatura|invoice|cart[aã]o/.test(raw)) return "invoice";
  if (/comprovante|recibo|pix/.test(raw)) return "receipt";
  return "bank_statement";
}

function inferSource(input: string): DetectedSource {
  const raw = input.toLowerCase();
  if (/nubank|nu pagamentos|nu financeira/.test(raw)) return "nubank";
  if (/ita[uú]|unibanco/.test(raw)) return "itau";
  return "unknown";
}

function scopeOr(userId: string, householdId: string | null) {
  return [{ userId }, ...(householdId ? [{ householdId }] : [])];
}

function extractDrafts(result: unknown): AIComposerTransactionDraft[] {
  if (!result || typeof result !== "object") return [];
  const maybe = result as { transactionDraft?: unknown; batchDrafts?: unknown };

  const drafts: AIComposerTransactionDraft[] = [];
  if (maybe.transactionDraft && typeof maybe.transactionDraft === "object" && "amount" in maybe.transactionDraft) {
    drafts.push(maybe.transactionDraft as AIComposerTransactionDraft);
  }
  if (Array.isArray(maybe.batchDrafts)) {
    for (const item of maybe.batchDrafts as AIComposerBatchDraftItem[]) {
      if (item?.draft) drafts.push(item.draft);
    }
  }
  return drafts;
}

function normalizeDraft(draft: AIComposerTransactionDraft, source: string): NormalizedIngestedTransaction | null {
  if (!draft.amount || !draft.date || !draft.description) return null;
  const parsedDate = new Date(draft.date);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return {
    date: parsedDate,
    amount: Number(draft.amount),
    description: draft.description,
    type: draft.transactionType === "INCOME" ? "income" : "expense",
    source,
  };
}

async function findDuplicateByHash(params: {
  userId: string;
  householdId: string | null;
  inputHash: string;
}): Promise<{ eventId: string | null; transactionId: string | null } | null> {
  const existing = await prisma.aiCaptureEvent.findFirst({
    where: {
      OR: scopeOr(params.userId, params.householdId),
      rawText: { startsWith: `[HASH:${params.inputHash}]` },
    },
    select: { id: true, createdTransactionId: true },
    orderBy: { createdAt: "desc" },
  });

  if (!existing) return null;
  return {
    eventId: existing.id,
    transactionId: existing.createdTransactionId,
  };
}

function chooseDominantDetectedType(items: IngestionItem[]): DetectedType {
  const counters: Record<DetectedType, number> = {
    bank_statement: 0,
    receipt: 0,
    invoice: 0,
  };
  for (const item of items) counters[item.detectedType]++;
  return Object.entries(counters).sort((a, b) => b[1] - a[1])[0][0] as DetectedType;
}

function chooseDominantSource(items: IngestionItem[]): DetectedSource {
  const counters: Record<DetectedSource, number> = {
    nubank: 0,
    itau: 0,
    unknown: 0,
  };
  for (const item of items) counters[item.source]++;
  return Object.entries(counters).sort((a, b) => b[1] - a[1])[0][0] as DetectedSource;
}

export async function processCaptureBatch(params: {
  userId: string;
  householdId: string | null;
  inputs: CaptureInput[];
}): Promise<CaptureBatchResult> {
  const batchId = randomUUID();
  const items: IngestionItem[] = [];

  for (let index = 0; index < params.inputs.length; index++) {
    const input = params.inputs[index];
    const detectedType = inferDetectedType(input.documentKind, input.rawInput);
    const source = inferSource(`${input.fileName ?? ""} ${input.rawInput}`);

    try {
      const inputHash = makeInputHash(input.rawInput);
      const duplicatedByHash = await findDuplicateByHash({
        userId: params.userId,
        householdId: params.householdId,
        inputHash,
      });

      if (duplicatedByHash) {
        items.push({
          index,
          fileName: input.fileName ?? null,
          detectedType,
          source,
          normalized: null,
          status: "duplicate",
          existingId: duplicatedByHash.transactionId,
          message: "Arquivo/conteúdo já processado anteriormente",
          eventId: duplicatedByHash.eventId,
          createdTransactionId: duplicatedByHash.transactionId,
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

      const drafts = extractDrafts(result);
      const firstNormalized = normalizeDraft(drafts[0], input.inputType);

      let dedupResult: DeduplicationResult | null = null;
      if (firstNormalized) {
        dedupResult = await detectDuplicateTransaction({
          userId: params.userId,
          householdId: params.householdId,
          item: firstNormalized,
        });
      }

      if (dedupResult?.status === "duplicate" && result.eventId) {
        await prisma.aiCaptureEvent.updateMany({
          where: { id: result.eventId },
          data: { decision: "possible_duplicate" },
        });
      }

      items.push({
        index,
        fileName: input.fileName ?? null,
        detectedType,
        source,
        normalized: firstNormalized,
        status: dedupResult?.status === "duplicate" ? "duplicate" : result.requiresReview ? "review" : "new",
        existingId: dedupResult?.status === "duplicate" ? dedupResult.existingId : null,
        message:
          dedupResult?.status === "duplicate"
            ? "Movimento já existente na base"
            : result.message ?? "Conteúdo reconhecido e pronto para confirmação",
        eventId: result.eventId ?? null,
        createdTransactionId: result.createdTransactionId ?? null,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Falha ao processar item";
      items.push({
        index,
        fileName: input.fileName ?? null,
        detectedType,
        source,
        normalized: null,
        status: "error",
        existingId: null,
        message,
        eventId: null,
        createdTransactionId: null,
      });
    }
  }

  const detectedType = items.length > 0 ? chooseDominantDetectedType(items) : "bank_statement";
  const source = items.length > 0 ? chooseDominantSource(items) : "unknown";

  return {
    batchId,
    processed: items.length,
    possibleDuplicates: items.filter((item) => item.status === "duplicate").length,
    readyToSave: items.filter((item) => item.status === "new").length,
    conflicts: items.filter((item) => item.status === "error").length,
    detectedType,
    source,
    items,
  };
}
