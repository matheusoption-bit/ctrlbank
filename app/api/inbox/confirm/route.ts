import { NextRequest, NextResponse } from "next/server";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type DraftPayload = {
  amount?: number | null;
  date?: string | null;
  description?: string | null;
  transactionType?: TransactionType | null;
  categoryId?: string | null;
  accountId?: string | null;
};

function pickBankAccountId(
  draft: DraftPayload,
  accountIds: { preferred: string | null; fallback: string | null }
) {
  if (draft.accountId) return draft.accountId;
  if (accountIds.preferred) return accountIds.preferred;
  return accountIds.fallback;
}

function computeBalanceDelta(amount: number, type: TransactionType, status: TransactionStatus) {
  if (status !== "COMPLETED") return 0;
  if (type === "INCOME") return amount;
  if (type === "EXPENSE") return -amount;
  return 0;
}

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });

  const body = await req.json().catch(() => ({}));
  const batchId = typeof body?.batchId === "string" ? body.batchId : null;
  const eventIds = Array.isArray(body?.eventIds) ? body.eventIds.filter((id: unknown): id is string => typeof id === "string") : [];

  if (!batchId && eventIds.length === 0) {
    return NextResponse.json({ error: "Nenhum evento informado para confirmação" }, { status: 400 });
  }

  const scopeOr = [{ userId: user.id }, ...(dbUser?.householdId ? [{ householdId: dbUser.householdId }] : [])];
  const where = batchId
    ? {
        captureGroupId: batchId,
        OR: scopeOr,
        createdTransactionId: null,
        wasUndone: false,
      }
    : {
        id: { in: eventIds },
        OR: scopeOr,
        createdTransactionId: null,
        wasUndone: false,
      };

  const [events, accounts] = await Promise.all([
    prisma.aiCaptureEvent.findMany({
      where,
      select: { id: true, normalizedDraft: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.bankAccount.findMany({
      where: { OR: scopeOr },
      select: { id: true, isDefault: true },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    }),
  ]);

  if (events.length === 0) {
    return NextResponse.json({ error: "Nenhum item elegível para confirmação" }, { status: 404 });
  }
  if (accounts.length === 0) {
    return NextResponse.json({ error: "Nenhuma conta encontrada para salvar as transações" }, { status: 400 });
  }

  const preferredAccountId = accounts.find((account) => account.isDefault)?.id ?? null;
  const fallbackAccountId = accounts[0]?.id ?? null;
  const accountIdSet = new Set(accounts.map((account) => account.id));

  let saved = 0;
  const skipped: Array<{ eventId: string; reason: string }> = [];

  for (const event of events) {
    const draft =
      event.normalizedDraft && typeof event.normalizedDraft === "object"
        ? (event.normalizedDraft as DraftPayload)
        : null;

    if (!draft?.amount || !draft.date || !draft.description || !draft.transactionType) {
      skipped.push({ eventId: event.id, reason: "Draft incompleto para confirmação automática" });
      continue;
    }

    const bankAccountId = pickBankAccountId(draft, { preferred: preferredAccountId, fallback: fallbackAccountId });
    if (!bankAccountId || !accountIdSet.has(bankAccountId)) {
      skipped.push({ eventId: event.id, reason: "Conta sugerida inválida ou não encontrada" });
      continue;
    }

    const parsedDate = new Date(draft.date);
    if (Number.isNaN(parsedDate.getTime())) {
      skipped.push({ eventId: event.id, reason: "Data inválida no draft" });
      continue;
    }

    const absoluteAmount = Math.abs(Number(draft.amount));
    const type = draft.transactionType;
    const delta = computeBalanceDelta(absoluteAmount, type, "COMPLETED");

    try {
      await prisma.$transaction(async (tx) => {
        const created = await tx.transaction.create({
          data: {
            userId: user.id,
            householdId: dbUser?.householdId ?? null,
            bankAccountId,
            categoryId: draft.categoryId ?? null,
            type,
            status: "COMPLETED",
            amount: absoluteAmount,
            description: draft.description,
            date: parsedDate,
            aiCaptureEventId: event.id,
          },
          select: { id: true },
        });

        if (delta !== 0) {
          await tx.bankAccount.update({
            where: { id: bankAccountId },
            data: { balance: { increment: delta } },
          });
        }

        await tx.aiCaptureEvent.update({
          where: { id: event.id },
          data: { createdTransactionId: created.id, decision: "transaction_created" },
        });
      });
      saved += 1;
    } catch (error) {
      console.error("[api/inbox/confirm] falha ao confirmar evento", event.id, error);
      skipped.push({ eventId: event.id, reason: "Falha ao persistir transação" });
    }
  }

  return NextResponse.json({
    saved,
    skipped,
    total: events.length,
    message: `Confirmei ${saved} item(ns) automaticamente.`,
  });
}
