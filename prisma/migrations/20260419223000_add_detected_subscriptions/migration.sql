CREATE TYPE "DetectedSubscriptionStatus" AS ENUM ('ACTIVE', 'POSSIBLE', 'PRICE_CHANGED', 'DUPLICATE_SUSPECTED', 'INACTIVE', 'HIDDEN');

CREATE TABLE "DetectedSubscription" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "householdId" TEXT,
  "brandKey" TEXT,
  "displayName" TEXT NOT NULL,
  "normalizedMerchant" TEXT NOT NULL,
  "sourceMerchantRaw" TEXT,
  "logoSlug" TEXT,
  "status" "DetectedSubscriptionStatus" NOT NULL DEFAULT 'POSSIBLE',
  "billingFrequency" "RecurringFrequency" NOT NULL,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isUserConfirmed" BOOLEAN NOT NULL DEFAULT false,
  "isHidden" BOOLEAN NOT NULL DEFAULT false,
  "estimatedNextChargeAt" TIMESTAMP(3),
  "lastChargeAt" TIMESTAMP(3),
  "lastAmount" DECIMAL(15,2),
  "averageAmount" DECIMAL(15,2),
  "currency" TEXT,
  "bankAccountId" TEXT,
  "recurringTransactionId" TEXT,
  "whyDetected" TEXT,
  "matchedSignals" JSONB,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DetectedSubscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SubscriptionCharge" (
  "id" TEXT NOT NULL,
  "subscriptionId" TEXT NOT NULL,
  "transactionId" TEXT NOT NULL,
  "householdId" TEXT,
  "userId" TEXT,
  "matchedBy" TEXT NOT NULL,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SubscriptionCharge_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DetectedSubscription_scope_key" ON "DetectedSubscription"("householdId", "normalizedMerchant", "bankAccountId");
CREATE UNIQUE INDEX "DetectedSubscription_user_scope_key" ON "DetectedSubscription"("userId", "normalizedMerchant", "bankAccountId");
CREATE INDEX "DetectedSubscription_householdId_status_idx" ON "DetectedSubscription"("householdId", "status");
CREATE INDEX "DetectedSubscription_userId_status_idx" ON "DetectedSubscription"("userId", "status");
CREATE INDEX "DetectedSubscription_normalizedMerchant_idx" ON "DetectedSubscription"("normalizedMerchant");
CREATE INDEX "DetectedSubscription_bankAccountId_idx" ON "DetectedSubscription"("bankAccountId");
CREATE INDEX "DetectedSubscription_estimatedNextChargeAt_idx" ON "DetectedSubscription"("estimatedNextChargeAt");
CREATE UNIQUE INDEX "SubscriptionCharge_subscriptionId_transactionId_key" ON "SubscriptionCharge"("subscriptionId", "transactionId");
CREATE INDEX "SubscriptionCharge_householdId_createdAt_idx" ON "SubscriptionCharge"("householdId", "createdAt");
CREATE INDEX "SubscriptionCharge_userId_createdAt_idx" ON "SubscriptionCharge"("userId", "createdAt");

ALTER TABLE "DetectedSubscription" ADD CONSTRAINT "DetectedSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DetectedSubscription" ADD CONSTRAINT "DetectedSubscription_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DetectedSubscription" ADD CONSTRAINT "DetectedSubscription_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DetectedSubscription" ADD CONSTRAINT "DetectedSubscription_recurringTransactionId_fkey" FOREIGN KEY ("recurringTransactionId") REFERENCES "RecurringTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SubscriptionCharge" ADD CONSTRAINT "SubscriptionCharge_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "DetectedSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubscriptionCharge" ADD CONSTRAINT "SubscriptionCharge_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubscriptionCharge" ADD CONSTRAINT "SubscriptionCharge_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubscriptionCharge" ADD CONSTRAINT "SubscriptionCharge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
