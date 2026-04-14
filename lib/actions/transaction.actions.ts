"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";
import {
  transactionSchema,
  TransactionFormValues,
  CSVTransactionRow,
  csvTransactionRowSchema,
} from "../validations/transaction.schema";

async function getHouseholdIdForUser(userId: string) {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { householdId: true },
  });
  return dbUser?.householdId;
}

export async function createTransaction(data: TransactionFormValues) {
  const { user } = await validateSession();
  if (!user) return { success: false, error: "Não autorizado" };

  const householdId = await getHouseholdIdForUser(user.id);
  if (!householdId) return { success: false, error: "Household não configurado" };

  const parsed = transactionSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos" };
  }

  // Verify bank account belongs to household
  const bankAccount = await prisma.bankAccount.findUnique({
    where: { id: parsed.data.bankAccountId },
  });
  if (!bankAccount || bankAccount.householdId !== householdId) {
    return { success: false, error: "Conta não encontrada" };
  }

  try {
    await prisma.transaction.create({
      data: {
        userId: user.id,
        householdId,
        bankAccountId: parsed.data.bankAccountId,
        categoryId: parsed.data.categoryId || null,
        type: parsed.data.type,
        status: parsed.data.status,
        amount: parsed.data.amount,
        description: parsed.data.description,
        date: parsed.data.date,
        installmentNumber: parsed.data.installmentNumber ?? null,
        totalInstallments: parsed.data.totalInstallments ?? null,
        ignoreInTotals: parsed.data.ignoreInTotals,
      },
    });

    // Update bank account balance
    if (parsed.data.status === "COMPLETED") {
      const balanceChange = parsed.data.type === "INCOME"
        ? parsed.data.amount
        : -parsed.data.amount;

      await prisma.bankAccount.update({
        where: { id: parsed.data.bankAccountId },
        data: { balance: { increment: balanceChange } },
      });
    }

    revalidatePath("/");
    revalidatePath("/transacoes");
    revalidatePath("/contas");
    return { success: true };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Falha ao criar transação" };
  }
}

export async function updateTransaction(data: TransactionFormValues) {
  const { user } = await validateSession();
  if (!user) return { success: false, error: "Não autorizado" };

  const householdId = await getHouseholdIdForUser(user.id);
  if (!householdId) return { success: false, error: "Household não configurado" };

  const parsed = transactionSchema.safeParse(data);
  if (!parsed.success || !parsed.data.id) {
    return { success: false, error: "Dados inválidos" };
  }

  const existing = await prisma.transaction.findUnique({
    where: { id: parsed.data.id },
  });

  if (!existing || existing.householdId !== householdId) {
    return { success: false, error: "Transação não encontrada" };
  }

  // Verify the new bank account also belongs to this household (prevents IDOR)
  const newBankAccount = await prisma.bankAccount.findUnique({
    where: { id: parsed.data.bankAccountId },
  });
  if (!newBankAccount || newBankAccount.householdId !== householdId) {
    return { success: false, error: "Conta de destino não encontrada" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Reverse old balance change
      if (existing.status === "COMPLETED") {
        const oldReverse = existing.type === "INCOME"
          ? -Number(existing.amount)
          : Number(existing.amount);
        await tx.bankAccount.update({
          where: { id: existing.bankAccountId },
          data: { balance: { increment: oldReverse } },
        });
      }

      // Update transaction
      await tx.transaction.update({
        where: { id: parsed.data.id },
        data: {
          bankAccountId: parsed.data.bankAccountId,
          categoryId: parsed.data.categoryId || null,
          type: parsed.data.type,
          status: parsed.data.status,
          amount: parsed.data.amount,
          description: parsed.data.description,
          date: parsed.data.date,
          installmentNumber: parsed.data.installmentNumber ?? null,
          totalInstallments: parsed.data.totalInstallments ?? null,
          ignoreInTotals: parsed.data.ignoreInTotals,
        },
      });

      // Apply new balance change
      if (parsed.data.status === "COMPLETED") {
        const newChange = parsed.data.type === "INCOME"
          ? parsed.data.amount
          : -parsed.data.amount;
        await tx.bankAccount.update({
          where: { id: parsed.data.bankAccountId },
          data: { balance: { increment: newChange } },
        });
      }
    });

    revalidatePath("/");
    revalidatePath("/transacoes");
    revalidatePath("/contas");
    return { success: true };
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { success: false, error: "Falha ao editar transação" };
  }
}

export async function deleteTransaction(id: string) {
  const { user } = await validateSession();
  if (!user) return { success: false, error: "Não autorizado" };

  const householdId = await getHouseholdIdForUser(user.id);
  if (!householdId) return { success: false, error: "Household não configurado" };

  const existing = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!existing || existing.householdId !== householdId) {
    return { success: false, error: "Transação não encontrada" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Reverse balance before deleting
      if (existing.status === "COMPLETED") {
        const reverse = existing.type === "INCOME"
          ? -Number(existing.amount)
          : Number(existing.amount);
        await tx.bankAccount.update({
          where: { id: existing.bankAccountId },
          data: { balance: { increment: reverse } },
        });
      }

      await tx.transaction.delete({ where: { id } });
    });

    revalidatePath("/");
    revalidatePath("/transacoes");
    revalidatePath("/contas");
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: "Falha ao excluir transação" };
  }
}

const CSV_IMPORT_MAX_ROWS = 500;

export async function importTransactionsFromCSV(
  rows: CSVTransactionRow[],
  bankAccountId: string
) {
  const { user } = await validateSession();
  if (!user) return { success: false, error: "Não autorizado", imported: 0 };

  const householdId = await getHouseholdIdForUser(user.id);
  if (!householdId) return { success: false, error: "Household não configurado", imported: 0 };

  if (!Array.isArray(rows) || rows.length > CSV_IMPORT_MAX_ROWS) {
    return { success: false, error: `Máximo de ${CSV_IMPORT_MAX_ROWS} linhas por importação`, imported: 0 };
  }

  // Verify bank account belongs to household
  const bankAccount = await prisma.bankAccount.findUnique({
    where: { id: bankAccountId },
  });
  if (!bankAccount || bankAccount.householdId !== householdId) {
    return { success: false, error: "Conta não encontrada", imported: 0 };
  }

  // Validate all rows upfront — reject the entire import on bad data
  const validRows = rows
    .map((row) => csvTransactionRowSchema.safeParse(row))
    .filter((r) => r.success)
    .map((r) => r.data!);

  if (validRows.length === 0) {
    return { success: false, error: "Nenhuma linha válida encontrada no CSV", imported: 0 };
  }

  let balanceChange = 0;
  for (const row of validRows) {
    balanceChange += row.type === "INCOME" ? row.amount : -row.amount;
  }

  try {
    // Atomic: all transactions + balance update succeed or all rollback
    await prisma.$transaction(async (tx) => {
      await tx.transaction.createMany({
        data: validRows.map((row) => ({
          userId: user.id,
          householdId,
          bankAccountId,
          categoryId: row.categoryId || null,
          type: row.type,
          status: "COMPLETED" as const,
          amount: row.amount,
          description: row.description,
          date: row.date,
        })),
      });

      if (balanceChange !== 0) {
        await tx.bankAccount.update({
          where: { id: bankAccountId },
          data: { balance: { increment: balanceChange } },
        });
      }
    });

    revalidatePath("/");
    revalidatePath("/transacoes");
    revalidatePath("/contas");
    return { success: true, imported: validRows.length };
  } catch (error) {
    console.error("Error importing CSV:", error);
    return { success: false, error: "Falha ao importar. Nenhuma alteração foi salva.", imported: 0 };
  }
}
