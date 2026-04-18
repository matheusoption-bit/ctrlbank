import { prisma } from "@/lib/prisma";
import { getMonthlySpendingByCategory, getTopCategories, getAverageSpending } from "@/lib/finance/analysis";
import { generateFinanceAlerts } from "@/lib/finance/alerts";
import { generateFinanceRecommendations } from "@/lib/finance/recommendations";

export async function runFinanceIntelligence(userId: string, householdId: string | null) {
  const [monthly, topCategories, average, alerts, recommendations] = await Promise.all([
    getMonthlySpendingByCategory(userId, householdId),
    getTopCategories(userId, householdId),
    getAverageSpending(userId, householdId),
    generateFinanceAlerts(userId, householdId),
    generateFinanceRecommendations(userId, householdId),
  ]);

  await prisma.aiRecommendation.updateMany({
    where: {
      type: "finance_context",
      OR: [{ userId }, ...(householdId ? [{ householdId }] : [])],
    },
    data: { isDismissed: true },
  });

  const toPersist = recommendations.slice(0, 2);
  for (const rec of toPersist) {
    await prisma.aiRecommendation.create({
      data: {
        userId,
        householdId,
        visibility: householdId ? "HOUSEHOLD" : "PERSONAL",
        type: "finance_context",
        message: rec.message,
        score: rec.impact,
      },
    });
  }

  return {
    monthly,
    topCategories,
    average,
    alerts,
    recommendations,
  };
}

export function buildFinanceContextReply(params: {
  question: string;
  monthlyTotal: number;
  topCategories: Array<{ category: string; amount: number }>;
  average: number;
  alerts: Array<{ message: string }>;
  recommendations: Array<{ message: string }>;
}) {
  const top = params.topCategories
    .map((item) => `- ${item.category}: R$ ${item.amount.toFixed(2)}`)
    .join("\n");

  const delta = params.average > 0 ? ((params.monthlyTotal - params.average) / params.average) * 100 : 0;
  const deltaText = params.average > 0
    ? `Você está ${delta >= 0 ? `${Math.round(delta)}% acima` : `${Math.abs(Math.round(delta))}% abaixo`} da sua média.`
    : "Ainda não há média suficiente para comparação.";

  const firstAlert = params.alerts[0]?.message ? `\nAlerta: ${params.alerts[0].message}` : "";
  const firstRecommendation = params.recommendations[0]?.message
    ? `\nRecomendação: ${params.recommendations[0].message}`
    : "";

  if (params.question.toLowerCase().includes("como estou") || params.question.toLowerCase().includes("mês")) {
    return `Você gastou R$ ${params.monthlyTotal.toFixed(2)} até agora.\nPrincipais categorias:\n${top || "- Sem dados no mês."}\n${deltaText}${firstAlert}${firstRecommendation}`;
  }

  return `Resumo atual: total no mês de R$ ${params.monthlyTotal.toFixed(2)}.\nTop categorias:\n${top || "- Sem dados."}\n${deltaText}${firstRecommendation}`;
}
