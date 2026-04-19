import { prisma } from "@/lib/prisma";
import { AIComposerTransactionDraft } from "@/lib/ai/contracts";
import { detectDuplicateTransaction } from "@/lib/finance/deduplication";
import { getPolicyConfig } from "@/lib/policy/engine";

type Severity = "LOW" | "MEDIUM" | "HIGH";

export type QualitySignal = {
  code: "OUTLIER_AMOUNT" | "DUPLICATE_SUSPECTED" | "CATEGORY_CONFLICT";
  severity: Severity;
  reason: string;
};

export type QualityEvaluation = {
  riskScore: number;
  requiresReview: boolean;
  signals: QualitySignal[];
};

function mean(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((acc, v) => acc + v, 0) / values.length;
}

function std(values: number[]) {
  if (values.length <= 1) return 0;
  const avg = mean(values);
  const variance = mean(values.map((v) => (v - avg) ** 2));
  return Math.sqrt(variance);
}

export async function evaluateTransactionQuality(params: {
  userId: string;
  householdId: string | null;
  draft: AIComposerTransactionDraft;
}): Promise<QualityEvaluation> {
  const { userId, householdId, draft } = params;
  const [outlierPolicy, reviewPolicy] = await Promise.all([
    getPolicyConfig<{ zScoreMedium?: number; zScoreHigh?: number }>("outlier_sensitivity", householdId),
    getPolicyConfig<{ riskScoreThreshold?: number; highSeverityRequiresReview?: boolean }>("review_thresholds", householdId),
  ]);
  const signals: QualitySignal[] = [];
  const weights: number[] = [];

  if (!draft.amount || !draft.date) {
    return { riskScore: 0.2, requiresReview: false, signals };
  }

  // 1) Outlier via z-score on last transactions in same category/account
  const history = await prisma.transaction.findMany({
    where: {
      OR: [{ userId }, ...(householdId ? [{ householdId }] : [])],
      type: draft.transactionType,
      ...(draft.categoryId ? { categoryId: draft.categoryId } : {}),
      ...(draft.accountId ? { bankAccountId: draft.accountId } : {}),
    },
    select: { amount: true },
    take: 40,
    orderBy: { date: "desc" },
  });

  const values = history.map((item) => Number(item.amount)).filter((v) => Number.isFinite(v));
  if (values.length >= 8) {
    const avg = mean(values);
    const sigma = std(values);
    if (sigma > 0) {
      const z = Math.abs((Math.abs(draft.amount) - avg) / sigma);
      const zMedium = Number(outlierPolicy.zScoreMedium ?? 3);
      const zHigh = Number(outlierPolicy.zScoreHigh ?? 4);
      if (z >= zMedium) {
        signals.push({
          code: "OUTLIER_AMOUNT",
          severity: z >= zHigh ? "HIGH" : "MEDIUM",
          reason: `Valor com z-score ${z.toFixed(2)} para o histórico local`,
        });
        weights.push(z >= zHigh ? 0.55 : 0.35);
      }
    }
  }

  // 2) Duplicate suspicion (checksum/time-window/similarity via existing engine)
  const dedup = await detectDuplicateTransaction({
    userId,
    householdId,
    item: {
      amount: Math.abs(draft.amount),
      date: new Date(draft.date),
      description: draft.description,
      type: draft.transactionType === "INCOME" ? "income" : "expense",
      source: draft.source,
    },
  });

  if (dedup.status === "duplicate") {
    signals.push({
      code: "DUPLICATE_SUSPECTED",
      severity: "HIGH",
      reason: `Movimento potencialmente duplicado (${dedup.existingId})`,
    });
    weights.push(0.7);
  }

  // 3) Category/account conflict from short-term local profile
  if (draft.accountId && draft.categoryId) {
    const profile = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        OR: [{ userId }, ...(householdId ? [{ householdId }] : [])],
        bankAccountId: draft.accountId,
        type: draft.transactionType,
      },
      _count: { categoryId: true },
      orderBy: { _count: { categoryId: "desc" } },
      take: 3,
    });

    const topCategories = profile.map((p) => p.categoryId).filter(Boolean);
    if (topCategories.length >= 2 && !topCategories.includes(draft.categoryId)) {
      signals.push({
        code: "CATEGORY_CONFLICT",
        severity: "MEDIUM",
        reason: "Categoria incomum para esta conta com base no histórico recente",
      });
      weights.push(0.25);
    }
  }

  const riskScore = Math.min(1, weights.reduce((acc, w) => acc + w, 0));
  const threshold = Number(reviewPolicy.riskScoreThreshold ?? 0.45);
  const requiresReview = riskScore >= threshold || (reviewPolicy.highSeverityRequiresReview ?? true) && signals.some((s) => s.severity === "HIGH");

  return {
    riskScore,
    requiresReview,
    signals,
  };
}
