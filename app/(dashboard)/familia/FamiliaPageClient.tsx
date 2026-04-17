"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Copy, RefreshCw, Link2, UserPlus, Shield,
  Eye, Crown, UserMinus, X, Check, Plus, Building2,
} from "lucide-react";
import { toast } from "sonner";
import {
  generateInviteCode, joinHousehold, createHousehold,
  updateMemberRole, removeMember, createCounterAccount,
} from "@/app/actions/household";
import { UserRole } from "@prisma/client";

interface Member {
  id: string; name: string | null; email: string;
  role: UserRole; createdAt: Date | string;
}

interface CurrentUser {
  id: string; name: string | null; email: string;
  role: UserRole; householdId: string | null;
}

type Props = {
  currentUser: CurrentUser;
  members: Member[];
  household: { id: string; name: string } | null;
  inviteCode: string | null;
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

function RoleBadge({ role }: { role: UserRole }) {
  return role === "ADMIN"
    ? <span className="badge-positive flex items-center gap-1"><Crown size={10} />Admin</span>
    : <span className="badge-info flex items-center gap-1"><Eye size={10} />Visualizador</span>;
}

export default function FamiliaPageClient({ currentUser, members, household, inviteCode }: Props) {
  const [code, setCode]       = useState(inviteCode ?? "");
  const [joinCode, setJoinCode] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterEmail, setCounterEmail]       = useState("");
  const [counterPass,  setCounterPass]        = useState("");
  const [isPending, startTransition] = useTransition();
  const isAdmin = currentUser.role === UserRole.ADMIN;

  function copyCode() {
    navigator.clipboard.writeText(code);
    toast.success("Código copiado!");
  }

  function handleGenerate() {
    startTransition(async () => {
      const res = await generateInviteCode();
      if (res.error) toast.error(res.error);
      else { setCode(res.code!); toast.success("Novo código gerado!"); }
    });
  }

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await joinHousehold(joinCode);
      if (res.error) toast.error(res.error);
      else { toast.success(`Entrou no grupo: ${res.householdName}`); setJoinCode(""); }
    });
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await createHousehold(householdName);
      if (res.error) toast.error(res.error);
      else { toast.success("Grupo familiar criado!"); setHouseholdName(""); }
    });
  }

  function handleRoleChange(memberId: string, role: UserRole) {
    startTransition(async () => {
      const res = await updateMemberRole(memberId, role);
      if (res.error) toast.error(res.error);
      else toast.success("Permissão atualizada!");
    });
  }

  function handleRemove(memberId: string, name: string | null) {
    if (!confirm(`Remover ${name ?? "membro"} do grupo?`)) return;
    startTransition(async () => {
      const res = await removeMember(memberId);
      if (res.error) toast.error(res.error);
      else toast.success("Membro removido");
    });
  }

  function handleCreateCounter(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await createCounterAccount(counterEmail, counterPass);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Conta do contador criada!");
        setShowCounterForm(false);
        setCounterEmail(""); setCounterPass("");
      }
    });
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.header variants={item} className="pt-2">
        <p className="section-label mb-1">Gerenciamento</p>
        <h1 className="text-3xl font-black tracking-tight">Família</h1>
      </motion.header>

      {/* Sem household */}
      {!household && (
        <motion.div variants={item} className="space-y-3">
          {/* Criar */}
          <div className="card-c6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl"><Building2 size={18} className="text-primary" /></div>
              <h2 className="font-bold">Criar Grupo Familiar</h2>
            </div>
            <form onSubmit={handleCreate} className="flex gap-2">
              <input
                value={householdName} onChange={(e) => setHouseholdName(e.target.value)}
                placeholder="Nome do grupo (ex: Família Silva)"
                className="input-c6 flex-1 text-sm"
                required minLength={2} maxLength={60}
              />
              <button type="submit" disabled={isPending} className="btn-primary px-4 py-2 text-sm whitespace-nowrap">
                {isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={15} />Criar</>}
              </button>
            </form>
          </div>

          {/* Entrar */}
          <div className="card-c6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-info/10 rounded-xl"><Link2 size={18} className="text-info" /></div>
              <h2 className="font-bold">Entrar com Código</h2>
            </div>
            <form onSubmit={handleJoin} className="flex gap-2">
              <input
                value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Código de 8 letras"
                className="input-c6 flex-1 text-sm font-mono tracking-widest uppercase"
                maxLength={8}
              />
              <button type="submit" disabled={isPending} className="btn-secondary px-4 py-2 text-sm whitespace-nowrap">
                {isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Entrar"}
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Com household */}
      {household && (
        <>
          {/* Info grupo */}
          <motion.div variants={item} className="card-c6 space-y-1">
            <p className="section-label">Grupo Familiar</p>
            <p className="text-2xl font-black">{household.name}</p>
            <p className="text-sm text-secondary">{members.length} membro{members.length !== 1 ? "s" : ""}</p>
          </motion.div>

          {/* Código de convite */}
          {isAdmin && (
            <motion.div variants={item} className="card-c6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl"><Link2 size={18} className="text-primary" /></div>
                <div>
                  <h2 className="font-bold">Código de Convite</h2>
                  <p className="text-xs text-secondary">Compartilhe para convidar a esposa</p>
                </div>
              </div>

              {code ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-3 font-mono font-bold tracking-[0.3em] text-xl text-center text-primary">
                    {code}
                  </div>
                  <button onClick={copyCode} className="p-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl transition-colors" title="Copiar">
                    <Copy size={18} className="text-primary" />
                  </button>
                  <button onClick={handleGenerate} disabled={isPending} className="p-3 bg-surface-2 hover:bg-white/5 border border-border rounded-xl transition-colors" title="Gerar novo">
                    <RefreshCw size={18} className={`text-secondary ${isPending ? "animate-spin" : ""}`} />
                  </button>
                </div>
              ) : (
                <button onClick={handleGenerate} disabled={isPending} className="btn-primary w-full text-sm">
                  <RefreshCw size={15} /> Gerar Código de Convite
                </button>
              )}
            </motion.div>
          )}

          {/* Entrar com código */}
          {!isAdmin && (
            <motion.div variants={item} className="card-c6 space-y-4">
              <h2 className="font-bold flex items-center gap-2"><UserPlus size={18} />Entrar em outro grupo</h2>
              <form onSubmit={handleJoin} className="flex gap-2">
                <input
                  value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Código de convite"
                  className="input-c6 flex-1 text-sm font-mono uppercase"
                  maxLength={8}
                />
                <button type="submit" disabled={isPending} className="btn-secondary px-4 py-2 text-sm">
                  Entrar
                </button>
              </form>
            </motion.div>
          )}

          {/* Membros */}
          <motion.div variants={item} className="space-y-3">
            <h2 className="font-bold flex items-center gap-2"><Users size={16} />Membros</h2>
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id} className="card-c6-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary flex-shrink-0">
                    {(member.name ?? member.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{member.name ?? member.email}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <RoleBadge role={member.role} />
                      {member.id === currentUser.id && (
                        <span className="text-xs text-secondary">(você)</span>
                      )}
                    </div>
                  </div>

                  {isAdmin && member.id !== currentUser.id && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleRoleChange(member.id, member.role === "ADMIN" ? "VIEWER" : "ADMIN")}
                        title={member.role === "ADMIN" ? "Tornar visualizador" : "Tornar admin"}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Shield size={14} className="text-secondary" />
                      </button>
                      <button
                        onClick={() => handleRemove(member.id, member.name)}
                        className="p-2 hover:bg-negative/5 rounded-lg transition-colors"
                      >
                        <UserMinus size={14} className="text-negative" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Conta Contador */}
          {isAdmin && (
            <motion.div variants={item} className="card-c6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-warning/10 rounded-xl"><Shield size={18} className="text-warning" /></div>
                  <div>
                    <h2 className="font-bold">Acesso do Contador</h2>
                    <p className="text-xs text-secondary">Cria uma conta com acesso somente leitura</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCounterForm(!showCounterForm)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  {showCounterForm ? <X size={16} className="text-secondary" /> : <Plus size={16} className="text-secondary" />}
                </button>
              </div>

              <AnimatePresence>
                {showCounterForm && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleCreateCounter}
                    className="space-y-3 overflow-hidden"
                  >
                    <input
                      type="email" value={counterEmail} onChange={(e) => setCounterEmail(e.target.value)}
                      placeholder="Email do contador"
                      className="input-c6 w-full text-sm" required
                    />
                    <input
                      type="password" value={counterPass} onChange={(e) => setCounterPass(e.target.value)}
                      placeholder="Senha (min. 8 caracteres)"
                      className="input-c6 w-full text-sm" required minLength={8}
                    />
                    <button type="submit" disabled={isPending} className="btn-primary w-full text-sm">
                      {isPending
                        ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <><Check size={15} />Criar conta do contador</>}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
