import { AICapability } from "./providers/types";
export type RouterInput = {
  capability: AICapability;
  inputType: "text" | "image" | "text+image" | "audio" | "pdf" | "csv";
  textLength: number;
  taintLevel?: "LOW" | "MEDIUM" | "HIGH";
};

export type RouterDecision = {
  providerHint: "gemini" | "openai" | "nvidia";
  allowFallback: boolean;
  reason: string;
};

function isOpenAiEnabled() {
  return process.env.OPENAI_API_KEY && process.env.AI_ENABLE_OPENAI === "true";
}

function isNimEnabled() {
  return Boolean(process.env.NIM_API_KEY);
}

export function routeAIRequest(input: RouterInput): RouterDecision {
  const hasMedia = ["image", "text+image", "audio", "pdf"].includes(input.inputType);
  const isComplex = input.textLength > 1200 || input.inputType === "pdf" || input.taintLevel === "HIGH";

  // Política: visão/OCR complexo => GPT-4o quando habilitado
  if (hasMedia && isComplex && isOpenAiEnabled() && input.inputType !== "audio") {
    return {
      providerHint: "openai",
      allowFallback: true,
      reason: "media_complexity",
    };
  }

  // Política: análises densas sem mídia => NIM
  if (!hasMedia && isComplex && isNimEnabled() && ["conversation", "planning", "suggestion"].includes(input.capability)) {
    return {
      providerHint: "nvidia",
      allowFallback: true,
      reason: "dense_reasoning_no_media",
    };
  }

  // Padrão: Gemini para ingestão leve e texto estruturado
  return {
    providerHint: "gemini",
    allowFallback: true,
    reason: "default_light_ingestion",
  };
}
