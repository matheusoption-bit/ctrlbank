import { QuotaPeriodType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class QuotaExceededError extends Error {
  code = "QUOTA_EXCEEDED";
  details: Record<string, unknown>;

  constructor(message: string, details: Record<string, unknown>) {
    super(message);
    this.details = details;
  }
}

export function getMonthlyWindow(referenceDate = new Date()) {
  const from = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const to = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1);
  return { from, to };
}

export async function getQuotaUsage(householdId: string, capability: string, provider?: string | null) {
  const { from, to } = getMonthlyWindow();
  const quota = await prisma.householdQuota.findFirst({
    where: {
      householdId,
      capability,
      provider: provider ?? null,
      periodType: QuotaPeriodType.MONTHLY,
    },
  });

  const usageAgg = await prisma.aiCaptureEvent.aggregate({
    where: {
      householdId,
      createdAt: { gte: from, lt: to },
      ...(provider ? { provider } : {}),
    },
    _count: { _all: true },
    _sum: {
      tokensIn: true,
      tokensOut: true,
    },
  });

  const requests = usageAgg._count._all;
  const tokensIn = usageAgg._sum.tokensIn ?? 0;
  const tokensOut = usageAgg._sum.tokensOut ?? 0;

  const maxOfPct = (...values: Array<number | null>) => Math.max(...values.filter((v): v is number => Number.isFinite(v)));

  const reqPct = quota?.maxRequests ? (requests / quota.maxRequests) * 100 : null;
  const inPct = quota?.maxInputTokens ? (tokensIn / quota.maxInputTokens) * 100 : null;
  const outPct = quota?.maxOutputTokens ? (tokensOut / quota.maxOutputTokens) * 100 : null;
  const usagePct = maxOfPct(reqPct, inPct, outPct);

  return {
    quota,
    period: { from, to },
    usage: { requests, tokensIn, tokensOut, usagePct: Number.isFinite(usagePct) ? usagePct : 0 },
  };
}

export async function enforceHouseholdQuota(params: {
  householdId: string | null;
  capability: string;
  provider?: string | null;
}) {
  if (!params.householdId) return { status: "NO_HOUSEHOLD" as const };

  const report = await getQuotaUsage(params.householdId, params.capability, params.provider);
  const quota = report.quota;
  if (!quota) return { status: "NO_POLICY" as const, report };

  const over = Boolean(
    (quota.maxRequests && report.usage.requests >= quota.maxRequests) ||
    (quota.maxInputTokens && report.usage.tokensIn >= quota.maxInputTokens) ||
    (quota.maxOutputTokens && report.usage.tokensOut >= quota.maxOutputTokens)
  );

  const warning = Boolean(quota.warningThresholdPct && report.usage.usagePct >= quota.warningThresholdPct);

  if (over && quota.hardBlock) {
    throw new QuotaExceededError("Quota exceeded for household", {
      householdId: params.householdId,
      capability: params.capability,
      provider: params.provider ?? null,
      usage: report.usage,
      limits: {
        maxRequests: quota.maxRequests,
        maxInputTokens: quota.maxInputTokens,
        maxOutputTokens: quota.maxOutputTokens,
      },
    });
  }

  return {
    status: over ? "OVER_SOFT_LIMIT" : warning ? "WARNING" : "OK",
    report,
  } as const;
}
