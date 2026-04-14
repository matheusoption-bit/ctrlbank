import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";
import { CategoriesClient } from "@/components/categorias/CategoriesClient";

export default async function CategoriasPage() {
  const { user } = await validateSession();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });

  const householdId = dbUser?.householdId;

  const rawCategories = householdId
    ? await prisma.category.findMany({
        where: { householdId, type: { in: ["INCOME", "EXPENSE"] } },
        orderBy: { name: "asc" },
        select: { id: true, name: true, type: true, icon: true, color: true },
      })
    : [];

  const categories = rawCategories.map((c) => ({
    ...c,
    type: c.type as "INCOME" | "EXPENSE",
  }));

  return <CategoriesClient categories={categories} />;
}
