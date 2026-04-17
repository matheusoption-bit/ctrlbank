import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getHealthScore, getProjection, getConsolidatedBalance, getBurnRate } from "@/app/actions/health";
import { getActiveRecommendations } from "@/app/actions/ai/recommendations";
import SaudePageClient from "./SaudePageClient";

export default async function SaudePage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const [healthScore, projection, balance, burnRate, recommendations] = await Promise.all([
    getHealthScore(),
    getProjection(),
    getConsolidatedBalance(),
    getBurnRate(),
    getActiveRecommendations()
  ]);

  return (
    <SaudePageClient
      healthScore={healthScore}
      projection={projection}
      balance={balance}
      burnRate={burnRate}
      recommendations={recommendations}
    />
  );
}
