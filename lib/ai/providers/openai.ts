import OpenAI from "openai";
import { AICapability, AIGenerationOptions, AIMediaFile, AIProvider } from "./types";
import { extractJsonFromModelOutput } from "./utils";

export class OpenAIProvider implements AIProvider {
  id = "openai";
  private client: OpenAI;
  private defaultModel = process.env.OPENAI_MODEL || "gpt-4o";

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  supports(capability: AICapability, hasMedia: boolean): boolean {
    return Boolean(capability) || hasMedia === false || hasMedia === true;
  }

  async generateText(prompt: string, opts?: AIGenerationOptions): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: this.defaultModel,
      messages: [
        ...(opts?.systemPrompt ? [{ role: "system" as const, content: opts.systemPrompt }] : []),
        { role: "user" as const, content: prompt },
      ],
      temperature: opts?.temperature ?? 0.4,
    });

    const output = completion.choices[0]?.message?.content;
    if (!output) throw new Error("OpenAI returned empty response");
    return output;
  }

  async generateStructured(prompt: string, _schema?: any, opts?: AIGenerationOptions): Promise<any> {
    const completion = await this.client.chat.completions.create({
      model: this.defaultModel,
      messages: [
        ...(opts?.systemPrompt ? [{ role: "system" as const, content: opts.systemPrompt }] : []),
        {
          role: "user" as const,
          content: opts?.responseFormat === "json_object"
            ? `${prompt}\n\nRetorne apenas JSON válido.`
            : prompt,
        },
      ],
      temperature: opts?.temperature ?? 0.2,
      response_format: opts?.responseFormat === "json_object" ? { type: "json_object" } : undefined,
    });

    const output = completion.choices[0]?.message?.content;
    if (!output) throw new Error("OpenAI returned empty response");
    return extractJsonFromModelOutput(output);
  }

  async generateMultimodal(prompt: string, media: AIMediaFile, opts?: AIGenerationOptions): Promise<any> {
    if (!media.mimeType.startsWith("image/")) {
      throw new Error("OpenAI multimodal provider currently supports image inputs only.");
    }

    const completion = await this.client.chat.completions.create({
      model: this.defaultModel,
      messages: [
        ...(opts?.systemPrompt ? [{ role: "system" as const, content: opts.systemPrompt }] : []),
        {
          role: "user" as const,
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${media.mimeType};base64,${media.base64}`,
              },
            },
          ],
        },
      ],
      temperature: opts?.temperature ?? 0.3,
      response_format: opts?.responseFormat === "json_object" ? { type: "json_object" } : undefined,
    });

    const output = completion.choices[0]?.message?.content;
    if (!output) throw new Error("OpenAI returned empty response");

    if (opts?.responseFormat === "json_object") {
      return extractJsonFromModelOutput(output);
    }

    return output;
  }
}
