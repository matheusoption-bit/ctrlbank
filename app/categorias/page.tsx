"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus, ArrowUpRight, ArrowDownLeft, MoreVertical } from "lucide-react";

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
const mockCategories = {
  INCOME: [
    { id: "1", name: "Salário", icon: "💰", color: "#00FF88" },
    { id: "2", name: "Freelance", icon: "💻", color: "#00D9FF" },
    { id: "3", name: "Investimentos", icon: "📈", color: "#FFCC00" },
    { id: "4", name: "Bônus", icon: "🎁", color: "#FF88FF" },
  ],
  EXPENSE: [
    { id: "5", name: "Alimentação", icon: "🍔", color: "#FF6B6B" },
    { id: "6", name: "Transporte", icon: "🚗", color: "#FF9F1C" },
    { id: "7", name: "Streaming", icon: "🎬", color: "#E74C3C" },
    { id: "8", name: "Saúde", icon: "🏥", color: "#3498DB" },
    { id: "9", name: "Educação", icon: "📚", color: "#9B59B6" },
    { id: "10", name: "Lazer", icon: "🎮", color: "#1ABC9C" },
  ],
};

export default function CategoriasPage() {
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
            <span className="text-foreground">Categorias</span>
          </h1>
          <p className="text-secondary text-sm mt-2 font-medium">
            Organize suas receitas e despesas
          </p>
        </div>
        <motion.button
          className="btn-primary flex items-center gap-2 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Nova Categoria
        </motion.button>
      </motion.header>

      {/* Receitas Section */}
      <motion.section className="space-y-4" variants={itemVariants}>
        <div className="flex items-center gap-3 px-1">
          <div className="p-2 bg-success/15 rounded-lg border border-success/20">
            <ArrowUpRight className="w-5 h-5 text-success" />
          </div>
          <h2 className="text-2xl font-bold">Receitas</h2>
          <span className="text-secondary text-sm">({mockCategories.INCOME.length})</span>
        </div>

        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" variants={itemVariants}>
          {mockCategories.INCOME.map((category) => (
            <motion.div
              key={category.id}
              className="card-c6-sm bg-gradient-to-br from-surface to-black group hover:from-surface/80 transition-all duration-200 cursor-pointer relative overflow-hidden"
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                style={{ backgroundColor: category.color }}
              />
              <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-20" style={{ backgroundColor: category.color }} />

              <div className="relative z-10 space-y-3">
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <motion.button
                    className="p-1 hover:bg-white/5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                  >
                    <MoreVertical className="w-4 h-4 text-secondary" />
                  </motion.button>
                </div>
                <p className="font-bold text-sm">{category.name}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Despesas Section */}
      <motion.section className="space-y-4" variants={itemVariants}>
        <div className="flex items-center gap-3 px-1">
          <div className="p-2 bg-danger/15 rounded-lg border border-danger/20">
            <ArrowDownLeft className="w-5 h-5 text-danger" />
          </div>
          <h2 className="text-2xl font-bold">Despesas</h2>
          <span className="text-secondary text-sm">({mockCategories.EXPENSE.length})</span>
        </div>

        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" variants={itemVariants}>
          {mockCategories.EXPENSE.map((category) => (
            <motion.div
              key={category.id}
              className="card-c6-sm bg-gradient-to-br from-surface to-black group hover:from-surface/80 transition-all duration-200 cursor-pointer relative overflow-hidden"
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                style={{ backgroundColor: category.color }}
              />
              <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-20" style={{ backgroundColor: category.color }} />

              <div className="relative z-10 space-y-3">
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <motion.button
                    className="p-1 hover:bg-white/5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                  >
                    <MoreVertical className="w-4 h-4 text-secondary" />
                  </motion.button>
                </div>
                <p className="font-bold text-sm">{category.name}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
