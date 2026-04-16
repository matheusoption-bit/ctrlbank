import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getDashboardSummary, getMonthlyEvolution, getMonthForecast } from "@/app/actions/transactions";
import { getActiveRecommendations } from "@/app/actions/ai/recommendations";
import DashboardPageClient from "./DashboardPageClient";

/**
 * Dashboard – Server Component.
 * Busca dados reais e passa pro client.
 */
export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const [summary, evolution, forecast, recommendations] = await Promise.all([
    getDashboardSummary(),
    getMonthlyEvolution(),
    getMonthForecast(),
    getActiveRecommendations()
  ]);

  return (
    <DashboardPageClient
      user={{ id: user.id, name: user.name, email: user.email }}
      summary={summary}
      evolution={evolution}
      forecast={forecast}
      recommendations={recommendations}
    />
  );
}
