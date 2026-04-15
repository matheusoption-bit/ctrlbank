import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBudgetsWithSpending, getSmartInsights } from "@/app/actions/budgets";
import { getCategories } from "@/app/actions/categories";
import OrcamentosPageClient from "./OrcamentosPageClient";

export const metadata = { title: "Orçamentos" };

export default async function OrcamentosPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });

  const now = new Date();
  const month = Number(searchParams.month ?? now.getMonth() + 1);
  const year  = Number(searchParams.year  ?? now.getFullYear());

  const [budgets, insights, categories] = await Promise.all([
    getBudgetsWithSpending(month, year),
    getSmartInsights(month, year),
    getCategories("EXPENSE"),
  ]);

  return (
    <OrcamentosPageClient
      budgets={budgets}
      insights={insights}
      categories={categories}
      currentMonth={month}
      currentYear={year}
      hasHouseholdId={!!dbUser?.householdId}
    />
  );
}
