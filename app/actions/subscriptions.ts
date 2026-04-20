"use server";

import { revalidatePath } from "next/cache";
import { DetectedSubscriptionStatus, Prisma, RecurringFrequency } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireWriteContext } from "@/lib/security/auth-context";
import { scopeWhere } from "@/lib/security/scope";
import { detectSubscriptions } from "@/lib/subscriptions/detect";
import { merchantMatchesQuery } from "@/lib/subscriptions/normalize";
import { getSubscriptionBrandByKey } from "@/lib/brands/subscriptions";

function stringArrayFromJson(value: Prisma.JsonValue | null): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function jsonInput(value: Record<string, unknown>): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

const SubscriptionListFiltersSchema = z.object({
  search: z.string().max(120).optional(),
  status: z.nativeEnum(DetectedSubscriptionStatus).optional(),
  includeHidden: z.coerce.boolean().optional().default(false),
});

const CUT_CANDIDATE_STATUSES: DetectedSubscriptionStatus[] = [
  DetectedSubscriptionStatus.INACTIVE,
  DetectedSubscriptionStatus.DUPLICATE_SUSPECTED,
  DetectedSubscriptionStatus.POSSIBLE,
];

function requireWriteRole(role: string) {
  if (role === "VIEWER") throw new Error("Permissão negada: somente leitura");
}

function monthlyAmountForFrequency(amount: number | null, frequency: RecurringFrequency) {
  if (!amount) return 0;

  switch (frequency) {
    case RecurringFrequency.DAILY:
      return amount * 30;
    case RecurringFrequency.WEEKLY:
      return (amount * 52) / 12;
    case RecurringFrequency.BIWEEKLY:
      return (amount * 26) / 12;
    case RecurringFrequency.MONTHLY:
      return amount;
    case RecurringFrequency.QUARTERLY:
      return amount / 3;
    case RecurringFrequency.YEARLY:
      return amount / 12;
    default:
      return amount;
  }
}

function subscriptionScopeKey(normalizedMerchant: string, bankAccountId: string | null) {
  return `${normalizedMerchant}::${bankAccountId ?? "no-account"}`;
}

function serializeSubscription(
  subscription: Prisma.DetectedSubscriptionGetPayload<{
    include: {
      bankAccount: { select: { id: true; name: true; type: true; color: true; icon: true } };
      charges: {
        include: {
          transaction: { select: { id: true; description: true; amount: true; date: true } };
        };
      };
    };
  }>,
) {
  const brand = getSubscriptionBrandByKey(subscription.brandKey);
  const charges = [...subscription.charges]
    .sort((left, right) => right.transaction.date.getTime() - left.transaction.date.getTime())
    .map((charge) => ({
      id: charge.id,
      matchedBy: charge.matchedBy,
      confidence: charge.confidence,
      transaction: {
        id: charge.transaction.id,
        description: charge.transaction.description,
        amount: Number(charge.transaction.amount),
        date: charge.transaction.date.toISOString(),
      },
    }));

  return {
    id: subscription.id,
    brandKey: subscription.brandKey,
    displayName: subscription.displayName,
    normalizedMerchant: subscription.normalizedMerchant,
    sourceMerchantRaw: subscription.sourceMerchantRaw,
    logoSlug: subscription.logoSlug,
    logoPath: brand?.logoPath ?? null,
    themeColor: brand?.themeColor ?? null,
    status: subscription.status,
    billingFrequency: subscription.billingFrequency,
    confidence: subscription.confidence,
    isUserConfirmed: subscription.isUserConfirmed,
    isHidden: subscription.isHidden,
    estimatedNextChargeAt: subscription.estimatedNextChargeAt?.toISOString() ?? null,
    lastChargeAt: subscription.lastChargeAt?.toISOString() ?? null,
    lastAmount: subscription.lastAmount ? Number(subscription.lastAmount) : null,
    averageAmount: subscription.averageAmount ? Number(subscription.averageAmount) : null,
    currency: subscription.currency,
    bankAccountId: subscription.bankAccountId,
    bankAccountName: subscription.bankAccount?.name ?? null,
    bankAccountType: subscription.bankAccount?.type ?? null,
    whyDetected: subscription.whyDetected,
    matchedSignals: stringArrayFromJson(subscription.matchedSignals),
    metadata: subscription.metadata,
    charges,
    openTransactionsHref: `/caixa?search=${encodeURIComponent(subscription.sourceMerchantRaw ?? subscription.displayName)}`,
  };
}

function summarizeSubscriptions(
  subscriptions: Prisma.DetectedSubscriptionGetPayload<{
    include: { bankAccount: { select: { id: true; name: true; type: true; color: true; icon: true } }; charges: { include: { transaction: { select: { id: true; description: true; amount: true; date: true } } } } };
  }>[],
) {
  const visible = subscriptions.filter((subscription) => !subscription.isHidden);
  const totalMonthly = visible.reduce(
    (sum, subscription) => sum + monthlyAmountForFrequency(subscription.lastAmount ? Number(subscription.lastAmount) : null, subscription.billingFrequency),
    0,
  );

  return {
    totalMonthly,
    activeCount: visible.filter((subscription) => subscription.status === DetectedSubscriptionStatus.ACTIVE).length,
    possibleCount: visible.filter((subscription) => subscription.status === DetectedSubscriptionStatus.POSSIBLE).length,
    priceChangedCount: visible.filter((subscription) => subscription.status === DetectedSubscriptionStatus.PRICE_CHANGED).length,
    duplicateCount: visible.filter((subscription) => subscription.status === DetectedSubscriptionStatus.DUPLICATE_SUSPECTED).length,
    inactiveCount: visible.filter((subscription) => subscription.status === DetectedSubscriptionStatus.INACTIVE).length,
    potentialCutMonthly: visible
      .filter((subscription) => CUT_CANDIDATE_STATUSES.includes(subscription.status))
      .reduce(
        (sum, subscription) => sum + monthlyAmountForFrequency(subscription.lastAmount ? Number(subscription.lastAmount) : null, subscription.billingFrequency),
        0,
      ),
  };
}

export async function syncDetectedSubscriptions() {
  const ctx = await requireWriteContext();

  const [transactions, recurringTransactions, merchantMemories, existingSubscriptions] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
        type: "EXPENSE",
        status: "COMPLETED",
        ignoreInTotals: false,
      },
      include: {
        bankAccount: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { date: "desc" },
      take: 600,
    }),
    prisma.recurringTransaction.findMany({
      where: {
        householdId: ctx.householdId ?? undefined,
      },
      orderBy: { nextDate: "asc" },
    }),
    prisma.merchantMemory.findMany({
      where: scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
      orderBy: { lastUsedAt: "desc" },
      take: 200,
    }),
    prisma.detectedSubscription.findMany({
      where: scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
      select: { id: true, normalizedMerchant: true, bankAccountId: true, isUserConfirmed: true, isHidden: true },
    }),
  ]);

  const candidates = detectSubscriptions({
    transactions: transactions.map((transaction) => ({
      id: transaction.id,
      description: transaction.description,
      amount: Number(transaction.amount),
      date: transaction.date,
      bankAccountId: transaction.bankAccountId,
      bankAccountName: transaction.bankAccount.name,
      bankAccountType: transaction.bankAccount.type,
    })),
    recurringTransactions: recurringTransactions.map((transaction) => ({
      id: transaction.id,
      description: transaction.description,
      amount: Number(transaction.amount),
      frequency: transaction.frequency,
      bankAccountId: transaction.bankAccountId,
      active: transaction.active,
    })),
    merchantMemories: merchantMemories.map((memory) => ({
      merchantName: memory.merchantName,
      bankAccountId: memory.bankAccountId,
    })),
  });

  const existingByScope = new Map(
    existingSubscriptions.map((subscription) => [subscriptionScopeKey(subscription.normalizedMerchant, subscription.bankAccountId), subscription]),
  );
  const touchedIds = new Set<string>();

  for (const candidate of candidates) {
    const existing = existingByScope.get(subscriptionScopeKey(candidate.normalizedMerchant, candidate.bankAccountId));
    const persisted = existing
      ? await prisma.detectedSubscription.update({
          where: { id: existing.id },
          data: {
            brandKey: candidate.brandKey,
            displayName: candidate.displayName,
            sourceMerchantRaw: candidate.sourceMerchantRaw,
            logoSlug: candidate.logoSlug,
            status: existing.isHidden ? DetectedSubscriptionStatus.HIDDEN : candidate.status,
            billingFrequency: candidate.billingFrequency,
            confidence: candidate.confidence,
            estimatedNextChargeAt: candidate.estimatedNextChargeAt,
            lastChargeAt: candidate.lastChargeAt,
            lastAmount: candidate.lastAmount,
            averageAmount: candidate.averageAmount,
            currency: candidate.currency,
            recurringTransactionId: candidate.recurringTransactionId,
            whyDetected: candidate.whyDetected,
            matchedSignals: candidate.matchedSignals,
            metadata: jsonInput(candidate.metadata),
          },
        })
      : await prisma.detectedSubscription.create({
          data: {
            userId: ctx.id,
            householdId: ctx.householdId,
            brandKey: candidate.brandKey,
            displayName: candidate.displayName,
            normalizedMerchant: candidate.normalizedMerchant,
            sourceMerchantRaw: candidate.sourceMerchantRaw,
            logoSlug: candidate.logoSlug,
            status: candidate.status,
            billingFrequency: candidate.billingFrequency,
            confidence: candidate.confidence,
            estimatedNextChargeAt: candidate.estimatedNextChargeAt,
            lastChargeAt: candidate.lastChargeAt,
            lastAmount: candidate.lastAmount,
            averageAmount: candidate.averageAmount,
            currency: candidate.currency,
            bankAccountId: candidate.bankAccountId,
            recurringTransactionId: candidate.recurringTransactionId,
            whyDetected: candidate.whyDetected,
            matchedSignals: candidate.matchedSignals,
            metadata: jsonInput(candidate.metadata),
          },
        });

    touchedIds.add(persisted.id);

    await prisma.subscriptionCharge.deleteMany({
      where: { subscriptionId: persisted.id },
    });

    if (candidate.charges.length > 0) {
      await prisma.subscriptionCharge.createMany({
        data: candidate.charges.map((charge) => ({
          subscriptionId: persisted.id,
          transactionId: charge.transactionId,
          householdId: ctx.householdId,
          userId: ctx.id,
          matchedBy: charge.matchedBy,
          confidence: charge.confidence,
        })),
      });
    }
  }

  const staleSubscriptionIds = existingSubscriptions
    .filter((subscription) => !touchedIds.has(subscription.id) && !subscription.isHidden)
    .map((subscription) => subscription.id);

  if (staleSubscriptionIds.length > 0) {
    await prisma.detectedSubscription.updateMany({
      where: { id: { in: staleSubscriptionIds } },
      data: { status: DetectedSubscriptionStatus.INACTIVE },
    });
  }

  revalidatePath("/assinaturas");
  revalidatePath("/buscar");
  return { success: true, count: candidates.length };
}

export async function getDetectedSubscriptions(filters?: unknown) {
  const ctx = await requireWriteContext();
  const parsed = SubscriptionListFiltersSchema.safeParse(filters ?? {});
  if (!parsed.success) {
    return { data: [], summary: summarizeSubscriptions([]) };
  }

  const { search, status, includeHidden } = parsed.data;

  const subscriptions = await prisma.detectedSubscription.findMany({
    where: {
      ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
      ...(status ? { status } : {}),
      ...(includeHidden ? {} : { isHidden: false }),
    },
    include: {
      bankAccount: { select: { id: true, name: true, type: true, color: true, icon: true } },
      charges: {
        include: {
          transaction: {
            select: {
              id: true,
              description: true,
              amount: true,
              date: true,
            },
          },
        },
      },
    },
    orderBy: [{ status: "asc" }, { lastChargeAt: "desc" }],
  });

  const filtered = search
    ? subscriptions.filter((subscription) => {
        return merchantMatchesQuery(subscription.displayName, search)
          || merchantMatchesQuery(subscription.normalizedMerchant, search)
          || merchantMatchesQuery(subscription.sourceMerchantRaw, search)
          || merchantMatchesQuery(subscription.bankAccount?.name, search);
      })
    : subscriptions;

  return {
    data: filtered.map(serializeSubscription),
    summary: summarizeSubscriptions(filtered),
  };
}

export async function getSubscriptionsPageData(filters?: unknown) {
  const initial = await getDetectedSubscriptions(filters);
  if (initial.data.length > 0) return initial;

  await syncDetectedSubscriptions();
  return getDetectedSubscriptions(filters);
}

export async function confirmDetectedSubscription(id: string) {
  const ctx = await requireWriteContext();
  requireWriteRole(ctx.role);

  await prisma.detectedSubscription.updateMany({
    where: { id, ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }) },
    data: {
      isUserConfirmed: true,
      isHidden: false,
      status: DetectedSubscriptionStatus.ACTIVE,
    },
  });

  revalidatePath("/assinaturas");
  revalidatePath("/buscar");
  return { success: true };
}

export async function hideDetectedSubscription(id: string) {
  const ctx = await requireWriteContext();
  requireWriteRole(ctx.role);

  await prisma.detectedSubscription.updateMany({
    where: { id, ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }) },
    data: {
      isHidden: true,
      status: DetectedSubscriptionStatus.HIDDEN,
    },
  });

  revalidatePath("/assinaturas");
  revalidatePath("/buscar");
  return { success: true };
}
