"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, X, Send, Loader2, Camera, Undo2, Check, FileImage, 
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { getAccounts } from "@/app/actions/accounts";
import { getCategories } from "@/app/actions/categories";
import { createTransaction, undoTransaction } from "@/app/actions/transactions";

// ─── Contracts ───────────────────────────────────────────────────────────────

type AIComposerResponse = {
  intent: "chat_reply" | "transaction_created" | "transaction_draft" | "clarification_needed";
  message: string;
  requiresReview: boolean;
  autoSaved: boolean;
  transactionDraft: any | null;
  createdTransactionId: string | null;
  undoAvailable: boolean;
  undoToken: string | null;
  missingFields: string[];
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  
  const [composerState, setComposerState] = useState<"idle" | "loading" | "review" | "success" | "clarification">("idle");
  const [responseMsg, setResponseMsg] = useState("");
  
  // Data for review
  const [draft, setDraft] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [createdTxId, setCreatedTxId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && accounts.length === 0) {
      // Pre-fetch data for the quick review card form
      startTransition(async () => {
        const [accs, cats] = await Promise.all([getAccounts(), getCategories()]);
        setAccounts(accs);
        setCategories(cats);
      });
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setImageBase64(base64.split(",")[1]); // Strip data URL part
    };
    reader.readAsDataURL(file);
  };

  async function send() {
    if (!input.trim() && !imageBase64) return;
    
    setComposerState("loading");
    setResponseMsg("");
    setDraft(null);
    setCreatedTxId(null);

    const payload = imageBase64 
      ? { inputType: "image", imageBase64 }
      : { inputType: "text", content: input.trim() };

    // Clear inputs immediately for better UX
    setInput("");
    setImageBase64(null);

    try {
      const res = await fetch("/api/ai/composer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: AIComposerResponse = await res.json();

      if (data.intent === "transaction_created") {
        setComposerState("success");
        setResponseMsg(data.message);
        setCreatedTxId(data.createdTransactionId);
      } else if (data.intent === "transaction_draft") {
        setComposerState("review");
        setResponseMsg(data.message);
        setDraft(data.transactionDraft);
      } else {
        setComposerState("clarification");
        setResponseMsg(data.message);
        setDraft(data.transactionDraft); // In case it has partial data
      }
    } catch (err) {
      setComposerState("clarification");
      setResponseMsg("Falha na comunicação com o AI Composer.");
    }
  }

  function handleUndo() {
    if (!createdTxId) return;
    startTransition(async () => {
      const result = await undoTransaction(createdTxId);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Transação desfeita.");
        setComposerState("idle");
        setCreatedTxId(null);
      }
    });
  }

  function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    
    startTransition(async () => {
      const result = await createTransaction({
        bankAccountId: draft.accountId,
        categoryId: draft.categoryId || null,
        type: draft.transactionType,
        status: "COMPLETED",
        amount: Number(draft.amount),
        description: draft.description,
        date: new Date(draft.date),
      });

      if (result.error) toast.error(result.error);
      else {
        toast.success("Revisão aprovada e transação criada!");
        setComposerState("idle");
        setDraft(null);
      }
    });
  }

  return (
    <>
      <motion.button
        onClick={() => {
          setOpen(!open);
          if (!open) setComposerState("idle");
        }}
        className="fixed z-50 w-14 h-14 rounded-full bg-primary shadow-glow-primary flex items-center justify-center text-white"
        style={{ right: "1.25rem", bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open
            ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={22} /></motion.span>
            : <motion.span key="open"  initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Sparkles size={22} fill="currentColor" /></motion.span>
          }
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 28, stiffness: 380 }}
            className="fixed z-50 bg-surface border border-border rounded-3xl shadow-soft-xl flex flex-col overflow-hidden"
            style={{ right: "1.25rem", bottom: "calc(8rem + env(safe-area-inset-bottom, 0px))", width: "min(calc(100vw - 2.5rem), 380px)", maxHeight: "min(80dvh, 600px)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4 bg-surface-2/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-inner">
                <Sparkles size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-bold text-base leading-tight">AI Composer</p>
                <p className="text-[11px] text-secondary">Captura sem atrito</p>
              </div>
            </div>

            {/* Inbox Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {composerState === "idle" && (
                <div className="flex flex-col items-center justify-center text-center h-40 space-y-3 opacity-60">
                  <Sparkles size={32} className="text-secondary" />
                  <p className="text-sm font-medium">O que vamos registrar agora?</p>
                  <p className="text-xs text-secondary/70">Texto, foto ou áudio.</p>
                </div>
              )}

              {composerState === "loading" && (
                <div className="flex flex-col items-center justify-center text-center h-40 space-y-3">
                  <Loader2 size={24} className="animate-spin text-primary" />
                  <p className="text-sm font-medium animate-pulse">Lendo intenção...</p>
                </div>
              )}

              {composerState === "success" && (
                <div className="card-c6 border-positive/30 bg-positive/5 space-y-3">
                  <div className="flex items-center gap-2 text-positive">
                    <Check size={18} />
                    <p className="font-bold text-sm">{responseMsg}</p>
                  </div>
                  <button onClick={handleUndo} disabled={isPending} className="flex items-center justify-center gap-2 w-full py-2 bg-surface border border-border rounded-xl text-sm font-semibold hover:border-negative/50 hover:text-negative transition-colors">
                    <Undo2 size={16} /> Desfazer Acerto Automático
                  </button>
                </div>
              )}

              {composerState === "clarification" && (
                <div className="card-c6 border-info/30 bg-info/5 space-y-2">
                  <p className="font-bold text-sm text-info">Ops...</p>
                  <p className="text-xs text-secondary">{responseMsg}</p>
                </div>
              )}

              {(composerState === "review" || (composerState === "clarification" && draft)) && (
                <div className="bg-surface-2 border border-border rounded-2xl p-4 shadow-soft">
                  <p className="text-xs font-black uppercase tracking-wider text-secondary mb-3 flex items-center justify-between">
                    Revisão Rápida
                    <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px]">
                      {(draft.confidence.overall * 100).toFixed(0)}% Match
                    </span>
                  </p>
                  
                  <form onSubmit={submitReview} className="space-y-3 mt-4">
                    {/* Amount */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-secondary font-semibold">Valor</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-secondary text-sm font-semibold pointer-events-none">R$</span>
                        <CurrencyInput value={draft.amount} onValueChange={(v) => setDraft({...draft, amount: v})} className="input-c6-sm w-full pl-9 font-bold" required placeholder="0,00" />
                      </div>
                    </div>
                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-secondary font-semibold">Descrição</label>
                      <input type="text" value={draft.description} onChange={(e) => setDraft({...draft, description: e.target.value})} className="input-c6-sm w-full" required />
                    </div>
                    {/* Account */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-secondary font-semibold">Conta Origem</label>
                      <div className="relative">
                        <select value={draft.accountId || ""} onChange={(e) => setDraft({...draft, accountId: e.target.value})} className="input-c6-sm w-full appearance-none pr-8" required>
                          <option value="">Selecione a conta...</option>
                          {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                      </div>
                    </div>
                    {/* Category */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-secondary font-semibold">Categoria (Opcional)</label>
                      <div className="relative">
                        <select value={draft.categoryId || ""} onChange={(e) => setDraft({...draft, categoryId: e.target.value})} className="input-c6-sm w-full appearance-none pr-8">
                          <option value="">Sem categoria definida...</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                      </div>
                    </div>
                    {/* Submit */}
                    <button type="submit" disabled={isPending} className="btn-primary w-full py-2 mt-2">
                      {isPending ? <Loader2 size={16} className="animate-spin text-white mx-auto" /> : "Confirmar e Registrar"}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Omni Input */}
            <div className="p-3 border-t border-border/50 bg-black/40">
              {imageBase64 && (
                <div className="mb-2 w-16 h-16 rounded-xl bg-surface border border-primary/50 relative overflow-hidden flex-shrink-0">
                  <img src={`data:image/jpeg;base64,${imageBase64}`} className="object-cover w-full h-full opacity-80" />
                  <button onClick={() => setImageBase64(null)} className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-negative/80"><X size={10} /></button>
                </div>
              )}
              
              <div className="flex gap-2 items-end bg-surface border border-border shadow-soft rounded-2xl p-1 relative focus-within:border-white/20 transition-colors">
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-9 h-9 rounded-xl flex flex-shrink-0 items-center justify-center text-secondary hover:text-white hover:bg-white/5 transition-all mb-0.5">
                  <Camera size={18} />
                </button>
                
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                  }}
                  placeholder="Escreva algo ou envie um comprovante..."
                  className="flex-1 bg-transparent text-sm min-h-[40px] max-h-24 resize-none outline-none placeholder:text-secondary/60 py-2.5 disabled:opacity-50"
                  disabled={composerState === "loading"}
                  rows={(input.match(/\n/g)||[]).length + 1 > 3 ? 3 : (input.match(/\n/g)||[]).length + 1}
                />
                
                <button
                  type="button"
                  onClick={send}
                  disabled={(!input.trim() && !imageBase64) || composerState === "loading"}
                  className="w-9 h-9 rounded-xl bg-primary flex flex-shrink-0 items-center justify-center text-white disabled:opacity-40 transition-opacity mb-0.5"
                >
                  {composerState === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
