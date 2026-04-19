import { AIProviderRegistry } from "@/lib/ai/providers/registry";
import { AICapability, AIGenerationOptions } from "@/lib/ai/providers/types";

export async function extractWithProvider(params: {
  registry: AIProviderRegistry;
  capability: AICapability;
  prompt: string;
  inputType: "text" | "image" | "text+image" | "audio" | "pdf" | "csv";
  imageBase64?: string;
  mimeType?: string;
  opts: AIGenerationOptions;
}) {
  const { registry, capability, prompt, inputType, imageBase64, mimeType, opts } = params;

  const isJsonExpected = opts.responseFormat === "json_object";
  if (inputType === "text" || inputType === "csv") {
    if (isJsonExpected) {
      return {
        parsedItems: await registry.generateStructured(capability, prompt, undefined, opts),
        rawTextResponse: "",
      };
    }
    return {
      parsedItems: null,
      rawTextResponse: await registry.generateText(capability, prompt, opts),
    };
  }

  const media = {
    base64: imageBase64!,
    mimeType: mimeType || (inputType === "audio" ? "audio/webm" : "image/jpeg"),
  };

  const multResult = await registry.generateMultimodal(capability, prompt, media, opts);
  if (isJsonExpected) {
    return { parsedItems: multResult, rawTextResponse: "" };
  }

  return { parsedItems: null, rawTextResponse: multResult };
}
