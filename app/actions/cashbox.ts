"use server";

import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

async function getAuthContext() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, householdId: true, role: true },
  });
  if (!fullUser) throw new Error("Usuário não encontrado");

  return fullUser;
}

/**
 * Busca todas as contas do Household, ou apenas do usuário caso não tenha household.
 * Agrupa por categoria (Corrente vs Cartão de Crédito etc).
 */
export async function getCashboxOverview() {
  const ctx = await getAuthContext();

  const accounts = await prisma.bankAccount.findMany({
    where: ctx.householdId 
      ? { householdId: ctx.householdId }
      : { userId: ctx.id, householdId: null },
    include: {
      user: {
        select: { id: true, name: true }
      }
    },
    orderBy: { createdAt: "asc" },
  });

  const totalBalance = accounts.reduce((acc, account) => {
    // Para cartões de crédito, o balance pode significar fatura aberta, então precisa tratar a lógica.
    // Assumindo que saldo de cc é negativo ou não conta pro total dependendo da regra.
    // Simplificado:
    if (account.type === "CREDIT") return acc - Math.abs(Number(account.balance));
    return acc + Number(account.balance);
  }, 0);

  return {
    accounts,
    totalBalance,
  };
}

/**
 * Busca a timeline de transações (extrato unificado do household).
 */
export async function getCashboxTimeline(limit = 50) {
  const ctx = await getAuthContext();

  const transactions = await prisma.transaction.findMany({
    where: ctx.householdId 
      ? { householdId: ctx.householdId }
      : { userId: ctx.id, householdId: null },
    include: {
      bankAccount: { select: { id: true, name: true, color: true, icon: true } },
      user: { select: { id: true, name: true } }
    },
    orderBy: { date: "desc" },
    take: limit,
  });

  return transactions;
}
