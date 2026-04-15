"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BotMessageSquare, X, Send, Loader2, Sparkles } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
}

// ─── Markdown-lite renderer ────────────────────────────────────────────────────

function MsgContent({ text }: { text: string }) {
  // Bold **text**, line breaks
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="text-sm leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </p>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

export default function AIChatWidget() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Olá! Sou o CtrlBot 🤖 Posso te ajudar com análises e dicas financeiras. O que você gostaria de saber?" },
  ]);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || isPending) return;
    setInput("");

    const userMsg: Message = { role: "user", content: text };
    const pendingMsg: Message = { role: "assistant", content: "", pending: true };
    setMessages(prev => [...prev, userMsg, pendingMsg]);

    startTransition(async () => {
      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Erro desconhecido" }));
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: err.error ?? "Algo deu errado. Tente novamente." };
            return updated;
          });
          return;
        }

        // SSE stream parsing
        const reader  = res.body!.getReader();
        const decoder = new TextDecoder();
        let   full    = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content ?? "";
              full += delta;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: full, pending: true };
                return updated;
              });
            } catch { /* skip malformed chunks */ }
          }
        }

        // Finalize
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: full, pending: false };
          return updated;
        });
      } catch {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: "Falha na conexão com a IA. Verifique sua internet." };
          return updated;
        });
      }
    });
  }

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed z-50 w-14 h-14 rounded-full bg-primary shadow-soft-xl flex items-center justify-center text-white"
        style={{
          left: "1.25rem",
          bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Assistente IA"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open
            ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={22} /></motion.span>
            : <motion.span key="open"  initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><BotMessageSquare size={22} /></motion.span>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 28, stiffness: 380 }}
            className="fixed z-50 bg-surface border border-border rounded-3xl shadow-soft-xl flex flex-col overflow-hidden"
            style={{
              left: "1.25rem",
              bottom: "calc(8rem + env(safe-area-inset-bottom, 0px))",
              width: "min(calc(100vw - 2.5rem), 360px)",
              height: "min(65dvh, 520px)",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-surface-2/50">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles size={15} className="text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">CtrlBot</p>
                <p className="text-[11px] text-secondary">Assistente Financeiro · IA</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-surface-2 border border-border/50 text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.pending && !msg.content
                      ? <Loader2 size={14} className="animate-spin text-secondary" />
                      : <MsgContent text={msg.content} />
                    }
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/50">
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="flex gap-2 items-center bg-surface-2 border border-border rounded-2xl px-3 py-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pergunte algo sobre suas finanças…"
                  maxLength={1000}
                  disabled={isPending}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-secondary/60 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isPending}
                  className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center disabled:opacity-40 transition-opacity flex-shrink-0"
                >
                  {isPending
                    ? <Loader2 size={14} className="animate-spin text-white" />
                    : <Send size={14} className="text-white" />
                  }
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
