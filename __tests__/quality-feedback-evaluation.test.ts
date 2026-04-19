import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ createFeedback: vi.fn(), createEval: vi.fn() }));

vi.mock("../lib/prisma", () => ({
  prisma: {
    decisionFeedback: { create: mocks.createFeedback },
    decisionEvaluation: { create: mocks.createEval },
  },
}));

import { captureDecisionFeedback } from "../lib/quality/feedback";
import { deterministicQualityScore, recordDecisionEvaluation } from "../lib/quality/evaluation";

describe("feedback + evaluation", () => {
  beforeEach(() => {
    mocks.createFeedback.mockReset();
    mocks.createEval.mockReset();
  });

  it("persists explicit and inferred feedback", async () => {
    mocks.createFeedback.mockResolvedValue({ id: "f1", isInferred: false });
    const explicit = await captureDecisionFeedback({ feedbackType: "suggestion_rejected", subjectType: "recommendation" });
    expect(explicit.isInferred).toBe(false);

    mocks.createFeedback.mockResolvedValue({ id: "f2", isInferred: true });
    const inferred = await captureDecisionFeedback({ feedbackType: "suggestion_accepted", subjectType: "processing", isInferred: true });
    expect(inferred.isInferred).toBe(true);
  });

  it("creates deterministic evaluation records", async () => {
    mocks.createEval.mockResolvedValue({ id: "e1" });
    const score = deterministicQualityScore(10, 2, 1);
    expect(score).toBeGreaterThan(0);

    const result = await recordDecisionEvaluation({
      scopeType: "household",
      subjectType: "classification",
      evaluationType: "unit",
      result: "CORRECT",
      score,
    });

    expect(result.id).toBe("e1");
  });
});
