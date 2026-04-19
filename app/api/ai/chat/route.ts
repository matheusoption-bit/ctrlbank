import { NextRequest } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { formatCurrency } from "@/lib/format";
import { enforceHouseholdQuota, QuotaExceededError } from "@/lib/quotas/service";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL        = process.env.GROQ_MODEL ?? "gemma2-9b-it";

const BodySchema = z.object({
  message: z.string().min(1).max(1000),
});

export async function POST(req: NextRequest) {
  // Auth
  const { user } = await validateRequest();
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Validate body
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "Mensagem inválida" }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return Response.json({ error: "IA não configurada" }, { status: 503 });
  }

  // Build financial context from last 30 days
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });

  const context = await buildFinancialContext(dbUser?.householdId ?? null);
  try {
    await enforceHouseholdQuota({
      householdId: dbUser?.householdId ?? null,
      capability: "ai_chat",
      provider: "groq",
    });
  } catch (error) {
    if (error instanceof QuotaExceededError) {
      return Response.json({ error: error.message, code: error.code, details: error.details }, { status: 429 });
    }
    throw error;
  }

  const systemPrompt = `Você é um assistente de saúde financeira familiar chamado CtrlBot, integrado ao CtrlBank.
Responda sempre em português do Brasil, de forma objetiva e útil.
Limite respostas a 3 parágrafos curtos no máximo.
Não sugira produtos financeiros específicos ou faça recomendações de investimento. Seu foco é a governança da saúde financeira da família.

Diagnóstico de saúde financeira atual (últimos 30 dias):
${context}`;

  // Groq SSE streaming
  try {
    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model:       MODEL,
        stream:      true,
        max_tokens:  512,
        temperature: 0.7,
        messages: [
          { role: "system",  content: systemPrompt },
          { role: "user",    content: body.message },
        ],
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error("Groq error:", err);
      return Response.json({ error: "IA indisponível. Tente novamente mais tarde." }, { status: 502 });
    }

    // Pass SSE stream through to the client
    return new Response(groqRes.body, {
      headers: {
        "Content-Type":      "text/event-stream",
        "Cache-Control":     "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Groq fetch error:", error);
    return Response.json({ error: "Falha na comunicação com a IA." }, { status: 500 });
  }
}

// ─── Context Builder ──────────────────────────────────────────────────────────

async function buildFinancialContext(householdId: string | null): Promise<string> {
  if (!householdId) return "Nenhum dado financeiro disponível.";

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [transactions, budgets] = await Promise.all([
    prisma.transaction.findMany({
      where: { householdId, date: { gte: since }, status: "COMPLETED" },
      select: { type: true, amount: true, category: { select: { name: true } } },
      take: 200,
    }),
    prisma.budget.findMany({
      where: { householdId, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
      select: { amount: true, category: { select: { name: true } } },
    }),
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
