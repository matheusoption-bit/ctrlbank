import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getHealthScore, getProjection, getConsolidatedBalance, getBurnRate } from "@/app/actions/health";
import { getActiveRecommendations } from "@/app/actions/ai/recommendations";
import { getMemberContributions } from "@/app/actions/household";
import { prisma } from "@/lib/prisma";
import SaudePageClient from "./SaudePageClient";

export default async function SaudePage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  const [healthScore, projection, balance, burnRate, recommendations, memberContributions] = await Promise.all([
    getHealthScore(),
    getProjection(),
    getConsolidatedBalance(),
    getBurnRate(),
    getActiveRecommendations(),
    getMemberContributions(),
  ]);

  return (
    <SaudePageClient
      healthScore={healthScore}
      projection={projection}
      balance={balance}
      burnRate={burnRate}
      recommendations={recommendations}
      memberContributions={memberContributions}
      userRole={dbUser?.role ?? "ADMIN"}
    />
  );
}
