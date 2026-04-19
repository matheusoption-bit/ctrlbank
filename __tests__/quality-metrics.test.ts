import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  feedbackFindMany: vi.fn(),
  evalFindMany: vi.fn(),
  logFindMany: vi.fn(),
  flagFindMany: vi.fn(),
  eventFindMany: vi.fn(),
  snapCreateMany: vi.fn(),
}));

vi.mock("../lib/prisma", () => ({
  prisma: {
    decisionFeedback: { findMany: mocks.feedbackFindMany },
    decisionEvaluation: { findMany: mocks.evalFindMany },
    ingestionLog: { findMany: mocks.logFindMany },
    transactionQualityFlag: { findMany: mocks.flagFindMany },
    aiCaptureEvent: { findMany: mocks.eventFindMany },
    productQualityMetricSnapshot: { createMany: mocks.snapCreateMany },
  },
}));

import { computeQualityMetricsForHousehold, persistQualityMetricSnapshots } from "../lib/quality/metrics";

describe("quality metric snapshots", () => {
  beforeEach(() => Object.values(mocks).forEach((m) => m.mockReset()));

  it("computes and persists key metrics", async () => {
    mocks.feedbackFindMany.mockResolvedValue([{ feedbackType: "suggestion_accepted" }, { feedbackType: "suggestion_rejected" }]);
    mocks.evalFindMany.mockResolvedValue([{ subjectType: "routing", result: "CORRECT" }]);
    mocks.logFindMany.mockResolvedValue([{ stage: "COMMITTED", status: "SUCCESS" }]);
    mocks.flagFindMany.mockResolvedValue([{ code: "DUPLICATE_SUSPECTED" }]);
    mocks.eventFindMany.mockResolvedValue([{ reviewState: "REQUIRED" }]);

    const metrics = await computeQualityMetricsForHousehold("h1", new Date("2026-04-01"), new Date("2026-04-02"));
    expect(metrics.find((m) => m.metricCode === "suggestion_acceptance_rate")?.metricValue).toBe(0.5);

    await persistQualityMetricSnapshots({ householdId: "h1", periodStart: new Date("2026-04-01"), periodEnd: new Date("2026-04-02") });
    expect(mocks.snapCreateMany).toHaveBeenCalled();
  });

  it("handles legacy null/empty data without crashing", async () => {
    mocks.feedbackFindMany.mockResolvedValue([]);
    mocks.evalFindMany.mockResolvedValue([]);
    mocks.logFindMany.mockResolvedValue([]);
    mocks.flagFindMany.mockResolvedValue([]);
    mocks.eventFindMany.mockResolvedValue([]);

    const metrics = await computeQualityMetricsForHousehold("h1", new Date(), new Date());
    expect(metrics.every((m) => Number.isFinite(m.metricValue))).toBe(true);
  });
});
