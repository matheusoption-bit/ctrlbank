import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { processAiIngest } from "@/lib/ai/ingest";
import { AIComposerMode } from "@/lib/ai/contracts";

const BodySchema = z.object({
  mode: z.enum(["Registrar", "Revisar", "Perguntar", "Planejar"]).default("Registrar"),
  inputType: z.enum(["text", "image", "text+image", "pdf", "csv"]),
  content: z.string().optional(),
  imageBase64: z.string().optional(),
  mimeType: z.string().optional(),
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
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "IA não configurada" }, { status: 503 });
    }

    const response = await processAiIngest({
      userId: user.id,
      householdId: dbUser?.householdId ?? null,
      mode: body.mode as AIComposerMode,
      inputType: body.inputType,
      content: body.content,
      imageBase64: body.imageBase64,
      mimeType: body.mimeType,
    });

    return NextResponse.json(response);

  } catch (error: any) {
    const message = error?.message || "Falha ao extrair dados";
    console.error("[ai/composer] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
