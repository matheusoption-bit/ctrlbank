import { ParsedInboxItem } from "@/lib/inbox/parser";

export type NormalizedInboxTransaction = {
  date: Date;
  amount: number;
  description: string;
  type: "expense" | "income";
};

export function normalizeInboxItems(items: ParsedInboxItem[]): NormalizedInboxTransaction[] {
  return items
    .map((item) => {
      const date = new Date(item.date);
      if (Number.isNaN(date.getTime())) return null;

      return {
        date,
        amount: Math.abs(Number(item.amount) || 0),
        description: item.description.trim() || "Transação importada",
        type: item.type,
      };
    })
    .filter((item): item is NormalizedInboxTransaction => Boolean(item && item.amount > 0));
}
