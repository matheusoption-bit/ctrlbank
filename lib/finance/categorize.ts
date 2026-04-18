import { prisma } from "@/lib/prisma";
import { findUserLearnedCategory } from "@/lib/finance/learning";

const CATEGORY_RULES = [
  { keywords: ["uber", "99"], category: "transporte" },
  { keywords: ["ifood", "burger", "pizza"], category: "alimentacao" },
  { keywords: ["netflix", "spotify"], category: "assinaturas" },
  { keywords: ["mercado", "supermercado"], category: "alimentacao" },
] as const;

export function categorize(description: string): string {
  const normalized = description.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.category;
    }
  }

  return "outros";
}

function normalizeCategoryName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const CATEGORY_ALIASES: Record<string, string[]> = {
  alimentacao: ["alimentacao", "alimentação", "supermercado", "mercado", "delivery"],
  transporte: ["transporte", "mobilidade", "combustivel", "combustível"],
  assinaturas: ["assinaturas", "assinatura", "streaming", "servicos", "serviços"],
  outros: ["outros", "outro"],
};

export async function resolveTransactionCategoryId(params: {
  userId: string;
  householdId: string | null;
  description: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
}) {
  if (!params.description || params.type !== "EXPENSE") return null;

  const learned = await findUserLearnedCategory({
    userId: params.userId,
    householdId: params.householdId,
    description: params.description,
  });

  const categoryFromRules = learned?.categoryName ?? categorize(params.description);
  const aliases = CATEGORY_ALIASES[categoryFromRules] ?? [categoryFromRules];

  const categories = await prisma.category.findMany({
    where: {
      OR: [{ userId: params.userId }, ...(params.householdId ? [{ householdId: params.householdId }] : [])],
      type: "EXPENSE",
    },
    select: { id: true, name: true },
  });

  const matched = categories.find((category) => {
    const normalizedName = normalizeCategoryName(category.name);
    return aliases.some((alias) => normalizedName.includes(normalizeCategoryName(alias)));
  });

  return matched?.id ?? null;
}
