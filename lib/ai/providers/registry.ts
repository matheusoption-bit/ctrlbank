import { GeminiProvider } from "./gemini";
import { NvidiaProvider } from "./nvidia";
import { OpenAIProvider } from "./openai";
import { AICapability, AIGenerationOptions, AIMediaFile, AIProvider } from "./types";

/**
 * Espera uma quantidade de milissegundos.
 */
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class AIProviderRegistry {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    const geminiKey = process.env.GEMINI_API_KEY;
    const nimKey = process.env.NIM_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
      this.providers.set("gemini", new GeminiProvider(geminiKey));
    }
    if (nimKey) {
      this.providers.set("nvidia", new NvidiaProvider(nimKey));
    }
    if (openaiKey && process.env.AI_ENABLE_OPENAI === "true") {
      this.providers.set("openai", new OpenAIProvider(openaiKey));
    }
  }

  /**
   * Resolve rota principal + fallback com política de hint.
   */
  private async executeWithFallback<T>(
    capability: AICapability,
    hasMedia: boolean,
    executeFn: (provider: AIProvider) => Promise<T>,
    opts?: AIGenerationOptions,
  ): Promise<T> {
    const gemini = this.providers.get("gemini");
    const nvidia = this.providers.get("nvidia");
    const openai = this.providers.get("openai");

    if (!gemini) {
      throw new Error("Missing GEMINI_API_KEY. Gemini is strictly required as the primary provider.");
    }

    const hint = opts?.providerHint;
    const preferred = hint ? this.providers.get(hint) : gemini;
    const fallbackAllowed = opts?.allowFallback !== false;

    const orderedFallback: AIProvider[] = [];
    if (preferred && preferred !== gemini) orderedFallback.push(preferred);
    orderedFallback.push(gemini);
    if (openai && !orderedFallback.includes(openai)) orderedFallback.push(openai);
    if (nvidia && !orderedFallback.includes(nvidia)) orderedFallback.push(nvidia);

    let lastError: any = null;
    for (const provider of orderedFallback) {
      if (!provider.supports(capability, hasMedia)) continue;

      try {
        return await executeFn(provider);
      } catch (e: any) {
        lastError = e;
        const errMsg = e?.message || "";
        const isTransientError = errMsg.includes("429") || errMsg.includes("503") || errMsg.includes("timeout") || errMsg.includes("500");
        console.warn(`[AI Registry] ${provider.id} failed. Error: ${errMsg}`);

        if (provider.id === "gemini" && isTransientError) {
          await delay(hasMedia ? 3000 : 2000);
          try {
            return await executeFn(provider);
          } catch (retryError: any) {
            lastError = retryError;
            console.warn(`[AI Registry] ${provider.id} retry failed. Error: ${retryError?.message}`);
          }
        }

        if (!fallbackAllowed) {
          throw lastError;
        }
      }
    }

    if (hasMedia) {
      throw new Error("Nosso motor de processamento visual/áudio está sobrecarregado (503). Por favor, aguarde alguns instantes ou tente digitar os dados manualmente.");
    }

    console.error("[AI Registry] all providers failed", lastError);
    throw new Error("Não foi possível processar esta requisição no momento devido a instabilidades. Por favor, tente novamente de outra forma ou mais tarde.");
  }

  async generateText(capability: AICapability, prompt: string, opts?: AIGenerationOptions): Promise<string> {
    return this.executeWithFallback(capability, false, provider => provider.generateText(prompt, opts), opts);
  }

  async generateStructured(capability: AICapability, prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any> {
    return this.executeWithFallback(capability, false, provider => provider.generateStructured(prompt, schema, opts), opts);
  }

  async generateMultimodal(capability: AICapability, prompt: string, media: AIMediaFile, opts?: AIGenerationOptions): Promise<any> {
    return this.executeWithFallback(capability, true, provider => provider.generateMultimodal(prompt, media, opts), opts);
  }
}
