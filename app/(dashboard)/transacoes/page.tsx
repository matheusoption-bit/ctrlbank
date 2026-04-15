import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getTransactions } from "@/app/actions/transactions";
import { getAccounts } from "@/app/actions/accounts";
import { getCategories } from "@/app/actions/categories";
import TransacoesPageClient from "./TransacoesPageClient";

export const metadata = { title: "Extrato" };

export default async function TransacoesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const [txResult, accounts, categories] = await Promise.all([
    getTransactions({
      page:          Number(searchParams.page ?? 1),
      type:          searchParams.type as "INCOME" | "EXPENSE" | "TRANSFER" | undefined,
      categoryId:    searchParams.categoryId,
      bankAccountId: searchParams.bankAccountId,
      dateFrom:      searchParams.dateFrom,
      dateTo:        searchParams.dateTo,
      search:        searchParams.q,
    }),
    getAccounts(),
    getCategories(),
  ]);

  // Serialize Prisma Decimal → number before passing to Client Component
  const serializedTransactions = (txResult.data ?? []).map((tx) => ({
    id:          tx.id,
    type:        tx.type,
    status:      tx.status,
    amount:      Number(tx.amount),
    description: tx.description,
    date:        tx.date instanceof Date ? tx.date.toISOString() : tx.date,
    bankAccount: tx.bankAccount,
    category:    tx.category,
    user:        tx.user,
  }));

  const serializedAccounts = accounts.map((a) => ({
    id:    a.id,
    name:  a.name,
    type:  a.type,
    color: a.color,
    icon:  a.icon,
  }));

  return (
    <TransacoesPageClient
      initialTransactions={serializedTransactions}
      totalCount={txResult.total ?? 0}
      accounts={serializedAccounts}
      categories={categories}
      currentUserId={user.id}
    />
  );
}
