"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { BankAccountCard, SafeBankAccount } from "@/components/cards/BankAccountCard";

interface RecentTransaction {
  id: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  description: string;
  date: string;
  categoryName: string;
  categoryIcon: string | null;
  categoryColor: string | null;
  accountName: string;
}

interface DashboardClientProps {
  user: { id: string; email: string; name: string | null };
  accounts: SafeBankAccount[];
  recentTransactions: RecentTransaction[];
  monthSummary: { income: number; expense: number };
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// Category icon fallback
const categoryIcons: Record<string, string> = {
  Alimentação: "🍽️",
  Transporte: "🚗",
  Moradia: "🏠",
  Saúde: "💊",
  Educação: "📚",
  Lazer: "🎮",
  Tecnologia: "💻",
  Renda: "💰",
  Streaming: "🎬",
  Compras: "🛍️",
};

export function DashboardClient({
  user,
  accounts,
  recentTransactions,
  monthSummary,
}: DashboardClientProps) {
  const [showBalance, setShowBalance] = useState(true);

  const totalBalance = accounts
    .filter((a) => a.type !== "CREDIT")
    .reduce((sum, a) => sum + a.balance, 0);

  const creditCards = accounts.filter((a) => a.type === "CREDIT");
  const firstName = user.name?.split(" ")[0] || user.email.split("@")[0];

  return (
    <motion.div
      className="space-y-8 pb-8"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* ── Hero: Consolidated Balance ── */}
      <motion.section variants={item} className="space-y-2">
        <p className="text-secondary text-sm font-medium">
          Olá, {firstName}
        </p>

        <div className="flex items-center gap-3">
          <h1
            className="text-balance md:text-balance-lg font-extrabold tracking-tight"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {showBalance ? formatCurrency(totalBalance) : "R$ ••••••"}
          </h1>
          <motion.button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 text-secondary hover:text-white rounded-lg transition-colors"
            whileTap={{ scale: 0.9 }}
            aria-label={showBalance ? "Esconder saldo" : "Mostrar saldo"}
          >
            {showBalance ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        <p className="text-[13px] text-secondary font-medium">Saldo total disponível</p>
      </motion.section>

      {/* ── Summary Cards: Income / Expense ── */}
      <motion.div className="grid grid-cols-2 gap-3" variants={item}>
        <div className="card-premium-sm flex items-center gap-3">
          <div className="p-2.5 bg-positive/10 rounded-xl">
            <ArrowUpRight className="w-5 h-5 text-positive" />
          </div>
          <div>
            <p className="text-[11px] text-secondary font-semibold uppercase tracking-wider">Entradas</p>
            <p className="text-lg font-bold text-positive" style={{ fontVariantNumeric: "tabular-nums" }}>
              {showBalance ? formatCurrency(monthSummary.income) : "••••"}
            </p>
          </div>
        </div>

        <div className="card-premium-sm flex items-center gap-3">
          <div className="p-2.5 bg-negative/10 rounded-xl">
            <ArrowDownLeft className="w-5 h-5 text-negative" />
          </div>
          <div>
            <p className="text-[11px] text-secondary font-semibold uppercase tracking-wider">Saídas</p>
            <p className="text-lg font-bold text-negative" style={{ fontVariantNumeric: "tabular-nums" }}>
              {showBalance ? formatCurrency(monthSummary.expense) : "••••"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Accounts Horizontal Carousel ── */}
      {accounts.length > 0 && (
        <motion.section variants={item} className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="section-title">Minhas Contas</h2>
            <Link
              href="/contas"
              className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:opacity-80 transition-opacity"
            >
              Ver todas <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
            {accounts.map((acc) => (
              <div key={acc.id} className="flex-shrink-0 w-[280px]">
                <BankAccountCard account={acc} compact />
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Credit Card Summary ── */}
      {creditCards.length > 0 && (
        <motion.section variants={item} className="space-y-3">
          <h2 className="section-title">Faturas</h2>
          <div className="space-y-2">
            {creditCards.map((card) => {
              const used = Math.abs(card.balance);
              const limit = card.creditLimit || 1;
              const pct = Math.min(100, (used / limit) * 100);

              return (
                <div key={card.id} className="card-premium-sm">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-sm font-semibold">{card.name}</span>
                    <span className="text-sm font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {showBalance ? formatCurrency(used) : "••••"}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pct > 80 ? "#FF3B5C" : pct > 50 ? "#FFB800" : "#00C853",
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-[11px] text-secondary font-medium">
                    <span>{pct.toFixed(0)}% utilizado</span>
                    <span>Limite {showBalance ? formatCurrency(limit) : "••••"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* ── Recent Transactions ── */}
      <motion.section variants={item} className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="section-title">Últimas Movimentações</h2>
          <Link
            href="/transacoes"
            className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:opacity-80 transition-opacity"
          >
            Ver todas <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-1">
            {recentTransactions.map((tx) => {
              const isIncome = tx.type === "INCOME";
              const icon =
                tx.categoryIcon ||
                categoryIcons[tx.categoryName] ||
                (isIncome ? "💰" : "💳");

              return (
                <motion.div
                  key={tx.id}
                  className="flex items-center gap-4 py-3.5 px-1 border-b border-border/50 last:border-0 hover:bg-white/[0.02] rounded-lg transition-colors -mx-1 px-3"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  {/* Category Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{
                      backgroundColor: tx.categoryColor
                        ? `${tx.categoryColor}15`
                        : isIncome
                        ? "rgba(0,200,83,0.1)"
                        : "rgba(255,59,92,0.1)",
                    }}
                  >
                    {icon}
                  </div>

                  {/* Description */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{tx.description}</p>
                    <p className="text-[11px] text-secondary font-medium">
                      {tx.categoryName} · {tx.accountName}
                    </p>
                  </div>

                  {/* Amount + Date */}
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`text-sm font-bold ${isIncome ? "text-positive" : "text-white"}`}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {isIncome ? "+" : "-"}{formatCurrency(Math.abs(tx.amount))}
                    </p>
                    <p className="text-[11px] text-secondary font-medium mt-0.5">
                      {formatDate(tx.date)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 card-premium border-dashed">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-surface-elevated flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-white font-semibold mb-1">Nenhuma movimentação</p>
            <p className="text-secondary text-sm">
              Adicione sua primeira transação para ver seu extrato aqui.
            </p>
          </div>
        )}
      </motion.section>

      {/* ── FAB: New Transaction ── */}
      <Link
        href="/transacoes"
        className="md:hidden fixed bottom-20 right-5 z-50 w-14 h-14 bg-primary text-white rounded-2xl shadow-fab active:scale-95 transition-transform flex items-center justify-center"
        aria-label="Nova transação"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </motion.div>
  );
}
