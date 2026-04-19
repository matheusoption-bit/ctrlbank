import { AutomationJobStatus, CalibrationMode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { persistQualityMetricSnapshots } from "@/lib/quality/metrics";
import { runCalibration } from "@/lib/calibration/service";

const mode = process.env.WAVE5_CALIBRATION_MODE === "APPLY_WITH_GUARDRAILS" ? CalibrationMode.APPLY_WITH_GUARDRAILS : CalibrationMode.RECOMMEND_ONLY;
const minSampleSize = Number(process.env.WAVE5_CALIBRATION_MIN_SAMPLE_SIZE ?? 25);
const maxStepPct = Number(process.env.WAVE5_CALIBRATION_MAX_STEP_PCT ?? 0.2);

async function recordJobRun(input: { jobName: string; status: AutomationJobStatus; itemCount: number; startedAt: Date; metadata?: Record<string, unknown>; errorSummary?: string; }) {
  return prisma.automationJobRun.create({
    data: {
      jobName: input.jobName,
      status: input.status,
      itemCount: input.itemCount,
      startedAt: input.startedAt,
      finishedAt: new Date(),
      metadata: (input.metadata ?? undefined) as any,
      errorSummary: input.errorSummary,
    },
  });
}

export async function runWave5Optimizations() {
  const startedAt = new Date();
  const periodEnd = new Date();
  const periodStart = new Date(Date.now() - 24 * 3600 * 1000);

  let metricsCount = 0;
  let calibrations = 0;
  let regressions = 0;

  try {
    const households = await prisma.household.findMany({ select: { id: true } });

    for (const household of households) {
      const metrics = await persistQualityMetricSnapshots({
        householdId: household.id,
        periodStart,
        periodEnd,
      });
      metricsCount += metrics.length;

      const calibration = await runCalibration({
        householdId: household.id,
        policyType: "review_thresholds",
        mode,
        minSampleSize,
        maxStepPct,
      });
      calibrations += 1;

      const reviewRate = metrics.find((m) => m.metricCode === "review_required_rate")?.metricValue ?? 0;
      if (reviewRate > 0.4) {
        regressions += 1;
        await prisma.decisionEvaluation.create({
          data: {
            scopeType: "household",
            scopeId: household.id,
            householdId: household.id,
            subjectType: "quality_regression",
            evaluationType: "regression_detector",
            result: "INCORRECT",
            observedOutcome: "review_required_spike",
            score: reviewRate,
            metadata: { source: "wave5_job", runId: calibration.id },
            evaluatedAt: new Date(),
          },
        });
      }
    }

    await recordJobRun({
      jobName: "wave5-continuous-optimization",
      status: AutomationJobStatus.SUCCESS,
      itemCount: metricsCount + calibrations,
      startedAt,
      metadata: { metricsCount, calibrations, regressions },
    });

    return { metricsCount, calibrations, regressions };
  } catch (error: any) {
    await recordJobRun({
      jobName: "wave5-continuous-optimization",
      status: AutomationJobStatus.FAILED,
      itemCount: metricsCount + calibrations,
      startedAt,
      errorSummary: error?.message ?? "unknown",
    });
    throw error;
  }
}
