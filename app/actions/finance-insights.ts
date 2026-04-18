"use server";

import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runFinanceIntelligence } from "@/lib/finance/intelligence";

export async function getFinanceInsights() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });

  const result = await runFinanceIntelligence(user.id, dbUser?.householdId ?? null);

  return {
    totalMonth: result.monthly.total,
    topCategories: result.topCategories.slice(0, 3),
    alert: result.alerts[0] ?? null,
    recommendation: result.recommendations[0] ?? null,
    average: result.average,
  };
}
