import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  householdFindMany: vi.fn(),
  jobCreate: vi.fn(),
  evalCreate: vi.fn(),
  metricsPersist: vi.fn(),
  calibrationRun: vi.fn(),
}));

vi.mock("../lib/prisma", () => ({
  prisma: {
    household: { findMany: mocks.householdFindMany },
    automationJobRun: { create: mocks.jobCreate },
    decisionEvaluation: { create: mocks.evalCreate },
  },
}));

vi.mock("../lib/quality/metrics", () => ({ persistQualityMetricSnapshots: mocks.metricsPersist }));
vi.mock("../lib/calibration/service", () => ({ runCalibration: mocks.calibrationRun }));

import { runWave5Optimizations } from "../lib/automation/wave5";

describe("wave5 scheduled job", () => {
  beforeEach(() => Object.values(mocks).forEach((m) => m.mockReset()));

  it("runs idempotent metric/calibration generation and logs success", async () => {
    mocks.householdFindMany.mockResolvedValue([{ id: "h1" }]);
    mocks.metricsPersist.mockResolvedValue([{ metricCode: "review_required_rate", metricValue: 0.2 }]);
    mocks.calibrationRun.mockResolvedValue({ id: "c1" });
    mocks.jobCreate.mockResolvedValue({ id: "j1", status: "SUCCESS" });

    const result = await runWave5Optimizations();
    expect(result.calibrations).toBe(1);
    expect(mocks.jobCreate).toHaveBeenCalled();
  });

  it("detects representative regression", async () => {
    mocks.householdFindMany.mockResolvedValue([{ id: "h1" }]);
    mocks.metricsPersist.mockResolvedValue([{ metricCode: "review_required_rate", metricValue: 0.5 }]);
    mocks.calibrationRun.mockResolvedValue({ id: "c1" });
    mocks.jobCreate.mockResolvedValue({ id: "j1", status: "SUCCESS" });

    const result = await runWave5Optimizations();
    expect(result.regressions).toBe(1);
    expect(mocks.evalCreate).toHaveBeenCalled();
  });
});
