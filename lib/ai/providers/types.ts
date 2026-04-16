export type AICapability =
  | "transaction_extract"
  | "conversation"
  | "planning"
  | "suggestion"
  | "transcription";

export interface AIProviderConfig {
  apiKey: string;
  defaultModel?: string; // Optional if provider supplies its own default
}

export interface AIGenerationOptions {
  systemPrompt?: string;
  responseFormat?: "json_object" | "text";
  temperature?: number;
}

export interface AIMediaFile {
  base64: string;
  mimeType: string;
}

export interface AIProvider {
  id: string;
  
  // Checking capability based on task and if media is present
  supports(capability: AICapability, hasMedia: boolean): boolean;

  generateText(prompt: string, opts?: AIGenerationOptions): Promise<string>;
  
  // Can either take a JSON schema or a text prompt formatted as JSON request
  generateStructured(prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any>;
  
  generateMultimodal(prompt: string, media: AIMediaFile, opts?: AIGenerationOptions): Promise<any>;
}
