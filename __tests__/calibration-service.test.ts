import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  calFindFirst: vi.fn(),
  evalFindMany: vi.fn(),
  polFindFirst: vi.fn(),
  polCreate: vi.fn(),
  calCreate: vi.fn(),
  changeCreate: vi.fn(),
  resolve: vi.fn(),
}));

vi.mock("../lib/prisma", () => ({
  prisma: {
    calibrationRun: { findFirst: mocks.calFindFirst, create: mocks.calCreate },
    decisionEvaluation: { findMany: mocks.evalFindMany },
    policyVersion: { findFirst: mocks.polFindFirst, create: mocks.polCreate },
    calibrationChange: { create: mocks.changeCreate },
  },
}));

vi.mock("../lib/policy/engine", () => ({ getPolicyConfig: mocks.resolve }));

import { runCalibration } from "../lib/calibration/service";

describe("calibration service", () => {
  beforeEach(() => Object.values(mocks).forEach((m) => m.mockReset()));

  it("does not apply when sample size is insufficient", async () => {
    mocks.calFindFirst.mockResolvedValue(null);
    mocks.evalFindMany.mockResolvedValue(new Array(5).fill({ result: "CORRECT" }));
    mocks.calCreate.mockResolvedValue({ applied: false, reason: "insufficient_sample_size" });

    const run = await runCalibration({ householdId: "h1", policyType: "review_thresholds", minSampleSize: 10 });
    expect(run.applied).toBe(false);
    expect(run.reason).toBe("insufficient_sample_size");
  });

  it("recommend-only mode does not create policy version", async () => {
    mocks.calFindFirst.mockResolvedValue(null);
    mocks.evalFindMany.mockResolvedValue(new Array(30).fill({ result: "CORRECT" }));
    mocks.resolve.mockResolvedValue({ riskScoreThreshold: 0.45 });
    mocks.calCreate.mockResolvedValue({ id: "c1", applied: false, reason: "recommendation_generated" });

    const run = await runCalibration({ householdId: "h1", policyType: "review_thresholds" });
    expect(run.applied).toBe(false);
    expect(mocks.polCreate).not.toHaveBeenCalled();
  });

  it("apply mode enforces bounded step and persists change", async () => {
    mocks.calFindFirst.mockResolvedValue(null);
    mocks.evalFindMany.mockResolvedValue(new Array(40).fill({ result: "INCORRECT" }));
    mocks.resolve.mockResolvedValue({ riskScoreThreshold: 0.45 });
    mocks.polFindFirst.mockResolvedValue({ id: "p1", version: 1 });
    mocks.polCreate.mockResolvedValue({ id: "p2" });
    mocks.calCreate.mockResolvedValue({ id: "c1", applied: true });

    const run = await runCalibration({ householdId: "h1", policyType: "review_thresholds", mode: "APPLY_WITH_GUARDRAILS", maxStepPct: 0.01 });
    expect(run.applied).toBe(true);
    expect(mocks.changeCreate).toHaveBeenCalled();
    const policyCreateArg = mocks.polCreate.mock.calls[0][0].data.config;
    expect(policyCreateArg.riskScoreThreshold).toBeGreaterThanOrEqual(0.44);
  });
});
