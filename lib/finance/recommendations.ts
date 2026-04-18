import { getAverageSpending, getMonthlySpendingByCategory } from "@/lib/finance/analysis";
import { generateFinanceAlerts } from "@/lib/finance/alerts";

export type FinanceRecommendation = {
  message: string;
  impact: number;
};

export async function generateFinanceRecommendations(userId: string, householdId?: string | null): Promise<FinanceRecommendation[]> {
  const monthly = await getMonthlySpendingByCategory(userId, householdId);
  const average = await getAverageSpending(userId, householdId);
  const alerts = await generateFinanceAlerts(userId, householdId);

  const recommendations: FinanceRecommendation[] = [];

  if (average > 0 && monthly.total > average) {
    const diff = monthly.total - average;
    recommendations.push({
      message: `Você gastou ${Math.round((diff / average) * 100)}% a mais neste mês em relação à média recente.`,
      impact: Number(diff.toFixed(2)),
    });
  }

  const foodEntry = Object.entries(monthly.byCategory).find(([category]) =>
    ["alimentacao", "alimentação", "supermercado"].some((alias) => category.includes(alias)),
  );

  if (foodEntry) {
    const [, amount] = foodEntry;
    const saving = amount * 0.15;
    recommendations.push({
      message: `Reduzindo gastos de alimentação/delivery em 15%, você pode economizar R$ ${saving.toFixed(2)}.`,
      impact: Number(saving.toFixed(2)),
    });
  }

  if (alerts.length > 0) {
    recommendations.push({
      message: "Revise os alertas do mês e ajuste suas maiores despesas para manter o orçamento saudável.",
      impact: Number((monthly.total * 0.05).toFixed(2)),
    });
  }

  return recommendations.slice(0, 3);
}
