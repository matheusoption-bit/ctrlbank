import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthorizedUser } from "@/lib/authorization";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthorizedUser();
    const householdId = authUser.householdId;

    if (!householdId) {
      return NextResponse.json(
        { message: "Household não encontrado" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get("month");

    // Parse YYYY-MM or use current month
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;

    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
      const [y, m] = monthParam.split("-").map(Number);
      year = y;
      month = m;
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const dateFilter = {
      householdId,
      status: "COMPLETED" as const,
      ignoreInTotals: false,
      date: { gte: startDate, lte: endDate },
    };

    // Fetch all data in parallel
    const [
      incomeAgg,
      expenseAgg,
      expensesByCategory,
      goals,
      biggestExpenseTx,
      recommendations,
    ] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...dateFilter, type: "INCOME" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...dateFilter, type: "EXPENSE" },
        _sum: { amount: true },
      }),
      prisma.transaction.groupBy({
        by: ["categoryId"],
        where: { ...dateFilter, type: "EXPENSE" },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
        take: 5,
      }),
      prisma.goal.findMany({
        where: { householdId, completed: false },
        select: {
          name: true,
          targetAmount: true,
          currentAmount: true,
          deadline: true,
        },
      }),
      prisma.transaction.findFirst({
        where: { ...dateFilter, type: "EXPENSE" },
        orderBy: { amount: "desc" },
        include: {
          user: { select: { name: true } },
        },
      }),
      prisma.aiRecommendation.findMany({
        where: {
          householdId,
          isDismissed: false,
          createdAt: { gte: startDate, lte: endDate },
        },
        select: { id: true, type: true, message: true, createdAt: true },
        orderBy: { score: "desc" },
        take: 5,
      }),
    ]);

    const totalIncome = Number(incomeAgg._sum.amount ?? 0);
    const totalExpenses = Number(expenseAgg._sum.amount ?? 0);
    const netResult = totalIncome - totalExpenses;

    // Top categories with names
    const categoryIds = expensesByCategory
      .map((c) => c.categoryId)
      .filter(Boolean) as string[];

    const categories = categoryIds.length
      ? await prisma.category.findMany({
          where: { id: { in: categoryIds } },
          select: { id: true, name: true },
        })
      : [];

    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    const topCategories = expensesByCategory.map((c) => {
      const amount = Number(c._sum.amount ?? 0);
      return {
        category: categoryMap.get(c.categoryId ?? "") ?? "Sem categoria",
        amount,
        percentOfTotal: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      };
    });

    // Goals progress
    const goalsProgress = goals.map((g) => {
      const target = Number(g.targetAmount);
      const current = Number(g.currentAmount);
      return {
        name: g.name,
        progress: target > 0 ? Math.round((current / target) * 100) : 0,
        deadline: g.deadline?.toISOString() ?? null,
      };
    });

    // Biggest expense
    const biggestExpense = biggestExpenseTx
      ? {
          description: biggestExpenseTx.description ?? "Sem descrição",
          amount: Number(biggestExpenseTx.amount),
          member: biggestExpenseTx.user?.name ?? "Desconhecido",
        }
      : null;

    return NextResponse.json({
      totalIncome,
      totalExpenses,
      netResult,
      topCategories,
      goalsProgress,
      biggestExpense,
      recommendations: recommendations.map((r) => ({
        id: r.id,
        type: r.type,
        message: r.message,
      })),
    });
  } catch (error: any) {
    if (
      error?.message === "Não autenticado" ||
      error?.message === "Usuário não encontrado"
    ) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    console.error("Error generating monthly summary:", error);
    return NextResponse.json(
      { message: "Erro ao gerar resumo mensal" },
      { status: 500 }
    );
  }
}
