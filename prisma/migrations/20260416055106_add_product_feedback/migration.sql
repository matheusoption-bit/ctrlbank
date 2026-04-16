/*
  Warnings:

  - A unique constraint covering the columns `[aiCaptureEventId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "VisibilityScope" AS ENUM ('PERSONAL', 'HOUSEHOLD');

-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "aiCaptureEventId" TEXT;

-- CreateTable
CREATE TABLE "ProductFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "householdId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'composer',
    "rawInput" TEXT NOT NULL,
    "normalizedTitle" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "priorityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reproductionSteps" JSONB,
    "suggestedSolution" TEXT,
    "acceptanceCriteria" JSONB,
    "status" TEXT NOT NULL DEFAULT 'new',
    "relatedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackArtifact" (
    "id" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "url" TEXT,
    "content" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiCaptureEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "householdId" TEXT,
    "captureGroupId" TEXT,
    "source" TEXT NOT NULL,
    "inputType" TEXT NOT NULL,
    "rawText" TEXT,
    "normalizedDraft" JSONB,
    "confidenceOverall" DOUBLE PRECISION NOT NULL,
    "decision" TEXT NOT NULL,
    "createdTransactionId" TEXT,
    "wasUndone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiCaptureEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantMemory" (
    "id" TEXT NOT NULL,
    "householdId" TEXT,
    "userId" TEXT NOT NULL,
    "merchantName" TEXT NOT NULL,
    "categoryId" TEXT,
    "bankAccountId" TEXT,
    "correctedCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerchantMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiConversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "householdId" TEXT,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "inputType" TEXT NOT NULL DEFAULT 'text',
    "content" TEXT NOT NULL,
    "audioDurationMs" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "householdId" TEXT,
    "visibility" "VisibilityScope" NOT NULL DEFAULT 'PERSONAL',
    "title" TEXT NOT NULL,
    "objectiveType" TEXT NOT NULL,
    "targetAmount" DECIMAL(15,2),
    "targetDate" TIMESTAMP(3),
    "targetMonths" INTEGER,
    "monthlyRequiredAmount" DECIMAL(15,2),
    "summary" TEXT NOT NULL,
    "recommendedCuts" JSONB,
    "scenarioData" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanProgressSnapshot" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "currentAmount" DECIMAL(15,2) NOT NULL,
    "progressPercentage" DOUBLE PRECISION NOT NULL,
    "projectedCompletion" TIMESTAMP(3),
    "isOnTrack" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanProgressSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiRecommendation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "householdId" TEXT,
    "visibility" "VisibilityScope" NOT NULL DEFAULT 'PERSONAL',
    "relatedPlanId" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionLabel" TEXT,
    "actionTarget" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isDismissed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiCaptureEvent_captureGroupId_idx" ON "AiCaptureEvent"("captureGroupId");

-- CreateIndex
CREATE INDEX "MerchantMemory_householdId_idx" ON "MerchantMemory"("householdId");

-- CreateIndex
CREATE INDEX "MerchantMemory_userId_idx" ON "MerchantMemory"("userId");

-- CreateIndex
CREATE INDEX "AiConversation_userId_idx" ON "AiConversation"("userId");

-- CreateIndex
CREATE INDEX "AiConversation_householdId_idx" ON "AiConversation"("householdId");

-- CreateIndex
CREATE INDEX "AiMessage_conversationId_idx" ON "AiMessage"("conversationId");

-- CreateIndex
CREATE INDEX "FinancialPlan_userId_idx" ON "FinancialPlan"("userId");

-- CreateIndex
CREATE INDEX "FinancialPlan_householdId_idx" ON "FinancialPlan"("householdId");

-- CreateIndex
CREATE INDEX "PlanProgressSnapshot_planId_idx" ON "PlanProgressSnapshot"("planId");

-- CreateIndex
CREATE INDEX "AiRecommendation_userId_idx" ON "AiRecommendation"("userId");

-- CreateIndex
CREATE INDEX "AiRecommendation_householdId_idx" ON "AiRecommendation"("householdId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_aiCaptureEventId_key" ON "Transaction"("aiCaptureEventId");

-- AddForeignKey
ALTER TABLE "ProductFeedback" ADD CONSTRAINT "ProductFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFeedback" ADD CONSTRAINT "ProductFeedback_relatedToId_fkey" FOREIGN KEY ("relatedToId") REFERENCES "ProductFeedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackArtifact" ADD CONSTRAINT "FeedbackArtifact_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "ProductFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_aiCaptureEventId_fkey" FOREIGN KEY ("aiCaptureEventId") REFERENCES "AiCaptureEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiCaptureEvent" ADD CONSTRAINT "AiCaptureEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiCaptureEvent" ADD CONSTRAINT "AiCaptureEvent_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantMemory" ADD CONSTRAINT "MerchantMemory_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantMemory" ADD CONSTRAINT "MerchantMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantMemory" ADD CONSTRAINT "MerchantMemory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantMemory" ADD CONSTRAINT "MerchantMemory_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialPlan" ADD CONSTRAINT "FinancialPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialPlan" ADD CONSTRAINT "FinancialPlan_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanProgressSnapshot" ADD CONSTRAINT "PlanProgressSnapshot_planId_fkey" FOREIGN KEY ("planId") REFERENCES "FinancialPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiRecommendation" ADD CONSTRAINT "AiRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiRecommendation" ADD CONSTRAINT "AiRecommendation_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
