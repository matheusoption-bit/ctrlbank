"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { scopeWhere } from "@/lib/security/scope";
import { TransactionType } from "@prisma/client";
import { DEFAULT_CATEGORIES_PT_BR } from "@/lib/finance/default-categories";
import { normalizeMerchantKey, suggestCategoryFromMerchant } from "@/lib/finance/merchant-dictionary";

const CategorySchema = z.object({
  name: z.string().min(1).max(50),
  type: z.nativeEnum(TransactionType),
  icon: z.string().max(10).optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
  taxClassification: z.enum(["DEDUCTIBLE_IR", "NON_DEDUCTIBLE", "TAXABLE_INCOME", "OTHER"]).optional().nullable(),
});

async function getAuthContext() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");
  const fullUser = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true, householdId: true, role: true } });
  if (!fullUser) throw new Error("Usuário não encontrado");
  return fullUser;
}

function requireWriteRole(role: string) {
  if (role === "VIEWER") throw new Error("Permissão negada: somente leitura");
}

export async function getCategories(type?: TransactionType) {
  const ctx = await getAuthContext();
  return prisma.category.findMany({ where: { ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }), ...(type ? { type } : {}) }, orderBy: { name: "asc" } });
}

export async function seedDefaultCategoriesForUser() {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const existing = await prisma.category.findMany({ where: scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }), select: { name: true, type: true } });
  const keySet = new Set(existing.map((c) => `${c.name}|${c.type}`));
  const toCreate = DEFAULT_CATEGORIES_PT_BR.filter((c) => !keySet.has(`${c.name}|${c.type}`));
  if (toCreate.length) {
    await prisma.category.createMany({
      data: toCreate.map((category) => ({ ...category, userId: ctx.id, householdId: ctx.householdId })),
    });
  }
  revalidatePath("/categorias");
  return { created: toCreate.length };
}

export async function createCategory(formData: unknown) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const parsed = CategorySchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  try {
    const category = await prisma.category.create({ data: { userId: ctx.id, householdId: ctx.householdId, ...parsed.data } });
    revalidatePath("/categorias");
    return { success: true, data: category };
  } catch {
    return { error: "Erro ao criar categoria." };
  }
}

export async function updateCategory(id: string, formData: unknown) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const parsed = CategorySchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const existing = await prisma.category.findFirst({ where: { id, ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }) } });
  if (!existing) return { error: "Categoria não encontrada" };

  try {
    const category = await prisma.category.update({ where: { id }, data: parsed.data });
    revalidatePath("/categorias");
    return { success: true, data: category };
  } catch {
    return { error: "Erro ao atualizar categoria." };
  }
}

export async function deleteCategory(id: string) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const existing = await prisma.category.findFirst({ where: { id, ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }) } });
  if (!existing) return { error: "Categoria não encontrada" };

  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/categorias");
    return { success: true };
  } catch {
    return { error: "Erro ao excluir categoria. Verifique se não há transações vinculadas." };
  }
}

export async function getUncategorizedTransactions() {
  const ctx = await getAuthContext();
  return prisma.transaction.findMany({
    where: { ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }), categoryId: null },
    orderBy: { date: "desc" },
    take: 50,
    include: { category: true },
  });
}

export async function suggestCategoryForTransactions(transactionIds: string[]) {
  const ctx = await getAuthContext();
  const txs = await prisma.transaction.findMany({ where: { ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }), id: { in: transactionIds } } });
  const categories = await prisma.category.findMany({ where: scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }) });
  const rules = await prisma.categoryLearningRule.findMany({ where: scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }) });
  const memories = await prisma.merchantMemory.findMany({ where: scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }) });

  return txs.map((tx) => {
    const desc = tx.description ?? "";
    const normalized = normalizeMerchantKey(desc);

    const rule = rules.find((r) => normalized.includes(normalizeMerchantKey(r.descriptionPattern)));
    if (rule) {
      return { transactionId: tx.id, suggestedCategoryId: categories.find((c) => c.name === rule.categoryName)?.id ?? null, confidence: 0.97, source: "rule" };
    }

    const memory = memories.find((m) => normalizeMerchantKey(m.merchantName) === normalized);
    if (memory?.categoryId) {
      return { transactionId: tx.id, suggestedCategoryId: memory.categoryId, confidence: 0.91, source: "memory" };
    }

    const dictName = suggestCategoryFromMerchant(desc);
    const category = categories.find((c) => c.name === dictName);
    return { transactionId: tx.id, suggestedCategoryId: category?.id ?? null, confidence: category ? 0.82 : 0.3, source: category ? "dictionary" : "none" };
  });
}

export async function applyCategoryBulk(params: { transactionIds: string[]; categoryId: string; createRule?: boolean }) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const { transactionIds, categoryId, createRule = false } = params;
  const category = await prisma.category.findFirst({ where: { id: categoryId, ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }) } });
  if (!category) throw new Error("Categoria inválida");

  const txs = await prisma.transaction.findMany({ where: { ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }), id: { in: transactionIds } } });
  const updateResult = await prisma.transaction.updateMany({ where: { ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }), id: { in: transactionIds } }, data: { categoryId } });

  let ruleCreated = 0;
  if (createRule) {
    for (const tx of txs) {
      const merchantName = (tx.description ?? "").trim();
      if (!merchantName) continue;
      const descriptionPattern = normalizeMerchantKey(merchantName);
      await prisma.categoryLearningRule.upsert({
        where: { userId_descriptionPattern_categoryName: { userId: ctx.id, descriptionPattern, categoryName: category.name } },
        create: { userId: ctx.id, householdId: ctx.householdId, descriptionPattern, categoryName: category.name, usageCount: 1 },
        update: { usageCount: { increment: 1 } },
      });
      await prisma.merchantMemory.upsert({
        where: { id: `${ctx.id}-${descriptionPattern}` },
        create: { id: `${ctx.id}-${descriptionPattern}`, userId: ctx.id, householdId: ctx.householdId, merchantName: descriptionPattern, categoryId, correctedCount: 1 },
        update: { categoryId, correctedCount: { increment: 1 }, lastUsedAt: new Date() },
      });
      ruleCreated += 1;
    }
  }

  revalidatePath("/categorias");
  revalidatePath("/caixa");
  return { updated: updateResult.count, ruleCreated };
}
