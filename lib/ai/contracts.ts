/**
 * Contrato central de extração operacional do AI Composer.
 */

export type AIComposerIntent =
  | "chat_reply"
  | "transaction_created"
  | "transaction_draft"
  | "clarification_needed";

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
  source: "text" | "image" | "text+image";
};

export type AIComposerResponse = {
  intent: AIComposerIntent;
  message: string;
  requiresReview: boolean;
  autoSaved: boolean;
  transactionDraft: AIComposerTransactionDraft | null;
  createdTransactionId: string | null;
  undoAvailable: boolean;
  undoToken: string | null;
  eventId: string | null;
  missingFields: Array<"amount" | "date" | "description" | "category" | "account" | "transactionType">;
};
