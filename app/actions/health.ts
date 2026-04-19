"use server";

import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";
import { calculateHealthScore, calculateProjection } from "@/lib/finance/health";
import { captureDecisionFeedback } from "@/lib/quality/feedback";
import { getCurrentMonthBoundsUtc, getMonthBoundsUtc } from "@/lib/finance/period";
import { scopeWhere } from "@/lib/security/scope";

export async function getHealthScore() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });

  const householdId = dbUser?.householdId;
  if (!householdId) {
    return null;
  }

  return calculateHealthScore(householdId);
}

export async function getProjection() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });

  const householdId = dbUser?.householdId;
  if (!householdId) {
    return null;
  }

  return calculateProjection(householdId);
}

export async function getConsolidatedBalance() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });

  const householdId = dbUser?.householdId;
  if (!householdId) {
    return { current: 0, lastMonth: 0, change: 0 };
  }

  const now = new Date();
  const current = getCurrentMonthBoundsUtc(now);
  const previous = getMonthBoundsUtc(
    current.start.getUTCMonth() === 0 ? current.start.getUTCFullYear() - 1 : current.start.getUTCFullYear(),
    current.start.getUTCMonth() === 0 ? 12 : current.start.getUTCMonth()
  );

  const [currentBalance, previousFlow] = await Promise.all([
    prisma.bankAccount.aggregate({
      where: { householdId },
      _sum: { balance: true }
    }),
    prisma.transaction.findMany({
      where: {
        ...scopeWhere({ userId: user.id, householdId }),
        date: { gte: previous.start, lt: previous.endExclusive },
        status: "COMPLETED",
        ignoreInTotals: false,
      },
      select: { amount: true, type: true },
    })
  ]);

  const currentValue = Number(currentBalance._sum.balance || 0);
  const previousIncome = previousFlow.filter((tx) => tx.type === "INCOME").reduce((sum, tx) => sum + Number(tx.amount), 0);
  const previousExpense = previousFlow.filter((tx) => tx.type === "EXPENSE").reduce((sum, tx) => sum + Number(tx.amount), 0);
  const previousNet = previousIncome - previousExpense;
  const lastMonth = currentValue - previousNet;

  return {
    current: currentValue,
    lastMonth,
    change: previousNet
  };
}

export async function getBurnRate() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });

  const householdId = dbUser?.householdId;
  if (!householdId) {
    return { last30Days: 0, previous30Days: 0, changePercent: 0 };
  }

  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);
  const sixtyDaysAgo = subDays(now, 60);

  const [last30, previous30] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        householdId,
        type: "EXPENSE",
        date: { gte: thirtyDaysAgo, lte: now },
        ignoreInTotals: false
      },
      _sum: { amount: true }
    }),
    prisma.transaction.aggregate({
      where: {
        householdId,
        type: "EXPENSE",
        date: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        ignoreInTotals: false
      },
      _sum: { amount: true }
    })
  ]);

  const last30Days = Number(last30._sum.amount || 0);
  const previous30Days = Number(previous30._sum.amount || 0);
  const changePercent = previous30Days > 0
    ? ((last30Days - previous30Days) / previous30Days) * 100
    : 0;

  return {
    last30Days,
    previous30Days,
    changePercent
  };
}

export async function generateRecommendations() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });

  const householdId = dbUser?.householdId;
  if (!householdId) {
    return null;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/health/recommendations/generate?householdId=${householdId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function dismissRecommendation(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });

  const result = await prisma.aiRecommendation.updateMany({
    where: {
      id,
      ...scopeWhere({ userId: user.id, householdId: dbUser?.householdId ?? null }),
    },
    data: { isDismissed: true }
  });

  if (result.count === 0) {
    throw new Error("Recommendation not found or unauthorized");
  }

  await captureDecisionFeedback({
    householdId: dbUser?.householdId ?? null,
    userId: user.id,
    feedbackType: "suggestion_rejected",
    subjectType: "recommendation",
    subjectId: id,
    recommendationId: id,
    isInferred: false,
  });
  return { success: true };
}
