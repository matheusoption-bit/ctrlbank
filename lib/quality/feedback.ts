import { prisma } from "@/lib/prisma";

export async function captureDecisionFeedback(input: {
  householdId?: string | null;
  userId?: string | null;
  feedbackType: string;
  subjectType: string;
  subjectId?: string | null;
  aiCaptureEventId?: string | null;
  qualityFlagId?: string | null;
  recommendationId?: string | null;
  policyVersionId?: string | null;
  provider?: string | null;
  model?: string | null;
  isInferred?: boolean;
  signalStrength?: number | null;
  metadata?: Record<string, unknown>;
}) {
  return prisma.decisionFeedback.create({
    data: {
      ...input,
      isInferred: input.isInferred ?? false,
      metadata: (input.metadata ?? undefined) as any,
    },
  });
}
