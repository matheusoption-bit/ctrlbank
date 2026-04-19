import { NextRequest, NextResponse } from "next/server";
import { IngestionStage, IngestionStatus, QualityFlagCode, QualityFlagSeverity, ReviewState } from "@prisma/client";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createManagedTransaction } from "@/app/actions/transactions";
import { detectDuplicateTransaction } from "@/lib/finance/deduplication";
import { appendIngestionLog, createQualityFlag, sanitizeErrorMessage } from "@/lib/inbox/operational";
import { verifySealedCapturePayload } from "@/lib/security/checksum";
import { scopeWhere } from "@/lib/security/scope";
import { isIdempotentCommitAlreadyDone } from "@/lib/inbox/processing-state";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const captureEventId = body?.captureEventId as string | undefined;

  if (!captureEventId) {
    return NextResponse.json({ error: "captureEventId é obrigatório para confirmação segura." }, { status: 400 });
  }

  let correlationId = crypto.randomUUID();

  try {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { householdId: true } });
    const householdId = dbUser?.householdId ?? null;

    const event = await prisma.aiCaptureEvent.findFirst({
      where: {
        id: captureEventId,
        ...scopeWhere({ userId: user.id, householdId }),
      },
      include: {
        sourceDocument: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Referência de processamento inválida." }, { status: 404 });
    }

    correlationId = event.correlationId ?? correlationId;

    const committed = await prisma.ingestionLog.findFirst({
      where: {
        aiCaptureEventId: event.id,
        stage: IngestionStage.COMMITTED,
        status: IngestionStatus.SUCCESS,
      },
      orderBy: { createdAt: "desc" },
    });

    if (isIdempotentCommitAlreadyDone({ hasCommittedLog: Boolean(committed) })) {
      return NextResponse.json({
        ok: true,
        idempotent: true,
        correlationId,
        message: "Processamento já confirmado anteriormente.",
      });
    }

    const staged = (event.normalizedDraft && typeof event.normalizedDraft === "object" ? event.normalizedDraft : null) as {
      items?: Array<{ date: string | Date; amount: number; description: string; type: "income" | "expense" }>;
    } | null;

    const stagedItems = Array.isArray(staged?.items) ? staged!.items : [];
    if (stagedItems.length === 0) {
      await createQualityFlag({
        code: QualityFlagCode.REVIEW_REQUIRED,
        severity: QualityFlagSeverity.HIGH,
        aiCaptureEventId: event.id,
        sourceDocumentId: event.sourceDocumentId,
        metadata: { reason: "staging_empty" },
      });
      await prisma.aiCaptureEvent.update({
        where: { id: event.id },
        data: {
          reviewState: ReviewState.REQUIRED,
          processingStage: IngestionStage.REVIEW_REQUIRED,
          decision: "clarification_needed",
          decisionReason: "Sem itens staged no servidor",
        },
      });
      return NextResponse.json({ error: "Nenhuma transação staged para confirmação." }, { status: 400 });
    }

    if (event.sealedPayload && event.signature) {
      const valid = verifySealedCapturePayload(event.sealedPayload, event.signature);
      if (!valid) {
        await appendIngestionLog({
          correlationId,
          aiCaptureEventId: event.id,
          sourceDocumentId: event.sourceDocumentId,
          stage: IngestionStage.FAILED,
          status: IngestionStatus.ERROR,
          errorCode: "SIGNATURE_INVALID",
          errorMessage: "Payload staged adulterado",
        });
        return NextResponse.json({ error: "Integridade do processamento inválida." }, { status: 409 });
      }
    }

    await appendIngestionLog({
      correlationId,
      aiCaptureEventId: event.id,
      sourceDocumentId: event.sourceDocumentId,
      stage: IngestionStage.COMMITTING,
      status: IngestionStatus.STARTED,
      actorType: "user",
      actorId: user.id,
    });

    const accounts = await prisma.bankAccount.findMany({
      where: scopeWhere({ userId: user.id, householdId }),
      select: { id: true, isDefault: true },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });

    const bankAccountId = accounts.find((account) => account.isDefault)?.id ?? accounts[0]?.id;
    if (!bankAccountId) {
      await createQualityFlag({
        code: QualityFlagCode.ACCOUNT_MISSING,
        severity: QualityFlagSeverity.HIGH,
        aiCaptureEventId: event.id,
        sourceDocumentId: event.sourceDocumentId,
      });
      return NextResponse.json({ error: "Nenhuma conta encontrada para confirmar." }, { status: 400 });
    }

    const createdTransactionIds: string[] = [];

    for (const item of stagedItems) {
      const dedup = await detectDuplicateTransaction({
        userId: user.id,
        householdId,
        item: {
          amount: Number(item.amount),
          date: new Date(item.date),
          description: item.description,
          source: event.inputType,
          type: item.type,
        },
      });

      if (dedup.status === "duplicate") {
        await createQualityFlag({
          code: QualityFlagCode.DUPLICATE_SUSPECTED,
          severity: QualityFlagSeverity.HIGH,
          aiCaptureEventId: event.id,
          sourceDocumentId: event.sourceDocumentId,
          metadata: { existingId: dedup.existingId, description: item.description },
        });
        continue;
      }

      const tx = await createManagedTransaction({
        userId: user.id,
        householdId,
        bankAccountId,
        type: item.type === "income" ? "INCOME" : "EXPENSE",
        status: "COMPLETED",
        amount: Math.abs(Number(item.amount)),
        description: item.description,
        date: new Date(item.date),
        runIntelligence: false,
      });

      createdTransactionIds.push(tx.id);

      await appendIngestionLog({
        correlationId,
        aiCaptureEventId: event.id,
        sourceDocumentId: event.sourceDocumentId,
        transactionId: tx.id,
        stage: IngestionStage.COMMITTED,
        status: IngestionStatus.SUCCESS,
        actorType: "user",
        actorId: user.id,
      });
    }

    await prisma.aiCaptureEvent.update({
      where: { id: event.id },
      data: {
        createdTransactionId: createdTransactionIds[0] ?? null,
        decision: createdTransactionIds.length > 0 ? "transaction_created" : "clarification_needed",
        processingStage: createdTransactionIds.length > 0 ? IngestionStage.COMMITTED : IngestionStage.REVIEW_REQUIRED,
        reviewState: createdTransactionIds.length > 0 ? ReviewState.APPROVED : ReviewState.REQUIRED,
        decisionReason: createdTransactionIds.length > 0 ? "Confirmação concluída via staging" : "Nenhum item elegível para commit",
      },
    });

    if (createdTransactionIds.length === 0) {
      await createQualityFlag({
        code: QualityFlagCode.REVIEW_REQUIRED,
        severity: QualityFlagSeverity.MEDIUM,
        aiCaptureEventId: event.id,
        sourceDocumentId: event.sourceDocumentId,
        metadata: { reason: "all_items_duplicate_or_invalid" },
      });
    }

    return NextResponse.json({
      ok: true,
      correlationId,
      captureEventId: event.id,
      saved: createdTransactionIds.length,
      message:
        createdTransactionIds.length > 0
          ? `Confirmei ${createdTransactionIds.length} transação(ões).`
          : "Nenhuma transação confirmada automaticamente; revisão necessária.",
    });
  } catch (error) {
    const message = sanitizeErrorMessage(error);
    console.error("[api/inbox/confirm] erro:", error);
    await appendIngestionLog({
      correlationId,
      stage: IngestionStage.FAILED,
      status: IngestionStatus.ERROR,
      errorCode: "CONFIRM_FAILED",
      errorMessage: message,
      finishedAt: new Date(),
    }).catch(() => null);

    return NextResponse.json({ error: "Não foi possível confirmar agora." }, { status: 500 });
  }
}
