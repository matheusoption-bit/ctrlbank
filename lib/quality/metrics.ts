import type { MetricPeriodType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { deterministicQualityScore } from "@/lib/quality/evaluation";

const METRIC_PERIOD_TYPE = {
  DAILY: "DAILY",
} as const satisfies Record<string, MetricPeriodType>;

type MetricRow = { metricCode: string; metricValue: number; dimensions?: Record<string, unknown> };

export async function computeQualityMetricsForHousehold(householdId: string, periodStart: Date, periodEnd: Date): Promise<MetricRow[]> {
  const [feedback, evals, logs, flags, events] = await Promise.all([
    prisma.decisionFeedback.findMany({ where: { householdId, createdAt: { gte: periodStart, lte: periodEnd } } }),
    prisma.decisionEvaluation.findMany({ where: { householdId, evaluatedAt: { gte: periodStart, lte: periodEnd } } }),
    prisma.ingestionLog.findMany({ where: { householdId, createdAt: { gte: periodStart, lte: periodEnd } } }),
    prisma.transactionQualityFlag.findMany({ where: { householdId, createdAt: { gte: periodStart, lte: periodEnd } } }),
    prisma.aiCaptureEvent.findMany({ where: { householdId, createdAt: { gte: periodStart, lte: periodEnd } } }),
  ]);

  const accepted = feedback.filter((f) => f.feedbackType === "suggestion_accepted").length;
  const rejected = feedback.filter((f) => f.feedbackType === "suggestion_rejected").length;
  const overridden = feedback.filter((f) => f.feedbackType === "review_overridden").length;
  const recommendationsTotal = accepted + rejected;
  const reviewRequired = events.filter((e) => e.reviewState === "REQUIRED").length;
  const reviewFalsePositive = feedback.filter((f) => f.feedbackType === "review_false_positive").length;
  const duplicates = flags.filter((f) => f.code === "DUPLICATE_SUSPECTED" || f.code === "DUPLICATE_CONFIRMED").length;
  const duplicateFalsePositive = feedback.filter((f) => f.feedbackType === "duplicate_false_positive").length;
  const completionSuccess = logs.filter((l) => l.stage === "COMMITTED" && l.status === "SUCCESS").length;
  const completionTotal = logs.filter((l) => l.stage === "COMMITTED").length;
  const routingSuccess = evals.filter((e) => e.subjectType === "routing" && e.result === "CORRECT").length;
  const routingTotal = evals.filter((e) => e.subjectType === "routing").length;

  const metrics: MetricRow[] = [
    { metricCode: "suggestion_acceptance_rate", metricValue: recommendationsTotal === 0 ? 0 : accepted / recommendationsTotal },
    { metricCode: "suggestion_override_rate", metricValue: recommendationsTotal === 0 ? 0 : overridden / Math.max(1, recommendationsTotal) },
    { metricCode: "review_required_rate", metricValue: events.length === 0 ? 0 : reviewRequired / events.length },
    { metricCode: "false_positive_review_rate", metricValue: reviewRequired === 0 ? 0 : reviewFalsePositive / reviewRequired },
    { metricCode: "duplicate_detected_rate", metricValue: events.length === 0 ? 0 : duplicates / events.length },
    { metricCode: "duplicate_false_positive_rate", metricValue: duplicates === 0 ? 0 : duplicateFalsePositive / duplicates },
    { metricCode: "routing_provider_success_rate", metricValue: routingTotal === 0 ? 0 : routingSuccess / routingTotal },
    { metricCode: "processing_completion_success_rate", metricValue: completionTotal === 0 ? 0 : completionSuccess / completionTotal },
    { metricCode: "decision_quality_score", metricValue: deterministicQualityScore(accepted, rejected, overridden) },
  ];

  return metrics;
}

export async function persistQualityMetricSnapshots(input: {
  householdId: string;
  scopeType?: string;
  scopeId?: string | null;
  periodType?: MetricPeriodType;
  periodStart: Date;
  periodEnd: Date;
}) {
  const metrics = await computeQualityMetricsForHousehold(input.householdId, input.periodStart, input.periodEnd);
  const computedAt = new Date();

  await prisma.productQualityMetricSnapshot.createMany({
    data: metrics.map((metric) => ({
      periodType: input.periodType ?? METRIC_PERIOD_TYPE.DAILY,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      householdId: input.householdId,
      scopeType: input.scopeType ?? "household",
      scopeId: input.scopeId ?? null,
      metricCode: metric.metricCode,
      metricValue: metric.metricValue,
      dimensions: (metric.dimensions as Prisma.InputJsonValue | undefined) ?? undefined,
      computedAt,
    })),
  });

  return metrics;
}
