import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { subMonths, addDays, subDays } from "date-fns";

export const runtime = "nodejs";

interface ProjectionResponse {
  currentBalance: number;
  projectedBalance30d: number;
  daysUntilZero: number | null;
  message: string;
  projectionPoints: Array<{ day: number; balance: number }>;
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    // Get householdId from query params or user's household
    const { searchParams } = new URL(request.url);
    let householdId = searchParams.get("householdId");

    if (!householdId) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { householdId: true }
      });
      householdId = dbUser?.householdId || null;
    }

    if (!householdId) {
      return NextResponse.json(
        { message: "Household não encontrado" },
        { status: 400 }
      );
    }

    const now = new Date();
    const threeMonthsAgo = subMonths(now, 3);
    const thirtyDaysFromNow = addDays(now, 30);

    // Current balance
    const currentBalanceResult = await prisma.bankAccount.aggregate({
      where: { householdId },
      _sum: { balance: true }
    });
    const currentBalance = Number(currentBalanceResult._sum.balance || 0);

    // Recurring expenses in next 30 days
    const recurringExpenses = await prisma.recurringTransaction.findMany({
      where: {
        householdId,
        type: "EXPENSE",
        active: true,
        nextDate: { lte: thirtyDaysFromNow }
      },
      select: { amount: true }
    });
    const recurringExpensesTotal = recurringExpenses.reduce(
      (sum, rec) => sum + Number(rec.amount),
      0
    );

    // Recurring income in next 30 days
    const recurringIncome = await prisma.recurringTransaction.findMany({
      where: {
        householdId,
        type: "INCOME",
        active: true,
        nextDate: { lte: thirtyDaysFromNow }
      },
      select: { amount: true }
    });
    const recurringIncomeTotal = recurringIncome.reduce(
      (sum, rec) => sum + Number(rec.amount),
      0
    );

    // Average variable expenses (last 3 months)
    const variableExpenses = await prisma.transaction.aggregate({
      where: {
        householdId,
        type: "EXPENSE",
        date: { gte: threeMonthsAgo, lte: now },
        ignoreInTotals: false
      },
      _sum: { amount: true },
      _count: true
    });

    // Average per month, extrapolate to 30 days
    const totalVariableExpenses = Number(variableExpenses._sum.amount || 0);
    const avgMonthlyVariableExpenses = totalVariableExpenses / 3;

    // Total estimated outflow
    const totalEstimatedOutflow = recurringExpensesTotal + avgMonthlyVariableExpenses;

    // Net flow per day
    const netDailyFlow = (recurringIncomeTotal - totalEstimatedOutflow) / 30;

    // Projected balance in 30 days
    const projectedBalance30d = currentBalance + recurringIncomeTotal - totalEstimatedOutflow;

    // Calculate days until zero
    let daysUntilZero: number | null = null;
    let message = "";

    if (projectedBalance30d > 0) {
      if (netDailyFlow < 0) {
        daysUntilZero = Math.floor(currentBalance / Math.abs(netDailyFlow));
        message = `No ritmo atual, seu saldo dura ${daysUntilZero} dias`;
      } else {
        message = "Sua projeção está positiva para os próximos 30 dias";
      }
    } else {
      const daysToNegative = Math.floor(currentBalance / Math.abs(netDailyFlow));
      message = `⚠️ Projeção: saldo negativo em ${daysToNegative} dias`;
    }

    // Generate 7-point projection (today + next 6 days)
    const projectionPoints: Array<{ day: number; balance: number }> = [];
    for (let i = 0; i <= 6; i++) {
      const dayBalance = currentBalance + (netDailyFlow * i);
      projectionPoints.push({ day: i, balance: Math.round(dayBalance * 100) / 100 });
    }

    const response: ProjectionResponse = {
      currentBalance: Math.round(currentBalance * 100) / 100,
      projectedBalance30d: Math.round(projectedBalance30d * 100) / 100,
      daysUntilZero,
      message,
      projectionPoints
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Error calculating cash flow projection:", error);
    return NextResponse.json(
      { message: "Erro ao calcular projeção de caixa" },
      { status: 500 }
    );
  }
}
