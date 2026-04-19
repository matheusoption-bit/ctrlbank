import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
  mockAggregate: vi.fn(),
}));

vi.mock("../lib/prisma", () => ({
  prisma: {
    householdQuota: { findFirst: mocks.mockFindFirst },
    aiCaptureEvent: { aggregate: mocks.mockAggregate },
  },
}));

import { enforceHouseholdQuota, QuotaExceededError } from "../lib/quotas/service";

describe("household quota enforcement", () => {
  beforeEach(() => {
    mocks.mockFindFirst.mockReset();
    mocks.mockAggregate.mockReset();
  });

  it("passes when usage is below limit", async () => {
    mocks.mockFindFirst.mockResolvedValue({ maxRequests: 10, maxInputTokens: 1000, maxOutputTokens: 1000, hardBlock: true, warningThresholdPct: 80 });
    mocks.mockAggregate.mockResolvedValue({ _count: { _all: 3 }, _sum: { tokensIn: 100, tokensOut: 120 } });

    const result = await enforceHouseholdQuota({ householdId: "h1", capability: "ai_composer", provider: "gemini" });
    expect(result.status).toBe("OK");
  });

  it("blocks when hard limit exceeded", async () => {
    mocks.mockFindFirst.mockResolvedValue({ maxRequests: 5, maxInputTokens: null, maxOutputTokens: null, hardBlock: true, warningThresholdPct: 50 });
    mocks.mockAggregate.mockResolvedValue({ _count: { _all: 5 }, _sum: { tokensIn: null, tokensOut: null } });

    await expect(enforceHouseholdQuota({ householdId: "h1", capability: "ai_chat", provider: "groq" })).rejects.toBeInstanceOf(QuotaExceededError);
  });

  it("handles legacy null telemetry without crash", async () => {
    mocks.mockFindFirst.mockResolvedValue({ maxRequests: 20, maxInputTokens: 1000, maxOutputTokens: 1000, hardBlock: true, warningThresholdPct: 20 });
    mocks.mockAggregate.mockResolvedValue({ _count: { _all: 1 }, _sum: { tokensIn: null, tokensOut: null } });

    const result = await enforceHouseholdQuota({ householdId: "h1", capability: "ai_chat", provider: null });
    expect(result.status).toBe("OK");
    if (result.status !== "NO_HOUSEHOLD") {
      expect(result.report.usage.tokensIn).toBe(0);
      expect(result.report.usage.tokensOut).toBe(0);
    }
  });
});
