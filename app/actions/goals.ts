"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const GoalSchema = z.object({
  name:          z.string().min(1).max(80),
  targetAmount:  z.coerce.number().positive("Valor alvo deve ser positivo"),
  currentAmount: z.coerce.number().min(0).default(0),
  deadline:      z.coerce.date().optional().nullable(),
  icon:          z.string().max(10).optional().nullable(),
  color:         z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthContext() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, householdId: true },
  });
  if (!fullUser) throw new Error("Usuário não encontrado");
  return fullUser;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function getGoals() {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return [];

  return prisma.goal.findMany({
    where: { householdId: ctx.householdId },
    orderBy: [{ completed: "asc" }, { deadline: "asc" }, { createdAt: "desc" }],
  });
}

export async function createGoal(formData: unknown) {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return { error: "Você não pertence a um grupo familiar" };

  const parsed = GoalSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  try {
    const goal = await prisma.goal.create({
      data: { householdId: ctx.householdId, ...parsed.data },
    });
    revalidatePath("/metas");
    return { success: true, data: goal };
  } catch {
    return { error: "Erro ao criar meta." };
  }
}

export async function updateGoal(id: string, formData: unknown) {
  const ctx = await getAuthContext();

  const goal = await prisma.goal.findFirst({
    where: { id, householdId: ctx.householdId ?? "" },
  });
  if (!goal) return { error: "Meta não encontrada" };

  const parsed = GoalSchema.partial().safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  try {
    await prisma.goal.update({ where: { id }, data: parsed.data });
    revalidatePath("/metas");
    return { success: true };
  } catch {
    return { error: "Erro ao atualizar meta." };
  }
}

export async function contributeToGoal(id: string, amount: number) {
  const ctx = await getAuthContext();

  const goal = await prisma.goal.findFirst({
    where: { id, householdId: ctx.householdId ?? "" },
  });
  if (!goal) return { error: "Meta não encontrada" };

  const newAmount = Math.min(Number(goal.currentAmount) + amount, Number(goal.targetAmount));
  const completed = newAmount >= Number(goal.targetAmount);

  await prisma.goal.update({
    where: { id },
    data: { currentAmount: newAmount, completed },
  });

  revalidatePath("/metas");
  return { success: true, completed };
}

export async function deleteGoal(id: string) {
  const ctx = await getAuthContext();

  const goal = await prisma.goal.findFirst({
    where: { id, householdId: ctx.householdId ?? "" },
  });
  if (!goal) return { error: "Meta não encontrada" };

  await prisma.goal.delete({ where: { id } });
  revalidatePath("/metas");
  return { success: true };
}
