-- Wave 2: Stabilization / Financial Data System
CREATE TYPE "SourceChannel" AS ENUM ('MANUAL', 'EMAIL', 'WHATSAPP', 'IMPORT', 'COMPOSER', 'API');
CREATE TYPE "SourceType" AS ENUM ('TEXT', 'IMAGE', 'PDF', 'CSV', 'OFX', 'AUDIO', 'RAW_TEXT');
CREATE TYPE "IngestionStage" AS ENUM ('RECEIVED', 'EXTRACTING', 'EXTRACTED', 'PARSING', 'PARSED', 'NORMALIZING', 'NORMALIZED', 'REVIEW_REQUIRED', 'COMMITTING', 'COMMITTED', 'FAILED', 'DUPLICATE_SKIPPED');
CREATE TYPE "IngestionStatus" AS ENUM ('STARTED', 'SUCCESS', 'ERROR', 'SKIPPED');
CREATE TYPE "QualityFlagCode" AS ENUM ('DUPLICATE_SUSPECTED', 'DUPLICATE_CONFIRMED', 'OUTLIER_AMOUNT', 'CATEGORY_CONFLICT', 'ACCOUNT_MISSING', 'OCR_LOW_CONFIDENCE', 'REVIEW_REQUIRED');
CREATE TYPE "QualityFlagSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "QualityFlagStatus" AS ENUM ('OPEN', 'RESOLVED', 'DISMISSED');
CREATE TYPE "ReviewState" AS ENUM ('NOT_REQUIRED', 'REQUIRED', 'APPROVED', 'REJECTED');
CREATE TYPE "TaintLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

CREATE TABLE "SourceDocument" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "householdId" TEXT,
  "correlationId" TEXT,
  "sourceChannel" "SourceChannel" NOT NULL,
  "sourceType" "SourceType" NOT NULL,
  "mimeType" TEXT,
  "originalName" TEXT,
  "sizeBytes" INTEGER,
  "sha256" TEXT NOT NULL,
  "contentHash" TEXT,
  "storageRef" TEXT,
  "extractionMethod" TEXT,
  "parserVersion" TEXT,
  "taintLevel" "TaintLevel",
  "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SourceDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "IngestionLog" (
  "id" TEXT NOT NULL,
  "correlationId" TEXT NOT NULL,
  "sourceDocumentId" TEXT,
  "aiCaptureEventId" TEXT,
  "transactionId" TEXT,
  "householdId" TEXT,
  "userId" TEXT,
  "stage" "IngestionStage" NOT NULL,
  "status" "IngestionStatus" NOT NULL,
  "channel" TEXT,
  "actorType" TEXT,
  "actorId" TEXT,
  "errorCode" TEXT,
  "errorMessage" TEXT,
  "metadata" JSONB,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "startedAt" TIMESTAMP(3),
  "finishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "IngestionLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TransactionQualityFlag" (
  "id" TEXT NOT NULL,
  "transactionId" TEXT,
  "aiCaptureEventId" TEXT,
  "sourceDocumentId" TEXT,
  "householdId" TEXT,
  "code" "QualityFlagCode" NOT NULL,
  "severity" "QualityFlagSeverity" NOT NULL,
  "status" "QualityFlagStatus" NOT NULL DEFAULT 'OPEN',
  "metadata" JSONB,
  "resolvedAt" TIMESTAMP(3),
  "resolvedByUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TransactionQualityFlag_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "AiCaptureEvent"
  ADD COLUMN "sourceDocumentId" TEXT,
  ADD COLUMN "correlationId" TEXT,
  ADD COLUMN "processingStage" "IngestionStage",
  ADD COLUMN "reviewState" "ReviewState" DEFAULT 'NOT_REQUIRED',
  ADD COLUMN "decisionReason" TEXT,
  ADD COLUMN "provider" TEXT,
  ADD COLUMN "model" TEXT,
  ADD COLUMN "tokensIn" INTEGER,
  ADD COLUMN "tokensOut" INTEGER,
  ADD COLUMN "latencyMs" INTEGER,
  ADD COLUMN "taintLevel" "TaintLevel",
  ADD COLUMN "sealedPayload" TEXT,
  ADD COLUMN "signature" TEXT,
  ADD COLUMN "signatureKeyId" TEXT,
  ADD COLUMN "prevHash" TEXT,
  ADD COLUMN "parserVersion" TEXT,
  ADD COLUMN "normalizerVersion" TEXT;

CREATE INDEX "SourceDocument_householdId_sha256_idx" ON "SourceDocument"("householdId", "sha256");
CREATE INDEX "SourceDocument_userId_sha256_idx" ON "SourceDocument"("userId", "sha256");
CREATE INDEX "SourceDocument_correlationId_idx" ON "SourceDocument"("correlationId");
CREATE INDEX "IngestionLog_correlationId_createdAt_idx" ON "IngestionLog"("correlationId", "createdAt");
CREATE INDEX "IngestionLog_sourceDocumentId_idx" ON "IngestionLog"("sourceDocumentId");
CREATE INDEX "IngestionLog_aiCaptureEventId_idx" ON "IngestionLog"("aiCaptureEventId");
CREATE INDEX "TransactionQualityFlag_transactionId_idx" ON "TransactionQualityFlag"("transactionId");
CREATE INDEX "TransactionQualityFlag_aiCaptureEventId_idx" ON "TransactionQualityFlag"("aiCaptureEventId");
CREATE INDEX "TransactionQualityFlag_sourceDocumentId_idx" ON "TransactionQualityFlag"("sourceDocumentId");
CREATE INDEX "TransactionQualityFlag_householdId_status_idx" ON "TransactionQualityFlag"("householdId", "status");
CREATE INDEX "AiCaptureEvent_correlationId_idx" ON "AiCaptureEvent"("correlationId");

ALTER TABLE "SourceDocument" ADD CONSTRAINT "SourceDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SourceDocument" ADD CONSTRAINT "SourceDocument_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IngestionLog" ADD CONSTRAINT "IngestionLog_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "IngestionLog" ADD CONSTRAINT "IngestionLog_aiCaptureEventId_fkey" FOREIGN KEY ("aiCaptureEventId") REFERENCES "AiCaptureEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "IngestionLog" ADD CONSTRAINT "IngestionLog_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "IngestionLog" ADD CONSTRAINT "IngestionLog_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IngestionLog" ADD CONSTRAINT "IngestionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IngestionLog" ADD CONSTRAINT "IngestionLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TransactionQualityFlag" ADD CONSTRAINT "TransactionQualityFlag_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TransactionQualityFlag" ADD CONSTRAINT "TransactionQualityFlag_aiCaptureEventId_fkey" FOREIGN KEY ("aiCaptureEventId") REFERENCES "AiCaptureEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TransactionQualityFlag" ADD CONSTRAINT "TransactionQualityFlag_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TransactionQualityFlag" ADD CONSTRAINT "TransactionQualityFlag_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TransactionQualityFlag" ADD CONSTRAINT "TransactionQualityFlag_resolvedByUserId_fkey" FOREIGN KEY ("resolvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AiCaptureEvent" ADD CONSTRAINT "AiCaptureEvent_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
