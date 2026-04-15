"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Copy, Check, Shield, Trash2, QrCode } from "lucide-react";
import { toast } from "sonner";
import { createCounterSession, revokeCounterSession } from "@/app/actions/counter";
import { formatDate } from "@/lib/format";
// Caso tenhamos QRCode lib, se não apenas link:
import { QRCodeSVG } from "qrcode.react";

interface CounterSession {
  id: string; label: string | null; tokenHash: string; expiresAt: Date; createdAt: Date;
}

function NewSessionModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: (token: string) => void }) {
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createCounterSession(fd);
      if (res.error) {
        toast.error(res.error);
      } else if (res.token) {
        toast.success("Sessão gerada com sucesso!");
        onSuccess(res.token);
      }
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
          <h2 className="font-bold text-lg">Novo Acesso p/ Contador</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl">
            <X size={18} className="text-secondary" />
          </button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="section-label">Rótulo / Mês</label>
            <input name="label" required placeholder="Ex: Fechamento Abril 2026" className="input-c6 w-full" />
          </div>
          <div className="space-y-1.5">
            <label className="section-label">Validade (Dias)</label>
            <input type="number" name="expiresInDays" defaultValue={30} min={1} max={90} className="input-c6 w-full" />
          </div>
          <p className="text-xs text-secondary leading-relaxed bg-surface-2 p-3 rounded-xl">
            <Shield size={14} className="inline mr-1 -mt-0.5" />
            Este acesso concederá visão <b>apenas de leitura</b> do Demonstrativo de Resultados (DRE), transações e métricas do ano. Seus saldos nunca serão alterados.
          </p>
          <button type="submit" disabled={isPending} className="btn-primary w-full">
            {isPending ? <div className="w-4 h-4 border-2 border-white/border-t-white rounded-full animate-spin" /> : "Gerar Acesso Temporário"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function TokenModal({ token, onClose }: { token: string, onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/contador/${token}`;

  function handleCopy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-sm bg-surface border border-border rounded-3xl shadow-soft-xl overflow-hidden text-center"
      >
        <div className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-positive/10 text-positive flex items-center justify-center mx-auto mb-2">
            <Check size={24} />
          </div>
          <h2 className="font-bold text-lg">Acesso Gerado!</h2>
          <p className="text-sm text-secondary">
            Compartilhe este link com seu contador. O acesso funcionará pelas próximas semanas configuradas.
          </p>

          <div className="bg-white p-4 rounded-xl mx-auto w-fit">
            <QRCodeSVG value={link} size={150} />
          </div>

          <div className="flex bg-surface-2 rounded-xl p-2 items-center">
            <input readOnly value={link} className="bg-transparent flex-1 outline-none text-xs text-secondary px-2 truncate" />
            <button onClick={handleCopy} className="p-2 bg-surface hover:bg-white/10 rounded-lg text-white transition-colors">
              {copied ? <Check size={16} className="text-positive" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
        <div className="p-4 border-t border-border mt-2">
          <button onClick={onClose} className="btn-outline w-full">Concluir</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ContadorPageClient({ sessions }: { sessions: CounterSession[] }) {
  const [showNew, setShowNew] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRevoke = (id: string, label: string) => {
    if (!confirm(`Revogar o acesso "${label}"?`)) return;
    startTransition(async () => {
      const res = await revokeCounterSession(id);
      if (res.error) toast.error(res.error);
      else toast.success("Acesso revogado.");
    });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <header className="flex items-center justify-between pt-2">
        <div>
          <p className="section-label mb-1">Integração Externa</p>
          <h1 className="text-3xl font-black tracking-tight">Contador</h1>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary px-4 py-2 text-sm">
          <Plus size={16} /> Novo
        </button>
      </header>

      <div className="card-c6 space-y-4">
        <div>
          <h2 className="font-bold">Acessos Ativos</h2>
          <p className="text-xs text-secondary">Links temporários para o seu contador</p>
        </div>
        
        {sessions.length === 0 ? (
          <div className="text-center py-10">
            <Shield size={32} className="text-secondary mx-auto mb-3 opacity-50" />
            <p className="text-sm text-secondary">Nenhum acesso de contador ativo.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map(s => {
              const expired = new Date(s.expiresAt) < new Date();
              return (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-surface-2">
                  <div>
                    <h3 className="font-bold text-sm">{s.label ?? "Sem Rótulo"}</h3>
                    <p className="text-xs text-secondary">
                      {expired ? (
                        <span className="text-negative">Expirado</span>
                      ) : (
                        `Expira em ${formatDate(s.expiresAt)}`
                      )}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleRevoke(s.id, s.label ?? "")}
                    disabled={isPending}
                    className="p-2 text-negative hover:bg-negative/10 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showNew && <NewSessionModal onClose={() => setShowNew(false)} onSuccess={(t) => { setShowNew(false); setNewToken(t); }} />}
        {newToken && <TokenModal token={newToken} onClose={() => setNewToken(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
