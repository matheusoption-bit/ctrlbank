import { AutomationJobStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateFinancialPlanSnapshotArtifact, generateMonthlyDossierArtifact } from "@/lib/artifacts/service";
import { getQuotaUsage } from "@/lib/quotas/service";

async function recordJobRun(input: {
  jobName: string;
  status: AutomationJobStatus;
  startedAt: Date;
  itemCount: number;
  householdId?: string | null;
  errorSummary?: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.automationJobRun.create({
    data: {
      jobName: input.jobName,
      status: input.status,
      itemCount: input.itemCount,
      startedAt: input.startedAt,
      finishedAt: new Date(),
      householdId: input.householdId ?? null,
      errorSummary: input.errorSummary,
      metadata: (input.metadata ?? undefined) as any,
    },
  });
}

export async function runWave4Automations() {
  const startedAt = new Date();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const households = await prisma.household.findMany({
    select: { id: true, users: { select: { id: true }, take: 1 } },
  });

  let dossierCount = 0;
  let warningCount = 0;
  let planCount = 0;

  try {
    for (const household of households) {
      const actorId = household.users[0]?.id;
      if (!actorId) continue;

      await generateMonthlyDossierArtifact({
        householdId: household.id,
        userId: actorId,
        year,
        month,
      });
      dossierCount++;

      const quotaPolicies = await prisma.householdQuota.findMany({ where: { householdId: household.id } });
      for (const policy of quotaPolicies) {
        const usage = await getQuotaUsage(household.id, policy.capability, policy.provider);
        if (policy.warningThresholdPct && usage.usage.usagePct >= policy.warningThresholdPct) {
          warningCount++;
        }
      }
    }

    const plans = await prisma.financialPlan.findMany({ where: { isActive: true }, select: { id: true, userId: true } });
    for (const plan of plans) {
      await generateFinancialPlanSnapshotArtifact({ planId: plan.id, actorUserId: plan.userId });
      planCount++;
    }

    await recordJobRun({
      jobName: "wave4-governance",
      status: AutomationJobStatus.SUCCESS,
      startedAt,
      itemCount: dossierCount + planCount,
      metadata: { dossiers: dossierCount, planSnapshots: planCount, quotaWarnings: warningCount },
    });

    return { dossiers: dossierCount, planSnapshots: planCount, quotaWarnings: warningCount };
  } catch (error: any) {
    await recordJobRun({
      jobName: "wave4-governance",
      status: AutomationJobStatus.FAILED,
      startedAt,
      itemCount: dossierCount + planCount,
      errorSummary: error?.message ?? "unknown",
    });
    throw error;
  }
}
