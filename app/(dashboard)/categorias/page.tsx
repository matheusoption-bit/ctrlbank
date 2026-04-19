import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCategories, getUncategorizedTransactions } from "@/app/actions/categories";
import { scopeWhere } from "@/lib/security/scope";
import CategoriasPageClient from "./CategoriasPageClient";

export default async function CategoriasPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { householdId: true } });
  const ctx = { userId: user.id, householdId: dbUser?.householdId ?? null };

  const [categories, uncategorized, categoryCount, monthlyCounts] = await Promise.all([
    getCategories(),
    getUncategorizedTransactions(),
    prisma.category.count({ where: scopeWhere(ctx) }),
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { ...scopeWhere(ctx), date: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
      _count: { _all: true },
    }),
  ]);

  return (
    <CategoriasPageClient
      categories={categories}
      categoryCount={categoryCount}
      uncategorizedCount={uncategorized.length}
      uncategorized={uncategorized.map((t) => ({ id: t.id, description: t.description, amount: Number(t.amount), date: t.date.toISOString() }))}
      monthlyCategoryCounts={Object.fromEntries(monthlyCounts.map((item) => [item.categoryId ?? "", item._count._all]))}
    />
  );
}
