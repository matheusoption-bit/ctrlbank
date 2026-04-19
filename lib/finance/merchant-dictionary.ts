export const MERCHANT_SEED_MAP: Record<string, string> = {
  ifood: "Alimentação",
  "uber eats": "Alimentação",
  rappi: "Alimentação",
  mercado: "Alimentação",
  atacadao: "Alimentação",
  carrefour: "Alimentação",
  extra: "Alimentação",
  shell: "Transporte",
  ipiranga: "Transporte",
  uber: "Transporte",
  "99": "Transporte",
  azul: "Transporte",
  gol: "Transporte",
  latam: "Transporte",
  drogasil: "Saúde & Bem-estar",
  "droga raia": "Saúde & Bem-estar",
  "pague menos": "Saúde & Bem-estar",
  unimed: "Saúde & Bem-estar",
  netflix: "Contas & Assinaturas",
  spotify: "Contas & Assinaturas",
  "youtube premium": "Contas & Assinaturas",
  "amazon prime": "Contas & Assinaturas",
  vivo: "Contas & Assinaturas",
  claro: "Contas & Assinaturas",
  tim: "Contas & Assinaturas",
  "enel": "Moradia",
  "sabesp": "Moradia",
  "caesb": "Moradia",
  nubank: "Transferência",
  itau: "Transferência",
  bradesco: "Transferência",
  santander: "Transferência",
  caixa: "Transferência",
  picpay: "Transferência",
  mercado_pago: "Transferência",
};

export function normalizeMerchantKey(raw: string) {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function suggestCategoryFromMerchant(merchant: string) {
  const normalized = normalizeMerchantKey(merchant);
  return Object.entries(MERCHANT_SEED_MAP).find(([key]) => normalized.includes(key))?.[1] ?? null;
}
