export type PromptGuardResult = {
  taintLevel: "LOW" | "MEDIUM" | "HIGH";
  suspiciousPatterns: string[];
  outOfDomain: boolean;
  shouldEscalateToReview: boolean;
};

const INJECTION_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  { label: "prompt_override", regex: /(ignore\s+(all|previous|prior)\s+instructions|system\s+prompt|developer\s+message)/i },
  { label: "secrets_exfiltration", regex: /(api[_\s-]?key|token|senha|password|secret|credential)/i },
  { label: "tooling_commands", regex: /(rm\s+-rf|curl\s+http|wget\s+http|powershell|bash\s+-c)/i },
  { label: "jailbreak", regex: /(jailbreak|bypass|dan mode|do anything now)/i },
];

const FINANCIAL_HINTS = /(r\$|pix|fatura|extrato|cart[aã]o|boleto|compra|pagamento|dep[oó]sito|sal[aá]rio|transfer[êe]ncia|receita|despesa|conta|banco)/i;

export function classifyTaintLevel(params: {
  sourceChannel?: string | null;
  inputType?: string | null;
}): "LOW" | "MEDIUM" | "HIGH" {
  const channel = (params.sourceChannel ?? "").toLowerCase();
  const inputType = (params.inputType ?? "").toLowerCase();

  if (["whatsapp", "email"].includes(channel)) return "HIGH";
  if (["image", "pdf", "audio", "text+image"].includes(inputType)) return "MEDIUM";
  return "LOW";
}

export function runPromptGuard(input: {
  text: string;
  sourceChannel?: string | null;
  inputType?: string | null;
  strict?: boolean;
}): PromptGuardResult {
  const text = (input.text ?? "").trim();
  const baseTaint = classifyTaintLevel({ sourceChannel: input.sourceChannel, inputType: input.inputType });

  const suspiciousPatterns = INJECTION_PATTERNS
    .filter((item) => item.regex.test(text))
    .map((item) => item.label);

  const outOfDomain = text.length > 24 && !FINANCIAL_HINTS.test(text);

  let taintLevel: "LOW" | "MEDIUM" | "HIGH" = baseTaint;
  if (suspiciousPatterns.length > 0) taintLevel = "HIGH";
  else if (outOfDomain && baseTaint === "LOW") taintLevel = "MEDIUM";

  const shouldEscalateToReview = taintLevel === "HIGH" || (input.strict && outOfDomain) || suspiciousPatterns.length > 0;

  return {
    taintLevel,
    suspiciousPatterns,
    outOfDomain,
    shouldEscalateToReview,
  };
}
