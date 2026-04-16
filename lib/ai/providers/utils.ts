/**
 * Extrai o bloco JSON de uma string de texto suja.
 * Lida com formatação markdown, texto solto e arrays.
 */
export function extractJsonFromModelOutput(output: string): any {
  if (!output || typeof output !== "string") {
    throw new Error("Invalid output received from model.");
  }

  const cleanString = output.trim();

  // Try matching JSON blocks bounded by markdown fences
  const jsonMatch = cleanString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  let potentialJson = jsonMatch ? jsonMatch[1].trim() : cleanString;

  // Sometimes models prepend or append conversational text. 
  // Let's attempt to isolate { ... } or [ ... ]
  try {
    return JSON.parse(potentialJson);
  } catch (e) {
    // If exact parsing fails, scan for the outermost brackets/braces
    const firstBrace = potentialJson.indexOf('{');
    const lastBrace = potentialJson.lastIndexOf('}');
    const firstBracket = potentialJson.indexOf('[');
    const lastBracket = potentialJson.lastIndexOf(']');

    if (firstBrace !== -1 && lastBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
        potentialJson = potentialJson.substring(firstBrace, lastBrace + 1);
    } else if (firstBracket !== -1 && lastBracket !== -1) {
        potentialJson = potentialJson.substring(firstBracket, lastBracket + 1);
    }

    try {
      return JSON.parse(potentialJson);
    } catch (finalError) {
      console.error("[JSON Extraction] Failed:", potentialJson);
      throw new Error("A IA não retornou um formato JSON rastreável.");
    }
  }
}
