import { TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type NormalizedIngestedTransaction = {
  date: Date;
  amount: number;
  description: string;
  type: "income" | "expense";
  source: string;
};

export type DeduplicationResult =
  | {
      status: "new";
    }
  | {
      status: "duplicate";
      existingId: string;
    };

type DedupInput = {
  userId: string;
  householdId: string | null;
  item: NormalizedIngestedTransaction;
};

function normalizeDescription(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string) {
  return new Set(normalizeDescription(value).split(" ").filter((token) => token.length >= 3));
}

function jaccardSimilarity(a: string, b: string) {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection++;
  }

  const union = new Set([...tokensA, ...tokensB]).size;
  return union === 0 ? 0 : intersection / union;
}

export async function detectDuplicateTransaction({ userId, householdId, item }: DedupInput): Promise<DeduplicationResult> {
  const from = new Date(item.date);
  from.setDate(from.getDate() - 1);
  const to = new Date(item.date);
  to.setDate(to.getDate() + 1);

  const txType: TransactionType = item.type === "income" ? "INCOME" : "EXPENSE";

  const candidates = await prisma.transaction.findMany({
    where: {
      OR: [{ userId }, ...(householdId ? [{ householdId }] : [])],
      amount: item.amount,
      type: txType,
      date: { gte: from, lte: to },
    },
    select: {
      id: true,
      description: true,
    },
    take: 20,
    orderBy: { date: "desc" },
  });

  const duplicate = candidates.find((candidate) => jaccardSimilarity(candidate.description ?? "", item.description ?? "") >= 0.4);

  if (!duplicate) {
    return { status: "new" };
  }

  return {
    status: "duplicate",
    existingId: duplicate.id,
  };
}
