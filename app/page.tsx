"use client";

import React from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Plus,
  MoreVertical,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";

// Mock data for 6 months
const chartData = [
  { month: "Jun", value: 8200 },
  { month: "Jul", value: 9100 },
  { month: "Ago", value: 8800 },
  { month: "Set", value: 10200 },
  { month: "Out", value: 11500 },
  { month: "Nov", value: 12450 },
];

// Mock transactions
const mockTransactions = [
  {
    id: 1,
    name: "Apple Store",
    category: "Tecnologia",
    amount: -1299.0,
    date: "Hoje",
    icon: "🍎",
  },
  {
    id: 2,
    name: "Salário Mensal",
    category: "Renda",
    amount: 8500.0,
    date: "Ontem",
    icon: "💰",
  },
  {
    id: 3,
    name: "Starbucks",
    category: "Alimentação",
    amount: -24.5,
    date: "12 Nov",
    icon: "☕",
  },
  {
    id: 4,
    name: "Uber Trip",
    category: "Transporte",
    amount: -18.9,
    date: "11 Nov",
    icon: "🚗",
  },
  {
    id: 5,
    name: "Netflix",
    category: "Streaming",
    amount: -54.9,
    date: "10 Nov",
    icon: "🎬",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function Dashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const totalBalance = 12450.8;
  const monthIncome = 8500.0;
  const monthExpense = 1342.4;
  const netWorth = totalBalance;

  return (
    <motion.div
      className="space-y-8 pb-32"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header className="flex justify-between items-center pt-2" variants={itemVariants}>
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">
            <span className="text-primary">Ctrl</span>Bank
          </h1>
          <p className="text-secondary text-sm mt-1">Bem-vindo de volta</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-white/5 transition-colors">
          <MoreVertical className="w-5 h-5 text-secondary" />
        </button>
      </motion.header>

      {/* Main Balance Card */}
      <motion.div
        variants={itemVariants}
        className="card-c6 bg-gradient-to-br from-surface via-surface to-black overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {showBalance ? (
                <Eye className="w-5 h-5 text-secondary" />
              ) : (
                <EyeOff className="w-5 h-5 text-secondary" />
              )}
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-secondary text-sm font-medium">Saldo Total Disponível</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
              {showBalance ? (
                <span>
                  R$ <span className="text-primary">{totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </span>
              ) : (
                <span className="text-primary">••••••</span>
              )}
            </h2>
          </div>

          <div className="flex gap-3 pt-4">
            <button className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm">
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
            <button className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm">
              <CreditCard className="w-4 h-4" />
              Cartões
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - 4 Cards */}
      <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
        {/* Saldo Total */}
        <div className="card-c6-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs text-secondary font-medium">Saldo Total</span>
          </div>
          <p className="text-2xl font-bold text-primary">
            R$ {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-2xs text-secondary mt-2">Conta Corrente</p>
        </div>

        {/* Entradas */}
        <div className="card-c6-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <ArrowUpRight className="w-4 h-4 text-success" />
            </div>
            <span className="text-xs text-secondary font-medium">Entradas</span>
          </div>
          <p className="text-2xl font-bold text-success">
            R$ {monthIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-2xs text-secondary mt-2">Este mês</p>
        </div>

        {/* Saídas */}
        <div className="card-c6-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-danger/10 rounded-lg">
              <ArrowDownLeft className="w-4 h-4 text-danger" />
            </div>
            <span className="text-xs text-secondary font-medium">Saídas</span>
          </div>
          <p className="text-2xl font-bold text-danger">
            R$ {monthExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-2xs text-secondary mt-2">Este mês</p>
        </div>

        {/* Net Worth */}
        <div className="card-c6-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs text-secondary font-medium">Net Worth</span>
          </div>
          <p className="text-2xl font-bold text-primary">
            R$ {netWorth.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-2xs text-secondary mt-2">Patrimônio</p>
        </div>
      </motion.div>

      {/* Chart Section */}
      <motion.section className="space-y-4" variants={itemVariants}>
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-semibold">Evolução - Últimos 6 Meses</h3>
          <button className="text-primary text-xs font-medium hover:opacity-80 transition-opacity">
            Ver detalhes
          </button>
        </div>
        <div className="card-c6 h-[280px] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFCC00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFCC00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#262626"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#A3A3A3"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#A3A3A3"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#171717",
                  border: "1px solid #262626",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                }}
                itemStyle={{ color: "#FFCC00" }}
                labelStyle={{ color: "#FFFFFF" }}
                formatter={(value) => [
                  `R$ ${(value as number).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                  "Saldo",
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#FFCC00"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* Transactions List */}
      <motion.section className="space-y-4" variants={itemVariants}>
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-semibold">Transações Recentes</h3>
          <button className="text-primary text-xs font-medium hover:opacity-80 transition-opacity">
            Ver tudo
          </button>
        </div>
        <div className="space-y-3">
          {mockTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              variants={itemVariants}
              className="card-c6-sm flex items-center justify-between group hover:bg-white/5"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-lg">
                  {transaction.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{transaction.name}</p>
                  <p className="text-xs text-secondary">
                    {transaction.category} • {transaction.date}
                  </p>
                </div>
              </div>
              <p
                className={`text-sm font-bold whitespace-nowrap ml-2 ${
                  transaction.amount > 0 ? "text-success" : "text-white"
                }`}
              >
                {transaction.amount > 0 ? "+" : ""}
                {transaction.amount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Bottom Navigation */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-8 pb-6 px-4"
        variants={itemVariants}
      >
        <div className="max-w-2xl mx-auto flex justify-around items-center bg-surface/80 backdrop-blur-xl border border-border rounded-full p-3 shadow-soft-xl">
          <button className="p-3 bg-primary rounded-full text-black hover:opacity-90 transition-opacity">
            <Wallet className="w-6 h-6" />
          </button>
          <button className="p-3 text-secondary hover:text-white transition-colors hover:bg-white/5 rounded-full">
            <CreditCard className="w-6 h-6" />
          </button>
          <button className="p-3 text-secondary hover:text-white transition-colors hover:bg-white/5 rounded-full">
            <TrendingUp className="w-6 h-6" />
          </button>
          <button className="p-3 text-secondary hover:text-white transition-colors hover:bg-white/5 rounded-full">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>
    </motion.div>
  );
}
