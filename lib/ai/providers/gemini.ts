import { GoogleGenAI } from "@google/genai";
import { AIGenerationOptions, AIMediaFile, AIProvider } from "./types";
import { extractJsonFromModelOutput } from "./utils";

export class GeminiProvider implements AIProvider {
  id = "gemini";
  private client: GoogleGenAI;
  private defaultModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  constructor(apiKey: string) {
    // Uses the new @google/genai syntax
    this.client = new GoogleGenAI({ apiKey });
  }

  supports(): boolean {
    // Gemini supports everything and is the primary for all modalities
    return true;
  }

  async generateText(prompt: string, opts?: AIGenerationOptions): Promise<string> {
    const response = await this.client.models.generateContent({
      model: this.defaultModel,
      contents: prompt,
      config: {
        systemInstruction: opts?.systemPrompt,
        temperature: opts?.temperature,
      }
    });

    if (!response.text) {
      throw new Error("Gemini returned empty response");
    }
    return response.text;
  }

  async generateStructured(prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any> {
    const isJsonFormat = opts?.responseFormat === "json_object" || !!schema;

    const response = await this.client.models.generateContent({
      model: this.defaultModel,
      contents: prompt,
      config: {
        systemInstruction: opts?.systemPrompt,
        temperature: opts?.temperature,
        responseMimeType: isJsonFormat ? "application/json" : "text/plain",
        // GenAI SDK allows responseSchema directly depending on version, 
        // but we rely on robust parsing from `extractJsonFromModelOutput` as fallback always
        responseSchema: schema ? schema : undefined, 
      }
    });

    if (!response.text) throw new Error("Gemini returned empty response");
    
    return extractJsonFromModelOutput(response.text);
  }

  async generateMultimodal(prompt: string, media: AIMediaFile, opts?: AIGenerationOptions): Promise<any> {
    const isJsonFormat = opts?.responseFormat === "json_object";

    // GoogleGenAI formats inlineData as a part of Part objects
    const response = await this.client.models.generateContent({
      model: this.defaultModel,
      contents: [
        {
          inlineData: {
            data: media.base64,
            mimeType: media.mimeType,
          }
        },
        prompt
      ],
      config: {
        systemInstruction: opts?.systemPrompt,
        temperature: opts?.temperature,
        responseMimeType: isJsonFormat ? "application/json" : "text/plain",
      }
    });

    if (!response.text) throw new Error("Gemini returned empty response");

    if (isJsonFormat) {
       return extractJsonFromModelOutput(response.text);
    }

    return response.text;
  }
}
