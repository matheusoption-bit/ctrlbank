"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, ArrowUpRight, ArrowDownLeft, ArrowLeftRight,
  Wallet, TrendingUp, ChevronRight, BarChart3, Sparkles
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
  ComposedChart, Line
} from "recharts";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────────────────────

interface User { id: string; email: string; name: string | null }

interface BankAccount {
  id: string; name: string; type: string;
  balance: number | string; color: string | null; icon: string | null;
}

interface Transaction {
  id: string; type: string; amount: number | string;
  description: string | null; date: Date | string;
  bankAccount: { name: string; color: string | null; icon: string | null };
  category: { name: string; icon: string | null; color: string | null } | null;
  user: { id: string; name: string | null };
}

interface CategoryBreakdown {
  categoryId: string | null;
  amount: number;
  category: { id: string; name: string; icon: string | null; color: string | null } | null;
}

interface Summary {
  totalBalance: number;
  monthIncome: number;
  monthExpense: number;
  accounts: BankAccount[];
  recentTransactions: Transaction[];
  categoryBreakdown: CategoryBreakdown[];
}

interface EvolutionItem {
  month: string; income: number; expense: number; balance: number;
}

interface ForecastItem {
  day: string; actual: number | null; forecast: number;
}

interface Props {
  user: User;
  summary: Summary;
  evolution: EvolutionItem[];
  forecast: ForecastItem[];
  recommendations?: any[];
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label, value, icon: Icon, color, sub,
}: {
  label: string; value: string; icon: React.ElementType;
  color: string; sub?: string;
}) {
  return (
    <motion.div variants={item} className="card-c6-sm space-y-3">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-xl ${color}`}>
          <Icon size={16} className="flex-shrink-0" />
        </div>
        <span className="section-label">{label}</span>
      </div>
      <p className="text-2xl font-black tabular-nums leading-none">{value}</p>
      {sub && <p className="text-xs text-secondary">{sub}</p>}
    </motion.div>
  );
}

function AccountScrollCard({ account }: { account: BankAccount }) {
  const balance = Number(account.balance);
  const isPositive = balance >= 0;
  const color = account.color ?? "#FF2D55";

  return (
    <div
      className="account-card scroll-snap-start min-w-[280px] flex-shrink-0 flex flex-col justify-between h-[160px] select-none group"
    >
      {/* dot de cor no topo-direito para indicar a cor da conta */}
      <div
        className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs text-secondary font-bold uppercase tracking-wider">{account.type}</p>
          <p className="font-bold text-white/90 truncate max-w-[180px]">{account.name}</p>
        </div>
        <div className="w-10 h-10 flex items-center justify-center text-xl">
          {account.icon ?? <Wallet size={18} className="text-secondary" />}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Saldo Atual</p>
        <p className="text-2xl font-black tabular-nums tracking-tight">
          {formatCurrency(balance)}
        </p>
      </div>

    </div>
  );
}

function TransactionRow({ tx, currentUserId }: { tx: Transaction, currentUserId: string }) {
  const amount = Number(tx.amount);
  const isIncome = tx.type === "INCOME";
  const isMe = tx.user.id === currentUserId;

  return (
    <motion.div
      variants={item}
      className="flex items-center gap-4 py-3 border-b border-border/50 last:border-0 group"
      whileHover={{ x: 3 }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: `${tx.category?.color ?? "#3A3A3C"}22` }}
      >
        {tx.category?.icon ?? (isIncome ? "💰" : "💸")}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">
          {tx.description ?? tx.category?.name ?? "Transação"}
        </p>
        <p className="text-xs text-secondary">
          {tx.category?.name ?? "Sem categoria"} · {formatDate(tx.date, { short: true, relative: true })}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-black tabular-nums ${isIncome ? "amount-positive" : "amount-negative"}`}>
          {isIncome ? "+" : "-"}{formatCurrency(Math.abs(amount))}
        </p>
        <p className="flex justify-end mt-0.5">
          {isMe ? (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white">Você</span>
          ) : (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary truncate max-w-[80px]">
              {tx.user.name?.split(" ")[0] ?? "Familiar"}
            </span>
          )}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPageClient({ user, summary, evolution, forecast, recommendations = [] }: Props) {
  const [showBalance, setShowBalance] = useState(true);
  const { totalBalance, monthIncome, monthExpense, accounts, recentTransactions, categoryBreakdown } = summary;
  const netMonth = monthIncome - monthExpense;

  return (
    <motion.div className="space-y-8" variants={container} initial="hidden" animate="show">

      {/* ── Header ── */}
      <motion.header variants={item} className="flex items-start justify-between pt-2">
        <div>
          <p className="section-label mb-1">Bem-vindo de volta</p>
          <h1 className="text-3xl font-black tracking-tight">
            {user.name?.split(" ")[0] ?? "Usuário"} 👋
          </h1>
        </div>
        <Link
          href="/perfil"
          className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center hover:border-primary/30 transition-colors"
        >
          <span className="text-sm font-bold text-primary">
            {(user.name ?? user.email).charAt(0).toUpperCase()}
          </span>
        </Link>
      </motion.header>

      {/* ── Saldo Hero ── */}
      <motion.section variants={item} className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-secondary text-xs uppercase tracking-widest font-black">Saldo Total</p>
          <motion.button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 text-secondary hover:text-white rounded-full transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
          </motion.button>
        </div>
        <h1 className="balance-hero tabular-nums">
          {showBalance ? (
            <>
              <span className="text-secondary text-4xl font-bold">R$&nbsp;</span>
              {formatCurrency(totalBalance).replace("R$", "").trim()}
            </>
          ) : (
            "R$ ••••••"
          )}
        </h1>
      </motion.section>

      {/* ── AI Recommendations ── */}
      {recommendations.length > 0 && (
        <motion.section variants={item} className="space-y-3">
          {recommendations.map(rec => (
            <div key={rec.id} className="card-c6 border border-info/20 bg-info/5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-3 p-4">
               <div className="absolute top-0 left-0 w-1 h-full bg-info/80"></div>
               <div className="flex gap-3 text-sm text-foreground items-start">
                  <div className="p-2 bg-info/10 text-info rounded-xl shrink-0 mt-0.5"><Sparkles size={16} /></div>
                  <div>
                    <p className="font-bold text-info mb-1 tracking-tight uppercase text-xs">Ação Recomendada</p>
                    <p className="leading-relaxed font-medium">{rec.message}</p>
                  </div>
               </div>
               {rec.actionLabel && rec.actionTarget && (
                  <Link href={rec.actionTarget} className="inline-flex items-center justify-center border border-info/30 bg-info/10 text-info hover:bg-info hover:text-white text-xs px-4 py-2 rounded-xl font-bold transition-colors whitespace-nowrap">
                     {rec.actionLabel}
                  </Link>
               )}
            </div>
          ))}
        </motion.section>
      )}

      {/* ── Stats Row (3 Colunas como no Print) ── */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Receitas */}
        <div className="card-c6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="section-label">Receitas do Período</span>
            <div className="w-8 h-8 rounded-full bg-positive/10 flex items-center justify-center text-positive">
              <ArrowUpRight size={16} strokeWidth={3} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-positive tabular-nums">
              {showBalance ? formatCurrency(monthIncome) : "••••"}
            </p>
          </div>
        </div>

        {/* Despesas */}
        <div className="card-c6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="section-label">Despesas do Período</span>
            <div className="w-8 h-8 rounded-full bg-negative/10 flex items-center justify-center text-negative">
              <ArrowDownLeft size={16} strokeWidth={3} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-negative tabular-nums">
              {showBalance ? formatCurrency(monthExpense) : "••••"}
            </p>
          </div>
        </div>

        {/* Balanço */}
        <div className="card-c6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="section-label">Diagnóstico do Período</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${netMonth >= 0 ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"}`}>
              {netMonth >= 0 ? <ArrowUpRight size={16} strokeWidth={3} /> : <ArrowDownLeft size={16} strokeWidth={3} />}
            </div>
          </div>
          <div>
            <p className={`text-2xl font-black tabular-nums ${netMonth >= 0 ? "text-positive" : "text-negative"}`}>
              {showBalance ? (netMonth >= 0 ? "+" : "") + formatCurrency(netMonth) : "••••"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll de Contas ── */}
      {accounts.length > 0 && (
        <motion.section variants={item} className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-base font-bold">Contas</h2>
            <Link
              href="/contas"
              className="flex items-center gap-1 text-xs text-primary font-semibold hover:opacity-80 transition-opacity"
            >
              Ver todas <ChevronRight size={14} />
            </Link>
          </div>
          <div className="scroll-horizontal flex gap-3 pb-2 -mx-4 px-4">
            {accounts.map((acc) => (
              <AccountScrollCard key={acc.id} account={acc} />
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Stats Cards ── */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <StatCard
          label="Receitas"
          value={formatCurrency(monthIncome, { compact: true })}
          icon={ArrowUpRight}
          color="bg-positive/10 text-positive"
          sub="No Período"
        />
        <StatCard
          label="Despesas"
          value={formatCurrency(monthExpense, { compact: true })}
          icon={ArrowDownLeft}
          color="bg-negative/10 text-negative"
          sub="No Período"
        />
      </motion.div>

      {/* ── Gráfico de Previsão ── */}
      {forecast && forecast.length > 0 && (
        <motion.section variants={item} className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <div>
              <h2 className="text-base font-bold">Previsão de Saldo</h2>
              <p className="text-xs text-secondary">Mês Atual</p>
            </div>
          </div>
          <div className="card-c6 p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecast} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="day" stroke="transparent" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <YAxis stroke="transparent" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12, color: "#fafafa" }}
                  formatter={(v: number, name: string) => [formatCurrency(v), name === "actual" ? "Realizado" : "Previsto"]}
                  labelStyle={{ color: "#fff", fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="forecast" stroke="#8E8E93" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                <Area type="monotone" dataKey="actual" stroke="#0A84FF" strokeWidth={2} fill="url(#actualGrad)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      )}

      {/* ── Gráfico Evolução ── */}
      {evolution.length > 0 && (
        <motion.section variants={item} className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <div>
              <h2 className="text-base font-bold">Evolução Financeira</h2>
              <p className="text-xs text-secondary">Últimos 6 meses</p>
            </div>
            <Link href="/relatorios" className="flex items-center gap-1 text-xs text-primary font-semibold hover:opacity-80 transition-opacity">
              Detalhes <ChevronRight size={14} />
            </Link>
          </div>
          <div className="card-c6 p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolution} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="transparent" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <YAxis stroke="transparent" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12, color: "#fafafa" }}
                  formatter={(v: number, name: string) => [formatCurrency(v), name === "income" ? "Receitas" : "Despesas"]}
                  labelStyle={{ color: "#fff", fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="income" animationDuration={400} stroke="#22c55e" strokeWidth={2} fill="url(#incomeGrad)" dot={{ r: 3, fill: "#34C759" }} />
                <Area type="monotone" dataKey="expense" animationDuration={400} stroke="#ef4444" strokeWidth={2} fill="url(#expenseGrad)" dot={{ r: 3, fill: "#FF3B30" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      )}

      {/* ── Categorias Top ── */}
      {categoryBreakdown.length > 0 && (
        <motion.section variants={item} className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-base font-bold">Top Despesas por Categoria</h2>
            <BarChart3 size={16} className="text-secondary" />
          </div>
          <div className="card-c6 p-4 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis
                  dataKey="category.name"
                  stroke="#8E8E93"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => v?.slice(0, 6) ?? "Outros"}
                />
                <YAxis stroke="transparent" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12, color: "#fafafa" }}
                  formatter={(v: number) => [formatCurrency(v), "Gasto"]}
                  labelStyle={{ color: "#fff", fontWeight: 700 }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  {categoryBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.category?.color ?? "#FF2D55"} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      )}

      {/* ── Transações Recentes ── */}
      <motion.section variants={item} className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-base font-bold">Transações Recentes</h2>
          <Link href="/transacoes" className="flex items-center gap-1 text-xs text-primary font-semibold hover:opacity-80 transition-opacity">
            Ver tudo <ChevronRight size={14} />
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="card-c6 text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto">
              <ArrowLeftRight size={20} className="text-secondary" />
            </div>
            <p className="text-secondary text-sm">Nenhuma transação ainda.</p>
            <Link href="/transacoes" className="btn-primary text-sm px-5 mx-auto w-fit">
              Registrar primeiro movimento
            </Link>
          </div>
        ) : (
          <div className="card-c6 p-4">
            {recentTransactions.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} currentUserId={user.id} />
            ))}
          </div>
        )}
      </motion.section>

    </motion.div>
  );
}

