import { createManagedTransaction } from "@/app/actions/transactions";
import { AIComposerTransactionDraft } from "@/lib/ai/contracts";

export async function commitDraft(params: {
  draft: AIComposerTransactionDraft;
  userId: string;
  householdId: string | null;
}) {
  const { draft, userId, householdId } = params;

  return createManagedTransaction({
    userId,
    householdId,
    bankAccountId: draft.accountId!,
    categoryId: draft.categoryId,
    type: draft.transactionType,
    status: "COMPLETED",
    amount: Math.abs(draft.amount!),
    description: draft.description,
    date: new Date(draft.date!),
  });
}
