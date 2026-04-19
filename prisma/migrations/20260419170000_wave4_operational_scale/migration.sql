-- Wave 4: Operational Scale / Institutional Evidence / Governance

CREATE TYPE "SigningKeyStatus" AS ENUM ('ACTIVE', 'RETIRED', 'REVOKED');
CREATE TYPE "SignedArtifactType" AS ENUM ('MONTHLY_DOSSIER', 'EXPORT_PDF', 'EXPORT_CSV', 'FINANCIAL_PLAN_SNAPSHOT', 'RECOMMENDATION_EVIDENCE', 'PROCESSING_EVIDENCE');
CREATE TYPE "QuotaPeriodType" AS ENUM ('MONTHLY');
CREATE TYPE "AutomationJobStatus" AS ENUM ('SUCCESS', 'FAILED');

CREATE TABLE "SignedArtifact" (
  "id" TEXT NOT NULL,
  "artifactType" "SignedArtifactType" NOT NULL,
  "scopeType" TEXT NOT NULL,
  "scopeId" TEXT NOT NULL,
  "householdId" TEXT,
  "userId" TEXT,
  "counterSessionId" TEXT,
  "sourceEntityType" TEXT,
  "sourceEntityId" TEXT,
  "payloadHash" TEXT NOT NULL,
  "payloadDigestAlgorithm" TEXT NOT NULL DEFAULT 'sha256',
  "signature" TEXT NOT NULL,
  "signatureAlgorithm" TEXT NOT NULL DEFAULT 'hmac-sha256',
  "signatureKeyId" TEXT NOT NULL,
  "verificationToken" TEXT NOT NULL,
  "fileName" TEXT,
  "mimeType" TEXT,
  "sizeBytes" INTEGER,
  "metadata" JSONB,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SignedArtifact_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HouseholdQuota" (
  "id" TEXT NOT NULL,
  "householdId" TEXT NOT NULL,
  "capability" TEXT NOT NULL,
  "provider" TEXT,
  "periodType" "QuotaPeriodType" NOT NULL DEFAULT 'MONTHLY',
  "maxRequests" INTEGER,
  "maxInputTokens" INTEGER,
  "maxOutputTokens" INTEGER,
  "hardBlock" BOOLEAN NOT NULL DEFAULT true,
  "warningThresholdPct" INTEGER DEFAULT 80,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HouseholdQuota_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AutomationJobRun" (
  "id" TEXT NOT NULL,
  "jobName" TEXT NOT NULL,
  "scopeType" TEXT,
  "scopeId" TEXT,
  "householdId" TEXT,
  "status" "AutomationJobStatus" NOT NULL,
  "itemCount" INTEGER NOT NULL DEFAULT 0,
  "errorSummary" TEXT,
  "metadata" JSONB,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AutomationJobRun_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SignedArtifact_verificationToken_key" ON "SignedArtifact"("verificationToken");
CREATE INDEX "SignedArtifact_artifactType_createdAt_idx" ON "SignedArtifact"("artifactType", "createdAt");
CREATE INDEX "SignedArtifact_scopeType_scopeId_createdAt_idx" ON "SignedArtifact"("scopeType", "scopeId", "createdAt");
CREATE INDEX "SignedArtifact_householdId_createdAt_idx" ON "SignedArtifact"("householdId", "createdAt");
CREATE INDEX "SignedArtifact_sourceEntityType_sourceEntityId_idx" ON "SignedArtifact"("sourceEntityType", "sourceEntityId");

CREATE UNIQUE INDEX "HouseholdQuota_householdId_capability_provider_periodType_key" ON "HouseholdQuota"("householdId", "capability", "provider", "periodType");
CREATE INDEX "HouseholdQuota_householdId_periodType_idx" ON "HouseholdQuota"("householdId", "periodType");

CREATE INDEX "AutomationJobRun_jobName_createdAt_idx" ON "AutomationJobRun"("jobName", "createdAt");
CREATE INDEX "AutomationJobRun_householdId_createdAt_idx" ON "AutomationJobRun"("householdId", "createdAt");

ALTER TABLE "SignedArtifact" ADD CONSTRAINT "SignedArtifact_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SignedArtifact" ADD CONSTRAINT "SignedArtifact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SignedArtifact" ADD CONSTRAINT "SignedArtifact_counterSessionId_fkey" FOREIGN KEY ("counterSessionId") REFERENCES "CounterSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SignedArtifact" ADD CONSTRAINT "SignedArtifact_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "HouseholdQuota" ADD CONSTRAINT "HouseholdQuota_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AutomationJobRun" ADD CONSTRAINT "AutomationJobRun_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
