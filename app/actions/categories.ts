"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { TransactionType } from "@prisma/client";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const CategorySchema = z.object({
  name:  z.string().min(1).max(50),
  type:  z.nativeEnum(TransactionType),
  icon:  z.string().max(10).optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
});

// ─── Helper ──────────────────────────────────────────────────────────────────

async function getAuthContext() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, householdId: true, role: true },
  });
  if (!fullUser) throw new Error("Usuário não encontrado");

  return fullUser;
}

function requireWriteRole(role: string) {
  if (role === "VIEWER") throw new Error("Permissão negada: somente leitura");
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function getCategories(type?: TransactionType) {
  const ctx = await getAuthContext();

  return prisma.category.findMany({
    where: {
      OR: [
        { userId: ctx.id },
        { householdId: ctx.householdId ?? "" },
      ],
      ...(type && { type }),
    },
    orderBy: { name: "asc" },
  });
}

export async function createCategory(formData: unknown) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const parsed = CategorySchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  try {
    const category = await prisma.category.create({
      data: {
        userId:            ctx.id,
        householdId:       ctx.householdId,
        ...parsed.data,
      },
    });

    revalidatePath("/configuracoes");
    return { success: true, data: category };
  } catch {
    return { error: "Erro ao criar categoria." };
  }
}

export async function updateCategory(id: string, formData: unknown) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const parsed = CategorySchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const existing = await prisma.category.findFirst({
    where: {
      id,
      OR: [{ userId: ctx.id }, { householdId: ctx.householdId ?? "" }],
    },
  });

  if (!existing) return { error: "Categoria não encontrada" };

  try {
    const category = await prisma.category.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/configuracoes");
    return { success: true, data: category };
  } catch {
    return { error: "Erro ao atualizar categoria." };
  }
}

export async function deleteCategory(id: string) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);

  const existing = await prisma.category.findFirst({
    where: {
      id,
      OR: [{ userId: ctx.id }, { householdId: ctx.householdId ?? "" }],
    },
  });

  if (!existing) return { error: "Categoria não encontrada" };

  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/configuracoes");
    return { success: true };
  } catch {
    return { error: "Erro ao excluir categoria. Verifique se não há transações vinculadas." };
  }
}
