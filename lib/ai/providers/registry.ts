import { GeminiProvider } from "./gemini";
import { NvidiaProvider } from "./nvidia";
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

    if (geminiKey) {
      this.providers.set("gemini", new GeminiProvider(geminiKey));
    }
    if (nimKey) {
      this.providers.set("nvidia", new NvidiaProvider(nimKey));
    }
  }

  /**
   * Resolve a rota primária e fallback com tolerância a falhas estrita.
   */
  private async executeWithFallback<T>(
    capability: AICapability,
    hasMedia: boolean,
    executeFn: (provider: AIProvider) => Promise<T>
  ): Promise<T> {
    const gemini = this.providers.get("gemini");
    const nvidia = this.providers.get("nvidia");

    if (!gemini) {
      throw new Error("Missing GEMINI_API_KEY. Gemini is strictly required as the primary provider.");
    }

    // TENTATIVA 1: Gemini (Principal)
    try {
      return await executeFn(gemini);
    } catch (e: any) {
      const errMsg = e.message || "";
      const isTransientError = errMsg.includes("429") || errMsg.includes("503") || errMsg.includes("timeout") || errMsg.includes("500");
      
      console.warn(`[AI Registry] Gemini failed (Attempt 1). Error: ${errMsg}`);

      if (isTransientError) {
        console.log(`[AI Registry] Retrying Gemini in 2 seconds...`);
        await delay(2000);
        try {
          return await executeFn(gemini);
        } catch (retryError: any) {
             console.warn(`[AI Registry] Gemini failed (Attempt 2). Error: ${retryError?.message}`);
             
             const isRetryErrTransient = retryError?.message?.includes("429") || retryError?.message?.includes("503") || retryError?.message?.includes("timeout") || retryError?.message?.includes("500");
             
             // Retry adicional explícito para mídias longas/suadas
             if (hasMedia && isRetryErrTransient) {
               console.log(`[AI Registry] Retrying Gemini Media again...`);
               await delay(3000);
               try {
                  return await executeFn(gemini);
               } catch (retry2: any) {}
             }
        }
      }

      // FALLBACK COMPORTAMENTO: Se chegou aqui, Gemini caiu mesmo após retry (ou erro duro)
      if (nvidia && nvidia.supports(capability, hasMedia)) {
        console.log(`[AI Registry] Fallback triggered: Routing request to NVIDIA for capability '${capability}'`);
        try {
          return await executeFn(nvidia);
        } catch (nvidiaError: any) {
          console.error(`[AI Registry] Fallback to NVIDIA also failed. Error: ${nvidiaError?.message}`);
             throw new Error("Os serviços de inteligência artificial estão indisponíveis no momento. Tente novamente mais tarde.");
        }
      } else {
        if (hasMedia) {
           console.warn(`[AI Registry] Fallback to Nvidia denied because it lacks media support.`);
           throw new Error("Nosso motor de processamento visual/áudio está sobrecarregado (503). Por favor, aguarde alguns instantes ou tente digitar os dados manualmente.");
        }

        console.error(`[AI Registry] Fallback not possible. Nvidia supports this task: ${!!nvidia?.supports?.(capability, hasMedia)}. Has media: ${hasMedia}`);
        throw new Error("Não foi possível processar esta requisição no momento devido a instabilidades. Por favor, tente novamente de outra forma ou mais tarde.");
      }
    }
  }

  async generateText(capability: AICapability, prompt: string, opts?: AIGenerationOptions): Promise<string> {
    return this.executeWithFallback(capability, false, provider => provider.generateText(prompt, opts));
  }

  async generateStructured(capability: AICapability, prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any> {
    return this.executeWithFallback(capability, false, provider => provider.generateStructured(prompt, schema, opts));
  }

  async generateMultimodal(capability: AICapability, prompt: string, media: AIMediaFile, opts?: AIGenerationOptions): Promise<any> {
    return this.executeWithFallback(capability, true, provider => provider.generateMultimodal(prompt, media, opts));
  }
}
