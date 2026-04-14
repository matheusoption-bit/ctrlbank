"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CreditCard, Wallet, Landmark, TrendingUp, MoreVertical } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
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

// Mock data
const mockAccounts = [
  {
    id: "1",
    name: "Conta Corrente",
    type: "CHECKING",
    balance: 12450.8,
    color: "#FFCC00",
    icon: "💳",
  },
  {
    id: "2",
    name: "Poupança",
    type: "SAVINGS",
    balance: 5230.5,
    color: "#00D9FF",
    icon: "🏦",
  },
  {
    id: "3",
    name: "Investimentos",
    type: "INVESTMENT",
    balance: 18750.0,
    color: "#00FF88",
    icon: "📈",
  },
  {
    id: "4",
    name: "Cartão de Crédito",
    type: "CREDIT",
    balance: -2150.0,
    color: "#FF6B6B",
    icon: "💰",
  },
];

export default function ContasPage() {
  const [isCreating, setIsCreating] = useState(false);

  const totalBalance = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <motion.div
      className="space-y-8 pb-40"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header className="flex justify-between items-center pt-4" variants={itemVariants}>
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            <span className="text-primary">Minhas</span>
            <br />
            <span className="text-foreground">Contas</span>
          </h1>
          <p className="text-secondary text-sm mt-2 font-medium">
            Gerencie suas contas bancárias e cartões
          </p>
        </div>
        <motion.button
          onClick={() => setIsCreating(!isCreating)}
          className="btn-primary flex items-center gap-2 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Nova Conta
        </motion.button>
      </motion.header>

      {/* Saldo Total */}
      <motion.div
        variants={itemVariants}
        className="card-c6 bg-gradient-to-br from-surface via-surface to-black overflow-hidden relative group"
        whileHover={{ scale: 1.02 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/15 rounded-2xl border border-primary/20">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <span className="text-secondary text-sm font-semibold uppercase tracking-wide">
              Saldo Total em Contas
            </span>
          </div>
          <p className="text-5xl font-black text-primary">
            R$ {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </motion.div>

      {/* Contas Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
        {mockAccounts.map((account) => (
          <motion.div
            key={account.id}
            className="card-c6 bg-gradient-to-br from-surface to-black group hover:from-surface/80 transition-all duration-200 cursor-pointer relative overflow-hidden"
            whileHover={{ scale: 1.05, y: -8 }}
            variants={itemVariants}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
              style={{ backgroundColor: account.color }}
            />
            <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-2xl opacity-20" style={{ backgroundColor: account.color }} />

            <div className="relative z-10 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${account.color}20` }}
                  >
                    {account.icon}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{account.name}</p>
                    <p className="text-xs text-secondary font-medium">{account.type}</p>
                  </div>
                </div>
                <motion.button
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  whileHover={{ scale: 1.1 }}
                >
                  <MoreVertical className="w-5 h-5 text-secondary" />
                </motion.button>
              </div>

              {/* Balance */}
              <div className="space-y-2">
                <p className="text-xs text-secondary font-semibold uppercase tracking-wide">Saldo</p>
                <p
                  className="text-4xl font-black"
                  style={{ color: account.balance >= 0 ? "#FFCC00" : "#FF6B6B" }}
                >
                  R$ {Math.abs(account.balance).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-border rounded-lg text-sm font-semibold transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Detalhes
                </motion.button>
                <motion.button
                  className="flex-1 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-sm font-semibold text-primary transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Editar
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {mockAccounts.length === 0 && (
        <motion.div
          className="card-c6 text-center py-16 space-y-4"
          variants={itemVariants}
        >
          <Wallet className="w-16 h-16 text-secondary/50 mx-auto" />
          <div>
            <h3 className="text-xl font-bold">Nenhuma conta criada</h3>
            <p className="text-secondary text-sm mt-1">
              Crie sua primeira conta para começar a gerenciar suas finanças
            </p>
          </div>
          <motion.button
            className="btn-primary mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Criar Primeira Conta
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
