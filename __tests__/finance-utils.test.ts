/**
 * Unit tests for the financial context builder helper logic (Fase 13)
 * Tests pure functions — no DB access needed.
 */

import { describe, it, expect } from "vitest";

// ─── formatCurrency (mirrors lib/format.ts behavior) ─────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style:    "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

describe("formatCurrency", () => {
  it("formats zero correctly", () => {
    const r = formatCurrency(0);
    expect(r).toContain("0,00");
  });

  it("formats positive value", () => {
    const r = formatCurrency(1234.56);
    expect(r).toContain("1.234,56");
  });

  it("formats negative value", () => {
    const r = formatCurrency(-500);
    expect(r).toContain("500,00");
  });
});

// ─── calcPercent helper ───────────────────────────────────────────────────────

function calcPercent(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

describe("calcPercent", () => {
  it("returns 0 when target is 0", () => {
    expect(calcPercent(100, 0)).toBe(0);
  });

  it("returns 50 when halfway", () => {
    expect(calcPercent(500, 1000)).toBe(50);
  });

  it("caps at 100 when exceeded", () => {
    expect(calcPercent(1500, 1000)).toBe(100);
  });

  it("returns 100 when exactly at target", () => {
    expect(calcPercent(1000, 1000)).toBe(100);
  });
});

// ─── getNextDate helpers (mirrors cron/recurring logic) ───────────────────────

function getNextDate(
  current: Date,
  frequency: "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY"
): Date {
  const d = new Date(current);
  switch (frequency) {
    case "DAILY":      d.setDate(d.getDate() + 1);            break;
    case "WEEKLY":     d.setDate(d.getDate() + 7);            break;
    case "BIWEEKLY":   d.setDate(d.getDate() + 14);           break;
    case "MONTHLY":    d.setMonth(d.getMonth() + 1);          break;
    case "QUARTERLY":  d.setMonth(d.getMonth() + 3);          break;
    case "YEARLY":     d.setFullYear(d.getFullYear() + 1);    break;
  }
  return d;
}

describe("getNextDate", () => {
  const base = new Date("2026-01-01T00:00:00Z");

  it("adds 1 day for DAILY", () => {
    const next = getNextDate(base, "DAILY");
    expect(next.getUTCDate()).toBe(2);
  });

  it("adds 7 days for WEEKLY", () => {
    const next = getNextDate(base, "WEEKLY");
    expect(next.getUTCDate()).toBe(8);
  });

  it("adds 14 days for BIWEEKLY", () => {
    const next = getNextDate(base, "BIWEEKLY");
    expect(next.getUTCDate()).toBe(15);
  });

  it("advances 1 month for MONTHLY", () => {
    const next = getNextDate(base, "MONTHLY");
    expect(next.getUTCMonth()).toBe(1); // February
  });

  it("advances 3 months for QUARTERLY", () => {
    const next = getNextDate(base, "QUARTERLY");
    expect(next.getUTCMonth()).toBe(3); // April
  });

  it("advances 1 year for YEARLY", () => {
    const next = getNextDate(base, "YEARLY");
    expect(next.getUTCFullYear()).toBe(2027);
  });

  it("does not mutate the original date", () => {
    const original = new Date("2026-06-15T00:00:00Z");
    getNextDate(original, "MONTHLY");
    expect(original.getUTCMonth()).toBe(5); // June unchanged
  });
});

// ─── TOTP code format validation ──────────────────────────────────────────────

describe("TOTP code format", () => {
  const totpPattern = /^\d{6}$/;

  it("accepts 6-digit code", () => {
    expect(totpPattern.test("123456")).toBe(true);
  });

  it("rejects fewer than 6 digits", () => {
    expect(totpPattern.test("12345")).toBe(false);
  });

  it("rejects more than 6 digits", () => {
    expect(totpPattern.test("1234567")).toBe(false);
  });

  it("rejects non-numeric chars", () => {
    expect(totpPattern.test("12345a")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(totpPattern.test("")).toBe(false);
  });
});
