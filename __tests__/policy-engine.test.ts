import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findFirst: vi.fn(),
  findUnique: vi.fn(),
  updateMany: vi.fn(),
  update: vi.fn(),
  tx: vi.fn(),
}));

vi.mock("../lib/prisma", () => ({
  prisma: {
    policyVersion: {
      findFirst: mocks.findFirst,
      findUnique: mocks.findUnique,
      updateMany: mocks.updateMany,
      update: mocks.update,
    },
    $transaction: mocks.tx,
  },
}));

import { activatePolicyVersion, getPolicyConfig, rollbackPolicy } from "../lib/policy/engine";

describe("policy engine", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((m) => m.mockReset());
  });

  it("resolves defaults when no active policy exists", async () => {
    mocks.findFirst.mockResolvedValue(null);
    const cfg = await getPolicyConfig<any>("review_thresholds", "h1");
    expect(cfg.riskScoreThreshold).toBe(0.45);
  });

  it("activates a policy version and retires prior one", async () => {
    mocks.findUnique.mockResolvedValue({ id: "p2", householdId: "h1", policyType: "review_thresholds" });
    mocks.tx.mockImplementation(async (fn: any) => fn({ policyVersion: { updateMany: mocks.updateMany, update: mocks.update } }));
    mocks.update.mockResolvedValue({ id: "p2", status: "ACTIVE" });

    const result = await activatePolicyVersion({ policyVersionId: "p2" });
    expect(mocks.updateMany).toHaveBeenCalled();
    expect(result.status).toBe("ACTIVE");
  });

  it("rolls back to previous retired version", async () => {
    mocks.findFirst
      .mockResolvedValueOnce({ id: "cur", householdId: "h1", policyType: "review_thresholds" })
      .mockResolvedValueOnce({ id: "old", householdId: "h1", policyType: "review_thresholds" });
    mocks.tx.mockImplementation(async (fn: any) => fn({ policyVersion: { update: mocks.update } }));
    mocks.update.mockResolvedValue({ id: "old", status: "ACTIVE" });

    const result = await rollbackPolicy("review_thresholds", "h1");
    expect(result.id).toBe("old");
  });
});
