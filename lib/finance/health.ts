import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, subDays, subMonths, addDays } from "date-fns";

interface ScoreBreakdown {
  spending: number;
  growth: number;
  commitments: number;
  goals: number;
}

export interface HealthScoreData {
  score: number;
  classification: "Saudável" | "Atenção" | "Risco";
  breakdown: ScoreBreakdown;
}

export async function calculateHealthScore(householdId: string): Promise<HealthScoreData> {
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
      nextDate: { lte: addDays(now, 30) }
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

  return {
    score: totalScore,
    classification,
    breakdown: {
      spending: Math.round(spendingScore),
      growth: Math.round(growthScore),
      commitments: Math.round(commitmentsScore),
      goals: Math.round(goalsScore)
    }
  };
}

export interface ProjectionData {
  currentBalance: number;
  projectedBalance30d: number;
  daysUntilZero: number | null;
  message: string;
  projectionPoints: Array<{ day: number; balance: number }>;
}

export async function calculateProjection(householdId: string): Promise<ProjectionData> {
  const now = new Date();
  const threeMonthsAgo = subMonths(now, 3);
  const thirtyDaysFromNow = addDays(now, 30);

  const [currentBalance, recurringExpenses, recurringIncome, variableExpenses] = await Promise.all([
    prisma.bankAccount.aggregate({
      where: { householdId },
      _sum: { balance: true }
    }),
    prisma.recurringTransaction.findMany({
      where: {
        householdId,
        type: "EXPENSE",
        active: true,
        nextDate: { lte: thirtyDaysFromNow }
      },
      select: { amount: true }
    }),
    prisma.recurringTransaction.findMany({
      where: {
        householdId,
        type: "INCOME",
        active: true,
        nextDate: { lte: thirtyDaysFromNow }
      },
      select: { amount: true }
    }),
    prisma.transaction.aggregate({
      where: {
        householdId,
        type: "EXPENSE",
        date: { gte: threeMonthsAgo, lte: now },
        ignoreInTotals: false
      },
      _sum: { amount: true }
    })
  ]);

  const balance = Number(currentBalance._sum.balance || 0);
  const recurringExpensesTotal = recurringExpenses.reduce((s, r) => s + Number(r.amount), 0);
  const recurringIncomeTotal = recurringIncome.reduce((s, r) => s + Number(r.amount), 0);
  const avgMonthlyVariableExpenses = Number(variableExpenses._sum.amount || 0) / 3;
  const totalEstimatedOutflow = recurringExpensesTotal + avgMonthlyVariableExpenses;
  const netDailyFlow = (recurringIncomeTotal - totalEstimatedOutflow) / 30;
  const projectedBalance30d = balance + recurringIncomeTotal - totalEstimatedOutflow;

  let daysUntilZero: number | null = null;
  let message = "";

  if (projectedBalance30d > 0) {
    if (netDailyFlow < 0) {
      daysUntilZero = Math.floor(balance / Math.abs(netDailyFlow));
      message = `No ritmo atual, seu saldo dura ${daysUntilZero} dias`;
    } else {
      message = "Sua projeção está positiva para os próximos 30 dias";
    }
  } else {
    const daysToNegative = Math.floor(balance / Math.abs(netDailyFlow));
    message = `⚠️ Projeção: saldo negativo em ${daysToNegative} dias`;
  }

  const projectionPoints: Array<{ day: number; balance: number }> = [];
  for (let i = 0; i <= 6; i++) {
    const dayBalance = balance + (netDailyFlow * i);
    projectionPoints.push({ day: i, balance: Math.round(dayBalance * 100) / 100 });
  }

  return {
    currentBalance: Math.round(balance * 100) / 100,
    projectedBalance30d: Math.round(projectedBalance30d * 100) / 100,
    daysUntilZero,
    message,
    projectionPoints
  };
}
