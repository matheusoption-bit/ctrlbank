import { prisma } from "@/lib/prisma";

function normalizePattern(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function buildDescriptionPattern(description: string) {
  return normalizePattern(description)
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter((token) => token.length >= 3)
    .slice(0, 4)
    .join(" ");
}

export async function findUserLearnedCategory(params: {
  userId: string;
  householdId: string | null;
  description: string;
}) {
  const normalizedDescription = normalizePattern(params.description);

  const rules = await prisma.categoryLearningRule.findMany({
    where: {
      OR: [{ userId: params.userId }, ...(params.householdId ? [{ householdId: params.householdId }] : [])],
    },
    orderBy: [{ usageCount: "desc" }, { updatedAt: "desc" }],
    take: 50,
  });

  return rules.find((rule) => normalizedDescription.includes(rule.descriptionPattern));
}

export async function saveUserLearningRule(params: {
  userId: string;
  householdId: string | null;
  description: string;
  categoryName: string;
}) {
  const descriptionPattern = buildDescriptionPattern(params.description);
  if (!descriptionPattern) return;

  const existing = await prisma.categoryLearningRule.findFirst({
    where: {
      categoryName: params.categoryName,
      descriptionPattern,
      OR: [{ userId: params.userId }, ...(params.householdId ? [{ householdId: params.householdId }] : [])],
    },
    select: { id: true },
  });

  if (existing) {
    await prisma.categoryLearningRule.update({
      where: { id: existing.id },
      data: { usageCount: { increment: 1 } },
    });
    return;
  }

  await prisma.categoryLearningRule.create({
    data: {
      userId: params.userId,
      householdId: params.householdId,
      descriptionPattern,
      categoryName: params.categoryName,
      usageCount: 1,
    },
  });
}
