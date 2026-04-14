/* ========================================
   Currency Formatting — Centralizado
   Padrão: pt-BR / BRL
   ======================================== */

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const compactFormatter = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  compactDisplay: "short",
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 1,
});

/**
 * Format a number as BRL currency.
 * Example: formatCurrency(12450.80) → "R$ 12.450,80"
 */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/**
 * Format a number as compact BRL.
 * Example: formatCurrencyCompact(12450) → "R$ 12,5 mil"
 */
export function formatCurrencyCompact(value: number): string {
  return compactFormatter.format(value);
}

/**
 * Format only the integer and decimal parts (no "R$ " prefix).
 * Example: formatCurrencyParts(12450.80) → { integer: "12.450", decimal: "80" }
 */
export function formatCurrencyParts(value: number): { integer: string; decimal: string } {
  const formatted = currencyFormatter.format(value);
  // Remove "R$ " prefix and split by comma
  const withoutPrefix = formatted.replace("R$\u00a0", "").replace("R$ ", "");
  const [integer, decimal] = withoutPrefix.split(",");
  return { integer: integer || "0", decimal: decimal || "00" };
}
