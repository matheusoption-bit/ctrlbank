export type MonthBounds = {
  start: Date;
  endExclusive: Date;
};

export function getMonthBoundsUtc(year: number, month: number): MonthBounds {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Invalid year/month for UTC bounds");
  }

  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const endExclusive = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

  return { start, endExclusive };
}

export function getCurrentMonthBoundsUtc(referenceDate = new Date()): MonthBounds {
  return getMonthBoundsUtc(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth() + 1);
}
