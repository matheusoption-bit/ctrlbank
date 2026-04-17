import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { startOfMonth, endOfMonth, subDays } from "date-fns";

export const runtime = "nodejs";

interface ScoreBreakdown {
  spending: number;
  growth: number;
  commitments: number;
  goals: number;
}

interface ScoreResponse {
  score: number;
  classification: "Saudável" | "Atenção" | "Risco";
  breakdown: ScoreBreakdown;
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

    // Calculate current month dates
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const thirtyDaysAgo = subDays(now, 30);

    // COMPONENT 1: Spending Control (40 points)
    const [incomeTransactions, expenseTransactions] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          householdId,
          type: "INCOME",
          date: { gte: monthStart, lte: monthEnd },
          ignoreInTotals: false
        },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: {
          householdId,
          type: "EXPENSE",
          date: { gte: monthStart, lte: monthEnd },
          ignoreInTotals: false
        },
        _sum: { amount: true }
      })
    ]);

    const income = Number(incomeTransactions._sum.amount || 0);
    const expenses = Number(expenseTransactions._sum.amount || 0);
    const ratio = income > 0 ? expenses / income : expenses > 0 ? 999 : 0;

    let spendingScore = 0;
    if (ratio <= 0.70) spendingScore = 40;
    else if (ratio <= 0.85) spendingScore = 28;
    else if (ratio <= 1.00) spendingScore = 16;
    else spendingScore = 0;

    // COMPONENT 2: Balance Growth (30 points)
    const currentBalance = await prisma.bankAccount.aggregate({
      where: { householdId },
      _sum: { balance: true }
    });

    // Get balance 30 days ago (approximate by looking at transactions)
    const transactionsLast30Days = await prisma.transaction.aggregate({
      where: {
        householdId,
        date: { gte: thirtyDaysAgo },
        ignoreInTotals: false
      },
      _sum: { amount: true }
    });

    const currentBalanceValue = Number(currentBalance._sum.balance || 0);
    const transactionsDelta = Number(transactionsLast30Days._sum.amount || 0);
    const balance30DaysAgo = currentBalanceValue - transactionsDelta;
    const balanceDelta = currentBalanceValue - balance30DaysAgo;

    let growthScore = 0;
    if (balanceDelta > 0) growthScore = 30;
    else if (balanceDelta === 0) growthScore = 15;
    else growthScore = 0;

    // COMPONENT 3: Fixed Commitments (20 points)
    const recurringExpenses = await prisma.recurringTransaction.findMany({
      where: {
        householdId,
        type: "EXPENSE",
        active: true,
        nextDate: { lte: subDays(now, -30) } // next 30 days
      },
      select: { amount: true }
    });

    const totalRecurringExpenses = recurringExpenses.reduce(
      (sum, rec) => sum + Number(rec.amount),
      0
    );

    const coverage = totalRecurringExpenses > 0
      ? currentBalanceValue / totalRecurringExpenses
      : currentBalanceValue > 0 ? 999 : 0;

    let commitmentsScore = 0;
    if (coverage >= 2.0) commitmentsScore = 20;
    else if (coverage >= 1.0) commitmentsScore = 12;
    else commitmentsScore = 0;

    // COMPONENT 4: Goal Progress (10 points)
    const goals = await prisma.goal.findMany({
      where: {
        householdId,
        completed: false
      },
      select: {
        currentAmount: true,
        targetAmount: true
      }
    });

    let goalsScore = 0;
    if (goals.length > 0) {
      const avgProgress = goals.reduce((sum, goal) => {
        const progress = Number(goal.targetAmount) > 0
          ? Number(goal.currentAmount) / Number(goal.targetAmount)
          : 0;
        return sum + progress;
      }, 0) / goals.length;

      goalsScore = avgProgress * 10;
    }

    // Calculate final score
    const totalScore = Math.round(
      spendingScore + growthScore + commitmentsScore + goalsScore
    );

    let classification: "Saudável" | "Atenção" | "Risco";
    if (totalScore >= 80) classification = "Saudável";
    else if (totalScore >= 50) classification = "Atenção";
    else classification = "Risco";

    const response: ScoreResponse = {
      score: totalScore,
      classification,
      breakdown: {
        spending: Math.round(spendingScore),
        growth: Math.round(growthScore),
        commitments: Math.round(commitmentsScore),
        goals: Math.round(goalsScore)
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Error calculating health score:", error);
    return NextResponse.json(
      { message: "Erro ao calcular score de saúde" },
      { status: 500 }
    );
  }
}
