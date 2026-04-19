"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { requireWriteContext } from "@/lib/security/auth-context";
import { enforceRateLimit } from "@/lib/security/rate-limit";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthContext() {
  return requireWriteContext();
}

// ─── Actions ─────────────────────────────────────────────────────────────────

/**
 * Buscar membros do household atual.
 */
export async function getHouseholdMembers() {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return { members: [], household: null, inviteCode: null };

  const household = await prisma.household.findUnique({
    where: { id: ctx.householdId },
    include: {
      users: {
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      },
    },
  });

  return {
    household,
    members: household?.users ?? [],
    inviteCode: household?.inviteCode ?? null,
  };
}

/**
 * Gerar novo código de convite (apenas ADMIN).
 */
export async function generateInviteCode() {
  const ctx = await getAuthContext();

  if (ctx.role !== UserRole.ADMIN) {
    return { error: "Apenas administradores podem gerar convites" };
  }
  if (!ctx.householdId) {
    return { error: "Você não pertence a um household" };
  }

  // Gera código de 8 chars legível
  const code = randomBytes(4).toString("hex").toUpperCase();

  await prisma.household.update({
    where: { id: ctx.householdId },
    data: { inviteCode: code },
  });

  revalidatePath("/familia");
  return { success: true, code };
}

/**
 * Gerar link de convite com token único e validade de 48h (apenas ADMIN).
 */
export async function generateInviteLink() {
  const ctx = await getAuthContext();
  const limit = await enforceRateLimit({
    key: `invite:create:${ctx.id}`,
    limit: 12,
    windowSeconds: 60 * 60,
  });
  if (!limit.allowed) return { error: "Muitas tentativas. Aguarde para gerar novo convite.", status: 429 };

  if (ctx.role !== UserRole.ADMIN) {
    return { error: "Apenas administradores podem gerar convites" };
  }
  if (!ctx.householdId) {
    return { error: "Você não pertence a um household" };
  }

  const token = randomBytes(16).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  await prisma.householdInvite.create({
    data: {
      householdId: ctx.householdId,
      token,
      createdById: ctx.id,
      expiresAt,
    },
  });

  revalidatePath("/familia");
  return { success: true, token };
}

/**
 * Entrar num household via código de convite.
 */
export async function joinHousehold(code: string) {
  const ctx = await getAuthContext();

  if (!code || code.trim().length < 4) {
    return { error: "Código inválido" };
  }

  const household = await prisma.household.findUnique({
    where: { inviteCode: code.trim().toUpperCase() },
  });

  if (!household) {
    return { error: "Código de convite não encontrado" };
  }

  if (ctx.householdId === household.id) {
    return { error: "Você já pertence a este grupo familiar" };
  }

  // Novos membros entram como MEMBER
  await prisma.$transaction([
    prisma.user.update({
      where: { id: ctx.id },
      data: {
        householdId: household.id,
        role: UserRole.MEMBER,
      },
    }),
    prisma.bankAccount.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    }),
    prisma.category.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    }),
    prisma.transaction.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    })
  ]);

  revalidatePath("/familia");
  revalidatePath("/");
  return { success: true, householdName: household.name };
}

/**
 * Entrar num household via link de convite com token.
 */
export async function joinHouseholdByToken(token: string) {
  const ctx = await getAuthContext();
  const limit = await enforceRateLimit({
    key: `invite:accept:${ctx.id}:${token.slice(0, 8)}`,
    limit: 15,
    windowSeconds: 60 * 60,
  });
  if (!limit.allowed) return { error: "Muitas tentativas de convite. Aguarde e tente novamente.", status: 429 };

  if (!token || token.trim().length < 8) {
    return { error: "Token inválido" };
  }

  const invite = await prisma.householdInvite.findUnique({
    where: { token: token.trim() },
    include: { household: true },
  });

  if (!invite) {
    return { error: "Convite não encontrado" };
  }

  if (invite.usedAt) {
    return { error: "Este convite já foi utilizado" };
  }

  if (invite.expiresAt < new Date()) {
    return { error: "Este convite expirou" };
  }

  if (ctx.householdId === invite.householdId) {
    return { error: "Você já pertence a este grupo familiar" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: ctx.id },
      data: {
        householdId: invite.householdId,
        role: UserRole.MEMBER,
      },
    }),
    prisma.householdInvite.update({
      where: { id: invite.id },
      data: { usedAt: new Date(), usedById: ctx.id },
    }),
    prisma.bankAccount.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: invite.householdId },
    }),
    prisma.category.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: invite.householdId },
    }),
    prisma.transaction.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: invite.householdId },
    }),
  ]);

  revalidatePath("/familia");
  revalidatePath("/");
  return { success: true, householdName: invite.household.name };
}

/**
 * Criar household (se o usuário não tiver um).
 */
export async function createHousehold(name: string) {
  const ctx = await getAuthContext();

  if (ctx.householdId) {
    return { error: "Você já pertence a um grupo familiar" };
  }

  const parsed = z.string().min(2).max(60).safeParse(name);
  if (!parsed.success) {
    return { error: "Nome deve ter entre 2 e 60 caracteres" };
  }

  const code = randomBytes(4).toString("hex").toUpperCase();

  const household = await prisma.household.create({
    data: {
      name: parsed.data,
      inviteCode: code,
      users: { connect: { id: ctx.id } },
    },
  });

  await prisma.$transaction([
    prisma.user.update({
      where: { id: ctx.id },
      data: { householdId: household.id, role: UserRole.ADMIN },
    }),
    prisma.bankAccount.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    }),
    prisma.category.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    }),
    prisma.transaction.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    })
  ]);

  revalidatePath("/familia");
  return { success: true, data: household };
}

/**
 * Alterar role de um membro (apenas ADMIN).
 * Suporta ADMIN, MEMBER e VIEWER.
 */
export async function updateMemberRole(memberId: string, role: UserRole) {
  const ctx = await getAuthContext();

  if (ctx.role !== UserRole.ADMIN) {
    return { error: "Apenas administradores podem alterar roles" };
  }

  const validRoles: UserRole[] = [UserRole.ADMIN, UserRole.MEMBER, UserRole.VIEWER];
  if (!validRoles.includes(role)) {
    return { error: "Role inválido" };
  }

  const member = await prisma.user.findFirst({
    where: { id: memberId, householdId: ctx.householdId ?? "" },
  });

  if (!member) return { error: "Membro não encontrado" };
  if (member.id === ctx.id) return { error: "Você não pode alterar seu próprio role" };

  await prisma.user.update({ where: { id: memberId }, data: { role } });
  revalidatePath("/familia");
  return { success: true };
}

/**
 * Remover membro do household (apenas ADMIN).
 */
export async function removeMember(memberId: string) {
  const ctx = await getAuthContext();

  if (ctx.role !== UserRole.ADMIN) {
    return { error: "Apenas administradores podem remover membros" };
  }
  if (memberId === ctx.id) {
    return { error: "Você não pode remover a si mesmo" };
  }

  const member = await prisma.user.findFirst({
    where: { id: memberId, householdId: ctx.householdId ?? "" },
  });

  if (!member) return { error: "Membro não encontrado" };

  await prisma.user.update({
    where: { id: memberId },
    data: { householdId: null },
  });

  revalidatePath("/familia");
  return { success: true };
}

/**
 * Criar conta de acesso para o contador (role VIEWER, sem household).
 */
export async function createCounterAccount(email: string, password: string) {
  const ctx = await getAuthContext();

  if (ctx.role !== UserRole.ADMIN) {
    return { error: "Apenas administradores podem criar contas de contador" };
  }

  const schema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
  });

  const parsed = schema.safeParse({ email, password });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "Email já cadastrado" };

  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      password_hash: passwordHash,
      name: "Contador",
      householdId: ctx.householdId,
      role: UserRole.VIEWER,
    },
  });

  return { success: true, data: { id: user.id, email: user.email } };
}

/**
 * Obter resumo mensal para check do mês.
 */
export async function getMonthlySummary(monthStr?: string) {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return null;

  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;

  if (monthStr && /^\d{4}-\d{2}$/.test(monthStr)) {
    const [y, m] = monthStr.split("-").map(Number);
    year = y;
    month = m;
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const dateFilter = {
    householdId: ctx.householdId,
    status: "COMPLETED" as const,
    ignoreInTotals: false,
    date: { gte: startDate, lte: endDate },
  };

  const [
    incomeAgg, expenseAgg, expensesByCategory,
    goals, biggestExpenseTx, recommendations,
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
      where: { householdId: ctx.householdId, completed: false },
      select: { name: true, targetAmount: true, currentAmount: true, deadline: true },
    }),
    prisma.transaction.findFirst({
      where: { ...dateFilter, type: "EXPENSE" },
      orderBy: { amount: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.aiRecommendation.findMany({
      where: {
        householdId: ctx.householdId,
        isDismissed: false,
        createdAt: { gte: startDate, lte: endDate },
      },
      select: { id: true, type: true, message: true },
      orderBy: { score: "desc" },
      take: 5,
    }),
  ]);

  const totalIncome = Number(incomeAgg._sum.amount ?? 0);
  const totalExpenses = Number(expenseAgg._sum.amount ?? 0);
  const netResult = totalIncome - totalExpenses;

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

  const goalsProgress = goals.map((g) => {
    const target = Number(g.targetAmount);
    const current = Number(g.currentAmount);
    return {
      name: g.name,
      progress: target > 0 ? Math.round((current / target) * 100) : 0,
      deadline: g.deadline?.toISOString() ?? null,
    };
  });

  const biggestExpense = biggestExpenseTx
    ? {
        description: biggestExpenseTx.description ?? "Sem descrição",
        amount: Number(biggestExpenseTx.amount),
        member: biggestExpenseTx.user?.name ?? "Desconhecido",
      }
    : null;

  return {
    totalIncome, totalExpenses, netResult,
    topCategories, goalsProgress, biggestExpense,
    recommendations: recommendations.map((r) => ({
      id: r.id, type: r.type, message: r.message,
    })),
  };
}

/**
 * Marcar o check mensal como visualizado.
 */
export async function markMonthlyCheckViewed(monthStr: string) {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return { error: "Sem household" };

  await prisma.monthlyCheckView.upsert({
    where: {
      householdId_month_userId: {
        householdId: ctx.householdId,
        month: monthStr,
        userId: ctx.id,
      },
    },
    create: {
      householdId: ctx.householdId,
      month: monthStr,
      userId: ctx.id,
    },
    update: { viewedAt: new Date() },
  });

  revalidatePath("/familia");
  return { success: true };
}

/**
 * Verificar se o check mensal já foi visualizado por todos os ADMINs do household.
 * Retorna true when all ADMIN users have viewed the check (ou se não há household).
 */
export async function hasMonthlyCheckBeenViewed(monthStr: string) {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return true;

  const adminViews = await prisma.monthlyCheckView.findMany({
    where: { householdId: ctx.householdId, month: monthStr },
  });

  const admins = await prisma.user.findMany({
    where: { householdId: ctx.householdId, role: UserRole.ADMIN },
    select: { id: true },
  });

  const viewedUserIds = new Set(adminViews.map((v) => v.userId));
  return admins.every((a) => viewedUserIds.has(a.id));
}

/**
 * Obter contribuição por membro do mês (VIEWER não vê dados individuais).
 */
export async function getMemberContributions(monthParam?: number, yearParam?: number) {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return [];
  if (ctx.role === UserRole.VIEWER) return [];

  const now = new Date();
  const month = monthParam ?? now.getMonth() + 1;
  const year = yearParam ?? now.getFullYear();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const members = await prisma.user.findMany({
    where: { householdId: ctx.householdId },
    select: { id: true, name: true, email: true },
  });

  const expenses = await prisma.transaction.groupBy({
    by: ["userId"],
    where: {
      householdId: ctx.householdId,
      type: "EXPENSE",
      status: "COMPLETED",
      ignoreInTotals: false,
      date: { gte: startDate, lte: endDate },
    },
    _sum: { amount: true },
  });

  const expenseMap = new Map(
    expenses.map((e) => [e.userId, Number(e._sum.amount ?? 0)])
  );
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e._sum.amount ?? 0), 0
  );

  return members.map((m) => {
    const amount = expenseMap.get(m.id) ?? 0;
    return {
      id: m.id,
      name: m.name ?? m.email,
      amount,
      percent: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
    };
  });
}
