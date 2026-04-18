const DATE_PATTERN = /\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\b/;
const AMOUNT_PATTERN = /(-)?\s*R\$\s*([\d.]+(?:,\d{2})?|\d+(?:,\d{2})?)/i;

export type ParsedInboxItem = {
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
};

function buildIsoDate(day: string, month: string, year?: string) {
  const now = new Date();
  const yyyy = year ? (year.length === 2 ? `20${year}` : year) : String(now.getUTCFullYear());
  const parsed = new Date(`${yyyy}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function parseMoney(rawAmount: string, hasMinusSign: boolean) {
  const normalized = rawAmount.replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value)) return null;
  return hasMinusSign ? -value : value;
}

function inferType(line: string, amount: number): "income" | "expense" {
  const text = line.toLowerCase();

  if (amount < 0) return "expense";
  if (/\b(debito|d[eé]bito|compra|pagamento|sa[ií]da|pix enviado|tarifa)\b/.test(text)) {
    return "expense";
  }
  if (/\b(receb|cr[eé]dito|sal[aá]rio|pix recebido|estorno|dep[oó]sito)\b/.test(text)) {
    return "income";
  }

  return "expense";
}

function cleanupDescription(line: string) {
  return line
    .replace(DATE_PATTERN, "")
    .replace(AMOUNT_PATTERN, "")
    .replace(/[\-|•]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseInboxText(rawText: string): ParsedInboxItem[] {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const items: ParsedInboxItem[] = [];

  for (const line of lines) {
    const amountMatch = line.match(AMOUNT_PATTERN);
    if (!amountMatch) continue;

    const dateMatch = line.match(DATE_PATTERN);
    const isoDate = dateMatch ? buildIsoDate(dateMatch[1], dateMatch[2], dateMatch[3]) : new Date().toISOString();
    if (!isoDate) continue;

    const signedAmount = parseMoney(amountMatch[2], Boolean(amountMatch[1]));
    if (signedAmount === null) continue;

    items.push({
      date: isoDate,
      description: cleanupDescription(line) || "Transação importada",
      amount: Math.abs(signedAmount),
      type: inferType(line, signedAmount),
    });
  }

  return items;
}
