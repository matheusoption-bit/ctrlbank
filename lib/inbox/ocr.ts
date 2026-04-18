import OpenAI from "openai";

const OCR_PROMPT =
  "Esta é uma imagem de um comprovante financeiro, nota fiscal ou extrato. Extraia todas as informações relevantes em texto: valor total, data, estabelecimento/merchant, itens se houver. Retorne apenas o texto extraído, sem formatação adicional.";

function ensureOpenAiClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada para OCR de imagens");
  }

  return new OpenAI({ apiKey });
}

export async function extractTextFromImageWithOcr(imageBase64: string, mimeType = "image/jpeg") {
  const client = ensureOpenAiClient();
  const model = process.env.OPENAI_VISION_MODEL ?? "gpt-4o";

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: OCR_PROMPT },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
  });

  const output = response.choices[0]?.message?.content?.trim();
  if (!output) {
    throw new Error("Falha ao extrair texto da imagem via OCR");
  }

  return output;
}

export async function extractTextFromPdf(buffer: Buffer) {
  try {
    if (typeof globalThis.DOMMatrix === "undefined") {
      class DOMMatrixFallback {
        multiply() {
          return this;
        }
        translate() {
          return this;
        }
        scale() {
          return this;
        }
      }
      (globalThis as any).DOMMatrix = DOMMatrixFallback;
    }

    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    let text = "";

    try {
      const parsed = await parser.getText();
      text = parsed.text?.trim() ?? "";
    } finally {
      await parser.destroy();
    }

    if (!text) {
      throw new Error("Falha ao extrair texto do PDF");
    }

    return text;
  } catch (error: any) {
    const msg = String(error?.message ?? "");
    if (msg.includes("DOMMatrix is not defined")) {
      throw new Error("Falha ao interpretar PDF neste ambiente (DOMMatrix). Tente enviar imagem ou texto do documento.");
    }
    throw error;
  }
}

export function isImageMimeType(mimeType: string) {
  return mimeType.startsWith("image/");
}

export function isPdfMimeType(mimeType: string) {
  return mimeType === "application/pdf";
}
