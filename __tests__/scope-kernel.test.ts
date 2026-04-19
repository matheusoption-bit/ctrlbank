import { describe, expect, it } from "vitest";
import { scopeWhere } from "../lib/security/scope";

describe("scope kernel", () => {
  it("uses user scope when no household", () => {
    expect(scopeWhere({ userId: "u1", householdId: null })).toEqual({ userId: "u1", householdId: null });
  });

  it("uses household scope when household exists", () => {
    expect(scopeWhere({ userId: "u1", householdId: "h1" })).toEqual({ householdId: "h1" });
  });
});
