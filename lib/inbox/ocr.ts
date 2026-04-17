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

  const response = await client.responses.create({
    model,
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: OCR_PROMPT },
          {
            type: "input_image",
            image_url: `data:${mimeType};base64,${imageBase64}`,
          },
        ],
      },
    ],
  });

  const output = response.output_text?.trim();
  if (!output) {
    throw new Error("Falha ao extrair texto da imagem via OCR");
  }

  return output;
}

export async function extractTextFromPdf(buffer: Buffer) {
  const { default: pdfParse } = await import("pdf-parse");
  const parsed = await pdfParse(buffer);
  const text = parsed.text?.trim();

  if (!text) {
    throw new Error("Falha ao extrair texto do PDF");
  }

  return text;
}

export function isImageMimeType(mimeType: string) {
  return mimeType.startsWith("image/");
}

export function isPdfMimeType(mimeType: string) {
  return mimeType === "application/pdf";
}
