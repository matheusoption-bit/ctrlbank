import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getQuotaUsage } from "@/lib/quotas/service";

export async function GET() {
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { householdId: true } });
  if (!dbUser?.householdId) return NextResponse.json({ artifacts: [], quotas: [], jobs: [] });

  const [artifacts, quotaPolicies, jobs, activePolicies, calibrations, experiments, metrics] = await Promise.all([
    prisma.signedArtifact.findMany({ where: { householdId: dbUser.householdId }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.householdQuota.findMany({ where: { householdId: dbUser.householdId } }),
    prisma.automationJobRun.findMany({ where: { OR: [{ householdId: dbUser.householdId }, { householdId: null }] }, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.policyVersion.findMany({ where: { householdId: dbUser.householdId, status: "ACTIVE" }, orderBy: { activatedAt: "desc" }, take: 10 }),
    prisma.calibrationRun.findMany({ where: { householdId: dbUser.householdId }, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.experiment.findMany({ where: { householdId: dbUser.householdId }, orderBy: { updatedAt: "desc" }, take: 10 }),
    prisma.productQualityMetricSnapshot.findMany({ where: { householdId: dbUser.householdId }, orderBy: { computedAt: "desc" }, take: 30 }),
  ]);

  const quotas = await Promise.all(
    quotaPolicies.map(async (policy) => {
      const report = await getQuotaUsage(dbUser.householdId!, policy.capability, policy.provider);
      return {
        policy,
        usage: report.usage,
      };
    })
  );

  return NextResponse.json({ artifacts, quotas, jobs, activePolicies, calibrations, experiments, metrics });
}
