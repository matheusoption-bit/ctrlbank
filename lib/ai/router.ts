import { AICapability } from "./providers/types";
import { getPolicyConfig } from "@/lib/policy/engine";
import { isExperimentEnabled } from "@/lib/experiments/service";
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

export async function routeAIRequest(input: RouterInput & { householdId?: string | null }): Promise<RouterDecision> {
  const routingPolicy = await getPolicyConfig<{
    complexTextLength?: number;
    preferredComplexMediaProvider?: "openai" | "gemini" | "nvidia";
    preferredDenseReasoningProvider?: "openai" | "gemini" | "nvidia";
  }>("provider_routing", input.householdId);
  const hasMedia = ["image", "text+image", "audio", "pdf"].includes(input.inputType);
  const complexLength = Number(routingPolicy.complexTextLength ?? 1200);
  const isComplex = input.textLength > complexLength || input.inputType === "pdf" || input.taintLevel === "HIGH";
  const routingExperiment = await isExperimentEnabled({ key: "routing_alt_provider", householdId: input.householdId });

  if (routingExperiment.enabled) {
    const config = (routingExperiment.experiment?.config as any) ?? {};
    return {
      providerHint: config.providerHint ?? "gemini",
      allowFallback: true,
      reason: `experiment:${routingExperiment.experiment?.key ?? "routing_alt_provider"}`,
    };
  }

  // Política: visão/OCR complexo => GPT-4o quando habilitado
  if (hasMedia && isComplex && isOpenAiEnabled() && input.inputType !== "audio") {
    return {
      providerHint: routingPolicy.preferredComplexMediaProvider ?? "openai",
      allowFallback: true,
      reason: "media_complexity",
    };
  }

  // Política: análises densas sem mídia => NIM
  if (!hasMedia && isComplex && isNimEnabled() && ["conversation", "planning", "suggestion"].includes(input.capability)) {
    return {
      providerHint: routingPolicy.preferredDenseReasoningProvider ?? "nvidia",
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
