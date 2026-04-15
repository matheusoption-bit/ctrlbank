"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { UserRole } from "@prisma/client";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthContext() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, householdId: true, role: true, name: true, email: true },
  });
  if (!fullUser) throw new Error("Usuário não encontrado");
  return fullUser;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

/**
 * Buscar membros do household atual.
 */
export async function getHouseholdMembers() {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return { members: [], household: null, inviteCode: null };

  const household = await prisma.household.findUnique({
    where: { id: ctx.householdId },
    include: {
      users: {
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      },
    },
  });

  return {
    household,
    members: household?.users ?? [],
    inviteCode: household?.inviteCode ?? null,
  };
}

/**
 * Gerar novo código de convite (apenas ADMIN).
 */
export async function generateInviteCode() {
  const ctx = await getAuthContext();

  if (ctx.role !== UserRole.ADMIN) {
    return { error: "Apenas administradores podem gerar convites" };
  }
  if (!ctx.householdId) {
    return { error: "Você não pertence a um household" };
  }

  // Gera código de 8 chars legível
  const code = randomBytes(4).toString("hex").toUpperCase();

  await prisma.household.update({
    where: { id: ctx.householdId },
    data: { inviteCode: code },
  });

  revalidatePath("/familia");
  return { success: true, code };
}

/**
 * Entrar num household via código de convite.
 */
export async function joinHousehold(code: string) {
  const ctx = await getAuthContext();

  if (!code || code.trim().length < 4) {
    return { error: "Código inválido" };
  }

  const household = await prisma.household.findUnique({
    where: { inviteCode: code.trim().toUpperCase() },
  });

  if (!household) {
    return { error: "Código de convite não encontrado" };
  }

  if (ctx.householdId === household.id) {
    return { error: "Você já pertence a este grupo familiar" };
  }

  // Sair do household atual se tiver um e migrar registros órfãos
  await prisma.$transaction([
    prisma.user.update({
      where: { id: ctx.id },
      data: {
        householdId: household.id,
        role: UserRole.VIEWER, // novos membros entram como VIEWER
      },
    }),
    prisma.bankAccount.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    }),
    prisma.category.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    }),
    prisma.transaction.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    })
  ]);

  revalidatePath("/familia");
  revalidatePath("/");
  return { success: true, householdName: household.name };
}

/**
 * Criar household (se o usuário não tiver um).
 */
export async function createHousehold(name: string) {
  const ctx = await getAuthContext();

  if (ctx.householdId) {
    return { error: "Você já pertence a um grupo familiar" };
  }

  const parsed = z.string().min(2).max(60).safeParse(name);
  if (!parsed.success) {
    return { error: "Nome deve ter entre 2 e 60 caracteres" };
  }

  const code = randomBytes(4).toString("hex").toUpperCase();

  const household = await prisma.household.create({
    data: {
      name: parsed.data,
      inviteCode: code,
      users: { connect: { id: ctx.id } },
    },
  });

  await prisma.$transaction([
    prisma.user.update({
      where: { id: ctx.id },
      data: { householdId: household.id, role: UserRole.ADMIN },
    }),
    prisma.bankAccount.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    }),
    prisma.category.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    }),
    prisma.transaction.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    })
  ]);

  revalidatePath("/familia");
  return { success: true, data: household };
}

/**
 * Alterar role de um membro (apenas ADMIN).
 */
export async function updateMemberRole(memberId: string, role: UserRole) {
  const ctx = await getAuthContext();

  if (ctx.role !== UserRole.ADMIN) {
    return { error: "Apenas administradores podem alterar roles" };
  }

  const member = await prisma.user.findFirst({
    where: { id: memberId, householdId: ctx.householdId ?? "" },
  });

  if (!member) return { error: "Membro não encontrado" };
  if (member.id === ctx.id) return { error: "Você não pode alterar seu próprio role" };

  await prisma.user.update({ where: { id: memberId }, data: { role } });
  revalidatePath("/familia");
  return { success: true };
}

/**
 * Remover membro do household (apenas ADMIN).
 */
export async function removeMember(memberId: string) {
  const ctx = await getAuthContext();

  if (ctx.role !== UserRole.ADMIN) {
    return { error: "Apenas administradores podem remover membros" };
  }
  if (memberId === ctx.id) {
    return { error: "Você não pode remover a si mesmo" };
  }

  const member = await prisma.user.findFirst({
    where: { id: memberId, householdId: ctx.householdId ?? "" },
  });

  if (!member) return { error: "Membro não encontrado" };

  await prisma.user.update({
    where: { id: memberId },
    data: { householdId: null },
  });

  revalidatePath("/familia");
  return { success: true };
}

/**
 * Criar conta de acesso para o contador (role VIEWER, sem household).
 */
export async function createCounterAccount(email: string, password: string) {
  const ctx = await getAuthContext();

  if (ctx.role !== UserRole.ADMIN) {
    return { error: "Apenas administradores podem criar contas de contador" };
  }

  const schema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
  });

  const parsed = schema.safeParse({ email, password });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "Email já cadastrado" };

  const { createHash } = await import("crypto");
  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      password_hash: passwordHash,
      name: "Contador",
      householdId: ctx.householdId,
      role: UserRole.VIEWER,
    },
  });

  return { success: true, data: { id: user.id, email: user.email } };
}
