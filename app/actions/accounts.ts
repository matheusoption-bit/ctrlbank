"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { BankAccountType } from "@prisma/client";

// ─── Schemas ────────────────────────────────────────────────────────────────

const CreateAccountSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(50),
  type: z.nativeEnum(BankAccountType),
  balance: z.coerce.number().default(0),
  color: z.string().optional(),
  icon: z.string().optional(),
  creditLimit: z.coerce.number().optional(),
  invoiceClosingDay: z.coerce.number().min(1).max(31).optional(),
  invoiceDueDay: z.coerce.number().min(1).max(31).optional(),
});

const UpdateAccountSchema = CreateAccountSchema.extend({
  id: z.string().cuid(),
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
 * Buscar todas as contas do household do usuário.
 * Server Action segura: householdId vem SEMPRE da sessão.
 */
export async function getAccounts() {
  const ctx = await getAuthContext();

  const accounts = await prisma.bankAccount.findMany({
    where: { householdId: ctx.householdId ?? undefined, userId: ctx.id },
    orderBy: { createdAt: "asc" },
  });

  return accounts;
}

/**
 * Criar nova conta bancária.
 */
export async function createAccount(formData: unknown) {
  const ctx = await getAuthContext();
  const parsed = CreateAccountSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { name, type, balance, color, icon, creditLimit, invoiceClosingDay, invoiceDueDay } =
    parsed.data;

  try {
    const account = await prisma.bankAccount.create({
      data: {
        userId: ctx.id,
        householdId: ctx.householdId,
        name,
        type,
        balance,
        color,
        icon,
        creditLimit:       type === BankAccountType.CREDIT ? creditLimit : undefined,
        invoiceClosingDay: type === BankAccountType.CREDIT ? invoiceClosingDay : undefined,
        invoiceDueDay:     type === BankAccountType.CREDIT ? invoiceDueDay : undefined,
      },
    });

    revalidatePath("/contas");
    revalidatePath("/");
    return { success: true, data: account };
  } catch (err) {
    console.error("createAccount error:", err);
    return { error: "Erro ao criar conta. Tente novamente." };
  }
}

/**
 * Atualizar conta bancária existente.
 * Valida que a conta pertence ao household do usuário.
 */
export async function updateAccount(formData: unknown) {
  const ctx = await getAuthContext();
  const parsed = UpdateAccountSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { id, name, type, balance, color, icon, creditLimit, invoiceClosingDay, invoiceDueDay } =
    parsed.data;

  // Verificar ownership
  const existing = await prisma.bankAccount.findFirst({
    where: {
      id,
      OR: [{ userId: ctx.id }, { householdId: ctx.householdId ?? "" }],
    },
  });

  if (!existing) {
    return { error: "Conta não encontrada" };
  }

  try {
    const account = await prisma.bankAccount.update({
      where: { id },
      data: {
        name,
        type,
        balance,
        color,
        icon,
        creditLimit:       type === BankAccountType.CREDIT ? creditLimit : null,
        invoiceClosingDay: type === BankAccountType.CREDIT ? invoiceClosingDay : null,
        invoiceDueDay:     type === BankAccountType.CREDIT ? invoiceDueDay : null,
      },
    });

    revalidatePath("/contas");
    revalidatePath("/");
    return { success: true, data: account };
  } catch (err) {
    console.error("updateAccount error:", err);
    return { error: "Erro ao atualizar conta." };
  }
}

/**
 * Excluir conta bancária.
 * Valida ownership antes de deletar.
 */
export async function deleteAccount(id: string) {
  const ctx = await getAuthContext();

  const existing = await prisma.bankAccount.findFirst({
    where: {
      id,
      OR: [{ userId: ctx.id }, { householdId: ctx.householdId ?? "" }],
    },
  });

  if (!existing) {
    return { error: "Conta não encontrada" };
  }

  try {
    await prisma.bankAccount.delete({ where: { id } });
    revalidatePath("/contas");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("deleteAccount error:", err);
    return { error: "Erro ao excluir conta." };
  }
}
