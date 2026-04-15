"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const BudgetSchema = z.object({
  categoryId: z.string().cuid("Categoria inválida"),
  amount:     z.coerce.number().positive("Valor deve ser positivo"),
  month:      z.coerce.number().int().min(1).max(12),
  year:       z.coerce.number().int().min(2020).max(2099),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthContext() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, householdId: true },
  });
  if (!fullUser) throw new Error("Usuário não encontrado");
  return fullUser;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

/**
 * Buscar orçamentos do mês com gasto atual calculado.
 */
export async function getBudgetsWithSpending(month: number, year: number) {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return [];

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth   = new Date(year, month, 0, 23, 59, 59);

  const budgets = await prisma.budget.findMany({
    where: { householdId: ctx.householdId },
    include: {
      category: { select: { id: true, name: true, icon: true, color: true } },
    },
  });

  // Calcular gasto real por categoria no mês
  const categoryIds = budgets.map((b) => b.categoryId);
  const spending = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      householdId:    ctx.householdId,
      type:           "EXPENSE",
      status:         "COMPLETED",
      ignoreInTotals: false,
      categoryId:     { in: categoryIds },
      date:           { gte: startOfMonth, lte: endOfMonth },
    },
    _sum: { amount: true },
  });

  const spendingMap = new Map(
    spending.map((s) => [s.categoryId, Number(s._sum.amount ?? 0)])
  );

  return budgets.map((b) => ({
    ...b,
    amount: Number(b.amount),
    spent:  spendingMap.get(b.categoryId) ?? 0,
  }));
}

/**
 * Criar ou atualizar orçamento (upsert).
 */
export async function upsertBudget(formData: unknown) {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return { error: "Você não pertence a um grupo familiar" };

  const parsed = BudgetSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { categoryId, amount, month, year } = parsed.data;

  try {
    await prisma.budget.upsert({
      where: {
        householdId_categoryId_month_year: {
          householdId: ctx.householdId,
          categoryId,
          month,
          year,
        },
      },
      create: { householdId: ctx.householdId, categoryId, amount, month, year },
      update: { amount },
    });

    revalidatePath("/orcamentos");
    return { success: true };
  } catch {
    return { error: "Erro ao salvar orçamento." };
  }
}

/**
 * Excluir orçamento.
 */
export async function deleteBudget(id: string) {
  const ctx = await getAuthContext();

  const budget = await prisma.budget.findFirst({
    where: { id, householdId: ctx.householdId ?? "" },
  });

  if (!budget) return { error: "Orçamento não encontrado" };

  await prisma.budget.delete({ where: { id } });
  revalidatePath("/orcamentos");
  return { success: true };
}

/**
 * Sugestões inteligentes de economia.
 * Compara gasto médio dos 3 meses anteriores com o mês atual.
 */
export async function getSmartInsights(month: number, year: number) {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return [];

  const currentMonth = month;
  const currentYear  = year;

  const currentStart = new Date(currentYear, currentMonth - 1, 1);
  const currentEnd   = new Date(currentYear, currentMonth, 0, 23, 59, 59);
  const threeMonthsAgo = new Date(currentYear, currentMonth - 4, 1);

  // Gasto atual por categoria
  const currentSpending = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      householdId: ctx.householdId,
      type: "EXPENSE",
      status: "COMPLETED",
      ignoreInTotals: false,
      date: { gte: currentStart, lte: currentEnd },
    },
    _sum: { amount: true },
  });

  // Gasto médio dos 3 meses anteriores por categoria
  const prevSpending = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      householdId: ctx.householdId,
      type: "EXPENSE",
      status: "COMPLETED",
      ignoreInTotals: false,
      date: { gte: threeMonthsAgo, lt: currentStart },
    },
    _sum: { amount: true },
    _count: true,
  });

  // Mapear e calcular insights
  const categoryIds = [
    ...new Set([
      ...currentSpending.map((c) => c.categoryId),
      ...prevSpending.map((c) => c.categoryId),
    ]),
  ].filter(Boolean) as string[];

  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true, icon: true },
  });

  const catMap = new Map(categories.map((c) => [c.id, c]));
  const insights: {
    categoryId: string; categoryName: string; icon: string | null;
    currentSpent: number; avgPrev: number; changePercent: number; excess: number;
  }[] = [];

  for (const curr of currentSpending) {
    if (!curr.categoryId) continue;
    const prev = prevSpending.find((p) => p.categoryId === curr.categoryId);
    const currentSpent = Number(curr._sum.amount ?? 0);
    const avgPrev = prev ? Number(prev._sum.amount ?? 0) / 3 : 0;

    if (avgPrev > 0 && currentSpent > avgPrev * 1.1) {
      const changePercent = Math.round(((currentSpent - avgPrev) / avgPrev) * 100);
      const cat = catMap.get(curr.categoryId);
      insights.push({
        categoryId:   curr.categoryId,
        categoryName: cat?.name ?? "Categoria",
        icon:         cat?.icon ?? "📊",
        currentSpent,
        avgPrev,
        changePercent,
        excess: currentSpent - avgPrev,
      });
    }
  }

  return insights.sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
}
