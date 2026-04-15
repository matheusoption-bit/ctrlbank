"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2, CalendarClock, Power, Repeat, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { 
  upsertRecurringTransaction, 
  toggleRecurringState, 
  deleteRecurringTransaction, 
  autoDetectRecurring 
} from "@/app/actions/recurring";
import { formatCurrency, formatDate } from "@/lib/format";
import { RecurringFrequency, TransactionType } from "@prisma/client";

interface RecurringTx {
  id: string; amount: any; description: string | null; type: TransactionType;
  frequency: RecurringFrequency; nextDate: Date; active: boolean;
  bankAccount: { name: string; color: string | null };
  category: { name: string; color: string | null; icon: string | null } | null;
}

const FREQUENCY_LABELS: Record<RecurringFrequency, string> = {
  DAILY: "Diário", WEEKLY: "Semanal", BIWEEKLY: "Quinzenal",
  MONTHLY: "Mensal", QUARTERLY: "Trimestral", YEARLY: "Anual"
};

function RecurringModal({
  accounts, categories, itemToEdit, suggestion, onClose
}: {
  accounts: any[]; categories: any[];
  itemToEdit?: RecurringTx | null;
  suggestion?: { description: string, amount: number } | null;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (itemToEdit) fd.append("id", itemToEdit.id);

    startTransition(async () => {
      const res = await upsertRecurringTransaction(fd);
      if (res.error) toast.error(res.error);
      else { toast.success("Salvo com sucesso!"); onClose(); }
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
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold">{itemToEdit ? "Editar Recorrência" : "Nova Recorrência"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-secondary"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div className="flex gap-2">
            <div className="space-y-1.5 flex-1">
              <label className="section-label">Tipo</label>
              <select name="type" defaultValue={itemToEdit?.type ?? "EXPENSE"} className="input-c6 w-full">
                <option value="EXPENSE">Despesa</option>
                <option value="INCOME">Receita</option>
              </select>
            </div>
            <div className="space-y-1.5 flex-[2]">
              <label className="section-label">Valor (R$)</label>
              <input name="amount" type="number" step="0.01" min="1" required defaultValue={itemToEdit ? Number(itemToEdit.amount) : suggestion?.amount || ""} className="input-c6 w-full" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="section-label">Descrição</label>
            <input name="description" required defaultValue={itemToEdit?.description ?? suggestion?.description ?? ""} className="input-c6 w-full" />
          </div>

          <div className="flex gap-2">
            <div className="space-y-1.5 flex-1">
              <label className="section-label">Frequência</label>
              <select name="frequency" defaultValue={itemToEdit?.frequency ?? "MONTHLY"} className="input-c6 w-full">
                {Object.entries(FREQUENCY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 flex-[1.5]">
              <label className="section-label">Próxima Data</label>
              <input name="nextDate" type="date" required defaultValue={itemToEdit?.nextDate ? new Date(itemToEdit.nextDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} className="input-c6 w-full text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="section-label">Conta Base</label>
            <select name="bankAccountId" required className="input-c6 w-full text-sm">
              <option value="">Selecione...</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="section-label">Categoria (Opcional)</label>
            <select name="categoryId" defaultValue={itemToEdit?.category?.name ? categories.find(c => c.name === itemToEdit.category.name)?.id : ""} className="input-c6 w-full text-sm">
              <option value="">Nenhuma</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>

          <button type="submit" disabled={isPending} className="btn-primary w-full text-sm mt-2">
            {isPending ? "Salvando..." : "Salvar Recorrência"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function RecorrentesPageClient({ recurring, accounts, categories }: any) {
  const [showModal, setShowModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<RecurringTx | null>(null);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleFetchInsights = async () => {
    setIsLoadingInsights(true);
    const res = await autoDetectRecurring();
    if (res.error) toast.error(res.error);
    else if (res.suggestions && res.suggestions.length > 0) {
      setInsights(res.suggestions);
    } else {
      toast.info("Nenhum padrão detectado no momento.");
    }
    setIsLoadingInsights(false);
  };

  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleRecurringState(id, !current);
      if (res.error) toast.error(res.error);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir transação recorrente?")) return;
    startTransition(async () => {
      const res = await deleteRecurringTransaction(id);
      if (res.error) toast.error(res.error);
    });
  };

  const openNew = (insightItem?: any) => {
    setItemToEdit(null);
    setSuggestion(insightItem || null);
    setShowModal(true);
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <header className="flex items-center justify-between pt-2">
        <div>
          <p className="section-label mb-1">Assinaturas e Salários</p>
          <h1 className="text-3xl font-black tracking-tight">Recorrentes</h1>
        </div>
        <button onClick={() => openNew()} className="btn-primary px-4 py-2 text-sm">
          <Plus size={16} /> Nova
        </button>
      </header>

      {/* Auto-detect */}
      {insights.length === 0 ? (
        <button onClick={handleFetchInsights} disabled={isLoadingInsights} className="w-full card-c6-sm border-dashed text-secondary hover:text-white transition-colors flex justify-center items-center gap-2">
          {isLoadingInsights ? <div className="w-4 h-4 border-2 border-white/border-t-transparent rounded-full animate-spin" /> : <Lightbulb size={16} />}
          Radar de Padrões (Auto-descobrir assinaturas)
        </button>
      ) : (
        <div className="space-y-3">
          <h2 className="font-bold flex items-center gap-2"><Lightbulb size={16} className="text-warning" /> Padrões Encontrados</h2>
          {insights.map((s, i) => (
            <div key={i} className="card-c6 p-3 flex justify-between items-center bg-surface-2 border-warning/30 border">
              <div>
                <p className="text-sm font-bold">{s.description}</p>
                <p className="text-xs text-secondary">{formatCurrency(s.amount)} · {s.occurrences} ocorrências recentes</p>
              </div>
              <button onClick={() => openNew(s)} className="btn-outline px-3 py-1.5 text-xs">Transformar em Recorrente</button>
            </div>
          ))}
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {recurring.length === 0 ? (
          <div className="card-c6 text-center py-14 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto text-secondary"><Repeat size={24} /></div>
            <h3 className="font-bold">Nenhuma recorrência</h3>
            <p className="text-secondary text-sm">Configure salários, assinaturas e despesas fixas para geração automática mensal.</p>
          </div>
        ) : (
          recurring.map((tx: RecurringTx) => (
            <div key={tx.id} className={`card-c6-sm flex items-center justify-between transition-colors ${!tx.active ? 'opacity-50 grayscale' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${tx.category?.color ?? "#3A3A3C"}22` }}>
                  {tx.category?.icon ?? (tx.type === "INCOME" ? "💰" : "💸")}
                </div>
                <div>
                  <p className="font-bold text-sm">{tx.description}</p>
                  <p className="text-xs text-secondary flex items-center gap-1">
                    {FREQUENCY_LABELS[tx.frequency]} · Próxima: {formatDate(tx.nextDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-sm font-black ${tx.type === "INCOME" ? "text-positive" : "text-negative"}`}>
                  {tx.type === "INCOME" ? "+" : "-"}{formatCurrency(Number(tx.amount))}
                </span>

                <div className="flex items-center gap-1">
                  <button onClick={() => handleToggle(tx.id, tx.active)} disabled={isPending} className={`p-2 rounded-lg transition-colors ${tx.active ? 'text-positive hover:bg-positive/10' : 'text-secondary hover:bg-white/5'}`}>
                    <Power size={14} />
                  </button>
                  <button onClick={() => { setItemToEdit(tx); setShowModal(true); }} className="p-2 text-secondary hover:text-white rounded-lg transition-colors">
                    <CalendarClock size={14} />
                  </button>
                  <button onClick={() => handleDelete(tx.id)} disabled={isPending} className="p-2 text-negative hover:bg-negative/10 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <RecurringModal
            itemToEdit={itemToEdit}
            suggestion={suggestion}
            accounts={accounts}
            categories={categories}
            onClose={() => { setShowModal(false); setItemToEdit(null); setSuggestion(null); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
