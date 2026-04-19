import { resolveCategory, resolveTargetAccount } from "@/lib/ai/composer";
import { AIComposerTransactionDraft } from "@/lib/ai/contracts";
import { ResolvedDraft } from "./types";

export async function resolveDraft(params: {
  parsed: any;
  userId: string;
  householdId: string | null;
  source: AIComposerTransactionDraft["source"];
}): Promise<ResolvedDraft> {
  const parsed = params.parsed ?? {};
  if (parsed.amount && isNaN(Number(parsed.amount))) parsed.amount = null;

  const targetAccount = await resolveTargetAccount(
    params.userId,
    params.householdId,
    parsed.accountName,
    parsed.description,
  );

  const targetCategory = await resolveCategory(
    params.userId,
    params.householdId,
    parsed.categoryName || "Outros",
    parsed.transactionType || "EXPENSE",
    parsed.description,
  );

  const draft: AIComposerTransactionDraft = {
    amount: parsed.amount ? Number(parsed.amount) : null,
    date: parsed.date ?? new Date().toISOString().split("T")[0],
    description: parsed.description || "Movimento Extraído",
    transactionType: parsed.transactionType || "EXPENSE",
    categoryName: targetCategory.name,
    categoryId: targetCategory.id,
    accountId: targetAccount?.id ?? null,
    accountName: targetAccount?.name ?? null,
    confidence: parsed.confidence || { overall: 0, amount: 0, date: 0, description: 0, category: 0, account: 0, transactionType: 0 },
    source: params.source,
  };

  const missingFields: ResolvedDraft["missingFields"] = [];
  if (!draft.amount) missingFields.push("amount");
  if (!draft.date) missingFields.push("date");
  if (!draft.description) missingFields.push("description");
  if (!draft.accountId) missingFields.push("account");
  if (!draft.transactionType) missingFields.push("transactionType");

  return { draft, missingFields };
}
