import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { validateRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // Auth check
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY não configurada" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { imageBase64, mimeType = "image/jpeg" } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: "Imagem não fornecida" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Você é um assistente financeiro especializado em documentos brasileiros.
Analise esta imagem (pode ser comprovante PIX, nota fiscal, recibo, boleto, cupom fiscal ou qualquer documento de pagamento brasileiro).

Extraia as informações e retorne APENAS um JSON válido, sem markdown, sem explicação, apenas o JSON:
{
  "valor": <número decimal, ex: 45.90>,
  "data": "<data no formato YYYY-MM-DD, se não encontrar use a data de hoje>",
  "estabelecimento": "<nome do estabelecimento, loja ou beneficiário>",
  "categoria": "<uma das opções: Alimentação, Transporte, Saúde, Lazer, Moradia, Educação, Vestuário, Serviços, Supermercado, Farmácia, Combustível, Outros>",
  "descricao": "<descrição curta e objetiva da transação, máximo 60 caracteres>",
  "tipo": "<EXPENSE ou INCOME>"
}

Regras:
- Se o documento for um recebimento (ex: venda, salário recebido), tipo = INCOME
- Se for um pagamento ou compra, tipo = EXPENSE
- Se não conseguir ler algum campo, use null para esse campo
- O valor deve ser apenas o número, sem R$ ou pontos de milhar`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
      prompt,
    ]);

    const responseText = result.response.text().trim();
    
    // Extrai o bloco de JSON caso o Gemini inclua algum texto extra antes ou depois
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Não foi possível extrair dados legíveis da imagem");
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      throw new Error("Não foi possível extrair dados legíveis da imagem");
    }

    return NextResponse.json({
      success: true,
      data: {
        valor: parsed.valor ?? null,
        data: parsed.data ?? new Date().toISOString().split("T")[0],
        estabelecimento: parsed.estabelecimento ?? null,
        categoria: parsed.categoria ?? "Outros",
        descricao: parsed.descricao ?? null,
        tipo: parsed.tipo ?? "EXPENSE",
      },
    });
  } catch (error) {
    console.error("[receipt-scan] Erro:", error);
    const msg = error instanceof Error ? error.message : "Falha ao processar o comprovante. Tente novamente.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
