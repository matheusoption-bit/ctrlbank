import { describe, expect, it } from "vitest";
import { isIdempotentCommitAlreadyDone, shouldRequireReview } from "../lib/inbox/processing-state";

describe("processing state rules", () => {
  it("requires review when parse produced no candidates", () => {
    expect(shouldRequireReview({ normalizedCount: 0, hasCommittedDuplicate: false })).toBe(true);
  });

  it("requires review when duplicate already committed", () => {
    expect(shouldRequireReview({ normalizedCount: 2, hasCommittedDuplicate: true })).toBe(true);
  });

  it("supports idempotent confirm", () => {
    expect(isIdempotentCommitAlreadyDone({ hasCommittedLog: true })).toBe(true);
    expect(isIdempotentCommitAlreadyDone({ hasCommittedLog: false })).toBe(false);
  });
});
