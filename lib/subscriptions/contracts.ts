import { DetectedSubscriptionStatus, RecurringFrequency } from "@prisma/client";

export type SubscriptionChargeView = {
  id: string;
  matchedBy: string;
  confidence: number;
  transaction: {
    id: string;
    description: string | null;
    amount: number;
    date: string;
  };
};

export type DetectedSubscriptionView = {
  id: string;
  brandKey: string | null;
  displayName: string;
  normalizedMerchant: string;
  sourceMerchantRaw: string | null;
  logoSlug: string | null;
  logoPath: string | null;
  themeColor: string | null;
  status: DetectedSubscriptionStatus;
  billingFrequency: RecurringFrequency;
  confidence: number;
  isUserConfirmed: boolean;
  isHidden: boolean;
  estimatedNextChargeAt: string | null;
  lastChargeAt: string | null;
  lastAmount: number | null;
  averageAmount: number | null;
  currency: string | null;
  bankAccountId: string | null;
  bankAccountName: string | null;
  bankAccountType: string | null;
  whyDetected: string | null;
  matchedSignals: string[];
  metadata: unknown;
  charges: SubscriptionChargeView[];
  openTransactionsHref: string;
};

export type DetectedSubscriptionSummary = {
  totalMonthly: number;
  activeCount: number;
  possibleCount: number;
  priceChangedCount: number;
  duplicateCount: number;
  inactiveCount: number;
  potentialCutMonthly: number;
};
