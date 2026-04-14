"use client";

import React, { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Plus,
  Eye,
  EyeOff,
  LogOut,
  TrendingUp,
  MoreVertical,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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
    color: "bg-blue-500/10",
  },
  {
    id: 2,
    name: "Salário Mensal",
    category: "Renda",
    amount: 8500.0,
    date: "Ontem",
    icon: "💰",
    color: "bg-success/10",
  },
  {
    id: 3,
    name: "Starbucks",
    category: "Alimentação",
    amount: -24.5,
    date: "12 Nov",
    icon: "☕",
    color: "bg-orange-500/10",
  },
  {
    id: 4,
    name: "Uber Trip",
    category: "Transporte",
    amount: -18.9,
    date: "11 Nov",
    icon: "🚗",
    color: "bg-purple-500/10",
  },
  {
    id: 5,
    name: "Netflix",
    category: "Streaming",
    amount: -54.9,
    date: "10 Nov",
    icon: "🎬",
    color: "bg-red-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
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
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const totalBalance = 12450.8;
  const monthIncome = 8500.0;
  const monthExpense = 1342.4;
  const netWorth = totalBalance;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.div
      className="space-y-8 pb-40"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Premium */}
      <motion.header className="flex justify-between items-center pt-4" variants={itemVariants}>
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            <span className="text-primary">Ctrl</span>
            <span className="text-foreground">Bank</span>
          </h1>
          <p className="text-secondary text-sm mt-2 font-medium">Bem-vindo de volta</p>
        </div>
        <motion.button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="p-3 rounded-full bg-surface border border-border hover:bg-white/5 transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Logout"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoggingOut ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <LogOut className="w-5 h-5 text-secondary hover:text-primary transition-colors" />
          )}
        </motion.button>
      </motion.header>

      {/* Main Balance Card - Premium */}
      <motion.div
        variants={itemVariants}
        className="card-c6 bg-gradient-to-br from-surface via-surface to-black overflow-hidden relative group"
        whileHover={{ scale: 1.02 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-8">
          <div className="flex justify-between items-start">
            <div className="p-4 bg-primary/15 rounded-2xl backdrop-blur-sm border border-primary/20">
              <Wallet className="w-7 h-7 text-primary" />
            </div>
            <motion.button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showBalance ? (
                <Eye className="w-5 h-5 text-secondary" />
              ) : (
                <EyeOff className="w-5 h-5 text-secondary" />
              )}
            </motion.button>
          </div>

          <div className="space-y-3">
            <p className="text-secondary text-sm font-semibold uppercase tracking-wide">
              Saldo Total Disponível
            </p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">
              {showBalance ? (
                <span>
                  <span className="text-secondary">R$ </span>
                  <span className="text-primary">{totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </span>
              ) : (
                <span className="text-primary">••••••</span>
              )}
            </h2>
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Adicionar Fundos
            </motion.button>
            <motion.button
              className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CreditCard className="w-5 h-5" />
              Cartões
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - 4 Premium Cards */}
      <motion.div className="grid grid-cols-2 gap-4 md:gap-6" variants={itemVariants}>
        {/* Saldo Total */}
        <motion.div
          className="card-c6-sm bg-gradient-to-br from-surface to-black group hover:from-surface/80"
          whileHover={{ scale: 1.05, y: -4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-primary/15 rounded-xl border border-primary/20 group-hover:bg-primary/25 transition-colors">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-secondary font-semibold uppercase tracking-wide">Saldo Total</span>
          </div>
          <p className="text-3xl font-black text-primary">
            R$ {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-2xs text-secondary mt-3 font-medium">Conta Corrente</p>
        </motion.div>

        {/* Entradas */}
        <motion.div
          className="card-c6-sm bg-gradient-to-br from-surface to-black group hover:from-surface/80"
          whileHover={{ scale: 1.05, y: -4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-success/15 rounded-xl border border-success/20 group-hover:bg-success/25 transition-colors">
              <ArrowUpRight className="w-5 h-5 text-success" />
            </div>
            <span className="text-xs text-secondary font-semibold uppercase tracking-wide">Entradas</span>
          </div>
          <p className="text-3xl font-black text-success">
            R$ {monthIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-2xs text-secondary mt-3 font-medium">Este mês</p>
        </motion.div>

        {/* Saídas */}
        <motion.div
          className="card-c6-sm bg-gradient-to-br from-surface to-black group hover:from-surface/80"
          whileHover={{ scale: 1.05, y: -4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-danger/15 rounded-xl border border-danger/20 group-hover:bg-danger/25 transition-colors">
              <ArrowDownLeft className="w-5 h-5 text-danger" />
            </div>
            <span className="text-xs text-secondary font-semibold uppercase tracking-wide">Saídas</span>
          </div>
          <p className="text-3xl font-black text-danger">
            R$ {monthExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-2xs text-secondary mt-3 font-medium">Este mês</p>
        </motion.div>

        {/* Net Worth */}
        <motion.div
          className="card-c6-sm bg-gradient-to-br from-surface to-black group hover:from-surface/80"
          whileHover={{ scale: 1.05, y: -4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-primary/15 rounded-xl border border-primary/20 group-hover:bg-primary/25 transition-colors">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-secondary font-semibold uppercase tracking-wide">Net Worth</span>
          </div>
          <p className="text-3xl font-black text-primary">
            R$ {netWorth.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-2xs text-secondary mt-3 font-medium">Patrimônio</p>
        </motion.div>
      </motion.div>

      {/* Chart Section - Premium */}
      <motion.section className="space-y-4" variants={itemVariants}>
        <div className="flex justify-between items-center px-1">
          <div>
            <h3 className="text-xl font-bold">Evolução Financeira</h3>
            <p className="text-secondary text-sm mt-1">Últimos 6 meses</p>
          </div>
          <motion.button
            className="text-primary text-xs font-bold uppercase tracking-wide hover:opacity-80 transition-opacity"
            whileHover={{ scale: 1.05 }}
          >
            Ver detalhes →
          </motion.button>
        </div>
        <motion.div
          className="card-c6 h-[320px] p-6 bg-gradient-to-br from-surface to-black"
          whileHover={{ boxShadow: "0 16px 48px rgba(255, 204, 0, 0.1)" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFCC00" stopOpacity={0.4} />
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
                style={{ fontSize: "12px", fontWeight: "600" }}
              />
              <YAxis
                stroke="#A3A3A3"
                style={{ fontSize: "12px", fontWeight: "600" }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#171717",
                  border: "2px solid #FFCC00",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.8)",
                  padding: "12px 16px",
                }}
                itemStyle={{ color: "#FFCC00", fontWeight: "bold" }}
                labelStyle={{ color: "#FFFFFF", fontWeight: "bold" }}
                formatter={(value) => [
                  `R$ ${(value as number).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                  "Saldo",
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#FFCC00"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorValue)"
                dot={{ fill: "#FFCC00", r: 5, strokeWidth: 2, stroke: "#171717" }}
                activeDot={{ r: 7, fill: "#FFCC00" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.section>

      {/* Transactions List - Premium */}
      <motion.section className="space-y-4" variants={itemVariants}>
        <div className="flex justify-between items-center px-1">
          <div>
            <h3 className="text-xl font-bold">Transações Recentes</h3>
            <p className="text-secondary text-sm mt-1">Seu histórico de movimentações</p>
          </div>
          <motion.button
            className="text-primary text-xs font-bold uppercase tracking-wide hover:opacity-80 transition-opacity"
            whileHover={{ scale: 1.05 }}
          >
            Ver tudo →
          </motion.button>
        </div>
        <div className="space-y-3">
          {mockTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              variants={itemVariants}
              className="card-c6-sm flex items-center justify-between group hover:bg-white/5 hover:border-primary/30 transition-all duration-200"
              whileHover={{ x: 4 }}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-14 h-14 rounded-xl ${transaction.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {transaction.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{transaction.name}</p>
                  <p className="text-xs text-secondary">
                    {transaction.category} • {transaction.date}
                  </p>
                </div>
              </div>
              <p
                className={`text-sm font-black whitespace-nowrap ml-2 ${
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

      {/* Bottom Navigation - Premium */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-12 pb-8 px-4"
        variants={itemVariants}
      >
        <div className="max-w-2xl mx-auto flex justify-around items-center bg-surface/90 backdrop-blur-xl border border-border rounded-full p-4 shadow-soft-xl hover:shadow-soft-2xl transition-shadow">
          <motion.button
            className="p-3 bg-primary rounded-full text-black hover:opacity-90 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wallet className="w-6 h-6" />
          </motion.button>
          <motion.button
            className="p-3 text-secondary hover:text-white transition-colors hover:bg-white/5 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <CreditCard className="w-6 h-6" />
          </motion.button>
          <motion.button
            className="p-3 text-secondary hover:text-white transition-colors hover:bg-white/5 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <TrendingUp className="w-6 h-6" />
          </motion.button>
          <motion.button
            className="p-3 text-secondary hover:text-white transition-colors hover:bg-white/5 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreVertical className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.nav>
    </motion.div>
  );
}
