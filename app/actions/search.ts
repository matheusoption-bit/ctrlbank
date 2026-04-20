"use server";

import { requireWriteContext } from "@/lib/security/auth-context";
import { scopeWhere } from "@/lib/security/scope";
import { prisma } from "@/lib/prisma";
import { normalizeSubscriptionMerchant } from "@/lib/subscriptions/normalize";
import { syncDetectedSubscriptions } from "@/app/actions/subscriptions";
import { SearchGlobalResponse, SearchResultGroup, SearchResultItem } from "@/lib/search/contracts";

const GROUP_LIMIT = 6;

function trimQuery(query: string) {
  return query.trim().slice(0, 100);
}

function formatCurrency(value: number | null) {
  if (value == null) return null;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function containsNormalizedText(source: string | null | undefined, normalizedQuery: string) {
  if (!normalizedQuery) return true;
  return normalizeSubscriptionMerchant(source).includes(normalizedQuery);
}

function buildGroup(
  key: SearchResultGroup["key"],
  title: string,
  description: string,
  items: SearchResultItem[],
): SearchResultGroup {
  return {
    key,
    title,
    description,
    total: items.length,
    items,
  };
}

export async function searchGlobal(rawQuery: string): Promise<SearchGlobalResponse> {
  const ctx = await requireWriteContext();
  const query = trimQuery(rawQuery);
  const normalizedQuery = normalizeSubscriptionMerchant(query);

  if (!query) {
    return {
      query,
      groups: [],
      totalResults: 0,
    };
  }

  const baseScope = scopeWhere({ userId: ctx.id, householdId: ctx.householdId });
  const subscriptionsCount = await prisma.detectedSubscription.count({ where: baseScope });
  if (subscriptionsCount === 0) {
    await syncDetectedSubscriptions();
  }

  const [transactions, subscriptions, accounts, categories, aiEvents] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        ...baseScope,
        description: { contains: query, mode: "insensitive" },
      },
      include: {
        bankAccount: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
      take: 30,
    }),
    prisma.detectedSubscription.findMany({
      where: {
        ...baseScope,
        isHidden: false,
      },
      include: {
        bankAccount: { select: { id: true, name: true, type: true } },
      },
      orderBy: [{ status: "asc" }, { lastChargeAt: "desc" }],
      take: 50,
    }),
    prisma.bankAccount.findMany({
      where: {
        ...baseScope,
        name: { contains: query, mode: "insensitive" },
      },
      orderBy: { createdAt: "asc" },
      take: GROUP_LIMIT,
    }),
    prisma.category.findMany({
      where: {
        ...baseScope,
        name: { contains: query, mode: "insensitive" },
      },
      orderBy: { name: "asc" },
      take: GROUP_LIMIT,
    }),
    prisma.aiCaptureEvent.findMany({
      where: {
        ...baseScope,
        OR: [
          { rawText: { contains: query, mode: "insensitive" } },
          { correlationId: { contains: query, mode: "insensitive" } },
          { sourceDocument: { originalName: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: {
        sourceDocument: {
          select: {
            id: true,
            originalName: true,
            sourceType: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: GROUP_LIMIT,
    }),
  ]);

  const movementItems = transactions.slice(0, GROUP_LIMIT).map<SearchResultItem>((transaction) => ({
    id: transaction.id,
    title: transaction.description ?? "Movimento sem descrição",
    subtitle: [transaction.bankAccount.name, transaction.category?.name ?? null, formatDate(transaction.date)]
      .filter(Boolean)
      .join(" · "),
    href: `/caixa?search=${encodeURIComponent(transaction.description ?? transaction.id)}`,
    value: formatCurrency(Number(transaction.amount)) ?? undefined,
    label: transaction.type,
    group: "movements",
    metadata: {
      bankAccountId: transaction.bankAccountId,
      categoryId: transaction.categoryId,
      date: transaction.date.toISOString(),
    },
  }));

  const subscriptionItems = subscriptions
    .filter((subscription) => {
      return containsNormalizedText(subscription.displayName, normalizedQuery)
        || containsNormalizedText(subscription.normalizedMerchant, normalizedQuery)
        || containsNormalizedText(subscription.sourceMerchantRaw, normalizedQuery)
        || containsNormalizedText(subscription.bankAccount?.name, normalizedQuery);
    })
    .slice(0, GROUP_LIMIT)
    .map<SearchResultItem>((subscription) => ({
      id: subscription.id,
      title: subscription.displayName,
      subtitle: [
        subscription.normalizedMerchant,
        subscription.bankAccount?.name ?? null,
        subscription.lastChargeAt ? `Última cobrança ${formatDate(subscription.lastChargeAt)}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
      href: `/assinaturas?search=${encodeURIComponent(subscription.displayName)}`,
      value: formatCurrency(subscription.lastAmount ? Number(subscription.lastAmount) : null) ?? undefined,
      label: subscription.status,
      group: "subscriptions",
      metadata: {
        bankAccountId: subscription.bankAccountId,
        status: subscription.status,
      },
    }));

  const accountItems = accounts.map<SearchResultItem>((account) => ({
    id: account.id,
    title: account.name,
    subtitle: account.type,
    href: "/contas",
    value: formatCurrency(Number(account.balance)) ?? undefined,
    label: account.isDefault ? "Principal" : undefined,
    group: "accounts",
    metadata: {
      type: account.type,
      accountId: account.id,
    },
  }));

  const categoryItems = categories.map<SearchResultItem>((category) => ({
    id: category.id,
    title: category.name,
    subtitle: category.type,
    href: "/categorias",
    label: category.type,
    group: "categories",
    metadata: {
      categoryId: category.id,
      icon: category.icon ?? null,
    },
  }));

  const merchantGroups = new Map<string, { latestDescription: string; count: number; lastDate: Date; amount: number }>();
  for (const transaction of transactions) {
    const normalizedMerchant = normalizeSubscriptionMerchant(transaction.description);
    if (!normalizedMerchant || !containsNormalizedText(normalizedMerchant, normalizedQuery)) continue;

    const existingMerchant = merchantGroups.get(normalizedMerchant);
    if (!existingMerchant) {
      merchantGroups.set(normalizedMerchant, {
        latestDescription: transaction.description ?? normalizedMerchant,
        count: 1,
        lastDate: transaction.date,
        amount: Number(transaction.amount),
      });
      continue;
    }

    merchantGroups.set(normalizedMerchant, {
      latestDescription: existingMerchant.latestDescription,
      count: existingMerchant.count + 1,
      lastDate: existingMerchant.lastDate > transaction.date ? existingMerchant.lastDate : transaction.date,
      amount: existingMerchant.amount,
    });
  }

  const merchantItems = [...merchantGroups.entries()]
    .sort((left, right) => right[1].count - left[1].count)
    .slice(0, GROUP_LIMIT)
    .map<SearchResultItem>(([merchant, data]) => ({
      id: merchant,
      title: merchant,
      subtitle: `${data.count} movimento(s) · último em ${formatDate(data.lastDate)}`,
      href: `/caixa?search=${encodeURIComponent(data.latestDescription)}`,
      value: formatCurrency(data.amount) ?? undefined,
      group: "merchants",
      metadata: {
        merchant,
      },
    }));

  const processingItems = aiEvents.map<SearchResultItem>((event) => ({
    id: event.id,
    title: event.sourceDocument?.originalName ?? event.correlationId ?? "Processamento sem nome",
    subtitle: [event.inputType, event.processingStage ?? null, formatDate(event.createdAt)]
      .filter(Boolean)
      .join(" · "),
    href: `/processamentos?search=${encodeURIComponent(event.correlationId ?? event.sourceDocument?.originalName ?? event.id)}`,
    label: event.reviewState ?? undefined,
    group: "processings",
    metadata: {
      sourceDocumentId: event.sourceDocument?.id ?? null,
      correlationId: event.correlationId ?? null,
    },
  }));

  const groups = [
    buildGroup("movements", "Movimentos", "Transações e lançamentos encontrados no fluxo.", movementItems),
    buildGroup("subscriptions", "Assinaturas", "Cobranças recorrentes detectadas e reconciliadas.", subscriptionItems),
    buildGroup("accounts", "Contas", "Contas e cartões disponíveis no seu escopo.", accountItems),
    buildGroup("categories", "Categorias", "Classificações financeiras encontradas.", categoryItems),
    buildGroup("merchants", "Merchants", "Agrupamentos por merchant normalizado.", merchantItems),
    buildGroup("processings", "Processamentos", "Evidências, documentos e eventos operacionais relacionados.", processingItems),
  ].filter((group) => group.items.length > 0);

  return {
    query,
    groups,
    totalResults: groups.reduce((sum, group) => sum + group.items.length, 0),
  };
}
