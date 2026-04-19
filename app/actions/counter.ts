"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import crypto from "crypto";

export async function createCounterSession(formData: FormData) {
  const { user } = await validateRequest();
  if (!user) return { error: "Não autenticado" };

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });
  if (!dbUser?.householdId) return { error: "Você não possui uma família associada" };

  const label = formData.get("label") as string;
  const days = Number(formData.get("expiresInDays"));
  if (!label || isNaN(days) || days <= 0) return { error: "Dados inválidos" };

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  const permissions = { 
    viewDRE: true, viewTransactions: true, viewDeductibles: true
  };

  try {
    const session = await prisma.counterSession.create({
      data: {
        householdId: dbUser.householdId,
        tokenHash,
        label,
        expiresAt,
        permissions,
      }
    });
    revalidatePath("/contador");
    return { success: true, token: rawToken, id: session.id };
  } catch {
    return { error: "Erro ao criar sessão de contador." };
  }
}

export async function revokeCounterSession(id: string) {
  const { user } = await validateRequest();
  if (!user) return { error: "Não autenticado" };

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { householdId: true }});
  if (!dbUser?.householdId) return { error: "Você não possui uma família associada" };

  try {
    await prisma.counterSession.delete({
      where: {
        id,
        householdId: dbUser.householdId,
      }
    });
    revalidatePath("/contador");
    return { success: true };
  } catch {
    return { error: "Erro ao revogar sessão de contador." };
  }
}

export async function getCounterSessions() {
  const { user } = await validateRequest();
  if (!user) return { error: "Não autenticado" };

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { householdId: true }});
  if (!dbUser?.householdId) return { error: "Sem household", sessions: [] };

  const sessions = await prisma.counterSession.findMany({
    where: { householdId: dbUser.householdId },
    orderBy: { createdAt: "desc" }
  });

  return { success: true, sessions };
}

export async function getCounterReports(token: string) {
  if (!token) return { error: "Token inválido" };

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const session = await prisma.counterSession.findUnique({
    where: { tokenHash },
    include: { household: { select: { name: true } } }
  });

  if (!session || session.expiresAt < new Date()) {
    return { error: "Sessão de contador inválida ou expirada" };
  }

  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59);

  const transactions = await prisma.transaction.findMany({
    where: {
      householdId: session.householdId,
      ignoreInTotals: false,
      status: "COMPLETED",
      date: { gte: startOfYear, lte: endOfYear }
    },
    include: {
      category: { select: { id: true, name: true, taxClassification: true, icon: true, color: true } },
      bankAccount: { select: { id: true, name: true, color: true } },
      user: { select: { id: true, name: true } }
    },
    orderBy: { date: "desc" }
  });

  return { 
    success: true, 
    year, 
    sessionLabel: session.label, 
    householdName: session.household?.name,
    transactions 
  };
}
