import { PolicyStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type JsonObject = Record<string, unknown>;

const DEFAULT_POLICIES: Record<string, JsonObject> = {
  review_thresholds: { riskScoreThreshold: 0.45, highSeverityRequiresReview: true },
  dedup_heuristics: { similarityThreshold: 0.4, dateWindowDays: 1 },
  outlier_sensitivity: { zScoreMedium: 3, zScoreHigh: 4 },
  provider_routing: { complexTextLength: 1200, preferredComplexMediaProvider: "openai", preferredDenseReasoningProvider: "nvidia" },
  recommendation_gating: { minimumScore: 0.2, dismissWeight: 0.8 },
  alert_gating: { minImpact: 0.05 },
};

export async function resolveActivePolicy(policyType: string, householdId?: string | null) {
  const where: Prisma.PolicyVersionWhereInput = {
    policyType,
    status: PolicyStatus.ACTIVE,
    OR: householdId ? [{ householdId }, { householdId: null }] : [{ householdId: null }],
  };

  const policy = await prisma.policyVersion.findFirst({
    where,
    orderBy: [{ householdId: "desc" }, { activatedAt: "desc" }, { createdAt: "desc" }],
  });

  return policy;
}

export async function getPolicyConfig<T extends JsonObject>(policyType: string, householdId?: string | null): Promise<T> {
  const active = await resolveActivePolicy(policyType, householdId);
  const fallback = (DEFAULT_POLICIES[policyType] ?? {}) as T;
  return { ...fallback, ...((active?.config as T | undefined) ?? {}) };
}

export async function activatePolicyVersion(input: {
  policyVersionId: string;
  actorUserId?: string | null;
}) {
  const target = await prisma.policyVersion.findUnique({ where: { id: input.policyVersionId } });
  if (!target) throw new Error("Policy version not found");

  return prisma.$transaction(async (tx) => {
    await tx.policyVersion.updateMany({
      where: {
        householdId: target.householdId,
        policyType: target.policyType,
        status: PolicyStatus.ACTIVE,
        NOT: { id: target.id },
      },
      data: { status: PolicyStatus.RETIRED, retiredAt: new Date() },
    });

    return tx.policyVersion.update({
      where: { id: target.id },
      data: {
        status: PolicyStatus.ACTIVE,
        activatedAt: new Date(),
        description: target.description ?? `Activated by ${input.actorUserId ?? "system"}`,
      },
    });
  });
}

export async function rollbackPolicy(policyType: string, householdId?: string | null) {
  const current = await prisma.policyVersion.findFirst({
    where: { policyType, householdId: householdId ?? null, status: PolicyStatus.ACTIVE },
    orderBy: { activatedAt: "desc" },
  });

  const previous = await prisma.policyVersion.findFirst({
    where: {
      policyType,
      householdId: householdId ?? null,
      status: { in: [PolicyStatus.RETIRED, PolicyStatus.ROLLED_BACK] },
      id: { not: current?.id },
    },
    orderBy: [{ activatedAt: "desc" }, { createdAt: "desc" }],
  });

  if (!previous) throw new Error("No previous policy available for rollback");

  return prisma.$transaction(async (tx) => {
    if (current) {
      await tx.policyVersion.update({ where: { id: current.id }, data: { status: PolicyStatus.ROLLED_BACK, retiredAt: new Date() } });
    }
    return tx.policyVersion.update({ where: { id: previous.id }, data: { status: PolicyStatus.ACTIVE, activatedAt: new Date() } });
  });
}
