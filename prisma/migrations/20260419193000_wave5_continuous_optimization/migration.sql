-- Wave 5 continuous optimization / adaptive operations
CREATE TYPE "PolicyStatus" AS ENUM ('DRAFT', 'ACTIVE', 'RETIRED', 'ROLLED_BACK', 'EXPERIMENTAL');
CREATE TYPE "CalibrationMode" AS ENUM ('RECOMMEND_ONLY', 'APPLY_WITH_GUARDRAILS');
CREATE TYPE "EvaluationResult" AS ENUM ('CORRECT', 'INCORRECT', 'ACCEPTED', 'REJECTED', 'OVERRIDDEN', 'NO_SIGNAL');
CREATE TYPE "MetricPeriodType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');
CREATE TYPE "ExperimentStatus" AS ENUM ('DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED', 'KILLED');

CREATE TABLE "PolicyVersion" (
    "id" TEXT NOT NULL,
    "householdId" TEXT,
    "policyType" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "PolicyStatus" NOT NULL DEFAULT 'DRAFT',
    "config" JSONB NOT NULL,
    "description" TEXT,
    "createdByUserId" TEXT,
    "activatedAt" TIMESTAMP(3),
    "retiredAt" TIMESTAMP(3),
    "parentPolicyVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PolicyVersion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DecisionEvaluation" (
    "id" TEXT NOT NULL,
    "scopeType" TEXT NOT NULL,
    "scopeId" TEXT,
    "householdId" TEXT,
    "userId" TEXT,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT,
    "sourceEventId" TEXT,
    "policyVersionId" TEXT,
    "provider" TEXT,
    "model" TEXT,
    "evaluationType" TEXT NOT NULL,
    "expectedOutcome" TEXT,
    "observedOutcome" TEXT,
    "result" "EvaluationResult" NOT NULL,
    "score" DOUBLE PRECISION,
    "metadata" JSONB,
    "evaluatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DecisionEvaluation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductQualityMetricSnapshot" (
    "id" TEXT NOT NULL,
    "periodType" "MetricPeriodType" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "scopeType" TEXT NOT NULL,
    "scopeId" TEXT,
    "householdId" TEXT,
    "metricCode" TEXT NOT NULL,
    "metricValue" DOUBLE PRECISION NOT NULL,
    "dimensions" JSONB,
    "computedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductQualityMetricSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DecisionFeedback" (
    "id" TEXT NOT NULL,
    "householdId" TEXT,
    "userId" TEXT,
    "feedbackType" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT,
    "aiCaptureEventId" TEXT,
    "qualityFlagId" TEXT,
    "recommendationId" TEXT,
    "policyVersionId" TEXT,
    "provider" TEXT,
    "model" TEXT,
    "isInferred" BOOLEAN NOT NULL DEFAULT false,
    "signalStrength" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DecisionFeedback_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CalibrationRun" (
    "id" TEXT NOT NULL,
    "householdId" TEXT,
    "policyType" TEXT NOT NULL,
    "mode" "CalibrationMode" NOT NULL,
    "baselineMetrics" JSONB,
    "candidateConfig" JSONB,
    "applied" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "guardrailStatus" TEXT,
    "policyVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CalibrationRun_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CalibrationChange" (
    "id" TEXT NOT NULL,
    "calibrationRunId" TEXT NOT NULL,
    "metricCode" TEXT NOT NULL,
    "baselineValue" DOUBLE PRECISION NOT NULL,
    "candidateValue" DOUBLE PRECISION NOT NULL,
    "observedValue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CalibrationChange_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Experiment" (
    "id" TEXT NOT NULL,
    "householdId" TEXT,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "ExperimentStatus" NOT NULL DEFAULT 'DRAFT',
    "allocationStrategy" TEXT NOT NULL,
    "targetScope" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "policyVersionId" TEXT,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PolicyVersion_householdId_policyType_version_key" ON "PolicyVersion"("householdId", "policyType", "version");
CREATE INDEX "PolicyVersion_policyType_status_householdId_idx" ON "PolicyVersion"("policyType", "status", "householdId");
CREATE INDEX "DecisionEvaluation_householdId_evaluatedAt_idx" ON "DecisionEvaluation"("householdId", "evaluatedAt");
CREATE INDEX "DecisionEvaluation_policyVersionId_evaluatedAt_idx" ON "DecisionEvaluation"("policyVersionId", "evaluatedAt");
CREATE INDEX "DecisionEvaluation_subjectType_result_evaluatedAt_idx" ON "DecisionEvaluation"("subjectType", "result", "evaluatedAt");
CREATE INDEX "ProductQualityMetricSnapshot_householdId_metricCode_periodStart_idx" ON "ProductQualityMetricSnapshot"("householdId", "metricCode", "periodStart");
CREATE INDEX "ProductQualityMetricSnapshot_scopeType_scopeId_periodStart_idx" ON "ProductQualityMetricSnapshot"("scopeType", "scopeId", "periodStart");
CREATE INDEX "DecisionFeedback_householdId_feedbackType_createdAt_idx" ON "DecisionFeedback"("householdId", "feedbackType", "createdAt");
CREATE INDEX "DecisionFeedback_subjectType_subjectId_createdAt_idx" ON "DecisionFeedback"("subjectType", "subjectId", "createdAt");
CREATE INDEX "CalibrationRun_householdId_policyType_createdAt_idx" ON "CalibrationRun"("householdId", "policyType", "createdAt");
CREATE INDEX "CalibrationChange_calibrationRunId_idx" ON "CalibrationChange"("calibrationRunId");
CREATE UNIQUE INDEX "Experiment_householdId_key_key" ON "Experiment"("householdId", "key");
CREATE INDEX "Experiment_status_startAt_endAt_idx" ON "Experiment"("status", "startAt", "endAt");

ALTER TABLE "PolicyVersion" ADD CONSTRAINT "PolicyVersion_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PolicyVersion" ADD CONSTRAINT "PolicyVersion_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PolicyVersion" ADD CONSTRAINT "PolicyVersion_parentPolicyVersionId_fkey" FOREIGN KEY ("parentPolicyVersionId") REFERENCES "PolicyVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionEvaluation" ADD CONSTRAINT "DecisionEvaluation_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionEvaluation" ADD CONSTRAINT "DecisionEvaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionEvaluation" ADD CONSTRAINT "DecisionEvaluation_policyVersionId_fkey" FOREIGN KEY ("policyVersionId") REFERENCES "PolicyVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProductQualityMetricSnapshot" ADD CONSTRAINT "ProductQualityMetricSnapshot_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionFeedback" ADD CONSTRAINT "DecisionFeedback_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionFeedback" ADD CONSTRAINT "DecisionFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionFeedback" ADD CONSTRAINT "DecisionFeedback_aiCaptureEventId_fkey" FOREIGN KEY ("aiCaptureEventId") REFERENCES "AiCaptureEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionFeedback" ADD CONSTRAINT "DecisionFeedback_qualityFlagId_fkey" FOREIGN KEY ("qualityFlagId") REFERENCES "TransactionQualityFlag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionFeedback" ADD CONSTRAINT "DecisionFeedback_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "AiRecommendation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionFeedback" ADD CONSTRAINT "DecisionFeedback_policyVersionId_fkey" FOREIGN KEY ("policyVersionId") REFERENCES "PolicyVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CalibrationRun" ADD CONSTRAINT "CalibrationRun_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CalibrationRun" ADD CONSTRAINT "CalibrationRun_policyVersionId_fkey" FOREIGN KEY ("policyVersionId") REFERENCES "PolicyVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CalibrationChange" ADD CONSTRAINT "CalibrationChange_calibrationRunId_fkey" FOREIGN KEY ("calibrationRunId") REFERENCES "CalibrationRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_policyVersionId_fkey" FOREIGN KEY ("policyVersionId") REFERENCES "PolicyVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
