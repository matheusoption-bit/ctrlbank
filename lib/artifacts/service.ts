import { randomBytes } from "crypto";
import { SignedArtifactType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { canonicalizePayload, signPayload } from "@/lib/security/signature";
import { verifySignature, VerificationStatus } from "@/lib/security/verification";

export function buildVerificationUrl(token: string) {
  const base = process.env.APP_BASE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/verify/${token}`;
}

export async function createSignedArtifact(params: {
  artifactType: SignedArtifactType;
  scopeType: string;
  scopeId: string;
  payload: unknown;
  householdId?: string | null;
  userId?: string | null;
  sourceEntityType?: string | null;
  sourceEntityId?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  createdByUserId?: string | null;
  metadata?: Record<string, unknown>;
  idempotencyKey?: string | null;
}) {
  const bytes = canonicalizePayload(params.payload);
  const signing = signPayload(bytes);

  if (params.idempotencyKey) {
    const existing = await prisma.signedArtifact.findFirst({
      where: {
        artifactType: params.artifactType,
        scopeType: params.scopeType,
        scopeId: params.scopeId,
        sourceEntityType: params.sourceEntityType ?? undefined,
        sourceEntityId: params.sourceEntityId ?? undefined,
        metadata: {
          path: ["idempotencyKey"],
          equals: params.idempotencyKey,
        },
      },
    });

    if (existing) return existing;
  }

  const verificationToken = randomBytes(18).toString("base64url");
  return prisma.signedArtifact.create({
    data: {
      artifactType: params.artifactType,
      scopeType: params.scopeType,
      scopeId: params.scopeId,
      householdId: params.householdId ?? null,
      userId: params.userId ?? null,
      sourceEntityType: params.sourceEntityType ?? null,
      sourceEntityId: params.sourceEntityId ?? null,
      payloadHash: signing.payloadHash,
      payloadDigestAlgorithm: signing.payloadDigestAlgorithm,
      signature: signing.signature,
      signatureAlgorithm: signing.signatureAlgorithm,
      signatureKeyId: signing.signatureKeyId,
      verificationToken,
      fileName: params.fileName ?? null,
      mimeType: params.mimeType ?? null,
      sizeBytes: bytes.byteLength,
      createdByUserId: params.createdByUserId ?? null,
      metadata: {
        ...(params.metadata ?? {}),
        idempotencyKey: params.idempotencyKey ?? null,
        verificationUrl: buildVerificationUrl(verificationToken),
        payloadBase64: bytes.toString("base64"),
      },
    },
  });
}

export async function verifyArtifactByToken(token: string): Promise<{ status: VerificationStatus; artifact: any | null }> {
  if (!token || token.length < 8) {
    return { status: "MALFORMED", artifact: null };
  }

  const artifact = await prisma.signedArtifact.findUnique({ where: { verificationToken: token } });
  if (!artifact) return { status: "ARTIFACT_NOT_FOUND", artifact: null };

  const payloadBase64 = ((artifact.metadata as Record<string, any> | null)?.payloadBase64 ?? null) as string | null;
  if (!payloadBase64) return { status: "MALFORMED", artifact };

  const status = verifySignature({
    payload: Buffer.from(payloadBase64, "base64"),
    signature: artifact.signature,
    signatureKeyId: artifact.signatureKeyId,
    signatureAlgorithm: artifact.signatureAlgorithm,
  });

  return { status, artifact };
}

export async function generateMonthlyDossierArtifact(input: {
  householdId: string;
  userId: string;
  year: number;
  month: number;
}) {
  const start = new Date(input.year, input.month - 1, 1);
  const end = new Date(input.year, input.month, 1);

  const [txs, flags, household] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        householdId: input.householdId,
        date: { gte: start, lt: end },
        status: "COMPLETED",
      },
      select: { type: true, amount: true, date: true, description: true },
    }),
    prisma.transactionQualityFlag.findMany({
      where: { householdId: input.householdId, createdAt: { gte: start, lt: end } },
      select: { code: true, severity: true, status: true },
      take: 10,
    }),
    prisma.household.findUnique({ where: { id: input.householdId }, select: { name: true } }),
  ]);

  const income = txs.filter((t) => t.type === "INCOME").reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = txs.filter((t) => t.type === "EXPENSE").reduce((sum, t) => sum + Number(t.amount), 0);

  const payload = {
    householdLabel: household?.name ?? "Household",
    period: `${input.year}-${String(input.month).padStart(2, "0")}`,
    summary: { income, expense, net: income - expense, count: txs.length },
    qualityFlags: flags,
    generatedAt: new Date().toISOString(),
  };

  return createSignedArtifact({
    artifactType: SignedArtifactType.MONTHLY_DOSSIER,
    scopeType: "household_month",
    scopeId: `${input.householdId}:${payload.period}`,
    householdId: input.householdId,
    userId: input.userId,
    sourceEntityType: "Household",
    sourceEntityId: input.householdId,
    fileName: `dossier-${payload.period}.json`,
    mimeType: "application/json",
    createdByUserId: input.userId,
    metadata: {
      period: payload.period,
      summary: payload.summary,
      qualityFlagsCount: flags.length,
    },
    payload,
    idempotencyKey: `${input.householdId}:${payload.period}`,
  });
}

export async function generateFinancialPlanSnapshotArtifact(input: { planId: string; actorUserId?: string | null }) {
  const plan = await prisma.financialPlan.findUnique({
    where: { id: input.planId },
    include: { progresses: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  if (!plan) throw new Error("Plan not found");

  const snapshot = plan.progresses[0] ?? null;
  const payload = {
    planId: plan.id,
    title: plan.title,
    visibility: plan.visibility,
    isActive: plan.isActive,
    updatedAt: plan.updatedAt.toISOString(),
    snapshot: snapshot
      ? {
          currentAmount: snapshot.currentAmount.toString(),
          progressPercentage: snapshot.progressPercentage,
          projectedCompletion: snapshot.projectedCompletion?.toISOString() ?? null,
          isOnTrack: snapshot.isOnTrack,
          createdAt: snapshot.createdAt.toISOString(),
        }
      : null,
  };

  return createSignedArtifact({
    artifactType: SignedArtifactType.FINANCIAL_PLAN_SNAPSHOT,
    scopeType: "financial_plan",
    scopeId: plan.id,
    householdId: plan.householdId,
    userId: plan.userId,
    sourceEntityType: "FinancialPlan",
    sourceEntityId: plan.id,
    mimeType: "application/json",
    fileName: `financial-plan-${plan.id}-snapshot.json`,
    createdByUserId: input.actorUserId ?? plan.userId,
    payload,
    idempotencyKey: `${plan.id}:${plan.updatedAt.toISOString()}`,
  });
}
