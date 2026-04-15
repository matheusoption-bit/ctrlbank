import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRecurringTransactions } from "@/app/actions/recurring";
import RecorrentesPageClient from "./RecorrentesPageClient";

export default async function RecorrentesPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });

  if (!dbUser?.householdId) {
    return <div className="p-10 text-center text-secondary">Acesso negado. Você precisa estar em um grupo familiar.</div>;
  }

  const [recurring, accounts, categories] = await Promise.all([
    getRecurringTransactions(),
    prisma.bankAccount.findMany({ where: { householdId: dbUser.householdId } }),
    prisma.category.findMany({ where: { householdId: dbUser.householdId } }),
  ]);

  return (
    <RecorrentesPageClient 
      recurring={recurring} 
      accounts={accounts}
      categories={categories}
    />
  );
}
