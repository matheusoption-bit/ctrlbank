"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  PieChart, Plus, X, Check, TrendingDown,
  AlertTriangle, Trash2, Lightbulb, ChevronLeft, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, formatMonthYear, calcPercent } from "@/lib/format";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { upsertBudget, deleteBudget } from "@/app/actions/budgets";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category { id: string; name: string; icon: string | null; color: string | null }
interface Budget {
  id: string; categoryId: string; amount: number; spent: number; month: number; year: number;
  category: { id: string; name: string; icon: string | null; color: string | null };
}
interface Insight {
  categoryId: string; categoryName: string; icon: string | null;
  currentSpent: number; avgPrev: number; changePercent: number; excess: number;
}

// ─── Budget Progress Bar ──────────────────────────────────────────────────────

function BudgetCard({ budget, onDelete }: { budget: Budget; onDelete: () => void }) {
  const percent = calcPercent(budget.spent, budget.amount);
  const remaining = budget.amount - budget.spent;
  const isOver  = percent > 100;
  const isWarn  = percent >= 70 && percent <= 100;
  const color   = budget.category.color ?? "#FF2D55";

  const barColor = isOver ? "#FF3B30" : isWarn ? "#FF9500" : "#34C759";

  return (
    <motion.div
      className="card-c6-sm space-y-3 group"
      whileHover={{ x: 2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: `${color}22` }}>
            {budget.category.icon ?? "📊"}
          </div>
          <div>
            <p className="font-semibold text-sm">{budget.category.name}</p>
            <p className="text-xs text-secondary">
              {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOver && <AlertTriangle size={16} className="text-negative animate-pulse" />}
          <div className="flex items-center gap-1">
            <span className={`text-sm font-black tabular-nums ${isOver ? "text-negative" : isWarn ? "text-warning" : "text-positive"}`}>
              {percent}%
            </span>
          </div>
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-negative/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={12} className="text-negative" />
          </button>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="budget-bar">
        <motion.div
          className="budget-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percent, 100)}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ backgroundColor: barColor }}
        />
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs text-secondary">
          {isOver
            ? `Estourou ${formatCurrency(Math.abs(remaining))}`
            : `Restam ${formatCurrency(remaining)}`}
        </p>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isOver  ? "bg-negative/10 text-negative"
            : isWarn ? "bg-warning/10 text-warning"
            : "bg-positive/10 text-positive"
          }`}
        >
          {isOver ? "Excedido" : isWarn ? "Atenção" : "OK"}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Add Budget Modal ─────────────────────────────────────────────────────────

function AddBudgetModal({
  categories, month, year, existingCategoryIds, onClose,
}: {
  categories: Category[];
  month: number; year: number;
  existingCategoryIds: string[];
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState<string | number>("");
  const available = categories.filter((c) => !existingCategoryIds.includes(c.id));

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await upsertBudget({
        categoryId: fd.get("categoryId") as string,
        amount:     Number(fd.get("amount")),
        month, year,
      });
      if (res.error) toast.error(res.error);
      else { toast.success("Orçamento salvo!"); onClose(); }
    });
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="w-full max-w-md bg-surface border border-border rounded-3xl shadow-soft-xl overflow-hidden"
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold">Novo Orçamento</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl"><X size={18} className="text-secondary" /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          {available.length === 0 ? (
            <p className="text-secondary text-sm text-center py-4">
              Todos as categorias já possuem orçamento neste mês.
            </p>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="section-label">Categoria</label>
                <select name="categoryId" required className="input-c6 w-full">
                  <option value="">Selecione...</option>
                  {available.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="section-label">Limite Mensal (R$)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-secondary text-sm font-semibold pointer-events-none">R$</span>
                  <CurrencyInput name="amount" value={amount} onValueChange={setAmount} required placeholder="0,00" className="input-c6 w-full pl-9" />
                </div>
              </div>
              <button type="submit" disabled={isPending || available.length === 0} className="btn-primary w-full text-sm">
                {isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={15} />Salvar orçamento</>}
              </button>
            </>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

export default function OrcamentosPageClient({ budgets, insights, categories, currentMonth, currentYear, hasHouseholdId }: {
  budgets: Budget[]; insights: Insight[]; categories: Category[];
  currentMonth: number; currentYear: number; hasHouseholdId: boolean;
}) {
  const router   = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  const totalBudgeted = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent    = budgets.reduce((s, b) => s + b.spent,  0);
  const overBudget    = budgets.filter((b) => b.spent > b.amount);

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteBudget(id);
      if (res.error) toast.error(res.error);
      else toast.success("Orçamento removido");
    });
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.header variants={item} className="flex flex-col md:flex-row md:items-center justify-between pt-2 gap-4">
        <div>
          <div className="flex items-center gap-1 bg-surface-2 border border-border rounded-xl p-1 mb-2 w-fit">
            <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-secondary hover:text-white">
              <ChevronLeft size={14} />
            </button>
            <span className="px-2 py-1 text-xs font-bold tabular-nums text-center uppercase tracking-wider">
              {formatMonthYear(currentMonth, currentYear)}
            </span>
            <button onClick={() => navigate(+1)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-secondary hover:text-white">
              <ChevronRight size={14} />
            </button>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Orçamentos</h1>
        </div>
        <button onClick={() => setShowModal(true)} disabled={!hasHouseholdId} className="btn-primary px-4 py-2 text-sm w-full md:w-auto disabled:opacity-50">
          <Plus size={16} /> Novo
        </button>
      </motion.header>

      {/* UX Bloqueio Guiado para Household */}
      {!hasHouseholdId && (
        <motion.div variants={item} className="card-c6 text-center py-10 space-y-4 border-warning/50 border relative overflow-hidden">
          <div className="absolute inset-0 bg-warning/5 pointer-events-none" />
          <div className="relative z-10 w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto text-warning">
            <AlertTriangle size={24} />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-lg text-white">Grupo Familiar Necessário</h3>
            <p className="text-secondary text-sm mt-1 max-w-[300px] mx-auto">
              Orçamentos são ferramentas colaborativas do módulo Household. Crie ou entre num grupo familiar para configurar os limites.
            </p>
          </div>
          <button onClick={() => router.push("/familia")} className="relative z-10 btn-primary bg-warning hover:bg-warning-500 text-white px-6 mx-auto w-fit text-sm">
            Ir para Meu Grupo Familiar
          </button>
        </motion.div>
      )}

      {/* Resumo geral */}
      {budgets.length > 0 && (
        <motion.div variants={item} className="card-c6 space-y-4">
          <div className="flex justify-between">
            <div>
              <p className="section-label mb-1">Gasto Total</p>
              <p className={`text-3xl font-black tabular-nums ${totalSpent > totalBudgeted ? "text-negative" : "text-foreground"}`}>
                {formatCurrency(totalSpent)}
              </p>
              <p className="text-xs text-secondary mt-1">de {formatCurrency(totalBudgeted)} orçados</p>
            </div>
            <div className="text-right">
              {overBudget.length > 0 && (
                <div className="badge-negative flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {overBudget.length} excedido{overBudget.length > 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
          <div className="budget-bar">
            <motion.div
              className="budget-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(calcPercent(totalSpent, totalBudgeted), 100)}%` }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundColor: totalSpent > totalBudgeted ? "#FF3B30"
                  : calcPercent(totalSpent, totalBudgeted) >= 70 ? "#FF9500"
                  : "#34C759",
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Insights inteligentes */}
      {insights.length > 0 && (
        <motion.section variants={item} className="space-y-3">
          <h2 className="font-bold flex items-center gap-2"><Lightbulb size={16} className="text-warning" />Sugestões de Economia</h2>
          <div className="space-y-2">
            {insights.map((insight) => (
              <div key={insight.categoryId} className="card-c6-sm border-l-2 border-warning/50 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{insight.icon}</span>
                  <p className="text-sm font-semibold">{insight.categoryName}</p>
                  <span className="badge-warning ml-auto">+{insight.changePercent}%</span>
                </div>
                <p className="text-xs text-secondary">
                  Vocês gastaram {formatCurrency(insight.currentSpent)} este mês vs. média de {formatCurrency(insight.avgPrev)} dos últimos 3 meses.
                  Excesso de <span className="text-warning font-semibold">{formatCurrency(insight.excess)}</span>.
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Lista de orçamentos */}
      {budgets.length === 0 ? (
        <motion.div variants={item} className="card-c6 text-center py-16 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto">
            <PieChart size={22} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Nenhum orçamento</h3>
            <p className="text-secondary text-sm mt-1">Defina limites mensais por categoria para governar a saúde financeira da sua família.</p>
          </div>
          <button onClick={() => setShowModal(true)} disabled={!hasHouseholdId} className="btn-primary px-6 mx-auto w-fit text-sm disabled:opacity-50">
            <Plus size={16} /> Criar orçamento
          </button>
        </motion.div>
      ) : (
        <motion.div variants={container} className="space-y-3">
          {budgets.map((budget) => (
            <motion.div key={budget.id} variants={item}>
              <BudgetCard budget={budget} onDelete={() => handleDelete(budget.id)} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && (
          <AddBudgetModal
            categories={categories}
            month={currentMonth}
            year={currentYear}
            existingCategoryIds={budgets.map((b) => b.categoryId)}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
