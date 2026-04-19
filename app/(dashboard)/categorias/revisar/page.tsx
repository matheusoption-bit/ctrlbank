import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getCategories, getUncategorizedTransactions, suggestCategoryForTransactions } from "@/app/actions/categories";
import RevisarPageClient from "./RevisarPageClient";

export default async function RevisarCategoriasPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const uncategorized = await getUncategorizedTransactions();
  const suggestions = await suggestCategoryForTransactions(uncategorized.map((item) => item.id));
  const categories = await getCategories();

  return (
    <RevisarPageClient
      categories={categories.map((c) => ({ id: c.id, name: c.name, icon: c.icon, color: c.color }))}
      rows={uncategorized.map((tx) => ({
        id: tx.id,
        merchant: tx.description ?? "Sem descrição",
        amount: Number(tx.amount),
        date: tx.date.toISOString(),
        suggestion: suggestions.find((s) => s.transactionId === tx.id) ?? null,
      }))}
    />
  );
}
