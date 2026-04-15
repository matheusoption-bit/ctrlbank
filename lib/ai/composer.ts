import { prisma } from "@/lib/prisma";
import { AIComposerTransactionDraft } from "./contracts";

export async function resolveTargetAccount(userId: string, householdId: string | null, inferredAccountName: string | null) {
  let accounts = [];
  if (householdId) {
    accounts = await prisma.bankAccount.findMany({ where: { householdId } });
  } else {
    accounts = await prisma.bankAccount.findMany({ where: { userId } });
  }

  if (accounts.length === 0) return null;

  // 1. Exact or partial match if AI provided a name (only if high confidence context)
  if (inferredAccountName) {
    const matched = accounts.find(a => a.name.toLowerCase().includes(inferredAccountName.toLowerCase()));
    if (matched) return matched;
  }

  // 2. Fallback to official default account
  const defaultAcc = accounts.find(a => a.isDefault);
  if (defaultAcc) return defaultAcc;

  // 3. Fallback to null (NO SILENT FALLBACK to first element)
  return null;
}

export async function resolveCategory(userId: string, householdId: string | null, categoryName: string, transactionType: string) {
  if (categoryName === "Outros") return { id: null, name: "Outros" };
  
  const categories = await prisma.category.findMany({
    where: { 
      OR: [{ userId }, { householdId: householdId ?? "" }],
      type: transactionType as any
    }
  });

  const matched = categories.find(c => c.name.toLowerCase().includes(categoryName.toLowerCase()));
  if (matched) return { id: matched.id, name: matched.name };
  
  return { id: null, name: "Outros" };
}

export function shouldAutoSave(draft: AIComposerTransactionDraft, missing: string[]): boolean {
  if (missing.length > 0) return false;
  return draft.confidence.overall >= 0.85;
}

export type CreateAiCaptureEventInput = {
  userId: string;
  householdId: string | null;
  source: string;
  inputType: string;
  rawText: string | null;
  normalizedDraft: any | null;
  confidenceOverall: number;
  decision: string;
  createdTransactionId: string | null;
};

export async function logAiCaptureEvent(data: CreateAiCaptureEventInput) {
  try {
    return await prisma.aiCaptureEvent.create({ data });
  } catch (err) {
    console.error("[ai/composer] failed to log ai capture event", err);
    return null;
  }
}
