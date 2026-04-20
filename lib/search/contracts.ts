export type SearchResultGroupKey =
  | "movements"
  | "subscriptions"
  | "accounts"
  | "categories"
  | "merchants"
  | "processings";

export type SearchResultItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  label?: string;
  value?: string;
  group: SearchResultGroupKey;
  metadata?: Record<string, string | null>;
};

export type SearchResultGroup = {
  key: SearchResultGroupKey;
  title: string;
  description: string;
  total: number;
  items: SearchResultItem[];
};

export type SearchGlobalResponse = {
  query: string;
  groups: SearchResultGroup[];
  totalResults: number;
};
