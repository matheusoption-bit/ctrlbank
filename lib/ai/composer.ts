import { prisma } from "@/lib/prisma";
import { AIComposerTransactionDraft } from "./contracts";

export async function resolveTargetAccount(userId: string, householdId: string | null, inferredAccountName: string | null, merchantName?: string) {
  let accounts = [];
  if (householdId) {
    accounts = await prisma.bankAccount.findMany({ where: { householdId } });
  } else {
    accounts = await prisma.bankAccount.findMany({ where: { userId } });
  }

  if (accounts.length === 0) return null;

  // 0. Use MerchantMemory if exists
  if (merchantName) {
    const memory = await prisma.merchantMemory.findFirst({
      where: {
        OR: [{ householdId: householdId ?? "" }, { userId }],
        merchantName: { equals: merchantName, mode: "insensitive" },
        bankAccountId: { not: null }
      },
      orderBy: { correctedCount: "desc" }
    });
    if (memory && memory.bankAccountId) {
      const matched = accounts.find(a => a.id === memory.bankAccountId);
      if (matched) return matched;
    }
  }

  // 1. Exact or partial match if AI provided a name
  if (inferredAccountName) {
    const matched = accounts.find(a => a.name.toLowerCase().includes(inferredAccountName.toLowerCase()));
    if (matched) return matched;
  }

  // 2. Fallback to official default account
  const defaultAcc = accounts.find(a => a.isDefault);
  if (defaultAcc) return defaultAcc;

  // 3. Fallback to null
  return null;
}

export async function resolveCategory(userId: string, householdId: string | null, categoryName: string, transactionType: string, merchantName?: string) {
  const categories = await prisma.category.findMany({
    where: { 
      OR: [{ userId }, { householdId: householdId ?? "" }],
      type: transactionType as any
    }
  });

  // 0. Use MerchantMemory if exists
  if (merchantName) {
    const memory = await prisma.merchantMemory.findFirst({
      where: {
        OR: [{ householdId: householdId ?? "" }, { userId }],
        merchantName: { equals: merchantName, mode: "insensitive" },
        categoryId: { not: null }
      },
      orderBy: { correctedCount: "desc" }
    });
    if (memory && memory.categoryId) {
      const matched = categories.find(c => c.id === memory.categoryId);
      if (matched) return { id: matched.id, name: matched.name, fromMemory: true };
    }
  }

  if (categoryName === "Outros") return { id: null, name: "Outros" };

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
  captureGroupId?: string | null;
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

export async function learnFromCorrection(userId: string, householdId: string | null, merchantName: string, categoryId: string | null, bankAccountId: string | null) {
  if (!merchantName || merchantName.length < 3) return;

  const mName = merchantName.trim();
  const existing = await prisma.merchantMemory.findFirst({
    where: {
      OR: [{ householdId: householdId ?? "" }, { userId }],
      merchantName: mName,
      categoryId: categoryId,
      bankAccountId: bankAccountId,
    }
  });

  if (existing) {
    await prisma.merchantMemory.update({
      where: { id: existing.id },
      data: { correctedCount: { increment: 1 }, lastUsedAt: new Date() }
    });
  } else {
    await prisma.merchantMemory.create({
      data: {
        userId,
        householdId,
        merchantName: mName,
        categoryId,
        bankAccountId,
        correctedCount: 1,
      }
    });
  }
}
