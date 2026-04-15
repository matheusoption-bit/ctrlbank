"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Download, FileText, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight, ChevronDown, Table } from "lucide-react";
import { formatCurrency, formatMonthYear } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Transaction {
  id: string; type: string; amount: number;
  description: string | null; date: string;
  bankAccount: { name: string; color: string | null };
  category: { name: string; icon: string | null; color: string | null } | null;
  status: string;
  ignoreInTotals: boolean;
}
interface Category { id: string; name: string; icon: string | null; color: string | null; type: string }
interface Account   { id: string; name: string; color: string | null }
interface Evolution { month: string; income: number; expense: number; balance: number }

interface Props {
  evolution: Evolution[];
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  currentMonth: number;
  currentYear: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

const CHART_COLORS = ["#FF2D55", "#0A84FF", "#34C759", "#FF9500", "#BF5AF2", "#FFD60A", "#30D158", "#64D2FF"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function DRETable({ transactions }: {
  transactions: Transaction[];
}) {
  // Filtrar apenas o que entra nos totais contábeis e que já foi efetivado
  const monthTx = transactions.filter(tx => tx.status === "COMPLETED" && !tx.ignoreInTotals);

  // Agrupar por categoria
  const incomeByCategory = useMemo(() => {
    const map = new Map<string, { name: string; icon: string | null; color: string | null; amount: number }>();
    monthTx.filter(tx => tx.type === "INCOME").forEach(tx => {
      const key = tx.category?.name ?? "Sem categoria";
      const existing = map.get(key);
      if (existing) existing.amount += tx.amount;
      else map.set(key, { name: key, icon: tx.category?.icon ?? null, color: tx.category?.color ?? null, amount: tx.amount });
    });
    return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
  }, [monthTx]);

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, { name: string; icon: string | null; color: string | null; amount: number }>();
    monthTx.filter(tx => tx.type === "EXPENSE").forEach(tx => {
      const key = tx.category?.name ?? "Sem categoria";
      const existing = map.get(key);
      if (existing) existing.amount += tx.amount;
      else map.set(key, { name: key, icon: tx.category?.icon ?? null, color: tx.category?.color ?? null, amount: tx.amount });
    });
    return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
  }, [monthTx]);

  const totalIncome  = incomeByCategory .reduce((s, c) => s + c.amount, 0);
  const totalExpense = expenseByCategory.reduce((s, c) => s + c.amount, 0);
  const result       = totalIncome - totalExpense;

  return (
    <div className="space-y-4">
      {/* Receitas */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-positive flex items-center gap-2">
            <TrendingUp size={15} /> Receitas
          </h3>
          <span className="font-black tabular-nums text-positive">{formatCurrency(totalIncome)}</span>
        </div>
        {incomeByCategory.length === 0 ? (
          <p className="text-xs text-secondary text-center py-3">Nenhuma receita no mês</p>
        ) : (
          <div className="space-y-1.5">
            {incomeByCategory.map((c) => (
              <div key={c.name} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                <span className="text-sm flex items-center gap-2">
                  <span>{c.icon}</span>{c.name}
                </span>
                <span className="text-sm font-semibold tabular-nums text-positive">{formatCurrency(c.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border" />

      {/* Despesas */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-negative flex items-center gap-2">
            <TrendingDown size={15} /> Despesas
          </h3>
          <span className="font-black tabular-nums text-negative">{formatCurrency(totalExpense)}</span>
        </div>
        {expenseByCategory.length === 0 ? (
          <p className="text-xs text-secondary text-center py-3">Nenhuma despesa no mês</p>
        ) : (
          <div className="space-y-1.5">
            {expenseByCategory.map((c) => (
              <div key={c.name} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                <span className="text-sm flex items-center gap-2">
                  <span>{c.icon}</span>{c.name}
                </span>
                <span className="text-sm font-semibold tabular-nums text-negative">{formatCurrency(c.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t-2 border-border pt-3">
        <div className="flex items-center justify-between">
          <span className="font-bold flex items-center gap-2">
            <Minus size={15} className="text-secondary" /> Resultado do Mês
          </span>
          <span className={`text-xl font-black tabular-nums ${result >= 0 ? "text-positive" : "text-negative"}`}>
            {result >= 0 ? "+" : ""}{formatCurrency(result)}
          </span>
        </div>
      </div>
    </div>
  );
}

function exportCSV(transactions: Transaction[], year: number) {
  const rows = [
    ["Data", "Tipo", "Conta", "Categoria", "Descrição", "Valor"].join(";"),
    ...transactions.map(tx => [
      new Date(tx.date).toLocaleDateString("pt-BR"),
      tx.type === "INCOME" ? "Receita" : tx.type === "EXPENSE" ? "Despesa" : "Transferência",
      tx.bankAccount.name,
      tx.category?.name ?? "Sem categoria",
      tx.description ?? "",
      formatCurrency(tx.amount).replace("R$", "").trim().replace(".", ""),
    ].join(";"))
  ].join("\n");

  const blob = new Blob(["\uFEFF" + rows], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `ctrlbank-${year}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportPDF(transactions: Transaction[], month: number, year: number) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("CtrlBank", 20, 20);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Relatório – ${formatMonthYear(month, year)}`, 20, 30);

  const income  = transactions.filter(tx => tx.type === "INCOME" ).reduce((s, tx) => s + tx.amount, 0);
  const expense = transactions.filter(tx => tx.type === "EXPENSE").reduce((s, tx) => s + tx.amount, 0);

  doc.setFillColor(34, 197, 94);
  doc.rect(20, 40, 80, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("RECEITAS", 25, 49);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(income), 25, 56);

  doc.setFillColor(239, 68, 68);
  doc.rect(110, 40, 80, 18, "F");
  doc.text("DESPESAS", 115, 49);
  doc.text(formatCurrency(expense), 115, 56);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  let y = 70;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Data", 20, y); doc.text("Tipo", 50, y); doc.text("Categoria", 80, y); doc.text("Valor", 160, y);
  y += 7;
  doc.setFont("helvetica", "normal");

  for (const tx of transactions) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const d = new Date(tx.date).toLocaleDateString("pt-BR");
    const t = tx.type === "INCOME" ? "Receita" : tx.type === "EXPENSE" ? "Despesa" : "Transf.";
    const c = tx.category?.name ?? "Sem categoria";
    const v = formatCurrency(tx.amount);

    tx.type === "INCOME"
      ? doc.setTextColor(34, 197, 94)
      : doc.setTextColor(239, 68, 68);

    doc.text(d, 20, y);
    doc.setTextColor(0, 0, 0);
    doc.text(t, 50, y); doc.text(c.slice(0, 20), 80, y); doc.text(v, 155, y, { align: "right" });
    y += 6;
  }

  doc.save(`ctrlbank-${year}-${String(month).padStart(2, "0")}.pdf`);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RelatoriosPageClient({ evolution, transactions, categories, accounts, currentMonth, currentYear }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"dre" | "graficos" | "exportar">("graficos");
  const [isExporting, setIsExporting] = useState(false);

  const totalIncome  = evolution.reduce((s, e) => s + e.income,  0);
  const totalExpense = evolution.reduce((s, e) => s + e.expense, 0);

  // ─── Navegação de mês ──────────────────────────────────────────────────────
  function navigate(deltaMonth: number) {
    let m = currentMonth + deltaMonth;
    let y = currentYear;
    if (m < 1)  { m = 12; y -= 1; }
    if (m > 12) { m = 1;  y += 1; }
    const p = new URLSearchParams(searchParams.toString());
    p.set("month", String(m));
    p.set("year",  String(y));
    router.push(`${pathname}?${p.toString()}`);
  }

  function setAccount(id: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (id) p.set("bankAccountId", id);
    else    p.delete("bankAccountId");
    router.push(`${pathname}?${p.toString()}`);
  }

  // Pie chart – categorias de despesa (mês selecionado – filtra pendentes e ignorados)
  const monthTx = transactions.filter(tx => tx.status === "COMPLETED" && !tx.ignoreInTotals);

  const pieData = useMemo(() => {
    const map = new Map<string, { name: string; color: string | null; value: number }>();
    monthTx.filter(tx => tx.type === "EXPENSE").forEach(tx => {
      const key   = tx.category?.name ?? "Outros";
      const color = tx.category?.color ?? null;
      const e     = map.get(key);
      if (e) e.value += tx.amount;
      else   map.set(key, { name: key, color, value: tx.amount });
    });
    return Array.from(map.values()).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [monthTx]);

  async function handleExportPDF() {
    setIsExporting(true);
    try { await exportPDF(monthTx, currentMonth, currentYear); }
    finally { setIsExporting(false); }
  }

  function handleExportCSV() {
    exportCSV(transactions, currentYear);
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.header variants={item} className="pt-2 space-y-4">
        <div>
          <p className="section-label mb-1">Período selecionado</p>
          <h1 className="text-3xl font-black tracking-tight">Relatórios</h1>
        </div>

        {/* Controles de período + filtro de conta */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Navegação Mês */}
          <div className="flex items-center gap-1 bg-surface-2 border border-border rounded-xl p-1">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-secondary hover:text-white">
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1.5 text-sm font-bold tabular-nums min-w-[130px] text-center">
              {formatMonthYear(currentMonth, currentYear)}
            </span>
            <button onClick={() => navigate(+1)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-secondary hover:text-white">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Filtro de Conta */}
          <div className="relative flex-1 min-w-[160px]">
            <select
              value={searchParams.get("bankAccountId") ?? ""}
              onChange={(e) => setAccount(e.target.value)}
              className="input-c6-sm w-full appearance-none pr-8"
            >
              <option value="">Todas as contas</option>
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          </div>
        </div>
      </motion.header>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        <div className="card-c6-sm space-y-1 col-span-1">
          <p className="section-label">Receitas 6m</p>
          <p className="text-base font-black tabular-nums text-positive">{formatCurrency(totalIncome, { compact: true })}</p>
        </div>
        <div className="card-c6-sm space-y-1 col-span-1">
          <p className="section-label">Despesas 6m</p>
          <p className="text-base font-black tabular-nums text-negative">{formatCurrency(totalExpense, { compact: true })}</p>
        </div>
        <div className="card-c6-sm space-y-1 col-span-1">
          <p className="section-label">Saldo 6m</p>
          <p className={`text-base font-black tabular-nums ${(totalIncome - totalExpense) >= 0 ? "text-positive" : "text-negative"}`}>
            {formatCurrency(totalIncome - totalExpense, { compact: true })}
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="flex gap-1 bg-surface-2 border border-border p-1 rounded-2xl">
        {([
          { key: "graficos", label: "Gráficos", icon: TrendingUp },
          { key: "dre",      label: "DRE",      icon: FileText },
          { key: "exportar", label: "Exportar",  icon: Download },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === key
                ? "bg-surface border border-border text-white shadow-soft"
                : "text-secondary hover:text-white"
            }`}
          >
            <Icon size={14} />{label}
          </button>
        ))}
      </motion.div>

      {/* Tab: Gráficos */}
      {tab === "graficos" && (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
          {/* Bar Chart – 6 Meses */}
          <motion.div variants={item} className="card-c6 space-y-3">
            <div>
              <h2 className="font-bold">Evolução 6 Meses</h2>
              <p className="text-xs text-secondary">Receitas vs. Despesas</p>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolution} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3C" vertical={false} />
                  <XAxis dataKey="month" stroke="#8E8E93" tick={{ fontSize: 11, fontWeight: 600 }} />
                  <YAxis stroke="#8E8E93" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1C1C1E", border: "1px solid #3A3A3C", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number, name: string) => [formatCurrency(v), name === "income" ? "Receita" : "Despesa"]}
                    labelStyle={{ color: "#fff", fontWeight: 700 }}
                  />
                  <Bar dataKey="income"  fill="#34C759" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#FF3B30" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart – categorias do mês */}
          {pieData.length > 0 && (
            <motion.div variants={item} className="card-c6 space-y-3">
              <div>
                <h2 className="font-bold">Despesas por Categoria</h2>
                <p className="text-xs text-secondary">Mês atual</p>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {pieData.map((entry, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={entry.color ?? CHART_COLORS[i % CHART_COLORS.length]}
                          opacity={0.85}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1C1C1E", border: "1px solid #3A3A3C", borderRadius: 12, fontSize: 12 }}
                      formatter={(v: number) => [formatCurrency(v), "Gasto"]}
                    />
                    <Legend
                      formatter={(value) => <span className="text-xs text-secondary">{value}</span>}
                      iconType="circle"
                      iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Tab: DRE */}
      {tab === "dre" && (
        <motion.div variants={item} initial="hidden" animate="show">
          <div className="card-c6 space-y-4">
            <div>
              <h2 className="font-bold">DRE – Demonstrativo</h2>
              <p className="text-xs text-secondary">{formatMonthYear(currentMonth, currentYear)}</p>
            </div>
            <DRETable transactions={transactions} />
          </div>
        </motion.div>
      )}

      {/* Tab: Exportar */}
      {tab === "exportar" && (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          <motion.div variants={item} className="card-c6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl"><FileText size={18} className="text-primary" /></div>
              <div>
                <h3 className="font-bold">Exportar PDF</h3>
                <p className="text-xs text-secondary">Relatório mensal formatado (DRE + transações)</p>
              </div>
            </div>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="btn-primary w-full text-sm"
            >
              {isExporting
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Download size={15} /> Baixar PDF – {formatMonthYear(currentMonth, currentYear)}</>
              }
            </button>
          </motion.div>

          <motion.div variants={item} className="card-c6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-positive/10 rounded-xl"><Table size={18} className="text-positive" /></div>
              <div>
                <h3 className="font-bold">Exportar CSV</h3>
                <p className="text-xs text-secondary">Planilha com todas as transações do período</p>
              </div>
            </div>
            <button
              onClick={handleExportCSV}
              className="btn-outline w-full text-sm"
            >
              <Download size={15} /> Baixar CSV – {currentYear}
            </button>
          </motion.div>

          <motion.div variants={item} className="card-c6-sm text-xs text-secondary space-y-1">
            <p className="font-semibold text-white">📋 Período disponível</p>
            <p>CSV: todas as transações dos últimos 3 meses</p>
            <p>PDF: mês atual com DRE completo</p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
