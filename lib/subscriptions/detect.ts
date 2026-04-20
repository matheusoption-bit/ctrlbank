import { DetectedSubscriptionStatus, RecurringFrequency } from "@prisma/client";
import { resolveSubscriptionBrand } from "@/lib/brands/subscriptions";
import { normalizeSubscriptionMerchant } from "@/lib/subscriptions/normalize";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

type DetectableTransaction = {
  id: string;
  description: string | null;
  amount: number;
  date: Date;
  bankAccountId: string;
  bankAccountName: string;
  bankAccountType: string;
};

type DetectableRecurringTransaction = {
  id: string;
  description: string | null;
  amount: number;
  frequency: RecurringFrequency;
  bankAccountId: string;
  active: boolean;
};

type DetectableMerchantMemory = {
  merchantName: string;
  bankAccountId: string | null;
};

export type SubscriptionChargeCandidate = {
  transactionId: string;
  matchedBy: string;
  confidence: number;
};

export type DetectedSubscriptionCandidate = {
  brandKey: string | null;
  displayName: string;
  normalizedMerchant: string;
  sourceMerchantRaw: string | null;
  logoSlug: string | null;
  logoPath: string | null;
  status: DetectedSubscriptionStatus;
  billingFrequency: RecurringFrequency;
  confidence: number;
  estimatedNextChargeAt: Date | null;
  lastChargeAt: Date | null;
  lastAmount: number | null;
  averageAmount: number | null;
  currency: string | null;
  bankAccountId: string | null;
  bankAccountName: string | null;
  whyDetected: string;
  matchedSignals: string[];
  metadata: Record<string, unknown>;
  recurringTransactionId: string | null;
  charges: SubscriptionChargeCandidate[];
};

export type DetectSubscriptionsInput = {
  transactions: DetectableTransaction[];
  recurringTransactions: DetectableRecurringTransaction[];
  merchantMemories: DetectableMerchantMemory[];
  now?: Date;
};

function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function amountVariationRatio(values: number[]) {
  if (values.length <= 1) return 0;
  const max = Math.max(...values);
  const min = Math.min(...values);
  if (max === 0) return 0;
  return (max - min) / max;
}

function inferFrequency(avgIntervalDays: number): RecurringFrequency | null {
  if (avgIntervalDays >= 1 && avgIntervalDays <= 2) return RecurringFrequency.DAILY;
  if (avgIntervalDays >= 5 && avgIntervalDays <= 10) return RecurringFrequency.WEEKLY;
  if (avgIntervalDays >= 11 && avgIntervalDays <= 18) return RecurringFrequency.BIWEEKLY;
  if (avgIntervalDays >= 25 && avgIntervalDays <= 38) return RecurringFrequency.MONTHLY;
  if (avgIntervalDays >= 70 && avgIntervalDays <= 110) return RecurringFrequency.QUARTERLY;
  if (avgIntervalDays >= 330 && avgIntervalDays <= 400) return RecurringFrequency.YEARLY;
  return null;
}

function expectedIntervalForFrequency(frequency: RecurringFrequency) {
  switch (frequency) {
    case RecurringFrequency.DAILY:
      return 1;
    case RecurringFrequency.WEEKLY:
      return 7;
    case RecurringFrequency.BIWEEKLY:
      return 14;
    case RecurringFrequency.MONTHLY:
      return 30;
    case RecurringFrequency.QUARTERLY:
      return 90;
    case RecurringFrequency.YEARLY:
      return 365;
    default:
      return 30;
  }
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_IN_MS);
}

function intervalConsistency(intervals: number[], expectedInterval: number) {
  if (intervals.length === 0) return 0;
  const averageDeviation = average(intervals.map((interval) => Math.abs(interval - expectedInterval)));
  return Math.max(0, 1 - averageDeviation / Math.max(expectedInterval, 1));
}

function titleizeMerchant(merchant: string) {
  return merchant
    .split(" ")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function countDuplicateCharges(transactions: DetectableTransaction[], expectedInterval: number) {
  if (transactions.length <= 1) return 0;

  const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
  let duplicates = 0;

  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];
    const deltaDays = Math.abs(current.date.getTime() - previous.date.getTime()) / DAY_IN_MS;
    const sameWindow = expectedInterval >= 25
      ? previous.date.getUTCMonth() === current.date.getUTCMonth()
        && previous.date.getUTCFullYear() === current.date.getUTCFullYear()
      : deltaDays <= Math.max(2, expectedInterval / 3);

    const similarAmount = Math.abs(current.amount - previous.amount) <= Math.max(current.amount, previous.amount) * 0.08;
    if (sameWindow && similarAmount) {
      duplicates += 1;
    }
  }

  return duplicates;
}

function recurringMatch(
  normalizedMerchant: string,
  bankAccountId: string,
  recurringTransactions: DetectableRecurringTransaction[],
) {
  return recurringTransactions.find((item) => {
    if (!item.active) return false;
    if (item.bankAccountId !== bankAccountId) return false;

    const normalizedDescription = normalizeSubscriptionMerchant(item.description);
    return normalizedDescription === normalizedMerchant || normalizedDescription.includes(normalizedMerchant) || normalizedMerchant.includes(normalizedDescription);
  }) ?? null;
}

function memoryMatch(
  normalizedMerchant: string,
  bankAccountId: string,
  merchantMemories: DetectableMerchantMemory[],
) {
  return merchantMemories.find((memory) => {
    const normalizedMemory = normalizeSubscriptionMerchant(memory.merchantName);
    const accountCompatible = !memory.bankAccountId || memory.bankAccountId === bankAccountId;
    return accountCompatible && (normalizedMemory === normalizedMerchant || normalizedMerchant.includes(normalizedMemory));
  }) ?? null;
}

function buildWhyDetected(params: {
  occurrences: number;
  billingFrequency: RecurringFrequency;
  status: DetectedSubscriptionStatus;
  brandMatched: boolean;
  recurringMatched: boolean;
  duplicateCharges: number;
  priceChanged: boolean;
}) {
  const reasons = [
    `${params.occurrences} cobranças semelhantes encontradas`,
    `cadência estimada ${params.billingFrequency.toLowerCase()}`,
  ];

  if (params.brandMatched) reasons.push("merchant reconciliado com registry de marcas");
  if (params.recurringMatched) reasons.push("padrão reforçado por recorrência já cadastrada");
  if (params.priceChanged) reasons.push("variação material de preço detectada");
  if (params.duplicateCharges > 0) reasons.push("múltiplas cobranças semelhantes no mesmo ciclo");
  if (params.status === DetectedSubscriptionStatus.INACTIVE) reasons.push("cobrança ausente além da janela esperada");

  return reasons.join("; ");
}

export function detectSubscriptions({
  transactions,
  recurringTransactions,
  merchantMemories,
  now = new Date(),
}: DetectSubscriptionsInput): DetectedSubscriptionCandidate[] {
  const groups = new Map<string, DetectableTransaction[]>();

  for (const transaction of transactions) {
    const normalizedMerchant = normalizeSubscriptionMerchant(transaction.description);
    if (!normalizedMerchant) continue;

    const groupKey = `${transaction.bankAccountId}:${normalizedMerchant}`;
    const currentGroup = groups.get(groupKey) ?? [];
    currentGroup.push(transaction);
    groups.set(groupKey, currentGroup);
  }

  const candidates: DetectedSubscriptionCandidate[] = [];

  for (const [, merchantTransactions] of groups.entries()) {
    if (merchantTransactions.length < 2) continue;

    const sorted = [...merchantTransactions].sort((a, b) => a.date.getTime() - b.date.getTime());
    const normalizedMerchant = normalizeSubscriptionMerchant(sorted[0]?.description);
    const bankAccountId = sorted[0]?.bankAccountId ?? null;
    const bankAccountName = sorted[0]?.bankAccountName ?? null;
    const amounts = sorted.map((item) => item.amount);
    const intervals = sorted.slice(1).map((item, index) => {
      const previous = sorted[index];
      return Math.round((item.date.getTime() - previous.date.getTime()) / DAY_IN_MS);
    });

    const avgInterval = average(intervals);
    const recurring = bankAccountId
      ? recurringMatch(normalizedMerchant, bankAccountId, recurringTransactions)
      : null;
    const memory = bankAccountId
      ? memoryMatch(normalizedMerchant, bankAccountId, merchantMemories)
      : null;
    const inferredFrequency = inferFrequency(avgInterval) ?? recurring?.frequency ?? null;

    if (!inferredFrequency) continue;

    const expectedInterval = expectedIntervalForFrequency(inferredFrequency);
    const recurrenceScore = intervalConsistency(intervals, expectedInterval);
    const amountVariation = amountVariationRatio(amounts);
    const amountStability = Math.max(0, 1 - amountVariation);
    const duplicateCharges = countDuplicateCharges(sorted, expectedInterval);
    const lastTransaction = sorted.at(-1) ?? null;
    const lastChargeAt = lastTransaction?.date ?? null;
    const estimatedNextChargeAt = lastChargeAt ? addDays(lastChargeAt, expectedInterval) : null;
    const lastAmount = lastTransaction?.amount ?? null;
    const averageAmount = amounts.length > 0 ? round(average(amounts)) : null;
    const brand = resolveSubscriptionBrand(lastTransaction?.description ?? normalizedMerchant);
    const priceChanged = amountVariation >= 0.12;
    const missingForLong = Boolean(lastChargeAt && now.getTime() - lastChargeAt.getTime() > expectedInterval * DAY_IN_MS * 1.75);

    if (merchantTransactions.length < 3 && recurrenceScore < 0.55) {
      continue;
    }

    let status: DetectedSubscriptionStatus = DetectedSubscriptionStatus.POSSIBLE;
    if (merchantTransactions.length >= 3 && recurrenceScore >= 0.65) {
      status = DetectedSubscriptionStatus.ACTIVE;
    }
    if (priceChanged) {
      status = DetectedSubscriptionStatus.PRICE_CHANGED;
    }
    if (duplicateCharges > 0) {
      status = DetectedSubscriptionStatus.DUPLICATE_SUSPECTED;
    }
    if (missingForLong) {
      status = DetectedSubscriptionStatus.INACTIVE;
    }

    const confidence = Math.min(
      0.99,
      round(
        0.28
          + Math.min(merchantTransactions.length, 4) * 0.1
          + recurrenceScore * 0.24
          + amountStability * 0.16
          + (brand ? 0.1 : 0)
          + (memory ? 0.05 : 0)
          + (recurring ? 0.07 : 0),
        3,
      ),
    );

    const matchedSignals = [
      `occurrences:${merchantTransactions.length}`,
      `recurrence-score:${round(recurrenceScore, 3)}`,
      `amount-variation:${round(amountVariation, 3)}`,
      `billing-frequency:${inferredFrequency}`,
      ...(brand ? [`brand:${brand.brandKey}`] : []),
      ...(memory ? ["merchant-memory"] : []),
      ...(recurring ? ["recurring-transaction"] : []),
      ...(duplicateCharges > 0 ? [`duplicate-charges:${duplicateCharges}`] : []),
      ...(missingForLong ? ["inactive-window"] : []),
    ];

    candidates.push({
      brandKey: brand?.brandKey ?? null,
      displayName: brand?.displayName ?? titleizeMerchant(normalizedMerchant),
      normalizedMerchant,
      sourceMerchantRaw: lastTransaction?.description ?? null,
      logoSlug: brand?.brandKey ?? null,
      logoPath: brand?.logoPath ?? null,
      status,
      billingFrequency: inferredFrequency,
      confidence,
      estimatedNextChargeAt,
      lastChargeAt,
      lastAmount,
      averageAmount,
      currency: "BRL",
      bankAccountId,
      bankAccountName,
      whyDetected: buildWhyDetected({
        occurrences: merchantTransactions.length,
        billingFrequency: inferredFrequency,
        status,
        brandMatched: Boolean(brand),
        recurringMatched: Boolean(recurring),
        duplicateCharges,
        priceChanged,
      }),
      matchedSignals,
      metadata: {
        transactionIds: sorted.map((item) => item.id),
        avgIntervalDays: round(avgInterval, 2),
        expectedIntervalDays: expectedInterval,
        amountVariationRatio: round(amountVariation, 4),
        duplicateCharges,
        recurrenceScore: round(recurrenceScore, 4),
        bankAccountType: sorted[0]?.bankAccountType ?? null,
      },
      recurringTransactionId: recurring?.id ?? null,
      charges: sorted.map((transaction) => ({
        transactionId: transaction.id,
        matchedBy: recurring ? "merchant+recurring" : brand ? "merchant+brand" : "merchant",
        confidence,
      })),
    });
  }

  return candidates.sort((left, right) => {
    if (left.status !== right.status) {
      return left.status.localeCompare(right.status);
    }

    return (right.lastChargeAt?.getTime() ?? 0) - (left.lastChargeAt?.getTime() ?? 0);
  });
}
