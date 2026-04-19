import type { CalibrationMode, PolicyStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPolicyConfig } from "@/lib/policy/engine";

const CALIBRATION_MODE = {
  RECOMMEND_ONLY: "RECOMMEND_ONLY",
  APPLY_WITH_GUARDRAILS: "APPLY_WITH_GUARDRAILS",
} as const satisfies Record<string, CalibrationMode>;

const POLICY_STATUS = {
  EXPERIMENTAL: "EXPERIMENTAL",
} as const satisfies Record<string, PolicyStatus>;

type CalibrationInput = {
  householdId: string;
  policyType: string;
  mode?: CalibrationMode;
  minSampleSize?: number;
  maxStepPct?: number;
  cooldownHours?: number;
};

export async function runCalibration(input: CalibrationInput) {
  const mode = input.mode ?? CALIBRATION_MODE.RECOMMEND_ONLY;
  const minSample = input.minSampleSize ?? 25;
  const maxStepPct = input.maxStepPct ?? 0.2;
  const cooldownHours = input.cooldownHours ?? 24;

  const latest = await prisma.calibrationRun.findFirst({
    where: { householdId: input.householdId, policyType: input.policyType },
    orderBy: { createdAt: "desc" },
  });

  if (latest && Date.now() - latest.createdAt.getTime() < cooldownHours * 3600 * 1000) {
    return prisma.calibrationRun.create({
      data: {
        householdId: input.householdId,
        policyType: input.policyType,
        mode,
        applied: false,
        reason: "cooldown_active",
        guardrailStatus: "blocked_cooldown",
      },
    });
  }

  const samples = await prisma.decisionEvaluation.findMany({
    where: {
      householdId: input.householdId,
      subjectType: input.policyType,
    },
    orderBy: { evaluatedAt: "desc" },
    take: 200,
  });

  if (samples.length < minSample) {
    return prisma.calibrationRun.create({
      data: {
        householdId: input.householdId,
        policyType: input.policyType,
        mode,
        applied: false,
        reason: "insufficient_sample_size",
        guardrailStatus: "blocked_sample_size",
        baselineMetrics: { sampleSize: samples.length },
      },
    });
  }

  const incorrectRate = samples.filter((s) => s.result === "INCORRECT" || s.result === "OVERRIDDEN").length / samples.length;
  const acceptedRate = samples.filter((s) => s.result === "ACCEPTED" || s.result === "CORRECT").length / samples.length;

  const current = await getPolicyConfig<Record<string, number>>(input.policyType, input.householdId);
  const currentThreshold = Number(current.riskScoreThreshold ?? current.similarityThreshold ?? 0.45);

  const targetDelta = incorrectRate > 0.25 ? 0.05 : acceptedRate > 0.8 ? -0.03 : 0;
  const boundedDelta = Math.max(-maxStepPct, Math.min(maxStepPct, targetDelta));
  const candidateThreshold = Number(Math.max(0.1, Math.min(0.95, currentThreshold + boundedDelta)).toFixed(4));

  let applied = false;
  let policyVersionId: string | undefined;
  let reason = "recommendation_generated";

  if (mode === CALIBRATION_MODE.APPLY_WITH_GUARDRAILS && boundedDelta !== 0) {
    const latestVersion = await prisma.policyVersion.findFirst({
      where: { householdId: input.householdId, policyType: input.policyType },
      orderBy: { version: "desc" },
    });

    const next = await prisma.policyVersion.create({
      data: {
        householdId: input.householdId,
        policyType: input.policyType,
        version: (latestVersion?.version ?? 0) + 1,
        status: POLICY_STATUS.EXPERIMENTAL,
        parentPolicyVersionId: latestVersion?.id,
        config: { ...current, riskScoreThreshold: candidateThreshold },
        description: "Auto-calibrated by Wave 5 engine",
      },
    });

    policyVersionId = next.id;
    applied = true;
    reason = "applied_with_guardrails";
  }

  const run = await prisma.calibrationRun.create({
    data: {
      householdId: input.householdId,
      policyType: input.policyType,
      mode,
      applied,
      reason,
      guardrailStatus: "ok",
      policyVersionId,
      baselineMetrics: { sampleSize: samples.length, incorrectRate, acceptedRate, currentThreshold },
      candidateConfig: { riskScoreThreshold: candidateThreshold, boundedDelta },
    },
  });

  await prisma.calibrationChange.create({
    data: {
      calibrationRunId: run.id,
      metricCode: "policy_threshold",
      baselineValue: currentThreshold,
      candidateValue: candidateThreshold,
    },
  });

  return run;
}
