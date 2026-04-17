"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Eye,
  EyeOff,
  ChevronRight,
  CreditCard,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

/* ─── tipos ─── */
interface DashboardClientProps {
  user: { id: string; email: string; name: string | null };
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
};

/* ─── mock data enquanto API não está conectada ─── */
const MOCK = {
  totalBalance: 34_850.8,
  monthIncome: 9_700.0,
  monthExpense: 3_247.5,
  accounts: [
    { id: "1", name: "Conta Corrente", type: "CHECKING", balance: 12_450.8, color: "#FF2D55" },
    { id: "2", name: "Poupança",        type: "SAVINGS",  balance: 5_230.5,  color: "#34C759" },
    { id: "3", name: "Investimentos",   type: "INVESTMENT", balance: 18_750.0, color: "#0A84FF" },
    { id: "4", name: "Nubank",          type: "CREDIT",   balance: -2_150.0,  color: "#FF2D55" },
  ],
  recentTransactions: [
    { id: "1", type: "EXPENSE", description: "Supermercado",          icon: "🛒", amount: 245.50,  date: "Hoje",   category: "Alimentação" },
    { id: "2", type: "INCOME",  description: "Salário Mensal",         icon: "💰", amount: 8500.00, date: "Hoje",   category: "Salário" },
    { id: "3", type: "EXPENSE", description: "Uber",                   icon: "🚗", amount: 32.00,   date: "Ontem",  category: "Transporte" },
    { id: "4", type: "EXPENSE", description: "Netflix",                icon: "🎬", amount: 54.90,   date: "Ontem",  category: "Streaming" },
    { id: "5", type: "INCOME",  description: "Freelance - Projeto Web", icon: "💻", amount: 1200.00, date: "5 abr.", category: "Freelance" },
  ],
};

export default function DashboardClient({ user }: DashboardClientProps) {
  const [showBalance, setShowBalance] = useState(true);
  const firstName = user.name?.split(" ")[0] || user.email.split("@")[0];
  const netMonth = MOCK.monthIncome - MOCK.monthExpense;

  return (
    <motion.div
      className="space-y-6 pb-8"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* ── Greeting ── */}
      <motion.section variants={item} className="pt-2">
        <p className="text-secondary text-sm font-medium">Olá, {firstName} 👋</p>

        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-secondary text-xs uppercase tracking-widest font-semibold mb-1">Saldo total</p>
            <div className="flex items-center gap-3">
              <h1
                className="text-5xl font-black tracking-tight tabular-nums leading-none"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {showBalance ? formatCurrency(MOCK.totalBalance) : "R$ ••••••"}
              </h1>
              <motion.button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 text-secondary hover:text-white rounded-full hover:bg-white/5 transition-colors"
                whileTap={{ scale: 0.9 }}
                aria-label={showBalance ? "Esconder saldo" : "Mostrar saldo"}
              >
                {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Stats Row ── */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        {/* Receitas */}
        <div className="card-c6-sm flex flex-col gap-1.5">
          <div className="p-2 bg-positive/10 rounded-lg w-fit">
            <ArrowUpRight className="w-4 h-4 text-positive" />
          </div>
          <p className="text-[10px] text-secondary font-semibold uppercase tracking-wider">Receitas</p>
          <p className="text-base font-bold text-positive tabular-nums">
            {showBalance ? formatCurrency(MOCK.monthIncome) : "••••"}
          </p>
        </div>

        {/* Despesas */}
        <div className="card-c6-sm flex flex-col gap-1.5">
          <div className="p-2 bg-negative/10 rounded-lg w-fit">
            <ArrowDownLeft className="w-4 h-4 text-negative" />
          </div>
          <p className="text-[10px] text-secondary font-semibold uppercase tracking-wider">Despesas</p>
          <p className="text-base font-bold text-negative tabular-nums">
            {showBalance ? formatCurrency(MOCK.monthExpense) : "••••"}
          </p>
        </div>

        {/* Balanço */}
        <div className="card-c6-sm flex flex-col gap-1.5">
          <div className={`p-2 rounded-lg w-fit ${netMonth >= 0 ? "bg-positive/10" : "bg-negative/10"}`}>
            <TrendingUp className={`w-4 h-4 ${netMonth >= 0 ? "text-positive" : "text-negative"}`} />
          </div>
          <p className="text-[10px] text-secondary font-semibold uppercase tracking-wider">Balanço</p>
          <p className={`text-base font-bold tabular-nums ${netMonth >= 0 ? "text-positive" : "text-negative"}`}>
            {showBalance ? formatCurrency(Math.abs(netMonth)) : "••••"}
          </p>
        </div>
      </motion.div>

      {/* ── Contas Scroll ── */}
      <motion.section variants={item} className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-[15px]">Minhas Contas</h2>
          <Link href="/caixa" className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:opacity-80 transition-opacity">
            Ver todas <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-3 scroll-horizontal pb-1 -mx-4 px-4">
          {MOCK.accounts.map((acc) => (
            <div
              key={acc.id}
              className="flex-shrink-0 w-[200px] account-card scroll-snap-start"
            >
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-secondary" />
                <p className="text-xs text-secondary font-medium">{acc.type}</p>
              </div>
              <p className="text-sm font-semibold text-white/90 mb-1">{acc.name}</p>
              <p
                className="text-xl font-black tabular-nums"
                style={{ color: acc.balance >= 0 ? "#FFFFFF" : "#FF3B30" }}
              >
                {showBalance
                  ? formatCurrency(Math.abs(acc.balance))
                  : "••••"}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Últimas Transações ── */}
      <motion.section variants={item} className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-[15px]">Última Movimentação</h2>
          <Link href="/caixa" className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:opacity-80 transition-opacity">
            Ver todas <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="card-c6 p-0 divide-y divide-border overflow-hidden">
          {MOCK.recentTransactions.map((tx, i) => {
            const isIncome = tx.type === "INCOME";
            return (
              <motion.div
                key={tx.id}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: isIncome ? "rgba(52,199,89,0.12)" : "rgba(255,59,48,0.12)" }}
                >
                  {tx.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{tx.description}</p>
                  <p className="text-[11px] text-secondary">{tx.category} · {tx.date}</p>
                </div>

                <p
                  className={`text-sm font-bold tabular-nums flex-shrink-0 ${isIncome ? "text-positive" : "text-foreground"}`}
                >
                  {isIncome ? "+" : "-"}{formatCurrency(Math.abs(tx.amount))}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── FAB (mobile) ── */}
      <Link
        href="/caixa"
        className="md:hidden fixed z-50 w-14 h-14 bg-primary text-white rounded-full shadow-glow-primary flex items-center justify-center active:scale-95 transition-transform"
        style={{ right: "1.25rem", bottom: "calc(6rem + env(safe-area-inset-bottom, 0px))" }}
        aria-label="Registrar movimento"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </motion.div>
  );
}
