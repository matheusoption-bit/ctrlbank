"use client";

import { motion } from "framer-motion";
import { CreditCard, Landmark, PiggyBank, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SafeBankAccount {
  id: string;
  name: string;
  type: "CHECKING" | "SAVINGS" | "CREDIT" | "INVESTMENT";
  balance: number;
  color: string | null;
  creditLimit: number | null;
  invoiceClosingDay: number | null;
  invoiceDueDay: number | null;
}

interface BankAccountCardProps {
  account: SafeBankAccount;
  onClick?: () => void;
}

const typeConfig = {
  CHECKING: { icon: Landmark, label: "Conta Corrente" },
  SAVINGS: { icon: PiggyBank, label: "Poupança" },
  CREDIT: { icon: CreditCard, label: "Cartão de Crédito" },
  INVESTMENT: { icon: Briefcase, label: "Investimentos" },
};

export function BankAccountCard({ account, onClick }: BankAccountCardProps) {
  const Icon = typeConfig[account.type]?.icon || Landmark;
  const isCredit = account.type === "CREDIT";

  // Formatação de Moeda
  const formattedBalance = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(account.balance);

  const formattedLimit = isCredit && account.creditLimit 
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(account.creditLimit) 
    : null;

  return (
    <motion.button
      type="button"
      whileHover={{ scale: onClick ? 1.02 : 1, y: onClick ? -2 : 0 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-[20px] p-6 text-left cursor-pointer shadow-soft transition-shadow hover:shadow-soft-lg w-full text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        // Fallback default style for cards if color is not provided
        !account.color && "bg-gradient-to-br from-surface to-[#2A2A2A] border border-white/10"
      )}
      style={account.color ? { backgroundColor: account.color } : {}}
    >
      {/* Glow Effect / Glassmorphism */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="font-semibold text-lg tracking-tight truncate max-w-[200px]">{account.name}</h3>
          <p className="text-xs text-white/70 font-medium">{typeConfig[account.type]?.label}</p>
        </div>
        <div className="p-2 bg-black/20 rounded-full backdrop-blur-md">
          <Icon className="w-5 h-5 text-white/90" />
        </div>
      </div>

      <div className="mt-4 relative z-10">
        <p className="text-sm font-medium text-white/70 mb-1">
          {isCredit ? "Fatura Atual" : "Saldo Disponível"}
        </p>
        <p className="text-2xl font-bold tracking-tighter" style={{ fontVariantNumeric: "tabular-nums" }}>
          {formattedBalance}
        </p>

        {isCredit && formattedLimit && (
          <div className="mt-5 flex items-center justify-between text-xs font-medium bg-black/20 p-3 rounded-xl backdrop-blur-sm">
            <span className="text-white/70">Limite Disponível</span>
            <span>{formattedLimit}</span>
          </div>
        )}
      </div>
    </motion.button>
  );
}
