/**
 * Unit tests for transaction validation schemas (Fase 13)
 */

import { describe, it, expect } from "vitest";
import { z } from "zod";

// ─── Inline schemas (mirror of lib/validations/transaction.schema.ts) ────────

const TransactionType    = z.enum(["INCOME", "EXPENSE", "TRANSFER"]);
const TransactionStatus  = z.enum(["COMPLETED", "PENDING"]);

const csvTransactionRowSchema = z.object({
  date:        z.coerce.date(),
  description: z.string().min(1).max(200),
  amount:      z.coerce.number().positive(),
  type:        TransactionType,
  status:      TransactionStatus.default("COMPLETED"),
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("csvTransactionRowSchema", () => {
  const valid = {
    date: "2026-04-01",
    description: "Salário",
    amount: "5000.00",
    type: "INCOME",
  };

  it("parses a valid row", () => {
    const result = csvTransactionRowSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(5000);
      expect(result.data.type).toBe("INCOME");
      expect(result.data.status).toBe("COMPLETED");
    }
  });

  it("rejects negative amount", () => {
    const result = csvTransactionRowSchema.safeParse({ ...valid, amount: "-100" });
    expect(result.success).toBe(false);
  });

  it("rejects description longer than 200 chars", () => {
    const result = csvTransactionRowSchema.safeParse({
      ...valid,
      description: "x".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid type", () => {
    const result = csvTransactionRowSchema.safeParse({ ...valid, type: "UNKNOWN" });
    expect(result.success).toBe(false);
  });

  it("coerces date string to Date object", () => {
    const result = csvTransactionRowSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.date).toBeInstanceOf(Date);
    }
  });

  it("defaults status to COMPLETED when omitted", () => {
    const result = csvTransactionRowSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe("COMPLETED");
  });

  it("accepts explicit PENDING status", () => {
    const result = csvTransactionRowSchema.safeParse({ ...valid, status: "PENDING" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe("PENDING");
  });
});

describe("TransactionType enum", () => {
  it("accepts valid values", () => {
    expect(TransactionType.safeParse("INCOME").success).toBe(true);
    expect(TransactionType.safeParse("EXPENSE").success).toBe(true);
    expect(TransactionType.safeParse("TRANSFER").success).toBe(true);
  });

  it("rejects invalid values", () => {
    expect(TransactionType.safeParse("DEPOSIT").success).toBe(false);
    expect(TransactionType.safeParse("").success).toBe(false);
  });
});
