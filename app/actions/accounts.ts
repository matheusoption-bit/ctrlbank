"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { BankAccountType } from "@prisma/client";
import { requireWriteContext, ServiceUnavailableError } from "@/lib/security/auth-context";
import { scopeWhere } from "@/lib/security/scope";

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
  createSetupBalance: z.coerce.boolean().optional(),
  isDefault: z.coerce.boolean().optional().default(false),
});

const UpdateAccountSchema = CreateAccountSchema.extend({
  id: z.string().cuid(),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthContext() {
  return requireWriteContext();
}

function requireWriteRole(role: string) {
  if (role === "VIEWER") throw new Error("Permissão negada: somente leitura");
}

// ─── Actions ─────────────────────────────────────────────────────────────────

/**
 * Buscar todas as contas do household do usuário.
 * Server Action segura: householdId vem SEMPRE da sessão.
 */
export async function getAccounts() {
  const ctx = await getAuthContext();

  const accounts = await prisma.bankAccount.findMany({
    where: scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
    orderBy: { createdAt: "asc" },
  });

  return accounts;
}

/**
 * Criar nova conta bancária.
 */
export async function createAccount(formData: unknown) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const parsed = CreateAccountSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { name, type, balance, color, icon, creditLimit, invoiceClosingDay, invoiceDueDay, createSetupBalance, isDefault } =
    parsed.data;

  try {
    const account = await prisma.$transaction(async (tx) => {
      const acc = await tx.bankAccount.create({
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
          isDefault,
        },
      });

      // Maintain uniqueness of isDefault
      if (isDefault) {
        await tx.bankAccount.updateMany({
          where: {
            id: { not: acc.id },
            ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
          },
          data: { isDefault: false },
        });
      }

      if (createSetupBalance && balance !== 0) {
        await tx.transaction.create({
          data: {
            userId: ctx.id,
            householdId: ctx.householdId,
            bankAccountId: acc.id,
            type: balance >= 0 ? "INCOME" : "EXPENSE",
            amount: Math.abs(balance),
            date: new Date(),
            description: "Saldo Inicial / Ajuste",
            status: "COMPLETED",
          }
        });
      }

      return acc;
    });

    revalidatePath("/contas");
    revalidatePath("/");
    return { success: true, data: account };
  } catch (err) {
    if (err instanceof ServiceUnavailableError) return { error: "Serviço temporariamente indisponível", status: 503 };
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
  requireWriteRole(ctx.role);
  const parsed = UpdateAccountSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { id, name, type, balance, color, icon, creditLimit, invoiceClosingDay, invoiceDueDay, createSetupBalance, isDefault } =
    parsed.data;

  if (Number(balance) !== 0 && !createSetupBalance) {
    return { error: "Saldo não é editável diretamente. Marque 'registrar ajuste' para lançar evidência contábil." };
  }

  // Verificar ownership
  const existing = await prisma.bankAccount.findFirst({
    where: {
      id,
      ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
    },
  });

  if (!existing) {
    return { error: "Conta não encontrada" };
  }

  try {
    const account = await prisma.$transaction(async (tx) => {
      const acc = await tx.bankAccount.update({
        where: { id },
        data: {
          name,
          type,
          color,
          icon,
          creditLimit:       type === BankAccountType.CREDIT ? creditLimit : null,
          invoiceClosingDay: type === BankAccountType.CREDIT ? invoiceClosingDay : null,
          invoiceDueDay:     type === BankAccountType.CREDIT ? invoiceDueDay : null,
          isDefault,
        },
      });

      if (isDefault) {
        await tx.bankAccount.updateMany({
          where: {
            id: { not: acc.id },
            ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
          },
          data: { isDefault: false },
        });
      }

      const diff = Number(balance) - Number(existing.balance);
      if (createSetupBalance && diff !== 0) {
        await tx.transaction.create({
          data: {
            userId: ctx.id,
            householdId: ctx.householdId,
            bankAccountId: acc.id,
            type: diff > 0 ? "INCOME" : "EXPENSE",
            amount: Math.abs(diff),
            date: new Date(),
            description: "Ajuste de Saldo",
            status: "COMPLETED",
          }
        });
        await tx.bankAccount.update({ where: { id: acc.id }, data: { balance: { increment: diff } } });
      }

      return acc;
    });

    revalidatePath("/contas");
    revalidatePath("/");
    return { success: true, data: account };
  } catch (err) {
    if (err instanceof ServiceUnavailableError) return { error: "Serviço temporariamente indisponível", status: 503 };
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
  requireWriteRole(ctx.role);

  const existing = await prisma.bankAccount.findFirst({
    where: {
      id,
      ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
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
    if (err instanceof ServiceUnavailableError) return { error: "Serviço temporariamente indisponível", status: 503 };
    console.error("deleteAccount error:", err);
    return { error: "Erro ao excluir conta." };
  }
}
