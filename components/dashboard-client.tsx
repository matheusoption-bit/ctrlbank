"use client";

import React, { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency, formatCurrencyParts } from "@/lib/currency";
import { SafeBankAccount } from "@/components/cards/BankAccountCard";
import { AccountScroll } from "@/components/dashboard/account-scroll";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { PremiumCard } from "@/components/ui/premium-card";
import Link from "next/link";

/* ========================================
   Animation variants — subtle, NOT flashy
   ======================================== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ========================================
   Types
   ======================================== */
interface User {
  id: string;
  email: string;
  name: string | null;
}

interface DashboardTransaction {
  id: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  description: string | null;
  amount: number;
  date: string;
  category: { name: string; icon: string | null; color: string | null } | null;
  bankAccount: { name: string } | null;
}

interface DashboardData {
  totalBalance: number;
  monthIncome: number;
  monthExpense: number;
  accounts: SafeBankAccount[];
  recentTransactions: DashboardTransaction[];
  chartData: { month: string; income: number; expense: number }[];
}

interface DashboardClientProps {
  user: User;
  data: DashboardData;
}

/* ========================================
   Component
   ======================================== */
export default function DashboardClient({ user, data }: DashboardClientProps) {
  const [showBalance, setShowBalance] = useState(true);

  const { integer, decimal } = formatCurrencyParts(data.totalBalance);
  const netResult = data.monthIncome - data.monthExpense;

  return (
    <motion.div
      className="space-y-8 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ====== Hero Balance Section ====== */}
      <motion.section className="space-y-1 pt-2" variants={itemVariants}>
        <div className="flex items-center justify-between">
          <p className="section-label">Saldo Total</p>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
            aria-label={showBalance ? "Esconder saldo" : "Mostrar saldo"}
          >
            {showBalance ? (
              <Eye className="w-5 h-5 text-secondary" strokeWidth={1.5} />
            ) : (
              <EyeOff className="w-5 h-5 text-secondary" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {showBalance ? (
          <h1 className="text-balance md:text-balance-lg text-white tracking-tight">
            <span className="text-secondary text-2xl md:text-3xl font-semibold">R$ </span>
            {integer}
            <span className="text-secondary text-2xl md:text-3xl font-semibold">,{decimal}</span>
          </h1>
        ) : (
          <h1 className="text-balance md:text-balance-lg text-white tracking-tight">
            <span className="text-secondary text-2xl md:text-3xl font-semibold">R$ </span>
            <span className="text-secondary">••••••</span>
          </h1>
        )}
      </motion.section>

      {/* ====== Stats Cards ====== */}
      <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4" variants={itemVariants}>
        {/* Entradas */}
        <PremiumCard className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-success/10 rounded-lg">
              <ArrowUpRight className="w-4 h-4 text-success" strokeWidth={2} />
            </div>
            <span className="text-xs text-secondary font-medium">Receitas</span>
          </div>
          <p className="text-xl font-semibold text-success" style={{ fontVariantNumeric: "tabular-nums" }}>
            {showBalance ? formatCurrency(data.monthIncome) : "••••"}
          </p>
          <p className="text-2xs text-secondary">Este mês</p>
        </PremiumCard>

        {/* Saídas */}
        <PremiumCard className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-danger/10 rounded-lg">
              <ArrowDownLeft className="w-4 h-4 text-danger" strokeWidth={2} />
            </div>
            <span className="text-xs text-secondary font-medium">Despesas</span>
          </div>
          <p className="text-xl font-semibold text-danger" style={{ fontVariantNumeric: "tabular-nums" }}>
            {showBalance ? formatCurrency(data.monthExpense) : "••••"}
          </p>
          <p className="text-2xs text-secondary">Este mês</p>
        </PremiumCard>

        {/* Balanço */}
        <PremiumCard className="space-y-3 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-primary" strokeWidth={2} />
            </div>
            <span className="text-xs text-secondary font-medium">Balanço</span>
          </div>
          <p
            className={`text-xl font-semibold ${netResult >= 0 ? "text-success" : "text-danger"}`}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {showBalance ? (netResult >= 0 ? "+" : "") + formatCurrency(netResult) : "••••"}
          </p>
          <p className="text-2xs text-secondary">Resultado do mês</p>
        </PremiumCard>
      </motion.div>

      {/* ====== Accounts Horizontal Scroll ====== */}
      <motion.div variants={itemVariants}>
        <AccountScroll accounts={data.accounts} />
      </motion.div>

      {/* ====== Chart ====== */}
      {data.chartData.length > 0 && (
        <motion.div variants={itemVariants}>
          <DashboardCharts data={data.chartData} />
        </motion.div>
      )}

      {/* ====== Recent Transactions ====== */}
      <motion.section className="space-y-3" variants={itemVariants}>
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-semibold">Últimas Movimentações</h3>
          <Link
            href="/transacoes"
            className="text-primary text-xs font-semibold hover:opacity-80 transition-opacity"
          >
            Ver tudo →
          </Link>
        </div>

        {data.recentTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary text-sm">Nenhuma movimentação ainda.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {data.recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/[0.02] transition-colors"
              >
                {/* Category Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    backgroundColor: tx.category?.color
                      ? `${tx.category.color}18`
                      : "rgba(161, 161, 170, 0.1)",
                  }}
                >
                  {tx.category?.icon || (tx.type === "INCOME" ? "💰" : "📄")}
                </div>

                {/* Description */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {tx.description || "Sem descrição"}
                  </p>
                  <p className="text-xs text-secondary truncate">
                    {tx.category?.name || "Sem categoria"}
                    {tx.bankAccount && ` • ${tx.bankAccount.name}`}
                  </p>
                </div>

                {/* Amount */}
                <p
                  className={`text-sm font-semibold whitespace-nowrap ${
                    tx.type === "INCOME" ? "text-success" : "text-white"
                  }`}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {tx.type === "INCOME" ? "+" : "-"}
                  {showBalance ? formatCurrency(tx.amount) : "••••"}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
