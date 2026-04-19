import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { processAiIngest } from "@/lib/ai/ingest";
import { AIComposerMode, AIComposerResponse } from "@/lib/ai/contracts";
import { runFinanceIntelligence, buildFinanceContextReply } from "@/lib/finance/intelligence";

const BodySchema = z.object({
  mode: z.enum(["Registrar", "Revisar", "Perguntar", "Planejar", "Sugerir"]).default("Registrar"),
  inputType: z.enum(["text", "image", "text+image", "audio", "pdf", "csv"]),
  content: z.string().optional(),
  imageBase64: z.string().optional(),
  mimeType: z.string().optional(),
  conversationId: z.string().optional(),
  audioDurationMs: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) return new Response("Não autorizado", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  try {
    const { getOrCreateConversation, saveAiMessage, createFinancialPlan, createProductFeedback } = await import("@/lib/ai/composer");

    const conversationId = await getOrCreateConversation(user.id, dbUser?.householdId ?? null, body.conversationId);

    // Save user message
    const userMessage = await saveAiMessage({
      conversationId,
      userId: user.id,
      role: "user",
      mode: body.mode,
      inputType: body.inputType,
      content: body.content ?? (body.inputType === "audio" ? "[Áudio Enviado]" : (body.imageBase64 ? "[Arquivo Anexado]" : "")),
      metadata: body.inputType === "audio"
        ? { inputType: "audio", audioDurationMs: body.audioDurationMs, transcriptionStatus: "pending" }
        : { inputType: body.inputType, audioDurationMs: body.audioDurationMs }
    });

    let response: AIComposerResponse;
    if (body.mode === "Perguntar") {
      const finance = await runFinanceIntelligence(user.id, dbUser?.householdId ?? null);
      const contextualReply = buildFinanceContextReply({
        question: body.content ?? "",
        monthlyTotal: finance.monthly.total,
        topCategories: finance.topCategories,
        average: finance.average,
        alerts: finance.alerts,
        recommendations: finance.recommendations,
        signals: finance.signals,
      });

      response = {
        intent: "chat_reply",
        message: contextualReply,
        requiresReview: false,
        autoSaved: false,
        transactionDraft: null,
        createdTransactionId: null,
        undoAvailable: false,
        undoToken: null,
        eventId: null,
        captureGroupId: null,
        conversationId,
        missingFields: [],
      };
    } else {
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: "IA não configurada" }, { status: 503 });
      }

      response = await processAiIngest({
        userId: user.id,
        householdId: dbUser?.householdId ?? null,
        mode: body.mode as AIComposerMode,
        inputType: body.inputType as any,
        content: body.content,
        imageBase64: body.imageBase64,
        mimeType: body.mimeType,
      });
    }

    response.conversationId = conversationId;

    if (body.inputType === "audio" && userMessage?.id) {
      await prisma.aiMessage.update({
        where: { id: userMessage.id },
        data: {
          content: response.userTranscript?.trim() || "[Áudio Enviado]",
          metadata: {
            inputType: "audio",
            audioDurationMs: body.audioDurationMs,
            transcriptionStatus: response.userTranscript?.trim() ? "completed" : "failed",
            transcript: response.userTranscript?.trim() || null,
          },
        }
      });
    }

    if (response.intent === "saved_plan" && response.transactionDraft) {
      const plan = await createFinancialPlan(user.id, dbUser?.householdId ?? null, response.transactionDraft);
      if (plan) {
        response.savedPlanId = plan.id;
        const { syncFinancialPlan } = await import("@/lib/ai/planner");
        await syncFinancialPlan(plan.id);
        // Also save assistant message for the plan
        await saveAiMessage({
          conversationId,
          userId: user.id,
          role: "assistant",
          mode: body.mode,
          content: "Plano financeiro criado com sucesso.",
          metadata: { intent: response.intent, savedPlanId: plan.id, planData: response.transactionDraft }
        });
        return NextResponse.json(response);
      }
    }

    if (response.intent === "product_feedback_logged" && response.feedbackId) {
      await saveAiMessage({
        conversationId,
        userId: user.id,
        role: "assistant",
        mode: body.mode,
        content: response.message,
        metadata: { intent: response.intent, feedbackId: response.feedbackId, normalizedFeedback: response.normalizedFeedback }
      });
      return NextResponse.json(response);
    }

    // Save common assistant reply
    await saveAiMessage({
      conversationId,
      userId: user.id,
      role: "assistant",
      mode: body.mode,
      content: response.message,
      metadata: {
        intent: response.intent,
        draft: response.transactionDraft,
        createdTxId: response.createdTransactionId,
        missingFields: response.missingFields
      }
    });

    return NextResponse.json(response);

  } catch (error: any) {
    const message = error?.message || "Falha ao extrair dados";
    console.error("[ai/composer] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
