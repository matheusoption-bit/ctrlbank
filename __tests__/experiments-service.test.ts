import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ findFirst: vi.fn(), update: vi.fn() }));

vi.mock("../lib/prisma", () => ({
  prisma: {
    experiment: { findFirst: mocks.findFirst, update: mocks.update },
  },
}));

import { isExperimentEnabled, killExperiment } from "../lib/experiments/service";

describe("experiment governance", () => {
  beforeEach(() => {
    mocks.findFirst.mockReset();
    mocks.update.mockReset();
  });

  it("honors allocation strategy", async () => {
    mocks.findFirst.mockResolvedValue({ id: "e1", key: "routing_alt_provider", config: { allocationPct: 0 } });
    const result = await isExperimentEnabled({ key: "routing_alt_provider", userId: "u1" });
    expect(result.enabled).toBe(false);
  });

  it("kill switch disables experiment", async () => {
    mocks.update.mockResolvedValue({ id: "e1", status: "KILLED" });
    const result = await killExperiment("e1");
    expect(result.status).toBe("KILLED");
  });
});
