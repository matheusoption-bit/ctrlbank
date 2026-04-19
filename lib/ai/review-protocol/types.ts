import { AIComposerResponse, AIComposerTransactionDraft } from "@/lib/ai/contracts";

export type MissingField = "amount" | "date" | "description" | "category" | "account" | "transactionType";

export type ReviewDecision = {
  intent: AIComposerResponse["intent"];
  message: string;
  requiresReview: boolean;
  canCommit: boolean;
};

export type ResolvedDraft = {
  draft: AIComposerTransactionDraft;
  missingFields: MissingField[];
};
