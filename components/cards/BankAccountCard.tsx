"use client";

import { CreditCard, Landmark, PiggyBank, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";

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
  compact?: boolean;
}

const typeConfig = {
  CHECKING: { icon: Landmark, label: "Conta Corrente" },
  SAVINGS: { icon: PiggyBank, label: "Poupança" },
  CREDIT: { icon: CreditCard, label: "Cartão de Crédito" },
  INVESTMENT: { icon: Briefcase, label: "Investimentos" },
};

export function BankAccountCard({ account, onClick, compact = false }: BankAccountCardProps) {
  const Icon = typeConfig[account.type]?.icon || Landmark;
  const isCredit = account.type === "CREDIT";
  const formattedBalance = formatCurrency(account.balance);
  const formattedLimit = isCredit && account.creditLimit
    ? formatCurrency(account.creditLimit)
    : null;

  // Credit usage percentage
  const usagePercent = isCredit && account.creditLimit && account.creditLimit > 0
    ? Math.min((account.balance / account.creditLimit) * 100, 100)
    : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "card-bank text-left w-full appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background",
        compact ? "min-w-[280px] w-[280px]" : "",
        onClick && "cursor-pointer"
      )}
      style={account.color ? { backgroundColor: account.color } : {}}
    >
      {/* Top: Name + Type icon */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="font-semibold text-base tracking-tight text-white truncate max-w-[200px]">
            {account.name}
          </h3>
          <p className="text-xs text-white/60 mt-0.5">
            {typeConfig[account.type]?.label}
          </p>
        </div>
        <div className="p-2 bg-white/[0.08] rounded-lg">
          <Icon className="w-4.5 h-4.5 text-white/80" strokeWidth={1.5} />
        </div>
      </div>

      {/* Chip decorativo (estilo cartão físico) */}
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <div className="w-8 h-5.5 rounded bg-gradient-to-br from-white/20 to-white/5 border border-white/10" />
        <div className="w-5 h-5.5 rounded bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/5" />
      </div>

      {/* Balance */}
      <div className="relative z-10">
        <p className="text-xs text-white/50 mb-1 font-medium">
          {isCredit ? "Fatura Atual" : "Saldo Disponível"}
        </p>
        <p
          className="text-2xl font-bold tracking-tight text-white"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {formattedBalance}
        </p>

        {/* Credit limit bar */}
        {isCredit && formattedLimit && (
          <div className="mt-4 space-y-2">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-primary"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Limite usado</span>
              <span className="text-white/70">
                {formattedBalance} de {formattedLimit}
              </span>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
