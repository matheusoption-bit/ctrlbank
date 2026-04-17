"use server";

import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, subDays, subMonths } from "date-fns";
import { calculateHealthScore, calculateProjection } from "@/lib/finance/health";

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
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const [currentBalance, lastMonthTransactions] = await Promise.all([
    prisma.bankAccount.aggregate({
      where: { householdId },
      _sum: { balance: true }
    }),
    prisma.transaction.aggregate({
      where: {
        householdId,
        date: { gte: lastMonthStart, lte: lastMonthEnd },
        ignoreInTotals: false
      },
      _sum: { amount: true }
    })
  ]);

  const current = Number(currentBalance._sum.balance || 0);
  const lastMonthDelta = Number(lastMonthTransactions._sum.amount || 0);
  const lastMonth = current - lastMonthDelta;
  const change = current - lastMonth;

  return {
    current,
    lastMonth,
    change
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

  await prisma.aiRecommendation.update({
    where: { id },
    data: { isDismissed: true }
  });

  return { success: true };
}
