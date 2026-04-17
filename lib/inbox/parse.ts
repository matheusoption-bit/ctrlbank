import { processAiIngest } from "@/lib/ai/ingest";
import { prisma } from "@/lib/prisma";

export type InboxSource = "via_ocr" | "via_pdf" | "email_text" | "whatsapp_text" | "manual_text";

export async function parseInboxRawInput({
  userId,
  householdId,
  rawInput,
  source,
}: {
  userId: string;
  householdId: string | null;
  rawInput: string;
  source: InboxSource;
}) {
  const response = await processAiIngest({
    userId,
    householdId,
    mode: "Registrar",
    inputType: "text",
    content: rawInput,
  });

  if (response.eventId) {
    await prisma.aiCaptureEvent.update({
      where: { id: response.eventId },
      data: {
        source,
        rawText: rawInput,
      },
    }).catch(() => null);
  }

  return response;
}

export function getInboxSourceBadge(source: string) {
  if (source === "via_ocr") return "via OCR";
  if (source === "via_pdf") return "via PDF";
  return null;
}
