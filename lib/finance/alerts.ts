import { prisma } from "@/lib/prisma";
import { getAverageSpending, getMonthlySpendingByCategory } from "@/lib/finance/analysis";

export type FinanceAlert = {
  type: "warning";
  message: string;
};

export async function generateFinanceAlerts(userId: string, householdId?: string | null): Promise<FinanceAlert[]> {
  const alerts: FinanceAlert[] = [];
  const monthly = await getMonthlySpendingByCategory(userId, householdId);
  const average = await getAverageSpending(userId, householdId);

  if (average > 0 && monthly.total > average * 1.3) {
    const increasePercent = Math.round(((monthly.total - average) / average) * 100);
    alerts.push({
      type: "warning",
      message: `Seu gasto total está ${increasePercent}% acima da sua média recente.`,
    });
  }

  const dominantCategory = Object.entries(monthly.byCategory).sort((a, b) => b[1] - a[1])[0];
  if (dominantCategory && monthly.total > 0) {
    const [category, amount] = dominantCategory;
    const share = amount / monthly.total;

    if (share >= 0.7) {
      alerts.push({
        type: "warning",
        message: `A categoria ${category} representa ${Math.round(share * 100)}% dos gastos do mês.`,
      });
    }
  }

  const { start, end } = {
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  };

  const highestExpense = await prisma.transaction.findFirst({
    where: {
      OR: [{ userId }, ...(householdId ? [{ householdId }] : [])],
      type: "EXPENSE",
      status: "COMPLETED",
      ignoreInTotals: false,
      date: { gte: start, lte: end },
    },
    orderBy: { amount: "desc" },
  });

  if (highestExpense && average > 0 && Number(highestExpense.amount) > average * 0.4) {
    alerts.push({
      type: "warning",
      message: `Gasto isolado alto detectado: R$ ${Number(highestExpense.amount).toFixed(2)} em ${highestExpense.description ?? "despesa"}.`,
    });
  }

  return alerts;
}
