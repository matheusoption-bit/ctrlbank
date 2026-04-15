/**
 * lib/format.ts
 * Utilitários de formatação consistentes para o CtrlBank.
 */

/**
 * Formata um valor numérico como moeda BRL.
 * Ex: formatCurrency(1234.56) → "R$ 1.234,56"
 */
export function formatCurrency(
  value: number | string | null | undefined,
  opts?: { compact?: boolean }
): string {
  const num = typeof value === "string" ? parseFloat(value) : (value ?? 0);
  if (isNaN(num)) return "R$ 0,00";

  if (opts?.compact && Math.abs(num) >= 1_000_000) {
    return `R$ ${(num / 1_000_000).toFixed(1).replace(".", ",")}M`;
  }
  if (opts?.compact && Math.abs(num) >= 1_000) {
    return `R$ ${(num / 1_000).toFixed(1).replace(".", ",")}k`;
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Formata um valor com sinal explícito (+/-).
 * Ex: formatWithSign(1234) → "+ R$ 1.234,00"
 */
export function formatWithSign(value: number | string | null | undefined): string {
  const num = typeof value === "string" ? parseFloat(value) : (value ?? 0);
  if (isNaN(num)) return "R$ 0,00";
  const formatted = formatCurrency(Math.abs(num));
  return num >= 0 ? `+ ${formatted}` : `- ${formatted}`;
}

/**
 * Formata data para pt-BR.
 * Ex: formatDate(new Date()) → "14 de abr. de 2026"
 */
export function formatDate(
  date: Date | string,
  opts?: { short?: boolean; relative?: boolean }
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (opts?.relative) {
    const now = new Date();
    const diffDays = Math.floor(
      (now.setHours(0, 0, 0, 0) - new Date(d).setHours(0, 0, 0, 0)) /
        86_400_000
    );
    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays <= 7) return `${diffDays} dias atrás`;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: opts?.short ? "short" : "long",
    year: "numeric",
  }).format(d);
}

/**
 * Formata mês/ano para exibição.
 * Ex: formatMonthYear(4, 2026) → "Abril 2026"
 */
export function formatMonthYear(month: number, year: number): string {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(
    new Date(year, month - 1, 1)
  );
}

/**
 * Calcula percentual com segurança.
 * Ex: calcPercent(300, 1000) → 30
 */
export function calcPercent(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(Math.round((value / total) * 100), 999);
}
