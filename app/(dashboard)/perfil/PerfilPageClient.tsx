"use client";

import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Shield, Calendar, LogOut,
  Crown, Eye, Home, ExternalLink, QrCode, Check, X, KeyRound
} from "lucide-react";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { setup2FA, enable2FA, disable2FA } from "@/app/actions/2fa";

interface UserProfile {
  id: string; name: string | null; email: string;
  role: string; createdAt: string; totpEnabled: boolean;
  household: { id: string; name: string; inviteCode: string | null } | null;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

export default function PerfilPageClient({ user }: { user: UserProfile }) {
  const [isPending, startTransition] = useTransition();
  const [totpUri, setTotpUri]       = useState<string | null>(null);
  const [totpCode, setTotpCode]     = useState("");
  const [totpStep, setTotpStep]     = useState<"idle" | "setup" | "disable">("idle");
  const isAdmin  = user.role === "ADMIN";

  const initials = (user.name ?? user.email)
    .split(" ")
    .slice(0, 2)
    .map(w => w.charAt(0).toUpperCase())
    .join("");

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.header variants={item} className="pt-2">
        <p className="section-label mb-1">Configurações</p>
        <h1 className="text-3xl font-black tracking-tight">Perfil</h1>
      </motion.header>

      {/* Avatar */}
      <motion.div variants={item} className="flex flex-col items-center gap-4 py-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
            <span className="text-4xl font-black text-primary">{initials}</span>
          </div>
          <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-2 border-background flex items-center justify-center ${isAdmin ? "bg-warning" : "bg-info"}`}>
            {isAdmin ? <Crown size={14} className="text-black" /> : <Eye size={14} className="text-white" />}
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{user.name ?? "Usuário"}</h2>
          <p className="text-secondary text-sm">{user.email}</p>
          <span className={`mt-2 inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
            isAdmin ? "bg-warning/10 text-warning" : "bg-info/10 text-info"
          }`}>
            {isAdmin ? <><Crown size={11} />Administrador</> : <><Eye size={11} />Visualizador</>}
          </span>
        </div>
      </motion.div>

      {/* Info Cards */}
      <motion.div variants={item} className="card-c6 space-y-1 divide-y divide-border/50">
        <div className="flex items-center gap-3 py-3 first:pt-0">
          <div className="p-2 bg-surface-2 rounded-lg"><User size={16} className="text-secondary" /></div>
          <div className="flex-1">
            <p className="text-xs text-secondary">Nome</p>
            <p className="font-semibold text-sm">{user.name ?? "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 py-3">
          <div className="p-2 bg-surface-2 rounded-lg"><Mail size={16} className="text-secondary" /></div>
          <div className="flex-1">
            <p className="text-xs text-secondary">Email</p>
            <p className="font-semibold text-sm">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 py-3">
          <div className="p-2 bg-surface-2 rounded-lg"><Shield size={16} className="text-secondary" /></div>
          <div className="flex-1">
            <p className="text-xs text-secondary">Permissão</p>
            <p className="font-semibold text-sm">{isAdmin ? "Administrador" : "Visualizador"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 py-3 last:pb-0">
          <div className="p-2 bg-surface-2 rounded-lg"><Calendar size={16} className="text-secondary" /></div>
          <div className="flex-1">
            <p className="text-xs text-secondary">Membro desde</p>
            <p className="font-semibold text-sm">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </motion.div>

      {/* Household */}
      {user.household && (
        <motion.div variants={item} className="card-c6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl"><Home size={18} className="text-primary" /></div>
              <div>
                <p className="font-bold">{user.household.name}</p>
                <p className="text-xs text-secondary">Grupo Familiar</p>
              </div>
            </div>
            <Link
              href="/familia"
              className="flex items-center gap-1 text-xs text-primary font-semibold hover:opacity-80 transition-opacity"
            >
              Gerenciar <ExternalLink size={12} />
            </Link>
          </div>
          {user.household.inviteCode && isAdmin && (
            <div className="bg-surface-2 border border-border/50 rounded-xl px-4 py-3 flex items-center justify-between">
              <p className="text-xs text-secondary">Código de convite</p>
              <p className="font-mono font-bold tracking-[0.2em] text-primary">{user.household.inviteCode}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Links Rápidos */}
      <motion.div variants={item} className="card-c6 space-y-1 divide-y divide-border/50">
        <Link href="/categorias" className="flex items-center justify-between py-3 first:pt-0 hover:opacity-80 transition-opacity">
          <span className="text-sm font-medium">Gerenciar Categorias</span>
          <ExternalLink size={14} className="text-secondary" />
        </Link>
        <Link href="/familia" className="flex items-center justify-between py-3 hover:opacity-80 transition-opacity">
          <span className="text-sm font-medium">Grupo Familiar</span>
          <ExternalLink size={14} className="text-secondary" />
        </Link>
        <Link href="/relatorios" className="flex items-center justify-between py-3 last:pb-0 hover:opacity-80 transition-opacity">
          <span className="text-sm font-medium">Relatórios e Exportação</span>
          <ExternalLink size={14} className="text-secondary" />
        </Link>
      </motion.div>

      {/* 2FA / Autenticação de dois fatores */}
      <motion.div variants={item} className="card-c6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${user.totpEnabled ? "bg-positive/10" : "bg-surface-2"}`}>
              <KeyRound size={18} className={user.totpEnabled ? "text-positive" : "text-secondary"} />
            </div>
            <div>
              <p className="font-bold text-sm">Autenticação 2FA</p>
              <p className="text-xs text-secondary">
                {user.totpEnabled ? "Ativa — app autenticador vinculado" : "Proteja sua conta com um código extra"}
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${user.totpEnabled ? "bg-positive/10 text-positive" : "bg-surface-2 text-secondary"}`}>
            {user.totpEnabled ? "ON" : "OFF"}
          </span>
        </div>

        {/* Setup flow */}
        {!user.totpEnabled && totpStep === "idle" && (
          <button
            onClick={() => {
              startTransition(async () => {
                const res = await setup2FA();
                if (res.error) { toast.error(res.error); return; }
                setTotpUri(res.uri!);
                setTotpStep("setup");
              });
            }}
            disabled={isPending}
            className="btn-primary w-full text-sm"
          >
            <QrCode size={15} /> Ativar 2FA
          </button>
        )}

        {totpStep === "setup" && totpUri && (
          <div className="space-y-4">
            <p className="text-xs text-secondary">
              Escaneie o QR code com Google Authenticator, Authy ou similar.
              Depois confirme com o código de 6 dígitos gerado.
            </p>
            <div className="flex justify-center p-4 bg-white rounded-2xl">
              <QRCodeSVG value={totpUri} size={180} />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                className="input-c6 flex-1 text-center font-mono tracking-[0.3em] text-lg"
              />
              <button
                disabled={isPending || totpCode.length !== 6}
                onClick={() => {
                  const fd = new FormData();
                  fd.set("code", totpCode);
                  startTransition(async () => {
                    const res = await enable2FA(fd);
                    if (res.error) { toast.error(res.error); return; }
                    toast.success("2FA ativado com sucesso!");
                    setTotpStep("idle");
                    setTotpCode("");
                    setTotpUri(null);
                  });
                }}
                className="btn-primary px-4"
              >
                <Check size={16} />
              </button>
              <button onClick={() => { setTotpStep("idle"); setTotpUri(null); setTotpCode(""); }} className="p-3 hover:bg-white/5 rounded-xl text-secondary hover:text-white">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {user.totpEnabled && totpStep === "idle" && (
          <button
            onClick={() => setTotpStep("disable")}
            className="w-full py-2 rounded-xl text-sm font-semibold border border-negative/30 text-negative hover:bg-negative/5 transition-colors"
          >
            Desativar 2FA
          </button>
        )}

        {user.totpEnabled && totpStep === "disable" && (
          <div className="space-y-3">
            <p className="text-xs text-secondary">Confirme com seu código atual para desativar.</p>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                className="input-c6 flex-1 text-center font-mono tracking-[0.3em] text-lg"
              />
              <button
                disabled={isPending || totpCode.length !== 6}
                onClick={() => {
                  const fd = new FormData();
                  fd.set("code", totpCode);
                  startTransition(async () => {
                    const res = await disable2FA(fd);
                    if (res.error) { toast.error(res.error); return; }
                    toast.success("2FA desativado.");
                    setTotpStep("idle");
                    setTotpCode("");
                  });
                }}
                className="py-2 px-4 rounded-xl bg-negative/10 text-negative border border-negative/30 text-sm font-semibold disabled:opacity-50"
              >
                <Check size={16} />
              </button>
              <button onClick={() => { setTotpStep("idle"); setTotpCode(""); }} className="p-3 hover:bg-white/5 rounded-xl text-secondary hover:text-white">
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Logout */}
      <motion.div variants={item}>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="btn-outline w-full border-negative/30 text-negative hover:bg-negative/5 hover:border-negative/50"
          >
            <LogOut size={16} /> Sair da conta
          </button>
        </form>
      </motion.div>

      {/* Version */}
      <motion.div variants={item} className="text-center">
        <p className="text-xs text-secondary/50">CtrlBank v5.0 · Família</p>
      </motion.div>
    </motion.div>
  );
}
