/**
 * Contrato central de extração operacional do AI Composer.
 */

export type AIComposerIntent =
  | "chat_reply"
  | "transaction_created"
  | "transaction_draft"
  | "clarification_needed"
  | "batch_review";

export type AIComposerMode = "Registrar" | "Revisar" | "Perguntar" | "Planejar";

export type AIComposerTransactionDraft = {
  amount: number | null;
  date: string | null; // YYYY-MM-DD
  description: string;
  transactionType: "INCOME" | "EXPENSE" | "TRANSFER";
  categoryName: string | null;
  categoryId: string | null;
  accountId: string | null;
  accountName: string | null;
  confidence: {
    overall: number; // 0..1
    amount: number;
    date: number;
    description: number;
    category: number;
    account: number;
    transactionType: number;
  };
  source: "text" | "image" | "text+image" | "pdf" | "csv";
};

export type AIComposerBatchDraftItem = {
  eventId: string | null;
  draft: AIComposerTransactionDraft;
};

export type AIComposerResponse = {
  intent: AIComposerIntent;
  message: string;
  requiresReview: boolean;
  autoSaved: boolean;
  transactionDraft: AIComposerTransactionDraft | null;
  batchDrafts?: AIComposerBatchDraftItem[];
  createdTransactionId: string | null;
  undoAvailable: boolean;
  undoToken: string | null;
  eventId: string | null;
  captureGroupId: string | null;
  missingFields: Array<"amount" | "date" | "description" | "category" | "account" | "transactionType">;
};
