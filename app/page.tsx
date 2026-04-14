"use client";

import React from "react";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Plus, 
  LayoutDashboard, 
  History, 
  Settings 
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { motion } from "framer-motion";

const data = [
  { name: "Seg", value: 4000 },
  { name: "Ter", value: 3000 },
  { name: "Qua", value: 2000 },
  { name: "Qui", value: 2780 },
  { name: "Sex", value: 1890 },
  { name: "Sáb", value: 2390 },
  { name: "Dom", value: 3490 },
];

const transactions = [
  { id: 1, name: "Apple Store", category: "Tecnologia", amount: -1299.00, date: "Hoje" },
  { id: 2, name: "Salário Mensal", category: "Renda", amount: 8500.00, date: "Ontem" },
  { id: 3, name: "Starbucks", category: "Alimentação", amount: -24.50, date: "12 Out" },
  { id: 4, name: "Uber Trip", category: "Transporte", amount: -18.90, date: "11 Out" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CtrlBank</h1>
          <p className="text-secondary text-sm">Olá, Bem-vindo de volta</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center">
          <Settings className="w-5 h-5 text-secondary" />
        </div>
      </header>

      {/* Balance Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-c6 bg-gradient-to-br from-surface to-black"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded-full text-secondary">
            Conta Corrente
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-secondary text-sm">Saldo total disponível</p>
          <h2 className="text-4xl font-bold tracking-tighter">R$ 12.450,80</h2>
        </div>
        <div className="mt-8 flex gap-4">
          <button className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Adicionar
          </button>
          <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 text-sm">
            <CreditCard className="w-4 h-4" /> Cartões
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-c6 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-green-500/10 rounded-lg">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            </div>
            <span className="text-xs text-secondary">Entradas</span>
          </div>
          <p className="text-lg font-bold">R$ 8.500,00</p>
        </div>
        <div className="card-c6 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-red-500/10 rounded-lg">
              <ArrowDownLeft className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-xs text-secondary">Saídas</span>
          </div>
          <p className="text-lg font-bold">R$ 1.342,40</p>
        </div>
      </div>

      {/* Chart Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold px-1">Visão Geral</h3>
        <div className="card-c6 h-[200px] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFCC00" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FFCC00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#FFCC00" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                itemStyle={{ color: '#FFFFFF' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Transactions List */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-semibold">Transações Recentes</h3>
          <button className="text-primary text-sm font-medium">Ver tudo</button>
        </div>
        <div className="space-y-3">
          {transactions.map((t) => (
            <div key={t.id} className="card-c6 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-secondary">{t.category} • {t.date}</p>
                </div>
              </div>
              <p className={`text-sm font-bold ${t.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-surface/80 backdrop-blur-xl border border-border rounded-full p-2 flex justify-around items-center shadow-2xl">
        <button className="p-3 bg-primary rounded-full text-black">
          <LayoutDashboard className="w-6 h-6" />
        </button>
        <button className="p-3 text-secondary hover:text-white transition-colors">
          <History className="w-6 h-6" />
        </button>
        <button className="p-3 text-secondary hover:text-white transition-colors">
          <Wallet className="w-6 h-6" />
        </button>
        <button className="p-3 text-secondary hover:text-white transition-colors">
          <Settings className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}
