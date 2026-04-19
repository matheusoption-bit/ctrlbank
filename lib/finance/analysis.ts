import { prisma } from "@/lib/prisma";

export type CategoryTotals = Record<string, number>;

function getMonthRange(referenceDate = new Date()) {
  const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export async function getMonthlySpendingByCategory(userId: string, householdId?: string | null) {
  const { start, end } = getMonthRange();

  const grouped = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      OR: [{ userId }, ...(householdId ? [{ householdId }] : [])],
      type: "EXPENSE",
      status: "COMPLETED",
      ignoreInTotals: false,
      date: { gte: start, lte: end },
    },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  const categoryIds = grouped.map((item) => item.categoryId).filter(Boolean) as string[];
  const categories = categoryIds.length
    ? await prisma.category.findMany({ where: { id: { in: categoryIds } }, select: { id: true, name: true } })
    : [];

  const byCategory: CategoryTotals = {};
  let total = 0;

  for (const item of grouped) {
    const amount = Number(item._sum.amount ?? 0);
    const categoryName = categories.find((category) => category.id === item.categoryId)?.name ?? "outros";
    byCategory[categoryName.toLowerCase()] = amount;
    total += amount;
  }

  return { total, byCategory };
}

export async function getTopCategories(userId: string, householdId?: string | null, take = 3) {
  const spending = await getMonthlySpendingByCategory(userId, householdId);

  return Object.entries(spending.byCategory)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, take);
}

export async function getAverageSpending(userId: string, householdId?: string | null) {
  const now = new Date();
  const firstMonth = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  const expenses = await prisma.transaction.findMany({
    where: {
      OR: [{ userId }, ...(householdId ? [{ householdId }] : [])],
      type: "EXPENSE",
      status: "COMPLETED",
      ignoreInTotals: false,
      date: { gte: firstMonth, lte: now },
    },
    select: { amount: true, date: true },
  });

  if (expenses.length === 0) return 0;

  const totalsByMonth = new Map<string, number>();
  for (const expense of expenses) {
    const date = new Date(expense.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    totalsByMonth.set(key, (totalsByMonth.get(key) ?? 0) + Number(expense.amount));
  }

  const totals = Array.from(totalsByMonth.values());
  return totals.reduce((sum, value) => sum + value, 0) / totals.length;
}
