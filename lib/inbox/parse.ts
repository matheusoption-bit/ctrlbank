import { processAiIngest } from "@/lib/ai/ingest";
import { prisma } from "@/lib/prisma";
import { parseDeterministicOFX, parseDeterministicCSV } from "./deterministic";
import { logAiCaptureEvent } from "@/lib/ai/composer";
import { randomUUID } from "crypto";

export type InboxChannel = "manual" | "email" | "whatsapp" | "import";
export type InboxInputType = "text" | "image" | "pdf" | "csv" | "ofx";
export type InboxDocumentKind = "statement" | "invoice" | "receipt" | "unknown";

export async function parseInboxRawInput({
  userId,
  householdId,
  rawInput,
  channel,
  inputType,
  documentKind,
}: {
  userId: string;
  householdId: string | null;
  rawInput: string;
  channel: InboxChannel;
  inputType: InboxInputType;
  documentKind: InboxDocumentKind;
}) {
  if (inputType === "ofx" || inputType === "csv") {
    const captureGroupId = randomUUID();
    const isOfx = inputType === "ofx";
    const drafts = isOfx ? 
      await parseDeterministicOFX(userId, householdId, rawInput) : 
      await parseDeterministicCSV(userId, householdId, rawInput);
    
    if (drafts.length > 0) {
      const batchDrafts = await Promise.all(drafts.map(async (draft) => {
        const aiEvent = await logAiCaptureEvent({
          userId,
          householdId,
          captureGroupId,
          source: inputType,
          inputType: "composer",
          rawText: rawInput,
          normalizedDraft: draft,
          confidenceOverall: draft.confidence.overall,
          decision: "batch_review",
          createdTransactionId: null,
        });
        return { eventId: aiEvent?.id ?? null, draft };
      }));

      return {
        intent: "batch_review",
        message: `Encontramos ${drafts.length} itens no arquivo. Verifique e confirme.`,
        requiresReview: true,
        autoSaved: false,
        transactionDraft: null,
        batchDrafts,
        createdTransactionId: null,
        undoAvailable: false,
        undoToken: null,
        eventId: batchDrafts[0]?.eventId ?? null,
        captureGroupId,
        conversationId: null,
        missingFields: [],
      };
    }
  }

  const response = await processAiIngest({
    userId,
    householdId,
    mode: "Registrar",
    inputType: inputType === "pdf" ? "pdf" : "text",
    content: rawInput,
  });

  if (response.eventId) {
    await prisma.aiCaptureEvent.update({
      where: { id: response.eventId },
      data: {
        source: channel,
        inputType: inputType,
        rawText: `[${documentKind.toUpperCase()}] ` + rawInput,
      },
    }).catch(() => null);
  }

  return response;
}

export function getInboxSourceBadge(channel: string, inputType: string) {
  if (inputType === "ofx") return "via OFX";
  if (inputType === "csv") return "via CSV";
  if (inputType === "pdf") return "via PDF";
  if (inputType === "image") return "via OCR";
  if (channel === "whatsapp") return "via WhatsApp";
  if (channel === "email") return "via Email";
  if (channel === "import") return "via Importação";
  return "Inclusão Manual";
}
