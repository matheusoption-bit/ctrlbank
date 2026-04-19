import { prisma } from "@/lib/prisma";
import { AIProviderRegistry } from "./providers/registry";
import { AICapability, AIGenerationOptions } from "./providers/types";
import { randomUUID } from "crypto";
import { AIComposerResponse, AIComposerMode, AIComposerBatchDraftItem } from "@/lib/ai/contracts";
import { logAiCaptureEvent } from "@/lib/ai/composer";
import { parseCSVForAI } from "./csv-pdf-parser";
import { formatCurrency } from "@/lib/format";
import { runPromptGuard } from "@/lib/ai/prompt-guard";
import { routeAIRequest } from "@/lib/ai/router";
import { extractWithProvider } from "@/lib/ai/review-protocol/extractor";
import { resolveDraft } from "@/lib/ai/review-protocol/resolver";
import { reviewDraft } from "@/lib/ai/review-protocol/reviewer";
import { commitDraft } from "@/lib/ai/review-protocol/committer";
import { evaluateTransactionQuality } from "@/lib/finance/quality";


const JSON_PROMPT_SINGLE = `
Você é o AI Composer do CtrlBank, sistema de governança da saúde financeira familiar.
Analise a entrada e crie um rascunho de UM único movimento financeiro.
Extraia as informações e retorne APENAS um JSON válido.
Formato:
{
  "userTranscript": "<transcrição do áudio se a entrada for áudio; null caso contrário>",
  "amount": <número float ex: 50.90, ou null>,
  "date": "<YYYY-MM-DD ou null>",
  "description": "<Nome curto do estabelecimento ou descrição, max 60 chars>",
  "transactionType": "<INCOME, EXPENSE ou TRANSFER>",
  "categoryName": "<Uma destas: Alimentação, Transporte, Saúde, Lazer, Moradia, Educação, Vestuário, Serviços, Supermercado, Farmácia, Combustível. Se incerto: Outros>",
  "accountName": "<Nome da conta bancária deduzida. null se não houver menção explícita>",
  "confidence": {
    "overall": 0.0 a 1.0,
    "amount": 0.0 a 1.0,
    "date": 0.0 a 1.0,
    "description": 0.0 a 1.0,
    "category": 0.0 a 1.0,
    "account": 0.0 a 1.0,
    "transactionType": 0.0 a 1.0
  }
}
Regras:
1. Recebimento: INCOME. Gasto: EXPENSE.
2. overall é a média da sua certeza sobre todo o bloco.
`;

const JSON_PROMPT_BATCH = `
Você é o AI Composer do CtrlBank. Leia o extrato/fatura e identifique TODAS as transações financeiras.
Retorne APENAS um array JSON de transações. Exemplo:
[
  {
    "amount": 50.90, "date": "2026-04-10", "description": "Uber", "transactionType": "EXPENSE",
    "categoryName": "Transporte", "accountName": null,
    "confidence": { "overall": 0.9, "amount": 0.9, "date": 0.9, "description": 0.9, "category": 0.9, "account": 0, "transactionType": 0.9 }
  }
]
`;

export type ProcessIngestInput = {
  userId: string;
  householdId: string | null;
  mode: AIComposerMode;
  inputType: "text" | "image" | "text+image" | "audio" | "pdf" | "csv";
  content?: string;
  imageBase64?: string;
  mimeType?: string; // image/jpeg, application/pdf, audio/webm etc.
  disableAutoSave?: boolean;
};

export async function processAiIngest(input: ProcessIngestInput): Promise<AIComposerResponse> {
  const isChatMode = input.mode === "Perguntar" || input.mode === "Planejar";
  const isSuggestMode = input.mode === "Sugerir";
  const isBatch = input.inputType === "pdf" || input.inputType === "csv";
  const captureGroupId = randomUUID();
  
  let prompt = isBatch ? JSON_PROMPT_BATCH : JSON_PROMPT_SINGLE;
  let finContext = "";

  if (isSuggestMode) {
    prompt = "Você analisa feedback de produto. Converta input em JSON com: title, summary, type (bug|ux|feature|improvement), area (composer|mobile|dashboard|orcamentos|metas|relatorios|planner|other), impact (low|medium|high), reproductionSteps[], suggestedSolution, acceptanceCriteria[]";
    if (input.inputType === 'audio') prompt += " Se a entrada for Áudio, DEVE retornar o campo raiz 'userTranscript' com a transcrição.";
  } else if (isChatMode) {
    finContext = await buildFinancialContext(input.userId, input.householdId);
    prompt = input.mode === "Planejar"
      ? `Você é o CtrlBot, consultor de saúde financeira familiar do CtrlBank.
Responda sempre em português, de forma objetiva, prática e acionável.
Contexto financeiro (últimos 30 dias):
${finContext}

Se o usuário estiver pedindo para criar ou fazer um plano financeiro específico, responda APENAS com um JSON válido (sem markdown tags fora do JSON) neste formato estruturado:
{
  "plan": {
    "title": "...",
    "objectiveType": "...",
    "targetAmount": <numero ou null>,
    "targetMonths": <numero ou null>,
    "monthlyRequiredAmount": <numero ou null>,
    "summary": "...",
    "visibility": "PERSONAL",
    "recommendedCuts": [{"category": "...", "amount": 100}],
    "scenarioData": {"conservative": "...", "aggressive": "..."}
  }
}
Se ele fizer perguntas soltas ou se o contexto não suportar criar um plano, responda APENAS um JSON (sem texto fora) com a seguinte chave:
{
  "chatReply": "1. Diagnóstico... 2. Onde otimizar..."
}
${input.inputType === 'audio' ? 'Se a entrada for Áudio, você DEVE retornar o campo raiz "userTranscript" com a transcrição do que o usuário disse.' : ''}`
      : `Você é o CtrlBot, assistente analítico premium no CtrlBank.
Responda sempre em português, de forma concisa e útil.
Contexto financeiro (últimos 30 dias):
${finContext}

Responda à pergunta do usuário de forma clara. Se houver áudio, forneça um JSON com { "chatReply": "sua reposta", "userTranscript": "o que o usuario falou" } ao invés de texto simples!`;
  }

  const registry = new AIProviderRegistry();
  
  let capability: AICapability = "transaction_extract";
  if (isSuggestMode) capability = "suggestion";
  else if (isChatMode && input.mode === "Planejar") capability = "planning";
  else if (isChatMode) capability = "conversation";

  const isJsonExpected = capability !== "conversation" || input.inputType === "audio";

  let processedContent = input.content;
  if (input.inputType === "csv" && input.content) {
    processedContent = parseCSVForAI(input.content);
  }

  const payloadText = processedContent ?? input.content ?? "";
  const guard = runPromptGuard({
    text: payloadText,
    sourceChannel: input.mode === "Revisar" ? "composer" : "manual",
    inputType: input.inputType,
    strict: input.mode === "Revisar" || input.mode === "Registrar",
  });

  const promptWithInput = (input.inputType === "text" || input.inputType === "csv")
    ? (processedContent ? `${prompt}

Entrada:
${processedContent}` : prompt)
    : (input.content ? `${prompt}

Entrada do Usuário: "${input.content}"` : prompt);

  const route = await routeAIRequest({
    capability,
    inputType: input.inputType,
    textLength: promptWithInput.length,
    taintLevel: guard.taintLevel,
    householdId: input.householdId,
  });

  const opts: AIGenerationOptions = {
    responseFormat: isJsonExpected ? "json_object" : "text",
    providerHint: route.providerHint,
    allowFallback: route.allowFallback,
  };

  const extraction = await extractWithProvider({
    registry,
    capability,
    prompt: promptWithInput,
    inputType: input.inputType,
    imageBase64: input.imageBase64,
    mimeType: input.mimeType,
    opts,
  });

  let parsedItems: any = extraction.parsedItems;
  let rawTextResponse = extraction.rawTextResponse;

  // extract JSON / reply
  let parsedJson: any = null;
  
  if (isSuggestMode) {
    // Handle Sugerir mode
    try {
      const parsed = parsedItems;
      if (parsed) {
        const { createProductFeedback } = await import("@/lib/ai/composer");
        
        // Prepare artifacts if audio or image
        const artifacts: Array<{ kind: string; url?: string; content?: any }> = [];
        if (input.inputType === "audio") {
          artifacts.push({
            kind: "transcript",
            content: { transcript: parsed.userTranscript || "[Audio enviado]" }
          });
        }
        if (input.inputType === "image" || input.inputType === "text+image") {
          artifacts.push({
            kind: "image",
            url: input.imageBase64 ? `data:${input.mimeType || "image/jpeg"};base64,${input.imageBase64}` : undefined
          });
        }
        
        // Create feedback
        const feedback = await createProductFeedback(
          input.userId,
          input.householdId,
          {
            rawInput: input.content || "[Feedback enviado]",
            normalizedTitle: parsed.title || "Feedback sem título",
            summary: parsed.summary || input.content || "",
            type: parsed.type || "improvement",
            area: parsed.area || "other",
            impact: parsed.impact || "low",
            reproductionSteps: parsed.reproductionSteps,
            suggestedSolution: parsed.suggestedSolution,
            acceptanceCriteria: parsed.acceptanceCriteria
          },
          artifacts
        );
        
        if (feedback) {
          return {
            intent: "product_feedback_logged",
            message: "Sugestão registrada com sucesso.",
            requiresReview: false,
            autoSaved: true,
            transactionDraft: null,
            feedbackId: feedback.id,
            normalizedFeedback: parsed,
            createdTransactionId: null,
            undoAvailable: false,
            undoToken: null,
            eventId: null,
            captureGroupId,
            conversationId: null,
            missingFields: [],
            userTranscript: parsed.userTranscript
          };
        }
      }
    } catch (e) {
      console.error("[ai/ingest] Failed to process Sugerir mode:", e);
    }
    
    throw new Error("Não foi possível processar o feedback de produto.");
  } else if (isChatMode) {
    if (input.mode === "Planejar") {
      try {
        const parsed = parsedItems;
        if (parsed) {
          parsedJson = parsed;
          if (parsed.plan) {
            return {
              intent: "saved_plan",
              message: "Plano de saúde financeira rascunhado para revisão.",
              requiresReview: true,
              autoSaved: false,
              transactionDraft: parsed.plan, // reusing draft temporarily or returning raw plan block
              createdTransactionId: null,
              undoAvailable: false,
              undoToken: null,
              eventId: null,
              captureGroupId: null,
              conversationId: null,
              missingFields: [],
              userTranscript: parsed.userTranscript,
            };
          } else if (parsed.chatReply) {
             rawTextResponse = parsed.chatReply;
          }
        }
      } catch {
         // fallback
      }
    } else if (parsedItems && parsedItems.chatReply) {
       rawTextResponse = parsedItems.chatReply;
       parsedJson = parsedItems;
    }
    
    return {
      intent: "chat_reply",
      message: rawTextResponse,
      requiresReview: false,
      autoSaved: false,
      transactionDraft: null,
      createdTransactionId: null,
      undoAvailable: false,
      undoToken: null,
      eventId: null,
      captureGroupId: null,
      conversationId: null,
      missingFields: [],
      userTranscript: parsedJson?.userTranscript,
    };
  }

  if (!parsedItems) {
    throw new Error("A IA não retornou um formato JSON rastreável.");
  }

  if (isBatch) {
    const drafts = await Promise.all((parsedItems as any[]).map(async (item) => (await resolveDraft({ parsed: item, userId: input.userId, householdId: input.householdId, source: input.inputType })).draft));
    const batchDrafts: AIComposerBatchDraftItem[] = await Promise.all(
      drafts.map(async (draft) => {
        const aiEvent = await logAiCaptureEvent({
          userId: input.userId,
          householdId: input.householdId,
          captureGroupId,
          source: input.inputType,
          inputType: "composer",
          rawText: input.content ?? null,
          normalizedDraft: draft,
          confidenceOverall: draft.confidence.overall,
          decision: "batch_review",
          createdTransactionId: null,
        });

        return {
          eventId: aiEvent?.id ?? null,
          draft,
        };
      })
    );

    return {
       intent: "batch_review",
       message: `Encontrei ${drafts.length} itens. Confirme a importação.`,
       requiresReview: true,
       autoSaved: false,
       transactionDraft: null,
       batchDrafts,
       createdTransactionId: null,
       undoAvailable: false,
       undoToken: null,
       eventId: null,
       captureGroupId,
       conversationId: null,
       missingFields: []
    };
  }

  // Single Item
  const { draft, missingFields } = await resolveDraft({
    parsed: parsedItems,
    userId: input.userId,
    householdId: input.householdId,
    source: input.inputType,
  });

  const quality = await evaluateTransactionQuality({
    userId: input.userId,
    householdId: input.householdId,
    draft,
  });

  const forcedSecurityReview = guard.shouldEscalateToReview;
  const forcedQualityReview = quality.requiresReview;
  const forceReview = forcedSecurityReview || forcedQualityReview;

  const decision = reviewDraft({
    draft,
    missingFields,
    disableAutoSave: input.disableAutoSave,
    forceReview,
    forceReason: forcedSecurityReview
      ? "Entrada sinalizada para revisão de segurança."
      : "Entrada sinalizada por heurísticas de qualidade.",
  });

  const response: AIComposerResponse = {
    intent: decision.intent,
    message: decision.message,
    requiresReview: decision.requiresReview,
    autoSaved: false,
    transactionDraft: draft,
    createdTransactionId: null,
    undoAvailable: false,
    undoToken: null,
    eventId: null,
    captureGroupId,
    conversationId: null,
    missingFields: missingFields,
    userTranscript: parsedItems.userTranscript ?? undefined,
  };

  if (decision.canCommit) {
    const tx = await commitDraft({
      draft,
      userId: input.userId,
      householdId: input.householdId,
    });

    response.intent = "transaction_created";
    response.message = "Movimento registrado com sucesso.";
    response.requiresReview = false;
    response.autoSaved = true;
    response.createdTransactionId = tx.id;
    response.undoAvailable = true;
    response.undoToken = `undo_${tx.id}`;
  }

  // Audit
  const aiEvent = await logAiCaptureEvent({
    userId: input.userId,
    householdId: input.householdId,
    captureGroupId,
    source: input.inputType,
    inputType: "composer",
    rawText: input.content ?? null,
    normalizedDraft: { draft, qualitySignals: quality.signals, taint: guard.taintLevel },
    confidenceOverall: draft.confidence.overall,
    decision: response.intent,
    createdTransactionId: response.createdTransactionId,
  });
  
  if (aiEvent) {
    response.eventId = aiEvent.id;
  }

  return response;
}

async function buildFinancialContext(userId: string, householdId: string | null): Promise<string> {
  const whereScope = householdId ? { householdId } : { userId };

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [transactions, budgets] = await Promise.all([
    prisma.transaction.findMany({
      where: { ...whereScope, date: { gte: since }, status: "COMPLETED", ignoreInTotals: false },
      select: { type: true, amount: true, category: { select: { name: true } } },
      take: 200,
    }),
    householdId
      ? prisma.budget.findMany({
          where: { householdId, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
          select: { amount: true, category: { select: { name: true } } },
        })
      : Promise.resolve([]),
  ]);

  const income  = transactions.filter(t => t.type === "INCOME" ).reduce((s, t) => s + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);

  const byCategory = new Map<string, number>();
  transactions.filter(t => t.type === "EXPENSE").forEach(t => {
    const k = t.category?.name ?? "Sem categoria";
    byCategory.set(k, (byCategory.get(k) ?? 0) + Number(t.amount));
  });

  const topCategories = Array.from(byCategory.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, val]) => `  - ${name}: ${formatCurrency(val)}`)
    .join("\n");

  const budgetLines = budgets
    .map(b => `  - ${b.category?.name ?? "?"}: limite ${formatCurrency(Number(b.amount))}`)
    .join("\n");

  return [
    `Receitas (30d): ${formatCurrency(income)}`,
    `Despesas (30d): ${formatCurrency(expense)}`,
    `Saldo líquido: ${formatCurrency(income - expense)}`,
    topCategories ? `\nTop despesas por categoria:\n${topCategories}` : "",
    budgetLines    ? `\nOrçamentos do mês:\n${budgetLines}` : "",
  ].filter(Boolean).join("\n");
}
