import { shouldAutoSave } from "@/lib/ai/composer";
import { ReviewDecision } from "./types";
import { AIComposerTransactionDraft } from "@/lib/ai/contracts";

export function reviewDraft(params: {
  draft: AIComposerTransactionDraft;
  missingFields: string[];
  disableAutoSave?: boolean;
  forceReview?: boolean;
  forceReason?: string;
}): ReviewDecision {
  const { draft, missingFields, disableAutoSave, forceReview, forceReason } = params;

  if (forceReview) {
    return {
      intent: "clarification_needed",
      message: forceReason ?? "Entrada sinalizada para revisão de segurança.",
      requiresReview: true,
      canCommit: false,
    };
  }

  const isAutoSave = shouldAutoSave(draft, missingFields);

  if (draft.confidence.overall < 0.55 || missingFields.length > 0) {
    return {
      intent: "clarification_needed",
      message: missingFields.includes("account")
        ? "Não encontrei a conta padrão, onde devo registrar isso?"
        : "Preciso de mais informações para registrar.",
      requiresReview: true,
      canCommit: false,
    };
  }

  if (draft.confidence.overall >= 0.55 && draft.confidence.overall < 0.85) {
    return {
      intent: "transaction_draft",
      message: "Fiz um rascunho, mas preciso da sua revisão.",
      requiresReview: true,
      canCommit: false,
    };
  }

  if (isAutoSave && !disableAutoSave) {
    return {
      intent: "transaction_created",
      message: "Movimento registrado com sucesso.",
      requiresReview: false,
      canCommit: true,
    };
  }

  return {
    intent: "transaction_draft",
    message: "Entrada pronta para salvar. Revise rapidamente antes de confirmar.",
    requiresReview: true,
    canCommit: false,
  };
}
