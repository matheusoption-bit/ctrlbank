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

// ─────────────────────────────────────────────
// Phase 11-14: Persistence & AI
// ─────────────────────────────────────────────

export async function getOrCreateConversation(userId: string, householdId: string | null, conversationId?: string | null) {
  if (conversationId) {
    const conv = await prisma.aiConversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    });
    if (conv) return conv.id;
  }
  const newConv = await prisma.aiConversation.create({
    data: { userId, householdId, title: "Nova Conversa" }
  });
  return newConv.id;
}

export async function saveAiMessage(data: {
  conversationId: string;
  userId: string;
  role: "user" | "assistant" | "system";
  mode: string;
  inputType?: string;
  content: string;
  metadata?: any;
}) {
  try {
    const message = await prisma.aiMessage.create({
      data: {
        conversationId: data.conversationId,
        userId: data.userId,
        role: data.role,
        mode: data.mode,
        inputType: data.inputType ?? "text",
        content: data.content,
        metadata: data.metadata ?? null,
      }
    });
    await prisma.aiConversation.update({
      where: { id: data.conversationId },
      data: { updatedAt: new Date() },
    });
    return message;
  } catch (err) {
    console.error("[ai/composer] failed to save ai message", err);
    return null;
  }
}

export async function createFinancialPlan(userId: string, householdId: string | null, planData: any) {
  try {
    const visibility = planData.visibility === "HOUSEHOLD" && householdId ? "HOUSEHOLD" : "PERSONAL";
    
    const plan = await prisma.financialPlan.create({
      data: {
        userId,
        householdId: visibility === "HOUSEHOLD" ? householdId : null,
        visibility,
        title: planData.title ?? "Plano Financeiro",
        objectiveType: planData.objectiveType ?? "general",
        targetAmount: planData.targetAmount,
        targetMonths: planData.targetMonths,
        monthlyRequiredAmount: planData.monthlyRequiredAmount,
        summary: planData.summary ?? "",
        recommendedCuts: planData.recommendedCuts,
        scenarioData: planData.scenarioData,
      }
    });
    // Auto sync immediately upon creation to seed initial snapshot
    const { syncFinancialPlan } = await import("./planner");
    await syncFinancialPlan(plan.id);
    return plan;
  } catch (err) {
    console.error("[ai/composer] failed to create financial plan", err);
    return null;
  }
}

export async function createRecommendation(userId: string, householdId: string | null, recData: any) {
  try {
    const visibility = recData.visibility === "HOUSEHOLD" && householdId ? "HOUSEHOLD" : "PERSONAL";
    
    return await prisma.aiRecommendation.create({
      data: {
        userId,
        householdId: visibility === "HOUSEHOLD" ? householdId : null,
        visibility,
        relatedPlanId: recData.relatedPlanId ?? null,
        type: recData.type ?? "insight",
        message: recData.message,
        actionLabel: recData.actionLabel,
        actionTarget: recData.actionTarget,
        score: recData.score ?? 0,
      }
    });
  } catch (err) {
    console.error("[ai/composer] failed to create rec", err);
    return null;
  }
}

// ─────────────────────────────────────────────
// Phase 15-18: Product Feedback Loop
// ─────────────────────────────────────────────

export async function createProductFeedback(
  userId: string,
  householdId: string | null,
  feedbackData: {
    rawInput: string;
    normalizedTitle: string;
    summary: string;
    type: string;
    area: string;
    impact: string;
    reproductionSteps?: any[];
    suggestedSolution?: string;
    acceptanceCriteria?: any[];
  },
  artifacts?: Array<{ kind: string; url?: string; content?: any }>
) {
  try {
    // 1. Deduplication: Find similar feedback in the same area
    const similarFeedbacks: any[] = await prisma.$queryRaw`
      SELECT id, "normalizedTitle", similarity("normalizedTitle", ${feedbackData.normalizedTitle}) as sim
      FROM "ProductFeedback"
      WHERE area = ${feedbackData.area}
      AND similarity("normalizedTitle", ${feedbackData.normalizedTitle}) > 0.7
      ORDER BY sim DESC
      LIMIT 1
    `;

    const relatedToId = similarFeedbacks.length > 0 ? similarFeedbacks[0].id : null;

    // 2. Calculate priorityScore
    // impact high=3 medium=2 low=1. score = impact*10 + (relatedCount*2)
    const impactMultiplier = feedbackData.impact === "high" ? 3 : feedbackData.impact === "medium" ? 2 : 1;
    
    let relatedCount = 0;
    if (relatedToId) {
      relatedCount = await prisma.productFeedback.count({
        where: { OR: [{ id: relatedToId }, { relatedToId }] }
      });
    }
    
    const priorityScore = (impactMultiplier * 10) + (relatedCount * 2);

    // 3. Create feedback record
    const feedback = await prisma.productFeedback.create({
      data: {
        userId,
        householdId,
        source: "composer",
        rawInput: feedbackData.rawInput,
        normalizedTitle: feedbackData.normalizedTitle,
        summary: feedbackData.summary,
        type: feedbackData.type,
        area: feedbackData.area,
        impact: feedbackData.impact,
        reproductionSteps: (feedbackData.reproductionSteps as any) ?? undefined,
        suggestedSolution: feedbackData.suggestedSolution ?? null,
        acceptanceCriteria: (feedbackData.acceptanceCriteria as any) ?? undefined,
        status: "new",
        priorityScore,
        relatedToId,
      }
    });

    // Create artifacts if provided
    if (artifacts && artifacts.length > 0) {
      await Promise.all(
        artifacts.map(artifact =>
          prisma.feedbackArtifact.create({
            data: {
              feedbackId: feedback.id,
              kind: artifact.kind,
              url: artifact.url ?? null,
              content: artifact.content ?? null,
            }
          })
        )
      );
    }

    return feedback;
  } catch (err) {
    console.error("[ai/composer] failed to create product feedback", err);
    return null;
  }
}
