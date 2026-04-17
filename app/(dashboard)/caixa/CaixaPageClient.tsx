"use client";

import { MoneyDisplay } from "@/components/ui/MoneyDisplay";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

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

export default function CaixaPageClient({ overview, timeline }: CaixaPageClientProps) {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Caixa</h1>
        <p className="text-secondary mt-1 text-sm">Gestão consolidada das contas da família.</p>
      </header>

      {/* Saldo Consolidado */}
      <section className="bg-surface border border-white/10 rounded-[16px] px-6 py-6 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-secondary mb-3">Saldo Consolidado Global</p>
        <MoneyDisplay amount={overview.totalBalance} size="hero" semantic />
      </section>

      {/* Contas */}
      <section className="space-y-4">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.08em] text-secondary">Saldos por Conta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overview.accounts.length === 0 ? (
            <p className="text-sm text-secondary">Nenhuma conta encontrada.</p>
          ) : (
            overview.accounts.map((acc) => (
              <div key={acc.id} className="relative overflow-hidden bg-surface border border-white/10 rounded-[16px] p-5 hover:border-primary/20 transition-all">
                {acc.color && (
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: acc.color }} />
                )}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-secondary">
                      <Wallet size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{acc.name}</p>
                      <p className="text-xs text-secondary truncate max-w-[120px]">{acc.user.name}</p>
                    </div>
                  </div>
                  <div className="text-xs font-semibold px-2 py-1 rounded-md bg-white/5 text-secondary uppercase tracking-wider">
                    {acc.type === "CHECKING" ? "CC" : acc.type === "SAVINGS" ? "CP" : "CREDIT"}
                  </div>
                </div>
                <MoneyDisplay amount={Number(acc.balance)} size="lg" />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Extrato / Timeline */}
      <section className="space-y-4">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.08em] text-secondary">Extrato Consolidado Familiar</h2>
        <div className="bg-surface border border-white/10 rounded-[16px] overflow-hidden">
          {timeline.length === 0 ? (
            <div className="p-8 text-center bg-white/[0.02]">
              <p className="text-sm text-secondary">Nenhuma transação encontrada.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {timeline.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/5 ${
                      tx.type === "INCOME" ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"
                    }`}>
                      {tx.type === "INCOME" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{tx.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-secondary">
                          {format(new Date(tx.date), "dd MMM", { locale: ptBR })}
                        </span>
                        {tx.user && (
                          <>
                            <span className="text-white/20">•</span>
                            <span className="text-xs text-secondary">{tx.user.name.split(" ")[0]}</span>
                          </>
                        )}
                        {tx.bankAccount && (
                          <>
                            <span className="text-white/20">•</span>
                            <span className="text-xs text-secondary truncate max-w-[80px]">{tx.bankAccount.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <MoneyDisplay amount={Number(tx.amount)} size="md" />
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
