import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getBudgetsWithSpending, getSmartInsights } from "@/app/actions/budgets";
import { getCategories } from "@/app/actions/categories";
import OrcamentosPageClient from "./OrcamentosPageClient";

export const metadata = { title: "Orçamentos" };

export default async function OrcamentosPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const now = new Date();
  const month = now.getMonth() + 1;
  const year  = now.getFullYear();

  const [budgets, insights, categories] = await Promise.all([
    getBudgetsWithSpending(month, year),
    getSmartInsights(),
    getCategories("EXPENSE"),
  ]);

  return (
    <OrcamentosPageClient
      budgets={budgets}
      insights={insights}
      categories={categories}
      currentMonth={month}
      currentYear={year}
    />
  );
}
