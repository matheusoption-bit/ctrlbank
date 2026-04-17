import { prisma } from "@/lib/prisma";
import { createManagedTransaction } from "@/app/actions/transactions";
import { AIProviderRegistry } from "./providers/registry";
import { AICapability, AIGenerationOptions } from "./providers/types";
import { extractJsonFromModelOutput } from "./providers/utils";
import { randomUUID } from "crypto";
import { AIComposerTransactionDraft, AIComposerResponse, AIComposerMode, AIComposerBatchDraftItem } from "@/lib/ai/contracts";
import { resolveTargetAccount, resolveCategory, shouldAutoSave, logAiCaptureEvent } from "@/lib/ai/composer";
import { parseCSVForAI } from "./csv-pdf-parser";
import { formatCurrency } from "@/lib/format";

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

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
  const opts: AIGenerationOptions = { responseFormat: isJsonExpected ? "json_object" : "text" };

  let parsedItems: any = null;
  let rawTextResponse = "";

  if (input.inputType === "text" || input.inputType === "csv") {
    let processedContent = input.content;
    if (input.inputType === "csv" && input.content) {
      processedContent = parseCSVForAI(input.content);
    }
    
    const textPrompt = processedContent ? `${prompt}\n\nEntrada:\n${processedContent}` : prompt;
    if (isJsonExpected) {
      parsedItems = await registry.generateStructured(capability, textPrompt, undefined, opts);
    } else {
      rawTextResponse = await registry.generateText(capability, textPrompt, opts);
    }
  } else {
    // image, text+image, pdf, audio
    const textPrompt = input.content ? `${prompt}\n\nEntrada do Usuário: "${input.content}"` : prompt;
    const media = {
      base64: input.imageBase64!,
      mimeType: input.mimeType || (input.inputType === "audio" ? "audio/webm" : "image/jpeg")
    };
    const multResult = await registry.generateMultimodal(capability, textPrompt, media, opts);
    if (isJsonExpected) {
      parsedItems = multResult;
    } else {
      rawTextResponse = multResult;
    }
  }

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
      } catch (e) {
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
  const processDraft = async (parsed: any): Promise<AIComposerTransactionDraft> => {
    if (parsed.amount && isNaN(Number(parsed.amount))) parsed.amount = null;
    const targetAccount = await resolveTargetAccount(input.userId, input.householdId, parsed.accountName, parsed.description);
    const targetCategory = await resolveCategory(input.userId, input.householdId, parsed.categoryName || "Outros", parsed.transactionType || "EXPENSE", parsed.description);

    return {
      amount: parsed.amount ? Number(parsed.amount) : null,
      date: parsed.date ?? new Date().toISOString().split("T")[0],
      description: parsed.description || "Movimento Extraído",
      transactionType: parsed.transactionType || "EXPENSE",
      categoryName: targetCategory.name,
      categoryId: targetCategory.id,
      accountId: targetAccount?.id ?? null,
      accountName: targetAccount?.name ?? null,
      confidence: parsed.confidence || { overall: 0, amount: 0, date: 0, description: 0, category: 0, account: 0, transactionType: 0 },
      source: input.inputType,
    };
  };

  if (isBatch) {
    const drafts = await Promise.all((parsedItems as any[]).map(item => processDraft(item)));
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
  const draft = await processDraft(parsedItems);
  const missingFields: Array<"amount" | "date" | "description" | "category" | "account" | "transactionType"> = [];
  if (!draft.amount) missingFields.push("amount");
  if (!draft.date) missingFields.push("date");
  if (!draft.description) missingFields.push("description");
  if (!draft.accountId) missingFields.push("account");
  if (!draft.transactionType) missingFields.push("transactionType");

  const response: AIComposerResponse = {
    intent: "clarification_needed",
    message: "Verifique os dados.",
    requiresReview: true,
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

  const isAutoSave = shouldAutoSave(draft, missingFields as any[]);

  if (draft.confidence.overall < 0.55 || missingFields.length > 0) {
    response.intent = "clarification_needed";
    response.message = missingFields.includes("account") 
      ? "Não encontrei a conta padrão, onde devo registrar isso?" 
      : "Preciso de mais informações para registrar.";
  } else if (draft.confidence.overall >= 0.55 && draft.confidence.overall < 0.85) {
    response.intent = "transaction_draft";
    response.message = "Fiz um rascunho, mas preciso da sua revisão.";
  } else if (isAutoSave && !input.disableAutoSave) {
    // AUTO-SAVE
    const tx = await createManagedTransaction({
      userId: input.userId,
      householdId: input.householdId,
      bankAccountId: draft.accountId!,
      categoryId: draft.categoryId,
      type: draft.transactionType,
      status: "COMPLETED",
      amount: Math.abs(draft.amount!),
      description: draft.description,
      date: new Date(draft.date!),
    });
    
    response.intent = "transaction_created";
    response.message = "Movimento registrado com sucesso.";
    response.requiresReview = false;
    response.autoSaved = true;
    response.createdTransactionId = tx.id;
    response.undoAvailable = true;
    response.undoToken = `undo_${tx.id}`;
  } else {
    response.intent = "transaction_draft";
    response.message = "Entrada pronta para salvar. Revise rapidamente antes de confirmar.";
    response.requiresReview = true;
  }

  // Audit
  const aiEvent = await logAiCaptureEvent({
    userId: input.userId,
    householdId: input.householdId,
    captureGroupId,
    source: input.inputType,
    inputType: "composer",
    rawText: input.content ?? null,
    normalizedDraft: draft,
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
