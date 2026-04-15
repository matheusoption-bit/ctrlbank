"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { TransactionType, TransactionStatus } from "@prisma/client";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const CreateTransactionSchema = z.object({
  bankAccountId:    z.string().cuid("Conta inválida"),
  categoryId:       z.string().cuid().optional().nullable(),
  type:             z.nativeEnum(TransactionType),
  status:           z.nativeEnum(TransactionStatus).default("COMPLETED"),
  amount:           z.coerce.number().positive("Valor deve ser positivo"),
  description:      z.string().max(200).optional().nullable(),
  date:             z.coerce.date(),
  installmentNumber: z.coerce.number().int().positive().optional().nullable(),
  totalInstallments: z.coerce.number().int().positive().optional().nullable(),
  ignoreInTotals:   z.boolean().default(false),
});

const UpdateTransactionSchema = CreateTransactionSchema.extend({
  id: z.string().cuid(),
});

const ListTransactionsSchema = z.object({
  page:         z.coerce.number().int().positive().default(1),
  limit:        z.coerce.number().int().positive().max(100).default(20),
  type:         z.nativeEnum(TransactionType).optional(),
  categoryId:   z.string().cuid().optional(),
  bankAccountId: z.string().cuid().optional(),
  dateFrom:     z.coerce.date().optional(),
  dateTo:       z.coerce.date().optional(),
  search:       z.string().max(100).optional(),
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

function buildWhereClause(
  ctx: { id: string; householdId: string | null },
  filters: z.infer<typeof ListTransactionsSchema>
) {
  return {
    householdId: ctx.householdId ?? undefined,
    ...(filters.type && { type: filters.type }),
    ...(filters.categoryId && { categoryId: filters.categoryId }),
    ...(filters.bankAccountId && { bankAccountId: filters.bankAccountId }),
    ...(filters.dateFrom || filters.dateTo
      ? {
          date: {
            ...(filters.dateFrom && { gte: filters.dateFrom }),
            ...(filters.dateTo   && { lte: filters.dateTo   }),
          },
        }
      : {}),
    ...(filters.search && {
      description: { contains: filters.search, mode: "insensitive" as const },
    }),
  };
}

// ─── Actions ─────────────────────────────────────────────────────────────────

/**
 * Listar transações com filtros e paginação.
 */
export async function getTransactions(filters?: unknown) {
  const ctx = await getAuthContext();
  const parsed = ListTransactionsSchema.safeParse(filters ?? {});

  if (!parsed.success) {
    return { error: "Filtros inválidos", data: [], total: 0 };
  }

  const { page, limit, ...rest } = parsed.data;
  const where = buildWhereClause(ctx, { page, limit, ...rest });
  const skip = (page - 1) * limit;

  const [transactions, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where,
      include: {
        bankAccount: { select: { id: true, name: true, color: true, icon: true } },
        category:    { select: { id: true, name: true, icon: true, color: true } },
        user:        { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { data: transactions, total, page, limit };
}

/**
 * Criar nova transação.
 * Atualiza o saldo da conta automaticamente.
 */
export async function createTransaction(formData: unknown) {
  const ctx = await getAuthContext();
  const parsed = CreateTransactionSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { bankAccountId, categoryId, type, status, amount, description,
    date, installmentNumber, totalInstallments, ignoreInTotals } = parsed.data;

  // Verificar que a conta pertence ao household
  const account = await prisma.bankAccount.findFirst({
    where: {
      id: bankAccountId,
      OR: [{ userId: ctx.id }, { householdId: ctx.householdId ?? "" }],
    },
  });

  if (!account) {
    return { error: "Conta não encontrada ou sem permissão" };
  }

  // Calcular delta do saldo
  const balanceDelta =
    !ignoreInTotals && status === "COMPLETED"
      ? type === "INCOME"
        ? amount
        : type === "EXPENSE"
        ? -amount
        : 0
      : 0;

  try {
    const [transaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId:       ctx.id,
          householdId:  ctx.householdId,
          bankAccountId,
          categoryId:   categoryId ?? null,
          type,
          status,
          amount,
          description:  description ?? null,
          date,
          installmentNumber:  installmentNumber ?? null,
          totalInstallments:  totalInstallments ?? null,
          ignoreInTotals,
        },
      }),
      // Atualizar saldo da conta
      ...(balanceDelta !== 0
        ? [
            prisma.bankAccount.update({
              where: { id: bankAccountId },
              data: { balance: { increment: balanceDelta } },
            }),
          ]
        : []),
    ]);

    revalidatePath("/");
    revalidatePath("/transacoes");
    revalidatePath("/contas");
    return { success: true, data: transaction };
  } catch (err) {
    console.error("createTransaction error:", err);
    return { error: "Erro ao registrar transação." };
  }
}

/**
 * Atualizar transação existente.
 * Reverte o saldo anterior e aplica o novo.
 */
export async function updateTransaction(formData: unknown) {
  const ctx = await getAuthContext();
  const parsed = UpdateTransactionSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { id, bankAccountId, categoryId, type, status, amount,
          description, date, installmentNumber,
          totalInstallments, ignoreInTotals } = parsed.data;

  // Verificar ownership
  const existing = await prisma.transaction.findFirst({
    where: {
      id,
      OR: [{ userId: ctx.id }, { householdId: ctx.householdId ?? "" }],
    },
  });

  if (!existing) return { error: "Transação não encontrada" };

  const oldDelta =
    !existing.ignoreInTotals && existing.status === "COMPLETED"
      ? existing.type === "INCOME"
        ? -Number(existing.amount)
        : existing.type === "EXPENSE"
        ? Number(existing.amount)
        : 0
      : 0;

  const newDelta =
    !ignoreInTotals && status === "COMPLETED"
      ? type === "INCOME"
        ? amount
        : type === "EXPENSE"
        ? -amount
        : 0
      : 0;

  try {
    await prisma.$transaction([
      // Reverter saldo antigo
      ...(oldDelta !== 0
        ? [prisma.bankAccount.update({
            where: { id: existing.bankAccountId },
            data: { balance: { increment: oldDelta } },
          })]
        : []),
      // Aplicar novo saldo
      ...(newDelta !== 0
        ? [prisma.bankAccount.update({
            where: { id: bankAccountId },
            data: { balance: { increment: newDelta } },
          })]
        : []),
      // Remover (noop sem tags no schema)
      // Atualizar transação
      prisma.transaction.update({
        where: { id },
        data: {
          bankAccountId,
          categoryId:        categoryId ?? null,
          type,
          status,
          amount,
          description:       description ?? null,
          date,
          installmentNumber: installmentNumber ?? null,
          totalInstallments: totalInstallments ?? null,
          ignoreInTotals,
        },
      }),
    ]);

    revalidatePath("/");
    revalidatePath("/transacoes");
    revalidatePath("/contas");
    return { success: true };
  } catch (err) {
    console.error("updateTransaction error:", err);
    return { error: "Erro ao atualizar transação." };
  }
}

/**
 * Excluir transação.
 * Reverte o impacto no saldo.
 */
export async function deleteTransaction(id: string) {
  const ctx = await getAuthContext();

  const existing = await prisma.transaction.findFirst({
    where: {
      id,
      OR: [{ userId: ctx.id }, { householdId: ctx.householdId ?? "" }],
    },
  });

  if (!existing) return { error: "Transação não encontrada" };

  const revertDelta =
    !existing.ignoreInTotals && existing.status === "COMPLETED"
      ? existing.type === "INCOME"
        ? -Number(existing.amount)
        : existing.type === "EXPENSE"
        ? Number(existing.amount)
        : 0
      : 0;

  try {
    await prisma.$transaction([
      prisma.transaction.delete({ where: { id } }),
      ...(revertDelta !== 0
        ? [prisma.bankAccount.update({
            where: { id: existing.bankAccountId },
            data: { balance: { increment: revertDelta } },
          })]
        : []),
    ]);

    revalidatePath("/");
    revalidatePath("/transacoes");
    revalidatePath("/contas");
    return { success: true };
  } catch (err) {
    console.error("deleteTransaction error:", err);
    return { error: "Erro ao excluir transação." };
  }
}

/**
 * Dashboard: agregações do mês atual.
 */
export async function getDashboardSummary() {
  const ctx = await getAuthContext();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const where = {
    householdId: ctx.householdId ?? undefined,
    status: "COMPLETED" as const,
    ignoreInTotals: false,
    date: { gte: startOfMonth, lte: endOfMonth },
  };

  const [income, expense, accounts, recentTransactions, categoryBreakdown] =
    await prisma.$transaction([
      prisma.transaction.aggregate({
        where: { ...where, type: "INCOME" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      }),
      prisma.bankAccount.findMany({
        where: {
          OR: [{ userId: ctx.id }, { householdId: ctx.householdId ?? "" }],
        },
        orderBy: { balance: "desc" },
      }),
      prisma.transaction.findMany({
        where: { householdId: ctx.householdId ?? undefined },
        take: 5,
        orderBy: { date: "desc" },
        include: {
          bankAccount: { select: { name: true, color: true, icon: true } },
          category:    { select: { name: true, icon: true, color: true } },
          user:        { select: { id: true, name: true } },
        },
      }),
      // Top categorias de despesa do mês
      prisma.transaction.groupBy({
        by: ["categoryId"],
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
        take: 5,
      }),
    ]);

  // Buscar nomes das categorias para o breakdown
  const categoryIds = categoryBreakdown
    .map((c) => c.categoryId)
    .filter(Boolean) as string[];

  const categories = categoryIds.length
    ? await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, name: true, icon: true, color: true },
      })
    : [];

  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);

  return {
    totalBalance,
    monthIncome:   Number(income._sum.amount   ?? 0),
    monthExpense:  Number(expense._sum.amount  ?? 0),
    accounts: accounts.map((a) => ({
      id: a.id, name: a.name, type: a.type,
      balance: Number(a.balance),
      color: a.color, icon: a.icon,
    })),
    recentTransactions: recentTransactions.map((tx) => ({
      id: tx.id, type: tx.type, amount: Number(tx.amount),
      description: tx.description,
      date: tx.date.toISOString(),
      bankAccount: tx.bankAccount,
      category: tx.category,
      user: tx.user,
    })),
    categoryBreakdown: categoryBreakdown.map((c) => ({
      categoryId: c.categoryId,
      amount:     Number(c._sum?.amount ?? 0),
      category:   categories.find((cat) => cat.id === c.categoryId) ?? null,
    })),
  };
}

/**
 * Evolução mensal dos últimos 6 meses (para gráfico).
 */
export async function getMonthlyEvolution() {
  const ctx = await getAuthContext();

  const months: { month: string; income: number; expense: number; balance: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d    = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() - i;
    const start = new Date(year, month, 1);
    const end   = new Date(year, month + 1, 0, 23, 59, 59);

    const [inc, exp] = await prisma.$transaction([
      prisma.transaction.aggregate({
        where: {
          householdId: ctx.householdId ?? undefined,
          type: "INCOME",
          status: "COMPLETED",
          ignoreInTotals: false,
          date: { gte: start, lte: end },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          householdId: ctx.householdId ?? undefined,
          type: "EXPENSE",
          status: "COMPLETED",
          ignoreInTotals: false,
          date: { gte: start, lte: end },
        },
        _sum: { amount: true },
      }),
    ]);

    const income  = Number(inc._sum.amount ?? 0);
    const expense = Number(exp._sum.amount ?? 0);

    months.push({
      month: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(start),
      income,
      expense,
      balance: income - expense,
    });
  }

  return months;
}

/**
 * Previsão de saldo mensal por dia (Dashboard).
 */
export async function getMonthForecast() {
  const ctx = await getAuthContext();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  // 1. Current total balance
  const accounts = await prisma.bankAccount.findMany({
    where: { OR: [{ userId: ctx.id }, { householdId: ctx.householdId ?? "" }] },
    select: { balance: true }
  });
  const currentTotal = accounts.reduce((acc, a) => acc + Number(a.balance), 0);

  // 2. All transactions of the current month
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

  const transactions = await prisma.transaction.findMany({
    where: {
      householdId: ctx.householdId ?? undefined,
      ignoreInTotals: false,
      date: { gte: startOfMonth, lte: endOfMonth }
    },
    select: { amount: true, type: true, status: true, date: true }
  });

  const dailyDeltas = Array(daysInMonth).fill(0);
  const dailyPendingDeltas = Array(daysInMonth).fill(0);

  transactions.forEach(tx => {
    const day = tx.date.getDate() - 1; // 0-indexed
    const val = tx.type === "INCOME" ? Number(tx.amount) : tx.type === "EXPENSE" ? -Number(tx.amount) : 0;
    if (tx.status === "COMPLETED") {
      dailyDeltas[day] += val;
    } else {
      dailyPendingDeltas[day] += val;
    }
  });

  const totalCompletedMonth = dailyDeltas.reduce((a, b) => a + b, 0);
  let balance = currentTotal - totalCompletedMonth;

  let actualBalance = balance;
  let forecastBalance = balance;

  const data = [];
  for (let i = 0; i < daysInMonth; i++) {
    const day = i + 1;
    actualBalance += dailyDeltas[i];
    forecastBalance += dailyDeltas[i] + dailyPendingDeltas[i];

    data.push({
      day: String(day).padStart(2, "0"),
      actual: day <= today ? actualBalance : null,
      forecast: forecastBalance,
    });
  }

  return data;
}

/**
 * Desfazer transação criada pelo AI Composer.
 */
export async function undoTransaction(id: string) {
  const ctx = await getAuthContext();

  const existing = await prisma.transaction.findFirst({
    where: {
      id,
      OR: [{ userId: ctx.id }, { householdId: ctx.householdId ?? "" }],
    },
  });

  if (!existing) return { error: "Transação não encontrada" };

  const revertDelta =
    !existing.ignoreInTotals && existing.status === "COMPLETED"
      ? existing.type === "INCOME"
        ? -Number(existing.amount)
        : existing.type === "EXPENSE"
        ? Number(existing.amount)
        : 0
      : 0;

  try {
    await prisma.$transaction([
      prisma.transaction.delete({ where: { id } }),
      ...(revertDelta !== 0
        ? [prisma.bankAccount.update({
            where: { id: existing.bankAccountId },
            data: { balance: { increment: revertDelta } },
          })]
        : []),
    ]);

    revalidatePath("/");
    revalidatePath("/transacoes");
    revalidatePath("/contas");
    return { success: true };
  } catch (err) {
    console.error("undoTransaction error:", err);
    return { error: "Erro ao desfazer transação." };
  }
}
