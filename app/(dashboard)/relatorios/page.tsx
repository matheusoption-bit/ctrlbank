import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getMonthlyEvolution, getTransactions } from "@/app/actions/transactions";
import { getCategories } from "@/app/actions/categories";
import { getAccounts } from "@/app/actions/accounts";
import { getHouseholdMembers } from "@/app/actions/household";
import RelatoriosPageClient from "./RelatoriosPageClient";

export const metadata = { title: "Relatórios" };

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const now = new Date();
  const month = Number(searchParams.month ?? now.getMonth() + 1);
  const year  = Number(searchParams.year  ?? now.getFullYear());
  const bankAccountId = searchParams.bankAccountId;

  // Full month window
  const startDate = new Date(year, month - 1, 1);
  const endDate   = new Date(year, month, 0, 23, 59, 59);

  const [evolution, txResult, categories, accounts, { members }] = await Promise.all([
    getMonthlyEvolution(),
    getTransactions({
      limit: 1000,
      dateFrom: startDate,
      dateTo: endDate,
      bankAccountId,
    }),
    getCategories(),
    getAccounts(),
    getHouseholdMembers(),
  ]);

  const transactions = txResult.data ?? [];

  return (
    <RelatoriosPageClient
      evolution={evolution}
      transactions={transactions.map(tx => ({
        ...tx,
        amount: Number(tx.amount),
        date: typeof tx.date === "string" ? tx.date : tx.date.toISOString(),
        user: tx.user ?? null,
      }))}
      categories={categories}
      accounts={accounts}
      members={members.map(m => ({ id: m.id, name: m.name, email: m.email }))}
      currentMonth={month}
      currentYear={year}
    />
  );
}
