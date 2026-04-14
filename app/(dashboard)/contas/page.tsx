import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";
import { AccountsClient } from "@/components/contas/accounts-client";
import { SafeBankAccount } from "@/components/cards/BankAccountCard";

export default async function ContasPage() {
  const { user } = await validateSession();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });

  let accounts: SafeBankAccount[] = [];

  if (dbUser?.householdId) {
    const rawAccounts = await prisma.bankAccount.findMany({
      where: { householdId: dbUser.householdId },
      orderBy: { createdAt: "desc" }
    });

    accounts = rawAccounts.map(acc => ({
      id: acc.id,
      name: acc.name,
      type: acc.type,
      balance: Number(acc.balance),
      color: acc.color,
      creditLimit: acc.creditLimit ? Number(acc.creditLimit) : null,
      invoiceClosingDay: acc.invoiceClosingDay,
      invoiceDueDay: acc.invoiceDueDay,
    }));
  }

  return <AccountsClient accounts={accounts} />;
}
