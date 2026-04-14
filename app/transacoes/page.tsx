"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Calendar, DollarSign, Trash2, Edit2 } from "lucide-react";

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
const mockTransactions = [
  {
    id: "1",
    type: "EXPENSE",
    description: "Supermercado",
    category: "Alimentação",
    amount: 245.5,
    account: "Conta Corrente",
    date: "2026-04-14",
    icon: "🛒",
  },
  {
    id: "2",
    type: "INCOME",
    description: "Salário Mensal",
    category: "Salário",
    amount: 8500.0,
    account: "Conta Corrente",
    date: "2026-04-10",
    icon: "💰",
  },
  {
    id: "3",
    type: "EXPENSE",
    description: "Uber",
    category: "Transporte",
    amount: 32.0,
    account: "Cartão de Crédito",
    date: "2026-04-09",
    icon: "🚗",
  },
  {
    id: "4",
    type: "EXPENSE",
    description: "Netflix",
    category: "Streaming",
    amount: 54.9,
    account: "Conta Corrente",
    date: "2026-04-08",
    icon: "🎬",
  },
  {
    id: "5",
    type: "INCOME",
    description: "Freelance - Projeto Web",
    category: "Freelance",
    amount: 1200.0,
    account: "Poupança",
    date: "2026-04-05",
    icon: "💻",
  },
];

const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function TransacoesPage() {
  const [formData, setFormData] = useState({
    type: "EXPENSE",
    account: "",
    category: "",
    amount: "",
    date: getLocalDateString(),
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }

    // Simulate API call
    submitTimeoutRef.current = setTimeout(() => {
      setIsSubmitting(false);
      setFormData({
        type: "EXPENSE",
        account: "",
        category: "",
        amount: "",
        date: getLocalDateString(),
        description: "",
      });
      submitTimeoutRef.current = null;
    }, 1000);
  };

  return (
    <motion.div
      className="space-y-8 pb-40"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header className="pt-4" variants={itemVariants}>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
          <span className="text-primary">Minhas</span>
          <br />
          <span className="text-foreground">Transações</span>
        </h1>
        <p className="text-secondary text-sm mt-2 font-medium">
          Registre e acompanhe todas as suas movimentações financeiras
        </p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário */}
        <motion.div className="lg:col-span-1" variants={itemVariants}>
          <form onSubmit={handleSubmit} className="card-c6 space-y-6">
            <h2 className="text-2xl font-bold">Nova Transação</h2>

            {/* Tipo */}
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wide">Tipo</label>
              <div className="flex gap-2">
                {["INCOME", "EXPENSE"].map((type) => (
                  <motion.button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type as "INCOME" | "EXPENSE" })}
                    className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                      formData.type === type
                        ? type === "INCOME"
                          ? "bg-success/20 border border-success text-success"
                          : "bg-danger/20 border border-danger text-danger"
                        : "bg-white/5 border border-border text-secondary hover:bg-white/10"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {type === "INCOME" ? "Receita" : "Despesa"}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Conta */}
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wide">Conta</label>
              <select
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                className="input-c6 w-full"
                required
              >
                <option value="">Selecione uma conta</option>
                <option value="checking">Conta Corrente</option>
                <option value="savings">Poupança</option>
                <option value="credit">Cartão de Crédito</option>
              </select>
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wide">Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-c6 w-full"
                required
              >
                <option value="">Selecione uma categoria</option>
                <option value="food">Alimentação</option>
                <option value="transport">Transporte</option>
                <option value="salary">Salário</option>
              </select>
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wide">Valor</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input-c6 pl-10 w-full"
                  required
                />
              </div>
            </div>

            {/* Data */}
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wide">Data</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-c6 pl-10 w-full"
                  required
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wide">Descrição</label>
              <textarea
                placeholder="Descrição da transação..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-c6 w-full resize-none"
                rows={3}
              />
            </div>

            {/* Botão Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Registrar Transação
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Tabela de Transações */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Transações Recentes</h2>

            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  className="card-c6-sm flex items-center justify-between group hover:bg-white/5 hover:border-primary/30 transition-all duration-200"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {transaction.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{transaction.description}</p>
                      <p className="text-xs text-secondary">
                        {transaction.category} • {transaction.account}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <p
                      className={`text-sm font-black whitespace-nowrap ${
                        transaction.type === "INCOME" ? "text-success" : "text-white"
                      }`}
                    >
                      {transaction.type === "INCOME" ? "+" : "-"}
                      {transaction.amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Edit2 className="w-4 h-4 text-secondary" />
                      </motion.button>
                      <motion.button
                        className="p-1 hover:bg-danger/10 rounded transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Trash2 className="w-4 h-4 text-danger" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
