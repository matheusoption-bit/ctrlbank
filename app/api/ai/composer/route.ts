import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL ?? "gemma2-9b-it";

// ─── Contracts ───────────────────────────────────────────────────────────────

type AIComposerIntent =
  | "chat_reply"
  | "transaction_created"
  | "transaction_draft"
  | "clarification_needed";

type AIComposerTransactionDraft = {
  amount: number | null;
  date: string | null; // YYYY-MM-DD
  description: string;
  transactionType: "INCOME" | "EXPENSE" | "TRANSFER";
  categoryName: string | null;
  categoryId: string | null;
  accountId: string | null;
  accountName: string | null;
  confidence: {
    overall: number; // 0..1
    amount: number;
    date: number;
    description: number;
    category: number;
    account: number;
    transactionType: number;
  };
  source: "text" | "image" | "text+image";
};

type AIComposerResponse = {
  intent: AIComposerIntent;
  message: string;
  requiresReview: boolean;
  autoSaved: boolean;
  transactionDraft: AIComposerTransactionDraft | null;
  createdTransactionId: string | null;
  undoAvailable: boolean;
  undoToken: string | null;
  missingFields: Array<"amount" | "date" | "description" | "category" | "account" | "transactionType">;
};

// ─── Prompts and Schemas ────────────────────────────────────────────────────

const BodySchema = z.object({
  inputType: z.enum(["text", "image"]),
  content: z.string().optional(),
  imageBase64: z.string().optional(),
  mimeType: z.string().default("image/jpeg").optional(),
});

const JSON_PROMPT = `
Você é o AI Composer do CtrlBank, responsável por ler o texto ou a imagem que o usuário enviar e criar um rascunho de transação.
Extraia as informações e retorne APENAS um JSON válido.
Formato:
{
  "amount": <número float ex: 50.90, ou null>,
  "date": "<YYYY-MM-DD ou null>",
  "description": "<Nome curto do estabelecimento ou descrição, max 60 chars>",
  "transactionType": "<INCOME, EXPENSE ou TRANSFER>",
  "categoryName": "<Uma destas: Alimentação, Transporte, Saúde, Lazer, Moradia, Educação, Vestuário, Serviços, Supermercado, Farmácia, Combustível. Se incerto: Outros>",
  "accountName": "<Nome da conta bancária deduzida pelo contexto. Retorne null se não houver menção explícita>",
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
1. Recebimento/salário: INCOME. Gasto/compra: EXPENSE.
2. Seja rigoroso nas pontuações de confiança.
3. overall é a média da sua certeza sobre todo o bloco.
`;

// ─── Helpers ────────────────────────────────────────────────────────────────

async function resolveTargetAccount(userId: string, householdId: string | null, inferredAccountName: string | null) {
  let accounts = [];
  if (householdId) {
    accounts = await prisma.bankAccount.findMany({ where: { householdId } });
  } else {
    accounts = await prisma.bankAccount.findMany({ where: { userId } });
  }

  if (accounts.length === 0) return null;

  // 1. Exact or partial match if AI provided a name
  if (inferredAccountName) {
    const matched = accounts.find(a => a.name.toLowerCase().includes(inferredAccountName.toLowerCase()));
    if (matched) return matched;
  }

  // 2. Fallback to default
  const defaultAcc = accounts.find(a => a.isDefault);
  if (defaultAcc) return defaultAcc;

  // 3. Fallback to null (user stated "not the first account in the list")
  return null;
}

async function resolveCategory(userId: string, householdId: string | null, categoryName: string, transactionType: string) {
  if (categoryName === "Outros") return { id: null, name: "Outros" };
  
  const categories = await prisma.category.findMany({
    where: { 
      OR: [{ userId }, { householdId: householdId ?? "" }],
      type: transactionType as any
    }
  });

  const matched = categories.find(c => c.name.toLowerCase().includes(categoryName.toLowerCase()));
  if (matched) return { id: matched.id, name: matched.name };
  
  return { id: null, name: "Outros" };
}

function shouldAutoSave(draft: AIComposerTransactionDraft, missing: string[]): boolean {
  if (missing.length > 0) return false;
  return draft.confidence.overall >= 0.85;
}

// ─── Endpoint ─────────────────────────────────────────────────────────────

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
    let resultJsonString = "";

    if (body.inputType === "text" && body.content) {
      const groqRes = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({
          model: GROQ_MODEL,
          stream: false,
          temperature: 0,
          messages: [
            { role: "system", content: JSON_PROMPT },
            { role: "user", content: body.content },
          ],
        }),
      });

      if (!groqRes.ok) throw new Error("Erro via GROQ");
      resultJsonString = (await groqRes.json()).choices[0]?.message?.content?.trim();
    } else if (body.inputType === "image" && body.imageBase64) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([
        { inlineData: { data: body.imageBase64, mimeType: body.mimeType ?? "image/jpeg" } },
        JSON_PROMPT,
      ]);
      resultJsonString = result.response.text().trim();
    } else {
      return NextResponse.json({ error: "Dados para inputType ausentes." }, { status: 400 });
    }

    const jsonMatch = resultJsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("A IA não retornou um formato rastreável.");
    const parsed = JSON.parse(jsonMatch[0]);

    if (parsed.amount && isNaN(Number(parsed.amount))) parsed.amount = null;

    // Resolve Contexts
    const targetAccount = await resolveTargetAccount(user.id, dbUser?.householdId ?? null, parsed.accountName);
    const targetCategory = await resolveCategory(user.id, dbUser?.householdId ?? null, parsed.categoryName || "Outros", parsed.transactionType || "EXPENSE");

    const draft: AIComposerTransactionDraft = {
      amount: parsed.amount ? Number(parsed.amount) : null,
      date: parsed.date ?? new Date().toISOString().split("T")[0],
      description: parsed.description || "Transação Extraída",
      transactionType: parsed.transactionType || "EXPENSE",
      categoryName: targetCategory.name,
      categoryId: targetCategory.id,
      accountId: targetAccount?.id ?? null,
      accountName: targetAccount?.name ?? null,
      confidence: parsed.confidence || { overall: 0, amount: 0, date: 0, description: 0, category: 0, account: 0, transactionType: 0 },
      source: body.inputType,
    };

    // Calculate requirements
    const missingFields: Array<"amount" | "date" | "description" | "category" | "account" | "transactionType"> = [];
    if (!draft.amount) missingFields.push("amount");
    if (!draft.date) missingFields.push("date");
    if (!draft.description) missingFields.push("description");
    if (!draft.accountId) missingFields.push("account");
    if (!draft.transactionType) missingFields.push("transactionType");

    const response: AIComposerResponse = {
      intent: "clarification_needed",
      message: "Por favor, verifique os dados.",
      requiresReview: true,
      autoSaved: false,
      transactionDraft: draft,
      createdTransactionId: null,
      undoAvailable: false,
      undoToken: null,
      missingFields: missingFields as any,
    };

    const isAutoSaveReady = shouldAutoSave(draft, missingFields as any);

    if (draft.confidence.overall < 0.55 || missingFields.length > 0) {
      response.intent = "clarification_needed";
      response.message = missingFields.includes("account") 
        ? "Não encontrei a conta padrão, onde devo registrar isso?" 
        : "Preciso de mais informações para registrar.";
    } else if (draft.confidence.overall >= 0.55 && draft.confidence.overall < 0.85) {
      response.intent = "transaction_draft";
      response.message = "Fiz um rascunho, mas preciso da sua revisão.";
    } else if (isAutoSaveReady) {
      // PERFORM AUTO-SAVE
      const tx = await prisma.transaction.create({
        data: {
          userId: user.id,
          householdId: dbUser?.householdId,
          bankAccountId: draft.accountId!,
          categoryId: draft.categoryId,
          type: draft.transactionType,
          status: "COMPLETED",
          amount: Math.abs(draft.amount!),
          description: draft.description,
          date: new Date(draft.date!),
        }
      });
      
      response.intent = "transaction_created";
      response.message = "Transação registrada com sucesso.";
      response.requiresReview = false;
      response.autoSaved = true;
      response.createdTransactionId = tx.id;
      response.undoAvailable = true;
      response.undoToken = `undo_${tx.id}`;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error("[ai/composer] Error:", error);
    return NextResponse.json({ error: "Falha ao extrair dados" }, { status: 500 });
  }
}
