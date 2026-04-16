import OpenAI from "openai";
import { AICapability, AIGenerationOptions, AIMediaFile, AIProvider } from "./types";
import { extractJsonFromModelOutput } from "./utils";

export class NvidiaProvider implements AIProvider {
  id = "nvidia";
  private client: OpenAI;
  // Recommend a robust reasoning model on NIM for text tasks
  private defaultModel = "meta/llama-3.1-405b-instruct"; 

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: "https://integrate.api.nvidia.com/v1",
    });
  }

  supports(capability: AICapability, hasMedia: boolean): boolean {
    // NVIDIA adapter will not handle media in this phase to isolate OCR risks
    if (hasMedia) return false;

    // NVIDIA is strictly a reasoning fallback for non-media tasks
    const supportedCapabilities: AICapability[] = ["conversation", "planning", "suggestion"];
    return supportedCapabilities.includes(capability);
  }

  async generateText(prompt: string, opts?: AIGenerationOptions): Promise<string> {
    const messages: any[] = [];
    
    if (opts?.systemPrompt) {
      messages.push({ role: "system", content: opts.systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const completion = await this.client.chat.completions.create({
      model: this.defaultModel,
      messages,
      temperature: opts?.temperature ?? 0.5,
      // max_tokens defaults inside OpenAI or can be specified if needed
    });

    const output = completion.choices[0]?.message?.content;
    if (!output) throw new Error("NVIDIA returned empty response");

    return output;
  }

  async generateStructured(prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any> {
    const messages: any[] = [];
    
    // Suggesting to the model that it MUST return JSON is crucial for non-native JSON mode models
    let sysPrompt = opts?.systemPrompt || "";
    if (opts?.responseFormat === "json_object") {
       sysPrompt += "\n\nVocê DEVE retornar APENAS UM JSON VÁLIDO. Nenhuma outra formatação ou texto é permitida.";
    }

    if (sysPrompt) {
      messages.push({ role: "system", content: sysPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const completion = await this.client.chat.completions.create({
      model: this.defaultModel,
      messages,
      temperature: opts?.temperature ?? 0.3, // Lower temp for structured output
    });

    const output = completion.choices[0]?.message?.content;
    if (!output) throw new Error("NVIDIA returned empty response");

    // Since NIM APIs might not enforce pure JSON responses robustly on all models, we rely on the parser
    return extractJsonFromModelOutput(output);
  }

  async generateMultimodal(prompt: string, media: AIMediaFile, opts?: AIGenerationOptions): Promise<any> {
    // Explicitly thrown as this should be intercepted by supports()
    throw new Error("NVIDIA Provider: Multimodal generating is intentionally disabled for this iteration.");
  }
}
