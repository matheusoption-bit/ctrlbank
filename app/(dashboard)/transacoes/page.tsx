import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";
import { TransactionsClient } from "@/components/transacoes/TransactionsClient";

export default async function TransacoesPage() {
  const { user } = await validateSession();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });

  const householdId = dbUser?.householdId;

  // Fetch accounts for select
  const rawAccounts = householdId
    ? await prisma.bankAccount.findMany({
        where: { householdId },
        select: { id: true, name: true, type: true },
        orderBy: { name: "asc" },
      })
    : [];

  // Fetch categories for select
  const rawCategories = householdId
    ? await prisma.category.findMany({
        where: { householdId },
        select: { id: true, name: true, type: true, icon: true },
        orderBy: { name: "asc" },
      })
    : [];

  // Fetch transactions
  const rawTransactions = householdId
    ? await prisma.transaction.findMany({
        where: { householdId },
        orderBy: { date: "desc" },
        take: 50,
        include: {
          category: { select: { name: true, icon: true, color: true } },
          bankAccount: { select: { name: true } },
        },
      })
    : [];

  const transactions = rawTransactions.map((tx) => ({
    id: tx.id,
    type: tx.type,
    description: tx.description,
    amount: Number(tx.amount),
    date: tx.date.toISOString(),
    bankAccountId: tx.bankAccountId,
    categoryId: tx.categoryId,
    status: tx.status,
    installmentNumber: tx.installmentNumber,
    totalInstallments: tx.totalInstallments,
    ignoreInTotals: tx.ignoreInTotals,
    category: tx.category,
    bankAccount: tx.bankAccount ? { name: tx.bankAccount.name } : null,
  }));

  return (
    <TransactionsClient
      accounts={rawAccounts}
      categories={rawCategories}
      transactions={transactions}
    />
  );
}
