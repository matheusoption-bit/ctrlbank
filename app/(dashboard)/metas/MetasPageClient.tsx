"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Target, Plus, Check, X, Edit2, Trash2, Calendar, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, calcPercent, formatDate } from "@/lib/format";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { createGoal, updateGoal, deleteGoal, contributeToGoal } from "@/app/actions/goals";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Goal {
  id: string; name: string; targetAmount: number; currentAmount: number;
  deadline: string | null; icon: string | null; color: string | null;
  completed: boolean;
}

// ─── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({
  goal, onEdit, onDelete, onContribute
}: {
  goal: Goal; onEdit: () => void; onDelete: () => void; onContribute: (val: number) => void;
}) {
  const percent = calcPercent(goal.currentAmount, goal.targetAmount);
  const remaining = goal.targetAmount - goal.currentAmount;
  const color = goal.color ?? "#FF2D55";
  const [showAdd, setShowAdd] = useState(false);
  const [addVal, setAddVal] = useState("");

  return (
    <motion.div className="card-c6-sm space-y-4 relative overflow-hidden group" whileHover={{ y: -2 }}>
      {goal.completed && (
        <div className="absolute top-3 right-3 bg-positive/20 text-positive text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider backdrop-blur-md z-10 border border-positive/30">
          Alcançada 🎯
        </div>
      )}

      {/* Info Header */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-soft" style={{ background: `${color}22`, border: `1px solid ${color}40` }}>
            {goal.icon ?? "🎯"}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{goal.name}</h3>
            {goal.deadline && (
              <p className="text-[11px] text-secondary flex items-center gap-1 mt-0.5">
                <Calendar size={10} /> até {formatDate(goal.deadline, { short: true })}
              </p>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 hover:bg-white/10 rounded-lg text-secondary hover:text-white transition-colors" title="Editar">
             <Edit2 size={13} />
          </button>
          <button onClick={onDelete} className="p-1.5 hover:bg-negative/10 rounded-lg text-secondary hover:text-negative transition-colors" title="Excluir">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Progress & Values */}
      <div className="space-y-2 relative z-10">
         <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-secondary mb-0.5">Acumulado</p>
              <p className={`text-2xl font-black tabular-nums leading-none ${goal.completed ? "text-positive" : "text-foreground"}`}>
                {formatCurrency(goal.currentAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold tracking-wider text-secondary mb-0.5">Faltam</p>
               <p className="text-sm font-semibold tabular-nums text-secondary">
                 {goal.completed ? "R$ 0,00" : formatCurrency(remaining)}
               </p>
            </div>
         </div>

        {/* Bar */}
        <div className="h-2.5 rounded-full overflow-hidden bg-surface-2 relative shadow-inner">
           <motion.div
             className="h-full rounded-full transition-all duration-1000 ease-out"
             initial={{ width: 0 }} animate={{ width: `${Math.min(percent, 100)}%` }}
             style={{ backgroundColor: goal.completed ? "#34C759" : color, boxShadow: `0 0 10px ${goal.completed ? "#34C759" : color}` }}
           />
        </div>
        <div className="flex justify-between items-center text-[11px] font-bold text-secondary">
           <span>{percent}% concluído</span>
           <span>Meta: {formatCurrency(goal.targetAmount)}</span>
        </div>
      </div>

      {/* Quick Add Area */}
      {!goal.completed && (
        <div className="pt-2 border-t border-border/50 relative z-10">
          <AnimatePresence mode="wait">
            {!showAdd ? (
              <motion.button
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={() => setShowAdd(true)}
                 className="w-full flex justify-center items-center gap-1.5 py-1.5 hover:bg-white/5 rounded-lg text-xs font-semibold text-primary transition-colors"
              >
                <Plus size={12} /> Guardar dinheiro
              </motion.button>
            ) : (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex gap-2">
                 <div className="relative flex-1">
                   <CurrencyInput
                     value={addVal} onValueChange={setAddVal}
                     placeholder="Valor (R$)" autoFocus className="input-c6 py-1.5 px-3 pl-8 text-xs w-full"
                     onKeyDown={(e: any) => {
                       if (e.key === "Enter" && addVal) {
                          onContribute(Number(addVal)); setShowAdd(false); setAddVal("");
                       } else if (e.key === "Escape") {
                          setShowAdd(false); setAddVal("");
                       }
                     }}
                   />
                   <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-secondary pointer-events-none">R$</span>
                 </div>
                 <button onClick={() => { if(addVal) onContribute(Number(addVal)); setShowAdd(false); setAddVal(""); }} className="bg-primary text-white p-2 rounded-lg hover:bg-primary-600 transition-colors">
                    <Check size={14} />
                 </button>
                 <button onClick={() => { setShowAdd(false); setAddVal(""); }} className="bg-surface-2 border border-border p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <X size={14} />
                 </button>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

// ─── Goal Modal ───────────────────────────────────────────────────────────────

const ICONS = ["🎯", "🚗", "🏠", "✈️", "💻", "🎓", "📱", "💍", "🏥", "🎮", "🎸", "👶"];
const COLORS = ["#FF2D55", "#FF9500", "#FFCC00", "#34C759", "#30D158", "#5AC8FA", "#0A84FF", "#5856D6", "#AF52DE", "#FF2D55", "#A2845E"];

function GoalModal({ editing, onClose }: { editing?: Goal; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [targetAmount, setTargetAmount] = useState<string | number>(editing?.targetAmount ?? "");
  const [currentAmount, setCurrentAmount] = useState<string | number>(editing?.currentAmount ?? "");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
       name: fd.get("name"), targetAmount: fd.get("targetAmount"), currentAmount: fd.get("currentAmount"),
       deadline: fd.get("deadline") ? new Date(fd.get("deadline") as string) : undefined,
       icon: fd.get("icon"), color: fd.get("color")
    };

    startTransition(async () => {
      const res = editing ? await updateGoal(editing.id, payload) : await createGoal(payload);
      if (res.error) toast.error(res.error);
      else { toast.success(editing ? "Meta atualizada!" : "Meta criada!"); onClose(); }
    });
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div className="w-full max-w-md bg-surface border border-border rounded-3xl shadow-soft-xl overflow-hidden" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", damping: 30, stiffness: 400 }}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-lg">{editing ? "Editar Meta" : "Nova Meta"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl"><X size={18} className="text-secondary" /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Nome */}
          <div className="space-y-1.5">
            <label className="section-label">Nome da Meta</label>
            <input name="name" defaultValue={editing?.name} placeholder="Ex: Viagem Japão" required className="input-c6 w-full" />
          </div>
          {/* Valores */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
               <label className="section-label">Valor Alvo (R$)</label>
               <div className="relative flex items-center">
                 <span className="absolute left-3 text-secondary text-sm font-semibold pointer-events-none">R$</span>
                 <CurrencyInput name="targetAmount" value={targetAmount} onValueChange={(v) => setTargetAmount(v)} required placeholder="0,00" className="input-c6 w-full font-bold pl-9" />
               </div>
            </div>
            <div className="space-y-1.5">
               <label className="section-label">Já Guardado (R$)</label>
               <div className="relative flex items-center">
                 <span className="absolute left-3 text-secondary text-sm font-semibold pointer-events-none">R$</span>
                 <CurrencyInput name="currentAmount" value={currentAmount} onValueChange={(v) => setCurrentAmount(v)} placeholder="0,00" className="input-c6 w-full pl-9" />
               </div>
            </div>
          </div>
          {/* Data */}
          <div className="space-y-1.5">
            <label className="section-label">Prazo (opcional)</label>
            <input name="deadline" type="date" defaultValue={editing?.deadline ? editing.deadline.split("T")[0] : ""} className="input-c6 w-full" />
          </div>
           {/* Ícone */}
           <div className="space-y-1.5">
             <label className="section-label">Ícone</label>
             <div className="flex flex-wrap gap-2">
               {ICONS.map(i => (
                 <label key={i} className="cursor-pointer">
                   <input type="radio" name="icon" value={i} className="peer sr-only" defaultChecked={editing?.icon === i || (!editing && i==="🎯")} />
                   <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-surface-2 peer-checked:bg-primary/20 peer-checked:ring-2 ring-primary transition-all">{i}</div>
                 </label>
               ))}
             </div>
           </div>
           {/* Cor */}
           <div className="space-y-1.5">
             <label className="section-label">Cor</label>
             <div className="flex flex-wrap gap-2">
               {COLORS.map(c => (
                 <label key={c} className="cursor-pointer">
                   <input type="radio" name="color" value={c} className="peer sr-only" defaultChecked={editing?.color === c || (!editing && c===COLORS[0])} />
                   <div className="w-8 h-8 rounded-full border-2 border-transparent peer-checked:border-white peer-checked:scale-110 transition-all" style={{ backgroundColor: c }} />
                 </label>
               ))}
             </div>
           </div>

          <button type="submit" disabled={isPending} className="btn-primary w-full mt-2">
             {isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={16} /> Salvar</>}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

export default function MetasPageClient({ goals, hasHouseholdId }: { goals: Goal[], hasHouseholdId: boolean }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Goal | undefined>();
  const [isPending, startTransition] = useTransition();

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved  = goals.reduce((s, g) => s + g.currentAmount, 0);
  const completedCount = goals.filter(g => g.completed).length;

  function handleDelete(id: string) {
    if (!confirm("Excluir esta meta?")) return;
    startTransition(async () => {
      const res = await deleteGoal(id);
      if (res.error) toast.error(res.error); else toast.success("Meta excluída");
    });
  }

  function handleContribute(id: string, amount: number) {
    startTransition(async () => {
      const res = await contributeToGoal(id, amount);
      if (res.error) toast.error(res.error);
      else if (res.completed) toast.success("Parabéns! Meta alcançada! 🎉", { duration: 5000 });
      else toast.success(`R$ ${amount} guardados!`);
    });
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.header variants={item} className="flex items-center justify-between pt-2">
        <div>
          <p className="section-label mb-1">Objetivos</p>
          <h1 className="text-3xl font-black tracking-tight">Metas</h1>
        </div>
        <button onClick={() => { setEditing(undefined); setShowModal(true); }} disabled={!hasHouseholdId} className="btn-primary px-4 py-2 text-sm disabled:opacity-50">
          <Plus size={16} /> Nova
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
              Metas são objetivos colaborativos do módulo Household. Crie ou entre num grupo familiar para planejar o futuro.
            </p>
          </div>
          <button onClick={() => router.push("/familia")} className="relative z-10 btn-primary bg-warning hover:bg-warning-500 text-white px-6 mx-auto w-fit text-sm">
            Ir para Meu Grupo Familiar
          </button>
        </motion.div>
      )}

      {/* Dashboard Resumo */}
      {goals.length > 0 && (
         <motion.div variants={item} className="card-c6 grid grid-cols-2 gap-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)" }}>
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
             <div className="col-span-2 md:col-span-1">
                <p className="section-label mb-1">Total Guardado</p>
                <p className="text-3xl font-black tabular-nums text-primary">{formatCurrency(totalSaved)}</p>
                <p className="text-xs text-secondary mt-1">de {formatCurrency(totalTarget)} planejados</p>
             </div>
             <div className="col-span-2 md:col-span-1 flex flex-col justify-end">
                <div className="flex justify-between items-end mb-2">
                   <span className="text-xs font-bold text-secondary uppercase tracking-widest">Progresso Geral</span>
                   <span className="text-sm font-black tabular-nums">{calcPercent(totalSaved, totalTarget)}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-background shadow-inner">
                   <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(calcPercent(totalSaved, totalTarget), 100)}%` }} />
                </div>
             </div>
             {completedCount > 0 && (
                <div className="col-span-2 pt-3 border-t border-border/50 text-xs font-medium text-positive">
                  🏆 {completedCount} meta{completedCount>1?"s":""} alcançada{completedCount>1?"s":""}!
                </div>
             )}
         </motion.div>
      )}

      {/* Lista de Metas */}
      {goals.length === 0 ? (
        <motion.div variants={item} className="flex flex-col items-center justify-center py-20 px-6 text-center bg-[#242424] border border-white/[0.08] rounded-[12px]">
          <div className="w-14 h-14 rounded-[12px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5">
            <Target size={24} style={{ color: "#71717a" }} />
          </div>
          <h2 className="text-base font-bold text-[#fafafa] mb-2">Nenhuma meta ainda</h2>
          <p className="text-sm text-[#71717a] max-w-xs leading-relaxed mb-6">
            Defina objetivos financeiros para a família e acompanhe o progresso em tempo real.
          </p>
          <button
            onClick={() => setShowModal(true)}
            disabled={!hasHouseholdId}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#22c55e] text-black text-sm font-semibold hover:bg-[#16a34a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Target size={15} />
            Criar primeira meta
          </button>
        </motion.div>
      ) : (
        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {goals.map(g => (
             <motion.div key={g.id} variants={item}>
                <GoalCard goal={g}
                   onDelete={() => handleDelete(g.id)}
                   onEdit={() => { setEditing(g); setShowModal(true); }}
                   onContribute={(val) => handleContribute(g.id, val)}
                />
             </motion.div>
           ))}
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && <GoalModal editing={editing} onClose={() => { setShowModal(false); setEditing(undefined); }} />}
      </AnimatePresence>
    </motion.div>
  );
}
