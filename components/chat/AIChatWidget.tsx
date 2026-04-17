"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, X, Send, Loader2, Camera, BarChart3, Search, Paperclip, CheckSquare, Copy, MessageSquare, Mic, Square, Trash2, ChevronUp, Lightbulb
} from "lucide-react";
import { toast } from "sonner";
import { getAccounts } from "@/app/actions/accounts";
import { getCategories } from "@/app/actions/categories";
import { getAiCaptureGroup } from "@/app/actions/ai/review";
import { getConversationHistory } from "@/app/actions/ai/conversation";
import { AIComposerBatchDraftItem, AIComposerResponse, AIComposerTransactionDraft, AIComposerMode } from "@/lib/ai/contracts";

import { SuccessCard, DraftReviewCard, BatchReviewCard, NextBestActionCard, SavedPlanCard, ProductFeedbackCard } from "./AICards";

type ComposerMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode: string;
  timestamp: string;
  metadata?: any;
};

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
  const [messages, setMessages] = useState<ComposerMessage[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Audio Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date);
  };

  const appendMessage = (role: "user" | "assistant", content: string, currentMode: string, metadata?: any) => {
    if (!content.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role,
        content,
        mode: currentMode,
        timestamp: formatTimestamp(new Date()),
        metadata
      },
    ]);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("captureGroupId") || params.get("shared") || params.get("share_error")) {
      setOpen(true);
    }

    const handleToggle = () => {
      setOpen(prev => {
        if (!prev) setComposerState("idle");
        return !prev;
      });
    };
    window.addEventListener("toggle-composer", handleToggle);
    return () => window.removeEventListener("toggle-composer", handleToggle);
  }, []);

  useEffect(() => {
    const syncViewport = () => setIsMobile(window.innerWidth < 768);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const fetchHistory = async (cursor?: string) => {
    setIsLoadingHistory(true);
    try {
      const res = await getConversationHistory(20, cursor);
      if (res.conversationId) setConversationId(res.conversationId);
      if (res.nextCursor) setNextCursor(res.nextCursor);
      else setNextCursor(null);

      if (res.messages.length > 0) {
        const formatted = res.messages.map((m: any) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          mode: m.mode,
          timestamp: formatTimestamp(new Date(m.createdAt)),
          metadata: m.metadata
        }));
        
        if (cursor) {
           setMessages(prev => [...formatted, ...prev]);
        } else {
           setMessages(formatted);
           setTimeout(() => {
             messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
           }, 100);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (open && accounts.length === 0) {
      startTransition(async () => {
        const [accs, cats] = await Promise.all([getAccounts(), getCategories()]);
        setAccounts(accs);
        setCategories(cats);
        await fetchHistory(); // Fetch initial history
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
      window.history.replaceState({}, "", `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`);
      return;
    }

    if (!captureGroupId) {
      if (shared) {
        toast.success("Conteúdo compartilhado processado.");
        params.delete("shared");
        window.history.replaceState({}, "", `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`);
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
      window.history.replaceState({}, "", `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`);
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
        setInput(text);
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

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      toast.error("Não foi possível acessar o microfone.");
    }
  };

  const cancelAudioRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    clearInterval(timerIntervalRef.current!);
    setIsRecording(false);
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  const stopAndSendAudio = () => {
    if (mediaRecorderRef.current && isRecording) {
      clearInterval(timerIntervalRef.current!);
      const currentDurationSeconds = recordingTime;
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(",")[1];
          setImageBase64(base64data);
          setMimeType("audio/webm");
          setFileName("VoiceNote");
          setIsRecording(false);
          setRecordingTime(0);
          
          // Trigger send directly
          executeSend(undefined, base64data, "audio/webm", "audio", currentDurationSeconds * 1000);
        };
      };
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  const formatAudioTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  async function executeSend(overrideInput?: string, overrideBase64?: string, overrideMime?: string, forcedInputType?: string, audioDurationMs?: number) {
    const finalInput = overrideInput ?? input;
    const finalBase64 = overrideBase64 ?? imageBase64;
    const finalMime = overrideMime ?? mimeType;

    if (!finalInput.trim() && !finalBase64) return;
    
    setComposerState("loading");
    setResponseMsg("");
    setDraft(null);
    setBatchDrafts([]);
    setMissingFields([]);
    setCreatedTxId(null);
    setActiveEventId(null);

    let inputType = forcedInputType ?? "text";
    if (!forcedInputType) {
      if (finalMime === "application/pdf") {
        inputType = "pdf";
      } else if (finalMime === "text/csv") {
        inputType = "csv";
      } else if (finalBase64) {
        inputType = finalInput.trim() ? "text+image" : "image";
      }
    }

    const payload = { 
      mode,
      inputType, 
      imageBase64: inputType === "text" || inputType === "csv" ? undefined : finalBase64, 
      content: finalInput.trim() || undefined,
      mimeType: inputType === "text" || inputType === "csv" ? undefined : finalMime,
      conversationId: conversationId || undefined,
      audioDurationMs
    };

    const userMessageDisplay =
      inputType === "audio" ? `🎤 Áudio Enviado (${formatAudioTime(Math.floor((audioDurationMs || 0)/1000))})` :
      finalInput.trim() ||
      (inputType === "pdf" && fileName ? `Arquivo PDF enviado: ${fileName}` : "") ||
      (inputType === "csv" && fileName ? `Arquivo CSV enviado: ${fileName}` : "") ||
      (finalBase64 && fileName ? `Imagem enviada: ${fileName}` : "") ||
      (finalBase64 ? "Imagem enviada" : "");

    appendMessage("user", userMessageDisplay, mode);

    if (inputType !== "csv" && inputType !== "audio") {
       setInput("");
    } else if (inputType === "csv") {
       setInput(""); 
    }

    try {
      const res = await fetch("/api/ai/composer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Falha ao extrair dados");
      }

      const composerData: AIComposerResponse = data;
      setActiveEventId(composerData.eventId);
      if (composerData.conversationId) {
        setConversationId(composerData.conversationId);
      }
      
      setImageBase64(null);
      setFileName(null);
      setMimeType(null);

      if (composerData.intent === "chat_reply") {
        setComposerState("chat_mode");
        // We do not setResponseMsg for continuous chat, we just append to messages array.
        appendMessage("assistant", composerData.message, mode);
      } else if (composerData.intent === "transaction_created") {
        setComposerState("success");
        setCreatedTxId(composerData.createdTransactionId);
        setDraft(composerData.transactionDraft);
        appendMessage("assistant", composerData.message, mode);
      } else if (composerData.intent === "batch_review") {
        setComposerState("batch_review");
        setBatchDrafts(composerData.batchDrafts || []);
        appendMessage("assistant", composerData.message, mode);
      } else if (composerData.intent === "transaction_draft") {
        setComposerState("review");
        setDraft(composerData.transactionDraft);
        appendMessage("assistant", composerData.message, mode);
      } else if (composerData.intent === "saved_plan") {
        setComposerState("chat_mode");
        appendMessage("assistant", composerData.message, mode, { intent: "saved_plan", planData: composerData.transactionDraft, savedPlanId: composerData.savedPlanId });
      } else {
        setComposerState("clarification");
        setResponseMsg(composerData.message);
        setDraft(composerData.transactionDraft);
        setMissingFields(composerData.missingFields || []);
        appendMessage("assistant", composerData.message, mode);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Falha na comunicação com o AI Composer.";
      setComposerState("clarification");
      setResponseMsg(message);
      toast.error(message);
      appendMessage("assistant", message, mode);
    }
  }

  const modes: AIComposerMode[] = ["Registrar", "Revisar", "Perguntar", "Planejar", "Sugerir"];

  return (
    <>
      <motion.button
        onClick={() => {
          setOpen(!open);
          if (!open) setComposerState("idle");
        }}
        className="hidden md:flex fixed z-50 w-14 h-14 rounded-full bg-primary shadow-glow-primary items-center justify-center text-white"
        style={{
          right: "1.25rem",
          bottom: "1.25rem",
        }}
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
            style={{
              right: isMobile ? "0.5rem" : "1.25rem",
              left: isMobile ? "0.5rem" : "auto",
              top: isMobile ? "calc(env(safe-area-inset-top, 0px) + 0.5rem)" : "auto",
              bottom: isMobile ? "calc(5.5rem + env(safe-area-inset-bottom, 0px))" : "5.5rem",
              width: "auto",
              maxWidth: isMobile ? "none" : "400px",
              maxHeight: isMobile ? "calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 6.5rem)" : "650px",
            }}
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
              {nextCursor && (
                 <div className="flex justify-center mb-4">
                    <button onClick={() => fetchHistory(nextCursor)} disabled={isLoadingHistory} className="text-xs bg-surface-2 border border-border/50 px-3 py-1.5 rounded-full text-secondary hover:text-white flex items-center gap-1 transition-colors">
                       {isLoadingHistory ? <Loader2 size={12} className="animate-spin" /> : <ChevronUp size={12} />}
                       Carregar anteriores
                    </button>
                 </div>
              )}

              {messages.length > 0 && (
                <div className="space-y-3 pb-2">
                  {messages.map((message) => (
                    <div key={message.id} className="flex flex-col">
                       <div
                         className={`rounded-2xl border px-3 py-2.5 ${
                           message.role === "user"
                             ? "ml-auto border-primary/20 bg-primary/10 max-w-[85%]"
                             : "mr-auto border-border bg-surface-2 max-w-[90%]"
                         }`}
                       >
                         <div className="flex items-center justify-between gap-3 mb-1">
                           <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-secondary opacity-70">
                             <MessageSquare size={10} />
                             <span>{message.role === "user" ? "Você" : message.mode}</span>
                             <span>{message.timestamp}</span>
                           </div>
                           <button
                             type="button"
                             onClick={async () => {
                               await navigator.clipboard.writeText(message.content);
                               toast.success("Mensagem copiada.");
                             }}
                             className="text-secondary hover:text-white transition-colors"
                             aria-label="Copiar mensagem"
                           >
                             <Copy size={10} />
                           </button>
                         </div>
                         <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                         
                         {message.metadata?.intent === "saved_plan" && message.metadata.planData && (
                            <div className="mt-2 text-left">
                               <SavedPlanCard planId={message.metadata.savedPlanId} planData={message.metadata.planData} />
                            </div>
                         )}
                         {message.metadata?.intent === "product_feedback_logged" && message.metadata.normalizedFeedback && (
                            <div className="mt-2 text-left">
                               <ProductFeedbackCard feedbackId={message.metadata.feedbackId} normalizedFeedback={message.metadata.normalizedFeedback} />
                            </div>
                         )}
                       </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
              
              {composerState === "idle" && messages.length === 0 && !isLoadingHistory && (
                <div className="flex flex-col items-center justify-center text-center h-40 space-y-3 opacity-60">
                   {mode === "Registrar" && <Sparkles size={32} className="text-secondary" />}
                   {mode === "Revisar" && <CheckSquare size={32} className="text-secondary" />}
                   {mode === "Perguntar" && <Search size={32} className="text-secondary" />}
                   {mode === "Planejar" && <BarChart3 size={32} className="text-secondary" />}
                   {mode === "Sugerir" && <Lightbulb size={32} className="text-secondary" />}
                  <p className="text-sm font-medium">O que vamos fazer?</p>
                  <p className="text-xs text-secondary/70 px-4">
                    {mode === "Registrar" && "Digite, fale, cole um print, anexe PDF ou CSV."}
                    {mode === "Revisar" && "Visualize drafts e lotes aguardando aprovação."}
                    {mode === "Perguntar" && "Tire dúvidas sobre a saúde financeira da sua família."}
                    {mode === "Planejar" && "Descubra como você está indo em relação às metas e orçamentos."}
                    {mode === "Sugerir" && "Sugira melhorias, reporte bugs ou novas funcionalidades."}
                  </p>
                </div>
              )}

              {composerState === "loading" && (
                <div className="flex flex-col items-center justify-center text-center h-24 space-y-3">
                  <Loader2 size={24} className="animate-spin text-primary" />
                  <p className="text-sm font-medium animate-pulse">Pensando...</p>
                </div>
              )}

              {/* Action Cards Overlays */}
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

              {composerState === "clarification" && missingFields.includes("account") && (
                <NextBestActionCard missingAccount={true} onSwitchToReview={() => setComposerState("review")} />
              )}

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
            <div className="p-3 border-t border-border/50 bg-surface-2/40 relative">
              {isRecording ? (
                 <div className="flex items-center justify-between bg-negative/10 border border-negative/30 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-3 text-negative font-semibold text-sm">
                       <span className="flex h-2 w-2 relative">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-negative opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 bg-negative"></span>
                       </span>
                       Gravando... {formatAudioTime(recordingTime)}
                    </div>
                    <div className="flex gap-2">
                       <button onClick={cancelAudioRecording} className="p-2 bg-surface text-secondary hover:text-white rounded-full transition-colors"><Trash2 size={16} /></button>
                       <button onClick={stopAndSendAudio} className="p-2 bg-primary text-white hover:bg-primary/80 rounded-full transition-colors"><Square size={16} fill="currentColor" /></button>
                    </div>
                 </div>
              ) : (
                <>
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
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); executeSend(); }
                      }}
                      placeholder={mode === "Perguntar" ? "Pergunte algo..." : "Escreva, fale, cole um print..."}
                      className="flex-1 bg-transparent text-sm min-h-[40px] max-h-24 resize-none outline-none placeholder:text-secondary/60 py-2.5 disabled:opacity-50"
                      disabled={composerState === "loading" || mimeType === "text/csv"}
                      rows={(input.match(/\n/g)||[]).length + 1 > 3 ? 3 : (input.match(/\n/g)||[]).length + 1}
                    />
                    
                    {input.trim() || imageBase64 ? (
                       <button
                         type="button"
                         onClick={() => executeSend()}
                         disabled={composerState === "loading"}
                         className="w-9 h-9 rounded-xl bg-primary flex flex-shrink-0 items-center justify-center text-white disabled:opacity-40 transition-opacity mb-0.5"
                       >
                         {composerState === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                       </button>
                    ) : (
                       <button
                         type="button"
                         onClick={startAudioRecording}
                         disabled={composerState === "loading"}
                         className="w-9 h-9 rounded-xl bg-surface-2 flex flex-shrink-0 items-center justify-center text-secondary hover:text-white hover:bg-white/10 transition-colors mb-0.5"
                       >
                         <Mic size={18} />
                       </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
