"use server";

import { validateRequest } from "@/lib/auth";
import { createManagedTransaction } from "@/app/actions/transactions";
import { learnFromCorrection } from "@/lib/ai/composer";
import { AIComposerBatchDraftItem, AIComposerTransactionDraft } from "@/lib/ai/contracts";
import { prisma } from "@/lib/prisma";

export async function approveAiDraft(draft: AIComposerTransactionDraft, eventId: string | null) {
  const { user } = await validateRequest();
  if (!user) return { error: "Não autorizado" };

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });

  try {
    const tx = await createManagedTransaction({
      userId: user.id,
      householdId: dbUser?.householdId ?? null,
      bankAccountId: draft.accountId!,
      categoryId: draft.categoryId ?? null,
      type: draft.transactionType,
      status: "COMPLETED",
      amount: Math.abs(draft.amount!),
      description: draft.description,
      date: draft.date ? new Date(draft.date) : new Date(),
      aiEventId: eventId,
    });

    // Train AI memory based on the final, corrected draft
    if (draft.description) {
      await learnFromCorrection(
        user.id,
        dbUser?.householdId ?? null,
        draft.description,
        draft.categoryId,
        draft.accountId
      );
    }

    return { txId: tx.id };
  } catch (error: any) {
    console.error("Erro ao aprovar draft:", error);
    return { error: error.message || "Falha ao registrar" };
  }
}

export async function getAiCaptureGroup(captureGroupId: string) {
  const { user } = await validateRequest();
  if (!user) return [];

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });

  const events = await prisma.aiCaptureEvent.findMany({
    where: {
      captureGroupId,
      createdTransactionId: null,
      wasUndone: false,
      OR: [
        { userId: user.id },
        ...(dbUser?.householdId ? [{ householdId: dbUser.householdId }] : []),
      ],
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      normalizedDraft: true,
    },
  });

  return events
    .map((event): AIComposerBatchDraftItem | null => {
      if (!event.normalizedDraft || typeof event.normalizedDraft !== "object") {
        return null;
      }

      return {
        eventId: event.id,
        draft: event.normalizedDraft as AIComposerTransactionDraft,
      };
    })
    .filter((item): item is AIComposerBatchDraftItem => item !== null);
}
