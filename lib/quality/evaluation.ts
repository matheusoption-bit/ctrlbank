import { EvaluationResult } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function recordDecisionEvaluation(input: {
  scopeType: string;
  scopeId?: string | null;
  householdId?: string | null;
  userId?: string | null;
  subjectType: string;
  subjectId?: string | null;
  sourceEventId?: string | null;
  policyVersionId?: string | null;
  provider?: string | null;
  model?: string | null;
  evaluationType: string;
  expectedOutcome?: string | null;
  observedOutcome?: string | null;
  result: EvaluationResult;
  score?: number | null;
  metadata?: Record<string, unknown>;
}) {
  return prisma.decisionEvaluation.create({
    data: {
      ...input,
      evaluatedAt: new Date(),
      metadata: (input.metadata ?? undefined) as any,
    },
  });
}

export function deterministicQualityScore(accepted: number, rejected: number, overridden: number) {
  const total = accepted + rejected + overridden;
  if (total === 0) return 0.5;
  const score = (accepted - rejected * 0.7 - overridden * 0.5) / total;
  return Math.max(0, Math.min(1, Number(((score + 1) / 2).toFixed(4))));
}
