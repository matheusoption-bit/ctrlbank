"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Puzzle, Link2, Zap, Shield, Clock, CheckCircle, AlertCircle, Hourglass,
} from "lucide-react";
import { formatDate } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Connection {
  id: string;
  provider: string;
  externalId: string;
  status: string;
  lastSyncAt: string | null;
  createdAt: string;
}

interface Props {
  connections: Connection[];
  isAdmin: boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item      = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

function StatusBadge({ status }: { status: string }) {
  if (status === "active") return (
    <span className="flex items-center gap-1 text-[11px] font-bold text-positive bg-positive/10 px-2.5 py-1 rounded-full">
      <CheckCircle size={11} /> Ativa
    </span>
  );
  if (status === "error") return (
    <span className="flex items-center gap-1 text-[11px] font-bold text-negative bg-negative/10 px-2.5 py-1 rounded-full">
      <AlertCircle size={11} /> Erro
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-[11px] font-bold text-secondary bg-surface-2 px-2.5 py-1 rounded-full">
      <Hourglass size={11} /> Pendente
    </span>
  );
}

const PROVIDERS: Record<string, { name: string; logo: string; description: string }> = {
  pluggy:        { name: "Pluggy",        logo: "🔌", description: "Open Finance certificado pelo Banco Central" },
  open_finance:  { name: "Open Finance",  logo: "🏦", description: "Conexão direta via ecossistema Open Finance Brasil" },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IntegracoesPageClient({ connections, isAdmin }: Props) {
  const COMING_SOON_FEATURES = [
    {
      icon: Link2,
      title: "Importação Automática",
      description: "Conecte sua conta bancária e importe transações automaticamente via Open Finance.",
      badge: "Em breve",
    },
    {
      icon: Zap,
      title: "Sincronização em Tempo Real",
      description: "Saldo e extrato atualizados automaticamente via webhooks Pluggy.",
      badge: "Em breve",
    },
    {
      icon: Shield,
      title: "Segurança Open Finance",
      description: "Autorização via fluxo de consentimento OAuth2 regulado pelo Banco Central.",
      badge: "Em breve",
    },
    {
      icon: Clock,
      title: "Histórico Automatizado",
      description: "Até 12 meses de histórico importado no primeiro sync.",
      badge: "Em breve",
    },
  ];

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.header variants={item} className="pt-2">
        <p className="section-label mb-1">Open Finance · Pluggy</p>
        <h1 className="text-3xl font-black tracking-tight">Integrações</h1>
      </motion.header>

      {/* Banner */}
      <motion.div variants={item} className="card-c6 bg-gradient-to-br from-primary/10 via-surface to-info/10 border-primary/20 p-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Puzzle size={22} className="text-primary" />
          </div>
          <div>
            <h2 className="font-black text-base">Conexão Bancária Automática</h2>
            <p className="text-xs text-secondary">Via Pluggy · Open Finance Brasil</p>
          </div>
        </div>
        <p className="text-sm text-secondary leading-relaxed">
          Em breve você poderá conectar sua conta bancária ao CtrlBank e governar a saúde financeira da sua família de forma automatizada.       Suportaremos os principais bancos via Open Finance regulado pelo Banco Central.
        </p>
        <div className="inline-flex items-center gap-2 bg-warning/10 border border-warning/20 rounded-xl px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
          <span className="text-xs font-semibold text-warning">Em desenvolvimento — disponível em breve</span>
        </div>
      </motion.div>

      {/* Conexões ativas */}
      {connections.length > 0 && (
        <motion.div variants={item} className="space-y-3">
          <h2 className="font-bold text-base">Conexões Ativas</h2>
          <div className="space-y-2">
            {connections.map((conn) => {
              const provider = PROVIDERS[conn.provider] ?? { name: conn.provider, logo: "🔗", description: "" };
              return (
                <div key={conn.id} className="card-c6-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-surface-2 flex items-center justify-center text-xl flex-shrink-0">
                    {provider.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{provider.name}</p>
                    <p className="text-xs text-secondary">
                      {conn.lastSyncAt
                        ? `Sincronizado ${formatDate(conn.lastSyncAt, { short: true, relative: true })}`
                        : "Nunca sincronizado"}
                    </p>
                  </div>
                  <StatusBadge status={conn.status} />
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Features coming soon */}
      <motion.div variants={item} className="space-y-3">
        <h2 className="font-bold text-base">O que vem por aí</h2>
        <div className="grid grid-cols-1 gap-3">
          {COMING_SOON_FEATURES.map(({ icon: Icon, title, description, badge }) => (
            <div key={title} className="card-c6-sm flex items-start gap-4 opacity-80">
              <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={18} className="text-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm">{title}</p>
                  <span className="text-[10px] font-bold bg-info/10 text-info px-2 py-0.5 rounded-full">{badge}</span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Interested CTA */}
      <motion.div variants={item} className="card-c6 text-center space-y-3 py-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
          <Link2 size={26} className="text-primary" />
        </div>
        <div>
          <h3 className="font-black text-lg">Quer ser avisado?</h3>
          <p className="text-sm text-secondary mt-1">
            Quando as integrações ficarem disponíveis, você receberá uma notificação.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-positive/10 border border-positive/20 rounded-xl px-4 py-2">
          <CheckCircle size={14} className="text-positive" />
          <span className="text-sm font-semibold text-positive">Você será notificado automaticamente</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
