"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Tag, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/categories";

interface Category {
  id: string; name: string; type: string;
  icon: string | null; color: string | null;
  taxClassification?: string | null;
}

const CATEGORY_COLORS = [
  "#FF2D55","#FF3B30","#FF9500","#FFCC00",
  "#34C759","#30D158","#0A84FF","#5AC8FA",
  "#5856D6","#AF52DE","#FF2D55","#A2845E",
];
const EMOJI_SUGGESTIONS = [
  "💰","💸","🏠","🚗","🍔","🎮","💊","📚",
  "✈️","🎸","👔","⚡","📱","🛒","🎓","💡",
];

const TX_TYPES = [
  { value: "INCOME",   label: "Receita",      color: "text-positive" },
  { value: "EXPENSE",  label: "Despesa",       color: "text-negative" },
  { value: "TRANSFER", label: "Transferência", color: "text-info"     },
];

type TxType = "INCOME" | "EXPENSE" | "TRANSFER";

function CategoryModal({
  editing, onClose,
}: {
  editing?: Category; onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name:             fd.get("name") as string,
      type:             fd.get("type") as TxType,
      icon:             fd.get("icon") as string || null,
      color:            fd.get("color") as string || null,
      taxClassification: fd.get("taxClassification") as string || null,
    };

    startTransition(async () => {
      const res = editing
        ? await updateCategory(editing.id, payload)
        : await createCategory(payload);

      if (res.error) toast.error(res.error);
      else { toast.success(editing ? "Categoria atualizada!" : "Categoria criada!"); onClose(); }
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
          <h2 className="font-bold text-lg">{editing ? "Editar Categoria" : "Nova Categoria"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl">
            <X size={18} className="text-secondary" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          {/* Tipo */}
          <div className="space-y-2">
            <label className="section-label">Tipo</label>
            <div className="grid grid-cols-3 gap-2">
              {TX_TYPES.map(({ value, label, color }) => (
                <label key={value} className="cursor-pointer">
                  <input type="radio" name="type" value={value} className="peer sr-only"
                    defaultChecked={editing?.type === value || (!editing && value === "EXPENSE")} />
                  <div className={`py-2 rounded-xl text-xs font-semibold border text-center transition-all bg-surface-2 border-border text-secondary peer-checked:bg-primary/10 peer-checked:border-primary/40 peer-checked:text-white`}>
                    {label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-1.5">
            <label className="section-label">Nome</label>
            <input
              name="name" defaultValue={editing?.name} required maxLength={50}
              placeholder="Ex: Alimentação, Salário..."
              className="input-c6 w-full"
            />
          </div>

          {/* Ícone */}
          <div className="space-y-2">
            <label className="section-label">Ícone (emoji)</label>
            <input
              name="icon" defaultValue={editing?.icon ?? ""} maxLength={10}
              placeholder="Selecione ou cole um emoji"
              className="input-c6 w-full text-2xl"
            />
            <div className="flex flex-wrap gap-2">
              {EMOJI_SUGGESTIONS.map(emoji => (
                <button key={emoji} type="button"
                  onClick={(e) => { (e.currentTarget.closest("form")?.querySelector("[name=icon]") as HTMLInputElement).value = emoji; }}
                  className="w-9 h-9 rounded-xl bg-surface-2 hover:bg-white/10 flex items-center justify-center text-lg transition-colors">
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Cor */}
          <div className="space-y-2">
            <label className="section-label">Cor</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map(c => (
                <label key={c} className="cursor-pointer">
                  <input type="radio" name="color" value={c} className="peer sr-only"
                    defaultChecked={editing?.color === c || (!editing && c === CATEGORY_COLORS[0])} />
                  <div className="w-8 h-8 rounded-full border-2 border-transparent peer-checked:border-white peer-checked:scale-110 transition-all"
                    style={{ backgroundColor: c }} />
                </label>
              ))}
            </div>
          </div>

          {/* Classificação Fiscal */}
          <div className="space-y-1.5">
            <label className="section-label">Classificação Fiscal (Contador)</label>
            <select name="taxClassification" defaultValue={editing?.taxClassification ?? ""} className="input-c6 w-full appearance-none bg-surface-2 placeholder-secondary text-white">
              <option value="">Sem classificação</option>
              <option value="DEDUCTIBLE_IR">Dedutível IR</option>
              <option value="NON_DEDUCTIBLE">Não dedutível</option>
              <option value="TAXABLE_INCOME">Receita tributável</option>
              <option value="OTHER">Outros</option>
            </select>
          </div>

          <button type="submit" disabled={isPending} className="btn-primary w-full">
            {isPending
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><Check size={16} /> {editing ? "Salvar" : "Criar categoria"}</>
            }
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } };

export default function CategoriasPageClient({ categories }: { categories: Category[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>();
  const [filter, setFilter] = useState<TxType | "ALL">("ALL");
  const [isPending, startTransition] = useTransition();

  const filtered = filter === "ALL" ? categories : categories.filter(c => c.type === filter);

  function handleDelete(id: string, name: string) {
    if (!confirm(`Excluir categoria "${name}"?`)) return;
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.error) toast.error(res.error);
      else toast.success("Categoria excluída");
    });
  }

  return (
    <motion.div className="space-y-5" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.header variants={item} className="flex items-center justify-between pt-2">
        <div>
          <p className="section-label mb-1">{categories.length} categorias</p>
          <h1 className="text-3xl font-black tracking-tight">Categorias</h1>
        </div>
        <button onClick={() => { setEditing(undefined); setShowModal(true); }} className="btn-primary px-4 py-2 text-sm">
          <Plus size={16} /> Nova
        </button>
      </motion.header>

      {/* Filter Tabs */}
      <motion.div variants={item} className="flex gap-1 bg-surface-2 border border-border p-1 rounded-2xl">
        {([
          { key: "ALL",      label: "Todas" },
          { key: "INCOME",   label: "Receitas" },
          { key: "EXPENSE",  label: "Despesas" },
          { key: "TRANSFER", label: "Transfer." },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === key
                ? "bg-surface border border-border text-white shadow-soft"
                : "text-secondary hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </motion.div>

      {/* List */}
      {filtered.length === 0 ? (
        <motion.div variants={item} className="card-c6 text-center py-14 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto">
            <Tag size={22} className="text-secondary" />
          </div>
          <p className="text-secondary text-sm">Nenhuma categoria aqui.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary px-5 mx-auto w-fit text-sm">
            <Plus size={15} /> Criar categoria
          </button>
        </motion.div>
      ) : (
        <motion.div variants={container} className="grid grid-cols-1 gap-2.5">
          {filtered.map(cat => (
            <motion.div key={cat.id} variants={item} className="card-c6-sm flex items-center gap-3 group hover:border-white/10 transition-all" whileHover={{ x: 2 }}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${cat.color ?? "#3A3A3C"}22` }}
              >
                {cat.icon ?? "📊"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{cat.name}</p>
                <span className={`text-xs font-medium ${
                  cat.type === "INCOME" ? "text-positive"
                  : cat.type === "EXPENSE" ? "text-negative"
                  : "text-info"
                }`}>
                  {cat.type === "INCOME" ? "Receita" : cat.type === "EXPENSE" ? "Despesa" : "Transferência"}
                </span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => { setEditing(cat); setShowModal(true); }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Pencil size={14} className="text-secondary" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  disabled={isPending}
                  className="p-2 hover:bg-negative/5 rounded-lg transition-colors"
                >
                  <Trash2 size={14} className="text-negative" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && (
          <CategoryModal
            editing={editing}
            onClose={() => { setShowModal(false); setEditing(undefined); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
