import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { startOfMonth, endOfMonth, subMonths, subDays, addDays } from "date-fns";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
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
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));
    const sevenDaysAgo = subDays(now, 7);

    const createdRecommendations: any[] = [];

    // TRIGGER 1: Category spending up >20%
    const [currentMonthByCategory, lastMonthByCategory] = await Promise.all([
      prisma.transaction.groupBy({
        by: ['categoryId'],
        where: {
          householdId,
          type: "EXPENSE",
          date: { gte: currentMonthStart, lte: currentMonthEnd },
          ignoreInTotals: false,
          categoryId: { not: null }
        },
        _sum: { amount: true }
      }),
      prisma.transaction.groupBy({
        by: ['categoryId'],
        where: {
          householdId,
          type: "EXPENSE",
          date: { gte: lastMonthStart, lte: lastMonthEnd },
          ignoreInTotals: false,
          categoryId: { not: null }
        },
        _sum: { amount: true }
      })
    ]);

    // Build maps for comparison
    const currentMap = new Map(
      currentMonthByCategory.map(c => [c.categoryId!, Number(c._sum.amount || 0)])
    );
    const lastMap = new Map(
      lastMonthByCategory.map(c => [c.categoryId!, Number(c._sum.amount || 0)])
    );

    const increasedCategories: Array<{
      categoryId: string;
      percentChange: number;
    }> = [];

    for (const [categoryId, currentAmount] of currentMap) {
      const lastAmount = lastMap.get(categoryId) || 0;
      if (lastAmount > 0) {
        const percentChange = ((currentAmount - lastAmount) / lastAmount) * 100;
        if (percentChange > 20) {
          increasedCategories.push({ categoryId, percentChange });
        }
      }
    }

    if (increasedCategories.length > 0) {
      const increasedCategoryIds = increasedCategories.map(({ categoryId }) => categoryId);

      const [recentRecommendations, categories] = await Promise.all([
        prisma.aiRecommendation.findMany({
          where: {
            householdId,
            type: "ALERT",
            isDismissed: false,
            createdAt: { gte: sevenDaysAgo }
          },
          select: {
            message: true
          }
        }),
        prisma.category.findMany({
          where: { id: { in: increasedCategoryIds } },
          select: { id: true, name: true }
        })
      ]);

      const categoryNameMap = new Map(
        categories.map(category => [category.id, category.name])
      );

      const recommendationsToCreate = increasedCategories
        .filter(({ categoryId }) => {
          return !recentRecommendations.some(rec => rec.message.includes(categoryId));
        })
        .map(({ categoryId, percentChange }) => ({
          userId: user.id,
          householdId,
          type: "ALERT" as const,
          message: `Seu gasto com ${categoryNameMap.get(categoryId) || 'esta categoria'} subiu ${Math.round(percentChange)}% este mês`,
          score: 70,
          isDismissed: false
        }));

      if (recommendationsToCreate.length > 0) {
        const newRecommendations = await Promise.all(
          recommendationsToCreate.map(data =>
            prisma.aiRecommendation.create({
              data
            })
          )
        );
        createdRecommendations.push(...newRecommendations);
      }
    }

    // TRIGGER 2: Negative balance projected
    // Calculate projection similar to projection endpoint
    const thirtyDaysFromNow = addDays(now, 30);
    const threeMonthsAgo = subMonths(now, 3);

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
    const netDailyFlow = (recurringIncomeTotal - recurringExpensesTotal - avgMonthlyVariableExpenses) / 30;

    if (netDailyFlow < 0) {
      const daysToNegative = Math.floor(balance / Math.abs(netDailyFlow));
      if (daysToNegative < 15 && daysToNegative > 0) {
        const existing = await prisma.aiRecommendation.findFirst({
          where: {
            householdId,
            type: "WARNING",
            message: { contains: "negativo" },
            isDismissed: false,
            createdAt: { gte: sevenDaysAgo }
          }
        });

        if (!existing) {
          const rec = await prisma.aiRecommendation.create({
            data: {
              userId: user.id,
              householdId,
              type: "WARNING",
              message: `Você pode ficar negativo em ${daysToNegative} dias no ritmo atual`,
              score: 90,
              isDismissed: false
            }
          });
          createdRecommendations.push(rec);
        }
      }
    }

    // TRIGGER 3: Subscription with no recent transaction
    const fortyFiveDaysAgo = subDays(now, 45);
    const subscriptions = await prisma.recurringTransaction.findMany({
      where: {
        householdId,
        type: "EXPENSE",
        frequency: "MONTHLY",
        active: true
      },
      select: {
        id: true,
        description: true
      }
    });

    for (const sub of subscriptions) {
      if (sub.description) {
        // Check for transactions with similar description
        const recentTransaction = await prisma.transaction.findFirst({
          where: {
            householdId,
            description: { contains: sub.description, mode: 'insensitive' },
            date: { gte: fortyFiveDaysAgo }
          }
        });

        if (!recentTransaction) {
          const existing = await prisma.aiRecommendation.findFirst({
            where: {
              householdId,
              type: "SUGGESTION",
              message: { contains: sub.description },
              isDismissed: false,
              createdAt: { gte: sevenDaysAgo }
            }
          });

          if (!existing) {
            const rec = await prisma.aiRecommendation.create({
              data: {
                userId: user.id,
                householdId,
                type: "SUGGESTION",
                message: `A assinatura ${sub.description} não gerou movimentação há mais de 45 dias — ainda está ativa?`,
                score: 50,
                isDismissed: false
              }
            });
            createdRecommendations.push(rec);
          }
        }
      }
    }

    // TRIGGER 4: Goal behind schedule
    const sixtyDaysFromNow = addDays(now, 60);
    const goals = await prisma.goal.findMany({
      where: {
        householdId,
        completed: false,
        deadline: { not: null, lte: sixtyDaysFromNow }
      },
      select: {
        id: true,
        name: true,
        currentAmount: true,
        targetAmount: true,
        deadline: true
      }
    });

    for (const goal of goals) {
      const progress = Number(goal.targetAmount) > 0
        ? (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100
        : 0;

      if (progress < 70) {
        const existing = await prisma.aiRecommendation.findFirst({
          where: {
            householdId,
            type: "SUGGESTION",
            message: { contains: goal.name },
            isDismissed: false,
            createdAt: { gte: sevenDaysAgo }
          }
        });

        if (!existing) {
          const rec = await prisma.aiRecommendation.create({
            data: {
              userId: user.id,
              householdId,
              type: "SUGGESTION",
              message: `A meta '${goal.name}' está em ${Math.round(progress)}% e o prazo se aproxima`,
              score: 60,
              isDismissed: false
            }
          });
          createdRecommendations.push(rec);
        }
      }
    }

    return NextResponse.json({
      message: "Recomendações geradas com sucesso",
      created: createdRecommendations.length,
      recommendations: createdRecommendations
    }, { status: 200 });

  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { message: "Erro ao gerar recomendações" },
      { status: 500 }
    );
  }
}
