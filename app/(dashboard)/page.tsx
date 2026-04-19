import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scopeWhere } from "@/lib/security/scope";
import { getCurrentMonthBoundsUtc } from "@/lib/finance/period";
import { getConsolidatedBalance, getHealthScore } from "@/app/actions/health";
import { getActiveRecommendations } from "@/app/actions/ai/recommendations";
import InicioPageClient from "./InicioPageClient";

export const metadata = { title: "Início" };

/**
 * Home canônica do CtrlBank.
 * Agrega saudação, saldo consolidado, saúde em foco, atenções, próximas
 * cobranças e movimentos recentes em um só comando.
 */
export default async function InicioPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true, name: true },
  });

  const ctx = { userId: user.id, householdId: dbUser?.householdId ?? null };
  const scoped = scopeWhere(ctx);
  const { start, endExclusive } = getCurrentMonthBoundsUtc();
  const now = new Date();
  const in30 = new Date(now);
  in30.setDate(in30.getDate() + 30);

  const [balance, health, recommendations, recentTxs, upcoming, monthFlow] = await Promise.all([
    getConsolidatedBalance(),
    getHealthScore(),
    getActiveRecommendations(),
    prisma.transaction.findMany({
      where: { ...scoped, ignoreInTotals: false, status: "COMPLETED" },
      orderBy: { date: "desc" },
      take: 5,
      include: {
        bankAccount: { select: { name: true, color: true, icon: true } },
        category: { select: { name: true, color: true, icon: true } },
      },
    }),
    dbUser?.householdId
      ? prisma.recurringTransaction.findMany({
          where: {
            householdId: dbUser.householdId,
            active: true,
            nextDate: { gte: now, lte: in30 },
          },
          orderBy: { nextDate: "asc" },
          take: 5,
          include: {
            category: { select: { name: true, color: true, icon: true } },
          },
        })
      : Promise.resolve([] as never[]),
    prisma.transaction.groupBy({
      by: ["type"],
      where: {
        ...scoped,
        status: "COMPLETED",
        ignoreInTotals: false,
        date: { gte: start, lt: endExclusive },
      },
      _sum: { amount: true },
    }),
  ]);

  const monthIncome = Number(monthFlow.find((item) => item.type === "INCOME")?._sum.amount ?? 0);
  const monthExpense = Number(monthFlow.find((item) => item.type === "EXPENSE")?._sum.amount ?? 0);

  return (
    <InicioPageClient
      userName={dbUser?.name ?? user.name ?? null}
      balance={balance}
      health={health ? { score: health.score, classification: health.classification } : null}
      recommendations={recommendations.map((rec) => ({
        id: rec.id,
        type: rec.type,
        message: rec.message,
        createdAt: rec.createdAt.toISOString(),
      }))}
      upcoming={upcoming.map((item) => ({
        id: item.id,
        description: item.description ?? item.category?.name ?? "Lançamento recorrente",
        amount: Number(item.amount),
        nextDate: item.nextDate.toISOString(),
        type: item.type,
        category: item.category,
      }))}
      recent={recentTxs.map((tx) => ({
        id: tx.id,
        type: tx.type,
        amount: Number(tx.amount),
        description: tx.description,
        date: tx.date.toISOString(),
        bankAccount: tx.bankAccount,
        category: tx.category,
      }))}
      monthIncome={monthIncome}
      monthExpense={monthExpense}
    />
  );
}
