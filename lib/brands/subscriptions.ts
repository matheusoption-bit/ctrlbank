import { normalizeSubscriptionMerchant } from "@/lib/subscriptions/normalize";

export type SubscriptionBrandDefinition = {
  brandKey: string;
  displayName: string;
  aliases: string[];
  merchantMatchers: string[];
  logoPath: string;
  themeColor?: string;
};

export type ResolvedSubscriptionBrand = {
  brandKey: string;
  displayName: string;
  logoPath: string;
  themeColor?: string;
  matchConfidence: number;
  matchedBy: string;
};

function simpleIcon(slug: string, color?: string) {
  const normalizedColor = color?.replace("#", "");
  return normalizedColor
    ? `https://cdn.simpleicons.org/${slug}/${normalizedColor}`
    : `https://cdn.simpleicons.org/${slug}`;
}

export const SUBSCRIPTION_BRANDS: SubscriptionBrandDefinition[] = [
  {
    brandKey: "adobe",
    displayName: "Adobe",
    aliases: ["adobe", "adobe creative cloud", "creative cloud"],
    merchantMatchers: ["adobe", "creative cloud"],
    logoPath: simpleIcon("adobe", "#FF0000"),
    themeColor: "#FF0000",
  },
  {
    brandKey: "openai",
    displayName: "OpenAI / ChatGPT",
    aliases: ["openai", "chatgpt", "chat gpt", "gpt plus"],
    merchantMatchers: ["openai", "chatgpt"],
    logoPath: simpleIcon("openai", "#10A37F"),
    themeColor: "#10A37F",
  },
  {
    brandKey: "netflix",
    displayName: "Netflix",
    aliases: ["netflix", "netflix com"],
    merchantMatchers: ["netflix"],
    logoPath: simpleIcon("netflix", "#E50914"),
    themeColor: "#E50914",
  },
  {
    brandKey: "apple",
    displayName: "Apple",
    aliases: ["apple", "apple tv", "apple com bill", "apple services"],
    merchantMatchers: ["apple", "apple tv", "icloud"],
    logoPath: simpleIcon("apple", "#A2AAAD"),
    themeColor: "#A2AAAD",
  },
  {
    brandKey: "spotify",
    displayName: "Spotify",
    aliases: ["spotify", "spotifyusa"],
    merchantMatchers: ["spotify"],
    logoPath: simpleIcon("spotify", "#1DB954"),
    themeColor: "#1DB954",
  },
  {
    brandKey: "github",
    displayName: "GitHub",
    aliases: ["github", "github copilot"],
    merchantMatchers: ["github", "copilot"],
    logoPath: simpleIcon("github", "#181717"),
    themeColor: "#181717",
  },
  {
    brandKey: "cursor",
    displayName: "Cursor",
    aliases: ["cursor", "cursor ai"],
    merchantMatchers: ["cursor"],
    logoPath: simpleIcon("cursor", "#000000"),
    themeColor: "#000000",
  },
  {
    brandKey: "disney-plus",
    displayName: "Disney+",
    aliases: ["disney plus", "disney+", "disneyplus"],
    merchantMatchers: ["disney", "disney plus", "disneyplus"],
    logoPath: simpleIcon("disneyplus", "#113CCF"),
    themeColor: "#113CCF",
  },
  {
    brandKey: "prime-video",
    displayName: "Prime Video",
    aliases: ["prime video", "amazon prime", "amazon prime video", "primevideo"],
    merchantMatchers: ["prime video", "amazon prime", "primevideo"],
    logoPath: simpleIcon("primevideo", "#00A8E1"),
    themeColor: "#00A8E1",
  },
  {
    brandKey: "youtube",
    displayName: "YouTube",
    aliases: ["youtube", "youtube premium", "google youtube"],
    merchantMatchers: ["youtube"],
    logoPath: simpleIcon("youtube", "#FF0000"),
    themeColor: "#FF0000",
  },
  {
    brandKey: "google-one",
    displayName: "Google One",
    aliases: ["google one", "google storage", "googleone"],
    merchantMatchers: ["google one", "google storage"],
    logoPath: simpleIcon("googleone", "#4285F4"),
    themeColor: "#4285F4",
  },
  {
    brandKey: "icloud",
    displayName: "iCloud",
    aliases: ["icloud", "apple icloud"],
    merchantMatchers: ["icloud"],
    logoPath: simpleIcon("icloud", "#0A84FF"),
    themeColor: "#0A84FF",
  },
  {
    brandKey: "dropbox",
    displayName: "Dropbox",
    aliases: ["dropbox"],
    merchantMatchers: ["dropbox"],
    logoPath: simpleIcon("dropbox", "#0061FF"),
    themeColor: "#0061FF",
  },
  {
    brandKey: "figma",
    displayName: "Figma",
    aliases: ["figma"],
    merchantMatchers: ["figma"],
    logoPath: simpleIcon("figma", "#F24E1E"),
    themeColor: "#F24E1E",
  },
  {
    brandKey: "canva",
    displayName: "Canva",
    aliases: ["canva"],
    merchantMatchers: ["canva"],
    logoPath: simpleIcon("canva", "#00C4CC"),
    themeColor: "#00C4CC",
  },
  {
    brandKey: "notion",
    displayName: "Notion",
    aliases: ["notion"],
    merchantMatchers: ["notion"],
    logoPath: simpleIcon("notion", "#000000"),
    themeColor: "#000000",
  },
  {
    brandKey: "max",
    displayName: "Max",
    aliases: ["max", "hbo max", "hbomax"],
    merchantMatchers: ["hbo max", "hbomax", "max"],
    logoPath: simpleIcon("max", "#5252FF"),
    themeColor: "#5252FF",
  },
  {
    brandKey: "deezer",
    displayName: "Deezer",
    aliases: ["deezer"],
    merchantMatchers: ["deezer"],
    logoPath: simpleIcon("deezer", "#FEAA2D"),
    themeColor: "#FEAA2D",
  },
  {
    brandKey: "microsoft-office",
    displayName: "Microsoft / Office",
    aliases: ["microsoft", "office", "office 365", "microsoft office"],
    merchantMatchers: ["microsoft", "office", "office 365"],
    logoPath: simpleIcon("microsoftoffice", "#D83B01"),
    themeColor: "#D83B01",
  },
  {
    brandKey: "1password",
    displayName: "1Password",
    aliases: ["1password", "one password"],
    merchantMatchers: ["1password", "one password"],
    logoPath: simpleIcon("1password", "#3B66BC"),
    themeColor: "#3B66BC",
  },
];

export function getSubscriptionBrandByKey(brandKey: string | null | undefined) {
  if (!brandKey) return null;
  return SUBSCRIPTION_BRANDS.find((brand) => brand.brandKey === brandKey) ?? null;
}

function scoreBrandMatch(merchant: string, brand: SubscriptionBrandDefinition) {
  let bestScore = 0;
  let matchedBy = "";

  for (const alias of [...brand.aliases, ...brand.merchantMatchers]) {
    const normalizedAlias = normalizeSubscriptionMerchant(alias);
    if (!normalizedAlias) continue;

    if (merchant === normalizedAlias) {
      return { score: 1, matchedBy: alias };
    }

    if (merchant.includes(normalizedAlias)) {
      if (0.92 > bestScore) {
        bestScore = 0.92;
        matchedBy = alias;
      }
      continue;
    }

    const aliasTokens = normalizedAlias.split(" ").filter(Boolean);
    if (aliasTokens.length > 1 && aliasTokens.every((token) => merchant.includes(token))) {
      if (0.85 > bestScore) {
        bestScore = 0.85;
        matchedBy = alias;
      }
    }
  }

  return { score: bestScore, matchedBy };
}

export function resolveSubscriptionBrand(rawMerchant: string | null | undefined): ResolvedSubscriptionBrand | null {
  const normalizedMerchant = normalizeSubscriptionMerchant(rawMerchant);
  if (!normalizedMerchant) return null;

  let winner: ResolvedSubscriptionBrand | null = null;

  for (const brand of SUBSCRIPTION_BRANDS) {
    const { score, matchedBy } = scoreBrandMatch(normalizedMerchant, brand);
    if (!score) continue;

    if (!winner || score > winner.matchConfidence) {
      winner = {
        brandKey: brand.brandKey,
        displayName: brand.displayName,
        logoPath: brand.logoPath,
        themeColor: brand.themeColor,
        matchConfidence: score,
        matchedBy,
      };
    }
  }

  return winner;
}
