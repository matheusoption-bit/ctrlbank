"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { TransactionType, RecurringFrequency } from "@prisma/client";

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

function requireWriteRole(role: string) {
  if (role === "VIEWER") throw new Error("Permissão negada: somente leitura");
}

export async function getRecurringTransactions() {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return [];

  return prisma.recurringTransaction.findMany({
    where: { householdId: ctx.householdId },
    include: {
      bankAccount: { select: { name: true, color: true } },
      category: { select: { name: true, color: true, icon: true } },
    },
    orderBy: { nextDate: "asc" },
  });
}

const RecurringSchema = z.object({
  id: z.string().optional(),
  bankAccountId: z.string().min(1),
  categoryId: z.string().nullable().optional(),
  type: z.nativeEnum(TransactionType),
  amount: z.coerce.number().positive(),
  description: z.string().min(1),
  frequency: z.nativeEnum(RecurringFrequency),
  nextDate: z.string().min(1),
  endDate: z.string().nullable().optional(),
});

export async function upsertRecurringTransaction(formData: FormData) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  if (!ctx.householdId) return { error: "Sem grupo familiar" };

  const parsed = RecurringSchema.safeParse({
    id: formData.get("id"),
    bankAccountId: formData.get("bankAccountId"),
    categoryId: formData.get("categoryId") || null,
    type: formData.get("type"),
    amount: formData.get("amount"),
    description: formData.get("description"),
    frequency: formData.get("frequency"),
    nextDate: formData.get("nextDate"),
    endDate: formData.get("endDate") || null,
  });

  if (!parsed.success) return { error: "Dados inválidos" };
  const d = parsed.data;

  try {
    if (d.id) {
      await prisma.recurringTransaction.update({
        where: { id: d.id, householdId: ctx.householdId },
        data: {
          bankAccountId: d.bankAccountId,
          categoryId: d.categoryId,
          type: d.type,
          amount: d.amount,
          description: d.description,
          frequency: d.frequency,
          nextDate: new Date(d.nextDate),
          endDate: d.endDate ? new Date(d.endDate) : null,
        },
      });
    } else {
      await prisma.recurringTransaction.create({
        data: {
          householdId: ctx.householdId,
          bankAccountId: d.bankAccountId,
          categoryId: d.categoryId,
          type: d.type,
          amount: d.amount,
          description: d.description,
          frequency: d.frequency,
          nextDate: new Date(d.nextDate),
          endDate: d.endDate ? new Date(d.endDate) : null,
        },
      });
    }
    revalidatePath("/configuracoes");
    return { success: true };
  } catch {
    return { error: "Erro ao salvar transação recorrente" };
  }
}

export async function toggleRecurringState(id: string, active: boolean) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  if (!ctx.householdId) return { error: "Sem grupo familiar" };

  await prisma.recurringTransaction.update({
    where: { id, householdId: ctx.householdId },
    data: { active },
  });
  revalidatePath("/configuracoes");
  return { success: true };
}

export async function deleteRecurringTransaction(id: string) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  if (!ctx.householdId) return { error: "Sem grupo familiar" };

  await prisma.recurringTransaction.delete({
    where: { id, householdId: ctx.householdId },
  });
  revalidatePath("/configuracoes");
  return { success: true };
}

export async function autoDetectRecurring() {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return { error: "Sem grupo familiar" };

  // Busca transações recentes para encontrar padrões
  const recent = await prisma.transaction.findMany({
    where: { householdId: ctx.householdId, type: "EXPENSE" },
    orderBy: { date: "desc" },
    take: 100,
  });

  const map = new Map<string, typeof recent>();
  for (const t of recent) {
    if (!t.description) continue;
    const norm = t.description.toLowerCase().trim();
    if (!map.has(norm)) map.set(norm, []);
    map.get(norm)!.push(t);
  }

  const suggestions: { description: string, amount: number, occurrences: number }[] = [];
  for (const [, txs] of map.entries()) {
    if (txs.length >= 3) {
      suggestions.push({
        description: txs[0].description!,
        amount: Number(txs[0].amount),
        occurrences: txs.length
      });
    }
  }

  return { success: true, suggestions };
}
