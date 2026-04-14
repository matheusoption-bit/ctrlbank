"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";
import { categorySchema, CategoryFormValues } from "../validations/category.schema";

async function getHouseholdIdForUser(userId: string) {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { householdId: true },
  });
  return dbUser?.householdId;
}

export async function createCategory(data: CategoryFormValues) {
  const { user } = await validateSession();
  if (!user) return { success: false, error: "Não autorizado" };

  const householdId = await getHouseholdIdForUser(user.id);
  if (!householdId) return { success: false, error: "Household não configurado" };

  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Dados inválidos" };

  try {
    await prisma.category.create({
      data: {
        userId: user.id,
        householdId,
        name: parsed.data.name,
        type: parsed.data.type,
        icon: parsed.data.icon || null,
        color: parsed.data.color || null,
      },
    });

    revalidatePath("/categorias");
    revalidatePath("/transacoes");
    return { success: true };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Falha ao criar categoria" };
  }
}

export async function updateCategory(data: CategoryFormValues) {
  const { user } = await validateSession();
  if (!user) return { success: false, error: "Não autorizado" };

  const householdId = await getHouseholdIdForUser(user.id);
  if (!householdId) return { success: false, error: "Household não configurado" };

  const parsed = categorySchema.safeParse(data);
  if (!parsed.success || !parsed.data.id) return { success: false, error: "Dados inválidos" };

  const existing = await prisma.category.findUnique({ where: { id: parsed.data.id } });
  if (!existing || existing.householdId !== householdId) {
    return { success: false, error: "Categoria não encontrada" };
  }

  try {
    await prisma.category.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        type: parsed.data.type,
        icon: parsed.data.icon || null,
        color: parsed.data.color || null,
      },
    });

    revalidatePath("/categorias");
    revalidatePath("/transacoes");
    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Falha ao editar categoria" };
  }
}

export async function deleteCategory(id: string) {
  const { user } = await validateSession();
  if (!user) return { success: false, error: "Não autorizado" };

  const householdId = await getHouseholdIdForUser(user.id);
  if (!householdId) return { success: false, error: "Household não configurado" };

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing || existing.householdId !== householdId) {
    return { success: false, error: "Categoria não encontrada" };
  }

  try {
    await prisma.category.delete({ where: { id } });

    revalidatePath("/categorias");
    revalidatePath("/transacoes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Falha ao excluir categoria. Pode estar em uso." };
  }
}

// Seed default categories for new households
const DEFAULT_CATEGORIES = [
  { name: "Salário", type: "INCOME" as const, icon: "💰", color: "#00C853" },
  { name: "Freelance", type: "INCOME" as const, icon: "💻", color: "#5AC8FA" },
  { name: "Investimentos", type: "INCOME" as const, icon: "📈", color: "#FF9500" },
  { name: "Outros", type: "INCOME" as const, icon: "📥", color: "#A1A1AA" },
  { name: "Alimentação", type: "EXPENSE" as const, icon: "🍔", color: "#FF3B5C" },
  { name: "Transporte", type: "EXPENSE" as const, icon: "🚗", color: "#FF9500" },
  { name: "Moradia", type: "EXPENSE" as const, icon: "🏠", color: "#5856D6" },
  { name: "Saúde", type: "EXPENSE" as const, icon: "🏥", color: "#5AC8FA" },
  { name: "Educação", type: "EXPENSE" as const, icon: "📚", color: "#AF52DE" },
  { name: "Lazer", type: "EXPENSE" as const, icon: "🎮", color: "#00C853" },
  { name: "Compras", type: "EXPENSE" as const, icon: "🛍️", color: "#FF2D55" },
  { name: "Assinaturas", type: "EXPENSE" as const, icon: "📺", color: "#FF3B5C" },
];

export async function seedDefaultCategories() {
  const { user } = await validateSession();
  if (!user) return { success: false, error: "Não autorizado" };

  const householdId = await getHouseholdIdForUser(user.id);
  if (!householdId) return { success: false, error: "Household não configurado" };

  // Check if categories already exist
  const existingCount = await prisma.category.count({ where: { householdId } });
  if (existingCount > 0) return { success: true, message: "Categorias já existem" };

  try {
    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map((cat) => ({
        userId: user.id,
        householdId,
        name: cat.name,
        type: cat.type,
        icon: cat.icon,
        color: cat.color,
      })),
    });

    revalidatePath("/categorias");
    return { success: true };
  } catch (error) {
    console.error("Error seeding categories:", error);
    return { success: false, error: "Falha ao criar categorias padrão" };
  }
}
