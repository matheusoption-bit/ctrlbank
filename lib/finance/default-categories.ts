import { TransactionType } from "@prisma/client";

export const DEFAULT_CATEGORIES_PT_BR: ReadonlyArray<{
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}> = [
  { name: "Alimentação", type: "EXPENSE", icon: "🍽️", color: "#FF6B4A" },
  { name: "Transporte", type: "EXPENSE", icon: "🚗", color: "#4AC3FF" },
  { name: "Moradia", type: "EXPENSE", icon: "🏠", color: "#8E7CFF" },
  { name: "Saúde & Bem-estar", type: "EXPENSE", icon: "💊", color: "#2ECC71" },
  { name: "Educação", type: "EXPENSE", icon: "📚", color: "#FFB020" },
  { name: "Lazer", type: "EXPENSE", icon: "🎭", color: "#FF4AA5" },
  { name: "Cuidados pessoais", type: "EXPENSE", icon: "✂️", color: "#D9BFFF" },
  { name: "Família & Pets", type: "EXPENSE", icon: "🐾", color: "#FFD84A" },
  { name: "Contas & Assinaturas", type: "EXPENSE", icon: "📄", color: "#6B7280" },
  { name: "Impostos & Taxas", type: "EXPENSE", icon: "🏛️", color: "#B0B0B0" },
  { name: "Dívidas", type: "EXPENSE", icon: "⚠️", color: "#EF4444" },
  { name: "Outros", type: "EXPENSE", icon: "◻️", color: "#3A3A3A" },
  { name: "Salário", type: "INCOME", icon: "💼", color: "#19FF63" },
  { name: "Freelance", type: "INCOME", icon: "🧑‍💻", color: "#7FFF8A" },
  { name: "Rendimentos", type: "INCOME", icon: "📈", color: "#B5FF3C" },
  { name: "Reembolso", type: "INCOME", icon: "↩️", color: "#A0A0A0" },
  { name: "Outros (Receita)", type: "INCOME", icon: "✨", color: "#CCCCCC" },
  { name: "Transferência", type: "TRANSFER", icon: "🔄", color: "#4A4A4A" },
] as const;
