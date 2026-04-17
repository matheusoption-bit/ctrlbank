"use client";

import { useState } from "react";
import { MoneyDisplay } from "@/components/ui/MoneyDisplay";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  CreditCard,
  Landmark,
  PiggyBank,
  Eye,
  EyeOff,
} from "lucide-react";

/* ── Types ────────────────────────────────────────────── */
interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
  icon?: string | null;
  color?: string | null;
  user: { name: string; id: string };
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  date: Date;
  status: string;
  user?: { name: string } | null;
  bankAccount?: { name: string; color?: string | null; icon?: string | null } | null;
}

interface CaixaPageClientProps {
  overview: {
    accounts: Account[];
    totalBalance: number;
  };
  timeline: Transaction[];
}

/* ── Helpers ──────────────────────────────────────────── */
function accountIcon(type: string) {
  if (type === "CREDIT") return CreditCard;
  if (type === "SAVINGS") return PiggyBank;
  return Landmark;
}

function accountLabel(type: string) {
  if (type === "CHECKING") return "Corrente";
  if (type === "SAVINGS") return "Poupança";
  if (type === "CREDIT") return "Crédito";
  return type;
}

/* ── Group transactions by date ──────────────────────── */
function groupByDate(txs: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  txs.forEach(tx => {
    const key = format(new Date(tx.date), "yyyy-MM-dd");
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  });
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
}

/* ── Main Component ───────────────────────────────────── */
export default function CaixaPageClient({ overview, timeline }: CaixaPageClientProps) {
  const [hideBalances, setHideBalances] = useState(false);
  const grouped = groupByDate(timeline);

  // Compute totals for the timeline period
  const income = timeline.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const expense = timeline.filter(t => t.type !== "INCOME").reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Header ───────────────────────────────────────── */}
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-[-0.03em] text-foreground">Caixa</h1>
          <p className="text-[13px] text-[#555]">
            Gestão consolidada das contas da família.
          </p>
        </div>
        <button
          onClick={() => setHideBalances(!hideBalances)}
          className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#555] hover:text-white hover:border-white/[0.12] transition-all"
          title={hideBalances ? "Mostrar saldos" : "Ocultar saldos"}
        >
          {hideBalances ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </header>

      {/* ── Hero Balance ─────────────────────────────────── */}
      <section className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl px-6 py-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#555] mb-2">
          Saldo Consolidado
        </p>
        <MoneyDisplay amount={overview.totalBalance} size="hero" semantic hidden={hideBalances} />

        {/* Quick stats */}
        <div className="flex items-center gap-6 mt-5 pt-5 border-t border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-positive/10 flex items-center justify-center">
              <ArrowDownLeft size={12} className="text-positive" />
            </div>
            <div>
              <p className="text-[9px] text-[#444] uppercase tracking-wider font-semibold">Entradas</p>
              <MoneyDisplay amount={income} size="sm" hidden={hideBalances} className="text-positive" />
            </div>
          </div>
          <div className="w-px h-8 bg-white/[0.04]" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-negative/10 flex items-center justify-center">
              <ArrowUpRight size={12} className="text-negative" />
            </div>
            <div>
              <p className="text-[9px] text-[#444] uppercase tracking-wider font-semibold">Saídas</p>
              <MoneyDisplay amount={expense} size="sm" hidden={hideBalances} className="text-negative" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Accounts Carousel ────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#555] mb-3">
          Contas · {overview.accounts.length}
        </p>
        {overview.accounts.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-8 text-center">
            <Wallet size={24} className="mx-auto mb-2 text-[#333]" />
            <p className="text-[13px] text-[#555]">Nenhuma conta cadastrada.</p>
          </div>
        ) : (
          <div className="scroll-horizontal flex gap-3 pb-1 -mx-1 px-1">
            {overview.accounts.map((acc) => {
              const AccIcon = accountIcon(acc.type);
              return (
                <div
                  key={acc.id}
                  className="scroll-snap-start relative flex-shrink-0 w-[260px] bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all group"
                >
                  {/* Color accent bar */}
                  {acc.color && (
                    <div
                      className="absolute top-0 left-5 right-5 h-[2px] rounded-b-full"
                      style={{ backgroundColor: acc.color }}
                    />
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#555]">
                        <AccIcon size={16} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-foreground truncate max-w-[140px]">{acc.name}</p>
                        <p className="text-[10px] text-[#444] truncate">{acc.user.name}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#444] bg-white/[0.03] px-2 py-0.5 rounded-md">
                      {accountLabel(acc.type)}
                    </span>
                  </div>

                  <MoneyDisplay amount={acc.balance} size="md" hidden={hideBalances} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Timeline ─────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#555] mb-3">
          Extrato Familiar
        </p>
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl overflow-hidden">
          {timeline.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-[13px] text-[#444]">Nenhuma transação encontrada.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {grouped.map(([dateKey, txs]) => (
                <div key={dateKey}>
                  {/* Date header */}
                  <div className="px-5 py-2.5 bg-white/[0.015] sticky top-0 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#444]">
                      {format(new Date(dateKey), "EEEE, dd 'de' MMM", { locale: ptBR })}
                    </span>
                  </div>
                  {/* Transactions */}
                  <div className="divide-y divide-white/[0.03]">
                    {txs.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.015] transition-colors">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                            tx.type === "INCOME"
                              ? "bg-positive/[0.06] border-positive/[0.10] text-positive"
                              : "bg-negative/[0.06] border-negative/[0.10] text-negative"
                          }`}>
                            {tx.type === "INCOME" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-foreground line-clamp-1">{tx.description}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {tx.user && (
                                <span className="text-[10px] text-[#444]">{tx.user.name.split(" ")[0]}</span>
                              )}
                              {tx.user && tx.bankAccount && <span className="text-white/10">·</span>}
                              {tx.bankAccount && (
                                <span className="text-[10px] text-[#444] truncate max-w-[100px]">{tx.bankAccount.name}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <span className={`text-[13px] font-semibold tabular-nums ${
                            tx.type === "INCOME" ? "text-positive" : "text-foreground"
                          }`}>
                            {tx.type === "INCOME" ? "+" : "−"}{" "}
                            <MoneyDisplay amount={Math.abs(tx.amount)} size="sm" hidden={hideBalances} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
