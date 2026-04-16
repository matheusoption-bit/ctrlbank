"use server";

import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getActiveRecommendations() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });

  const recs = await prisma.aiRecommendation.findMany({
    where: {
      isDismissed: false,
      OR: [
        { householdId: dbUser?.householdId ?? "" },
        { userId: user.id }
      ]
    },
    orderBy: [{ score: "desc" }, { createdAt: "desc" }],
    take: 2 // Max 2 na home
  });

  return recs;
}
