import { prisma } from "@/lib/prisma";
import { getMonthlySpendingByCategory, getTopCategories, getAverageSpending } from "@/lib/finance/analysis";
import { generateFinanceAlerts } from "@/lib/finance/alerts";
import { generateFinanceRecommendations } from "@/lib/finance/recommendations";
import { FinanceSignal } from "@/lib/finance/contracts";

function buildSignals(params: {
  monthlyTotal: number;
  average: number;
  alerts: Array<{ message: string }>;
  recommendations: Array<{ message: string }>;
}): FinanceSignal[] {
  const signals: FinanceSignal[] = [];

  const delta = params.average > 0 ? ((params.monthlyTotal - params.average) / params.average) * 100 : 0;
  if (params.average > 0 && delta >= 20) {
    signals.push({
      level: "risk",
      signal: "Gasto acima da média",
      source: "monthly_vs_average",
      explanation: `Seu gasto mensal está ${Math.round(delta)}% acima da média histórica.`,
      nextStep: "Revise as 3 maiores categorias e aplique um limite semanal.",
    });
  } else if (params.average > 0) {
    signals.push({
      level: "direction",
      signal: "Trajetória estável",
      source: "monthly_vs_average",
      explanation: `Seu gasto está ${Math.abs(Math.round(delta))}% ${delta >= 0 ? "acima" : "abaixo"} da média.`,
      nextStep: "Mantenha o ritmo e monitore categorias variáveis.",
    });
  }

  if (params.alerts[0]?.message) {
    signals.push({
      level: "attention",
      signal: "Alerta operacional",
      source: "alerts_engine",
      explanation: params.alerts[0].message,
      nextStep: "Abra o detalhe do alerta e confirme lançamentos recentes.",
    });
  }

  if (params.recommendations[0]?.message) {
    signals.push({
      level: "direction",
      signal: "Direção recomendada",
      source: "recommendation_engine",
      explanation: params.recommendations[0].message,
      nextStep: "Aplicar a recomendação nas próximas 2 semanas e medir impacto.",
    });
  }

  return signals.slice(0, 4);
}

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

  const signals = buildSignals({
    monthlyTotal: monthly.total,
    average,
    alerts,
    recommendations,
  });

  return {
    monthly,
    topCategories,
    average,
    alerts,
    recommendations,
    signals,
  };
}

export function buildFinanceContextReply(params: {
  question: string;
  monthlyTotal: number;
  topCategories: Array<{ category: string; amount: number }>;
  average: number;
  alerts: Array<{ message: string }>;
  recommendations: Array<{ message: string }>;
  signals?: FinanceSignal[];
}) {
  const top = params.topCategories
    .map((item) => `- ${item.category}: R$ ${item.amount.toFixed(2)}`)
    .join("\n");

  const delta = params.average > 0 ? ((params.monthlyTotal - params.average) / params.average) * 100 : 0;
  const deltaText = params.average > 0
    ? `Você está ${delta >= 0 ? `${Math.round(delta)}% acima` : `${Math.abs(Math.round(delta))}% abaixo`} da sua média.`
    : "Ainda não há média suficiente para comparação.";

  const signalText = (params.signals ?? [])
    .slice(0, 2)
    .map((s) => `\n[${s.level.toUpperCase()}] ${s.signal}: ${s.explanation} Próximo passo: ${s.nextStep}`)
    .join("");

  const firstAlert = params.alerts[0]?.message ? `\nAlerta: ${params.alerts[0].message}` : "";
  const firstRecommendation = params.recommendations[0]?.message
    ? `\nRecomendação: ${params.recommendations[0].message}`
    : "";

  if (params.question.toLowerCase().includes("como estou") || params.question.toLowerCase().includes("mês")) {
    return `Você gastou R$ ${params.monthlyTotal.toFixed(2)} até agora.\nPrincipais categorias:\n${top || "- Sem dados no mês."}\n${deltaText}${firstAlert}${firstRecommendation}${signalText}`;
  }

  return `Resumo atual: total no mês de R$ ${params.monthlyTotal.toFixed(2)}.\nTop categorias:\n${top || "- Sem dados."}\n${deltaText}${firstRecommendation}${signalText}`;
}
