import { normalizeMerchantKey } from "@/lib/finance/merchant-dictionary";

const NOISE_TOKENS = new Set([
  "br",
  "brazil",
  "bill",
  "billing",
  "card",
  "cartao",
  "compra",
  "com",
  "credit",
  "credito",
  "debit",
  "debito",
  "digital",
  "ecom",
  "intl",
  "international",
  "mercadopago",
  "online",
  "pag",
  "payment",
  "purchase",
  "sa",
  "serv",
  "service",
  "services",
  "store",
  "subscription",
  "subs",
  "tv",
  "www",
]);

const WHOLE_INPUT_ALIASES: Array<[RegExp, string]> = [
  [/\bapple com bill\b/g, "apple"],
  [/\bapple services\b/g, "apple"],
  [/\bgoogle youtube\b/g, "youtube"],
  [/\byoutube premium\b/g, "youtube"],
  [/\bamazon prime video\b/g, "prime video"],
  [/\bprimevideo\b/g, "prime video"],
  [/\bspotifyusa\b/g, "spotify"],
  [/\bnetflix com\b/g, "netflix"],
  [/\boffice 365\b/g, "microsoft office"],
  [/\bchat gpt\b/g, "chatgpt"],
  [/\bhbo max\b/g, "max"],
  [/\bicloud\b/g, "icloud"],
  [/\bgoogle one\b/g, "google one"],
];

const TOKEN_ALIASES = new Map<string, string>([
  ["chatgpt", "openai"],
  ["openai", "openai"],
  ["youtube", "youtube"],
  ["primevideo", "prime video"],
  ["spotifyusa", "spotify"],
  ["icloud", "icloud"],
]);

function compactMerchantNoise(normalized: string) {
  let value = ` ${normalized} `;

  for (const [pattern, replacement] of WHOLE_INPUT_ALIASES) {
    value = value.replace(pattern, replacement);
  }

  return value.replace(/\s+/g, " ").trim();
}

export function normalizeSubscriptionMerchant(raw: string | null | undefined) {
  if (!raw) return "";

  const compacted = compactMerchantNoise(normalizeMerchantKey(raw));
  const tokens = compacted
    .split(" ")
    .map((token) => TOKEN_ALIASES.get(token) ?? token)
    .filter((token) => token.length > 1)
    .filter((token) => !/^\d+$/.test(token))
    .filter((token) => !NOISE_TOKENS.has(token));

  const normalized = tokens.join(" ").trim();
  return normalized || compacted;
}

export function merchantTokenSet(raw: string | null | undefined) {
  return new Set(normalizeSubscriptionMerchant(raw).split(" ").filter(Boolean));
}

export function merchantMatchesQuery(merchant: string | null | undefined, query: string) {
  const normalizedMerchant = normalizeSubscriptionMerchant(merchant);
  const normalizedQuery = normalizeSubscriptionMerchant(query);

  if (!normalizedQuery) return true;
  if (normalizedMerchant.includes(normalizedQuery)) return true;

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  return queryTokens.every((token) => normalizedMerchant.includes(token));
}
