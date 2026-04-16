"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, X, Send, Loader2, Camera, User, BarChart3, Search, Paperclip, CheckSquare
} from "lucide-react";
import { toast } from "sonner";
import { getAccounts } from "@/app/actions/accounts";
import { getCategories } from "@/app/actions/categories";
import { getAiCaptureGroup } from "@/app/actions/ai/review";
import { AIComposerBatchDraftItem, AIComposerResponse, AIComposerTransactionDraft, AIComposerMode } from "@/lib/ai/contracts";

import { SuccessCard, DraftReviewCard, BatchReviewCard, NextBestActionCard } from "./AICards";

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [mode, setMode] = useState<AIComposerMode>("Registrar");
  
  const [composerState, setComposerState] = useState<"idle" | "loading" | "review" | "batch_review" | "success" | "clarification" | "chat_mode">("idle");
  const [responseMsg, setResponseMsg] = useState("");
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  
  const [draft, setDraft] = useState<AIComposerTransactionDraft | null>(null);
  const [batchDrafts, setBatchDrafts] = useState<AIComposerBatchDraftItem[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [createdTxId, setCreatedTxId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("captureGroupId") || params.get("shared") || params.get("share_error")) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (open && accounts.length === 0) {
      startTransition(async () => {
        const [accs, cats] = await Promise.all([getAccounts(), getCategories()]);
        setAccounts(accs);
        setCategories(cats);
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const params = new URLSearchParams(window.location.search);
    const captureGroupId = params.get("captureGroupId");
    const shared = params.get("shared");
    const shareError = params.get("share_error");

    if (shareError) {
      toast.error("Falha ao processar o conteúdo compartilhado.");
      params.delete("share_error");
      window.history.replaceState({}, "", `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`);
      return;
    }

    if (!captureGroupId) {
      if (shared) {
        toast.success("Conteúdo compartilhado processado.");
        params.delete("shared");
        window.history.replaceState({}, "", `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`);
      }
      return;
    }

    startTransition(async () => {
      const items = await getAiCaptureGroup(captureGroupId);

      if (items.length === 1) {
        setDraft(items[0].draft);
        setActiveEventId(items[0].eventId);
        setMissingFields(items[0].draft.accountId ? [] : ["account"]);
        setComposerState(items[0].draft.accountId ? "review" : "clarification");
      } else if (items.length > 1) {
        setBatchDrafts(items);
        setComposerState("batch_review");
      } else if (shared) {
        toast.success("Conteúdo compartilhado processado.");
      }

      params.delete("shared");
      params.delete("captureGroupId");
      window.history.replaceState({}, "", `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    if (file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setInput(text); // For CSV, just dump the text
        setImageBase64(null);
        setMimeType("text/csv");
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setImageBase64(base64.split(",")[1]);
        setMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  async function send() {
    if (!input.trim() && !imageBase64) return;
    
    setComposerState("loading");
    setResponseMsg("");
    setDraft(null);
    setBatchDrafts([]);
    setMissingFields([]);
    setCreatedTxId(null);
    setActiveEventId(null);

    let inputType = "text";
    if (mimeType === "application/pdf") {
      inputType = "pdf";
    } else if (mimeType === "text/csv") {
      inputType = "csv";
    } else if (imageBase64) {
      inputType = input.trim() ? "text+image" : "image";
    }

    const payload = { 
      mode,
      inputType, 
      imageBase64: inputType === "text" || inputType === "csv" ? undefined : imageBase64, 
      content: input.trim() || undefined,
      mimeType: inputType === "text" || inputType === "csv" ? undefined : mimeType
    };

    // Keep file name for preview, clear input so user can prepare next text
    if (inputType !== "csv") {
       setInput("");
    } else {
       setInput(""); // clear CSV text from textarea visible part
    }

    try {
      const res = await fetch("/api/ai/composer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: AIComposerResponse = await res.json();
      setActiveEventId(data.eventId);
      
      setImageBase64(null);
      setFileName(null);
      setMimeType(null);

      if (data.intent === "chat_reply") {
        setComposerState("chat_mode");
        setResponseMsg(data.message);
      } else if (data.intent === "transaction_created") {
        setComposerState("success");
        setResponseMsg(data.message);
        setCreatedTxId(data.createdTransactionId);
        setDraft(data.transactionDraft);
      } else if (data.intent === "batch_review") {
        setComposerState("batch_review");
        setResponseMsg(data.message);
        setBatchDrafts(data.batchDrafts || []);
      } else if (data.intent === "transaction_draft") {
        setComposerState("review");
        setResponseMsg(data.message);
        setDraft(data.transactionDraft);
      } else {
        setComposerState("clarification");
        setResponseMsg(data.message);
        setDraft(data.transactionDraft);
        setMissingFields(data.missingFields || []);
      }
    } catch (err) {
      setComposerState("clarification");
      setResponseMsg("Falha na comunicação com o AI Composer.");
    }
  }

  const modes: AIComposerMode[] = ["Registrar", "Revisar", "Perguntar", "Planejar"];

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
            {/* Context/Operating Header Modes */}
            <div className="flex bg-surface-2/80 backdrop-blur-md px-2 pt-2 border-b border-border/50 items-end overflow-x-auto no-scrollbar">
               {modes.map(m => (
                 <button 
                  key={m} 
                  onClick={() => setMode(m)}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${mode === m ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-foreground'}`}
                 >
                   {m}
                 </button>
               ))}
            </div>

            {/* Inbox Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {composerState === "idle" && (
                <div className="flex flex-col items-center justify-center text-center h-40 space-y-3 opacity-60">
                   {mode === "Registrar" && <Sparkles size={32} className="text-secondary" />}
                   {mode === "Revisar" && <CheckSquare size={32} className="text-secondary" />}
                   {mode === "Perguntar" && <Search size={32} className="text-secondary" />}
                   {mode === "Planejar" && <BarChart3 size={32} className="text-secondary" />}
                  <p className="text-sm font-medium">O que vamos fazer?</p>
                  <p className="text-xs text-secondary/70">
                    {mode === "Registrar" && "Digite, cole um print, anexe PDF ou CSV."}
                    {mode === "Revisar" && "Visualize drafts e lotes aguardando aprovação."}
                    {mode === "Perguntar" && "Tire dúvidas sobre suas finanças ou movimentações."}
                    {mode === "Planejar" && "Descubra como você está indo em relação às metas e orçamentos."}
                  </p>
                </div>
              )}

              {composerState === "loading" && (
                <div className="flex flex-col items-center justify-center text-center h-40 space-y-3">
                  <Loader2 size={24} className="animate-spin text-primary" />
                  <p className="text-sm font-medium animate-pulse">Lendo intenção e processando...</p>
                </div>
              )}

              {composerState === "success" && draft && createdTxId && (
                <SuccessCard 
                  draft={draft} 
                  txId={createdTxId} 
                  onUndo={() => {
                    setComposerState("idle");
                    setCreatedTxId(null);
                    setDraft(null);
                  }}
                />
              )}

              {composerState === "batch_review" && batchDrafts.length > 0 && (
                <BatchReviewCard 
                  items={batchDrafts}
                  onComplete={() => {
                    setComposerState("idle");
                    setBatchDrafts([]);
                  }}
                />
              )}

              {composerState === "chat_mode" && (
                 <div className="bg-surface-2 border border-border rounded-xl p-4 text-sm text-foreground space-y-2 whitespace-pre-wrap">
                    <div className="flex items-center gap-2 text-primary font-bold pb-2 border-b border-border/50">
                       <Sparkles size={14}/> CtrlBot Responde
                    </div>
                    {responseMsg}
                 </div>
              )}

              {/* Clarification Next best action (missing account) */}
              {composerState === "clarification" && missingFields.includes("account") && (
                <NextBestActionCard missingAccount={true} onSwitchToReview={() => setComposerState("review")} />
              )}

              {/* Clarification Generic */}
              {composerState === "clarification" && !missingFields.includes("account") && responseMsg && !draft && (
                <div className="card-c6 border-info/30 bg-info/5 space-y-2">
                  <p className="font-bold text-sm text-info">Incompleto</p>
                  <p className="text-xs text-secondary">{responseMsg}</p>
                </div>
              )}

              {(composerState === "review" || (composerState === "clarification" && draft && !missingFields.includes("account"))) && draft && (
                <DraftReviewCard 
                  draft={draft} 
                  missingFields={missingFields} 
                  accounts={accounts} 
                  categories={categories} 
                  eventId={activeEventId}
                  onApproved={() => {
                    setComposerState("idle");
                    setDraft(null);
                  }}
                />
              )}
            </div>

            {/* Omni Input */}
            <div className="p-3 border-t border-border/50 bg-surface-2/40">
              {(fileName || imageBase64) && mimeType !== "text/csv" && (
                <div className="mb-2 px-3 py-2 rounded-xl bg-surface border border-primary/20 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2 text-xs truncate max-w-[80%]">
                    <Paperclip size={12} className="text-primary"/> 
                    <span className="truncate">{fileName || "Anexo adicionado"}</span>
                  </div>
                  <button onClick={() => { setImageBase64(null); setFileName(null); setMimeType(null); }} className="p-1 rounded-full text-secondary hover:bg-negative/80 hover:text-white transition-colors"><X size={12} /></button>
                </div>
              )}
              {fileName && mimeType === "text/csv" && (
                <div className="mb-2 px-3 py-2 rounded-xl bg-surface border border-primary/20 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2 text-xs truncate max-w-[80%]">
                    <BarChart3 size={12} className="text-primary"/> 
                    <span className="truncate">{fileName}</span>
                  </div>
                  <button onClick={() => { setInput(""); setFileName(null); setMimeType(null); }} className="p-1 rounded-full text-secondary hover:bg-negative/80 hover:text-white transition-colors"><X size={12} /></button>
                </div>
              )}
              
              <div className="flex gap-2 items-end bg-surface border border-border shadow-soft rounded-2xl p-1 relative focus-within:border-white/20 transition-colors">
                <input type="file" accept="image/*,.pdf,.csv" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-9 h-9 rounded-xl flex flex-shrink-0 items-center justify-center text-secondary hover:text-white hover:bg-white/5 transition-all mb-0.5">
                  <Camera size={18} />
                </button>
                
                <textarea
                  value={mimeType === "text/csv" ? "(CSV Carregado) " : input}
                  onChange={(e) => {
                     if (mimeType !== "text/csv") setInput(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                  }}
                  placeholder={mode === "Perguntar" ? "Pergunte algo ao CtrlBank..." : "Escreva, cole um print, ou anexe um arquivo..."}
                  className="flex-1 bg-transparent text-sm min-h-[40px] max-h-24 resize-none outline-none placeholder:text-secondary/60 py-2.5 disabled:opacity-50"
                  disabled={composerState === "loading" || mimeType === "text/csv"}
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
