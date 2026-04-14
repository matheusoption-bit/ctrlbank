"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";
import { bankAccountSchema, BankAccountFormValues } from "../validations/account.schema";

async function getHouseholdIdForUser(userId: string) {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { householdId: true }
  });
  return dbUser?.householdId;
}

export async function createBankAccount(data: BankAccountFormValues) {
  const { user } = await validateSession();
  if (!user) return { success: false, error: "Não autorizado" };

  const householdId = await getHouseholdIdForUser(user.id);
  if (!householdId) return { success: false, error: "Household não configurado" };

  const parsed = bankAccountSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos" };
  }

  try {
    await prisma.bankAccount.create({
      data: {
        userId: user.id,
        householdId,
        name: parsed.data.name,
        type: parsed.data.type,
        balance: parsed.data.balance,
        color: parsed.data.color,
        creditLimit: parsed.data.creditLimit,
        invoiceClosingDay: parsed.data.invoiceClosingDay,
        invoiceDueDay: parsed.data.invoiceDueDay,
      }
    });

    revalidatePath("/contas");
    return { success: true };
  } catch (error) {
    console.error("Error creating account:", error);
    return { success: false, error: "Falha ao criar conta" };
  }
}

export async function updateBankAccount(data: BankAccountFormValues) {
  const { user } = await validateSession();
  if (!user) return { success: false, error: "Não autorizado" };

  const householdId = await getHouseholdIdForUser(user.id);
  if (!householdId) return { success: false, error: "Household não configurado" };

  const parsed = bankAccountSchema.safeParse(data);
  if (!parsed.success || !parsed.data.id) {
    return { success: false, error: "Dados inválidos" };
  }

  // Verifica se a conta pertence ao mesmo household
  const existing = await prisma.bankAccount.findUnique({
    where: { id: parsed.data.id }
  });

  if (!existing || existing.householdId !== householdId) {
    return { success: false, error: "Conta não encontrada ou sem permissão" };
  }

  try {
    await prisma.bankAccount.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        type: parsed.data.type,
        balance: parsed.data.balance,
        color: parsed.data.color,
        creditLimit: parsed.data.creditLimit,
        invoiceClosingDay: parsed.data.invoiceClosingDay,
        invoiceDueDay: parsed.data.invoiceDueDay,
      }
    });

    revalidatePath("/contas");
    return { success: true };
  } catch (error) {
    console.error("Error updating account:", error);
    return { success: false, error: "Falha ao editar conta" };
  }
}

export async function deleteBankAccount(id: string) {
  const { user } = await validateSession();
  if (!user) return { success: false, error: "Não autorizado" };

  const householdId = await getHouseholdIdForUser(user.id);
  if (!householdId) return { success: false, error: "Household não configurado" };

  const existing = await prisma.bankAccount.findUnique({
    where: { id }
  });

  if (!existing || existing.householdId !== householdId) {
    return { success: false, error: "Conta não encontrada ou sem permissão" };
  }

  try {
    await prisma.bankAccount.delete({
      where: { id }
    });

    revalidatePath("/contas");
    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, error: "Falha ao excluir conta. Pode conter transações." };
  }
}
