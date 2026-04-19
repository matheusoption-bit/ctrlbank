import { describe, expect, it } from "vitest";
import { BankAccountType, TransactionStatus, TransactionType } from "@prisma/client";
import { computeCanonicalFlow, computeCanonicalTotals } from "../lib/finance/kernel";
import { getMonthBoundsUtc } from "../lib/finance/period";

describe("finance kernel invariants", () => {
  it("keeps accounting balance and net position explicit for credit accounts", () => {
    const totals = computeCanonicalTotals([
      { type: BankAccountType.CHECKING, balance: 1000 },
      { type: BankAccountType.CREDIT, balance: 300 },
    ]);

    expect(totals.accountingBalance).toBe(1300);
    expect(totals.netPosition).toBe(700);
  });

  it("computes net as income - expense and ignores transfer/pending/ignored entries", () => {
    const flow = computeCanonicalFlow([
      { type: TransactionType.INCOME, amount: 500, status: TransactionStatus.COMPLETED, ignoreInTotals: false },
      { type: TransactionType.EXPENSE, amount: 200, status: TransactionStatus.COMPLETED, ignoreInTotals: false },
      { type: TransactionType.TRANSFER, amount: 999, status: TransactionStatus.COMPLETED, ignoreInTotals: false },
      { type: TransactionType.EXPENSE, amount: 999, status: TransactionStatus.PENDING, ignoreInTotals: false },
      { type: TransactionType.EXPENSE, amount: 999, status: TransactionStatus.COMPLETED, ignoreInTotals: true },
    ]);

    expect(flow.income).toBe(500);
    expect(flow.expense).toBe(200);
    expect(flow.net).toBe(300);
  });

  it("builds UTC month bounds deterministically", () => {
    const { start, endExclusive } = getMonthBoundsUtc(2026, 3);
    expect(start.toISOString()).toBe("2026-03-01T00:00:00.000Z");
    expect(endExclusive.toISOString()).toBe("2026-04-01T00:00:00.000Z");
  });
});
