"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CalendarClock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { COPY, greetingForHour } from "@/lib/copy/ctrlbank";
import { MoneyDisplay } from "@/components/ui/MoneyDisplay";

interface RecentTransaction {
  id: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  description: string | null;
  date: string;
  category: { name: string; color: string | null; icon: string | null } | null;
  bankAccount: { name: string; color: string | null; icon: string | null };
}

interface UpcomingCharge {
  id: string;
  description: string;
  amount: number;
  nextDate: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  category: { name: string; color: string | null; icon: string | null } | null;
}

interface Recommendation {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

interface HealthSummary {
  score: number;
  classification: "Saudável" | "Atenção" | "Risco";
}

interface BalanceSummary {
  current: number;
  change: number;
}

interface InicioPageClientProps {
  userName: string | null;
  balance: BalanceSummary;
  health: HealthSummary | null;
  recommendations: Recommendation[];
  upcoming: UpcomingCharge[];
  recent: RecentTransaction[];
  monthIncome: number;
  monthExpense: number;
}

function classificationStyles(classification: HealthSummary["classification"]) {
  switch (classification) {
    case "Saudável":
      return { bar: "bg-positive", text: "text-positive", chip: "bg-positive/10 text-positive" };
    case "Atenção":
      return { bar: "bg-warning", text: "text-warning", chip: "bg-warning/10 text-warning" };
    case "Risco":
      return { bar: "bg-negative", text: "text-negative", chip: "bg-negative/10 text-negative" };
  }
}

function TransactionIcon({ type }: { type: RecentTransaction["type"] }) {
  if (type === "INCOME")
    return (
      <div className="w-9 h-9 rounded-full bg-positive/10 flex items-center justify-center flex-shrink-0">
        <ArrowDownLeft size={15} className="text-positive" />
      </div>
    );
  if (type === "EXPENSE")
    return (
      <div className="w-9 h-9 rounded-full bg-negative/10 flex items-center justify-center flex-shrink-0">
        <ArrowUpRight size={15} className="text-negative" />
      </div>
    );
  return (
    <div className="w-9 h-9 rounded-full bg-white/[0.04] flex items-center justify-center flex-shrink-0">
      <ArrowLeftRight size={15} className="text-secondary" />
    </div>
  );
}

export default function InicioPageClient({
  userName,
  balance,
  health,
  recommendations,
  upcoming,
  recent,
  monthIncome,
  monthExpense,
}: InicioPageClientProps) {
  const greeting = greetingForHour(new Date().getHours());
  const firstName = userName?.split(" ")[0] ?? null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Greeting ─────────────────────────────────────── */}
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black tracking-[-0.03em] text-foreground">
          {greeting}{firstName ? `, ${firstName}` : ""}.
        </h1>
        <p className="text-[13px] text-secondary">{COPY.home.subtitle}</p>
      </header>

      {/* ── Hero: Saldo + Saúde ──────────────────────────── */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-border bg-surface px-6 py-6 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">
            {COPY.home.balanceLabel}
          </p>
          <MoneyDisplay amount={balance.current} size="hero" />
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <ArrowDownLeft size={12} className="text-positive" />
              Entradas do mês
              <span className="tabular-nums text-foreground font-semibold">
                {formatCurrency(monthIncome)}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ArrowUpRight size={12} className="text-negative" />
              Saídas do mês
              <span className="tabular-nums text-foreground font-semibold">
                {formatCurrency(monthExpense)}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              Variação
              <span
                className={`tabular-nums font-semibold ${balance.change >= 0 ? "text-positive" : "text-negative"}`}
              >
                {balance.change >= 0 ? "+" : ""}
                {formatCurrency(balance.change)}
              </span>
            </span>
          </div>
        </div>

        {/* Saúde em foco */}
        <Link
          href="/saude"
          className="rounded-2xl border border-border bg-surface px-6 py-6 space-y-4 transition-colors hover:border-border-strong"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">
              {COPY.home.healthLabel}
            </p>
            <ChevronRight size={14} className="text-secondary" />
          </div>
          {health ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-black tabular-nums leading-none ${classificationStyles(health.classification).text}`}>
                  {health.score}
                </span>
                <span className="text-xs text-secondary">/ 100</span>
              </div>
              <div className="space-y-2">
                <div className="h-[5px] rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${classificationStyles(health.classification).bar}`}
                    style={{ width: `${Math.min(100, Math.max(0, health.score))}%` }}
                  />
                </div>
                <span
                  className={`inline-flex items-center text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full ${classificationStyles(health.classification).chip}`}
                >
                  {health.classification}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-secondary">
              Saúde disponível após a primeira sincronização do seu grupo familiar.
            </p>
          )}
        </Link>
      </section>

      {/* ── Atenções / Recomendações ─────────────────────── */}
      {recommendations.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">
              {COPY.home.attentionsLabel}
            </p>
            <Link href="/saude" className="text-xs font-semibold text-primary hover:underline">
              {COPY.home.seeAll}
            </Link>
          </div>
          <div className="grid gap-2">
            {recommendations.slice(0, 2).map((rec) => (
              <article
                key={rec.id}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3"
              >
                <div className="mt-0.5 w-7 h-7 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={13} className="text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">{rec.message}</p>
                  <p className="text-[10px] text-secondary mt-1">
                    {formatDate(rec.createdAt, { short: true })}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-border bg-surface px-4 py-3 flex items-start gap-3">
          <div className="mt-0.5 w-7 h-7 rounded-full bg-positive/10 flex items-center justify-center flex-shrink-0">
            <Sparkles size={13} className="text-positive" />
          </div>
          <p className="text-sm text-secondary">{COPY.empty.recommendations}</p>
        </section>
      )}

      {/* ── Próximas cobranças + Movimentos recentes ─────── */}
      <section className="grid gap-4 md:grid-cols-2">
        {/* Próximas cobranças */}
        <div className="rounded-2xl border border-border bg-surface px-5 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary inline-flex items-center gap-1.5">
              <CalendarClock size={12} />
              {COPY.home.upcomingLabel}
            </p>
            <Link href="/caixa" className="text-xs font-semibold text-primary hover:underline">
              {COPY.home.seeAll}
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-secondary">{COPY.home.upcomingEmpty}</p>
          ) : (
            <ul className="space-y-2">
              {upcoming.slice(0, 4).map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] px-3 py-2.5"
                >
                  <TransactionIcon type={item.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.description}</p>
                    <p className="text-[11px] text-secondary">
                      {formatDate(item.nextDate, { short: true })}
                      {item.category ? ` · ${item.category.name}` : ""}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      item.type === "INCOME" ? "text-positive" : "text-foreground"
                    }`}
                  >
                    {formatCurrency(item.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Movimentos recentes */}
        <div className="rounded-2xl border border-border bg-surface px-5 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">
              {COPY.home.recentLabel}
            </p>
            <Link href="/caixa" className="text-xs font-semibold text-primary hover:underline">
              {COPY.home.seeAll}
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-secondary">{COPY.home.recentEmpty}</p>
          ) : (
            <ul className="space-y-2">
              {recent.slice(0, 5).map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] px-3 py-2.5"
                >
                  <TransactionIcon type={tx.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {tx.description ?? tx.category?.name ?? "Movimento"}
                    </p>
                    <p className="text-[11px] text-secondary">
                      {formatDate(tx.date, { short: true, relative: true })} · {tx.bankAccount.name}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      tx.type === "INCOME"
                        ? "text-positive"
                        : tx.type === "EXPENSE"
                        ? "text-negative"
                        : "text-foreground"
                    }`}
                  >
                    {tx.type === "EXPENSE" ? "-" : tx.type === "INCOME" ? "+" : ""}
                    {formatCurrency(Math.abs(tx.amount))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
