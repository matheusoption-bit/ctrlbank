import React from "react";
import { redirect } from "next/navigation";
import { validateSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/dashboard-client";
import { SafeBankAccount } from "@/components/cards/BankAccountCard";

export default async function DashboardPage() {
  const { user } = await validateSession();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });

  const householdId = dbUser?.householdId;
  if (!householdId) {
    return (
      <DashboardClient
        user={{ id: user.id, email: user.email, name: user.name }}
        data={{
          totalBalance: 0,
          monthIncome: 0,
          monthExpense: 0,
          accounts: [],
          recentTransactions: [],
          chartData: [],
        }}
      />
    );
  }

  // Fetch accounts
  const rawAccounts = await prisma.bankAccount.findMany({
    where: { householdId },
    orderBy: { createdAt: "desc" },
  });

  const accounts: SafeBankAccount[] = rawAccounts.map((acc) => ({
    id: acc.id,
    name: acc.name,
    type: acc.type,
    balance: Number(acc.balance),
    color: acc.color,
    creditLimit: acc.creditLimit ? Number(acc.creditLimit) : null,
    invoiceClosingDay: acc.invoiceClosingDay,
    invoiceDueDay: acc.invoiceDueDay,
  }));

  // Total balance (sum of non-credit accounts)
  const totalBalance = accounts
    .filter((a) => a.type !== "CREDIT")
    .reduce((sum, a) => sum + a.balance, 0);

  // Current month boundaries
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Month income/expense aggregation
  const monthAggregation = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      householdId,
      date: { gte: startOfMonth, lte: endOfMonth },
      ignoreInTotals: false,
    },
    _sum: { amount: true },
  });

  let monthIncome = 0;
  let monthExpense = 0;
  for (const group of monthAggregation) {
    const val = Number(group._sum.amount || 0);
    if (group.type === "INCOME") monthIncome = val;
    else if (group.type === "EXPENSE") monthExpense = val;
  }

  // Recent transactions (last 8)
  const rawTransactions = await prisma.transaction.findMany({
    where: { householdId },
    orderBy: { date: "desc" },
    take: 8,
    include: {
      category: { select: { name: true, icon: true, color: true } },
      bankAccount: { select: { name: true } },
    },
  });

  const recentTransactions = rawTransactions.map((tx) => ({
    id: tx.id,
    type: tx.type,
    description: tx.description,
    amount: Number(tx.amount),
    date: tx.date.toISOString(),
    category: tx.category,
    bankAccount: tx.bankAccount ? { name: tx.bankAccount.name } : null,
  }));

  // Chart data: last 6 months income vs expense
  const chartData: { month: string; income: number; expense: number }[] = [];
  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endD = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

    const agg = await prisma.transaction.groupBy({
      by: ["type"],
      where: {
        householdId,
        date: { gte: d, lte: endD },
        ignoreInTotals: false,
      },
      _sum: { amount: true },
    });

    let income = 0;
    let expense = 0;
    for (const g of agg) {
      const v = Number(g._sum.amount || 0);
      if (g.type === "INCOME") income = v;
      else if (g.type === "EXPENSE") expense = v;
    }

    chartData.push({
      month: monthNames[d.getMonth()],
      income,
      expense,
    });
  }

  return (
    <DashboardClient
      user={{ id: user.id, email: user.email, name: user.name }}
      data={{
        totalBalance,
        monthIncome,
        monthExpense,
        accounts,
        recentTransactions,
        chartData,
      }}
    />
  );
}
