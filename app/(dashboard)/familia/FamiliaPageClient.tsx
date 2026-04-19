"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Copy, RefreshCw, Link2, UserPlus, Shield,
  Eye, Crown, UserMinus, X, Check, Plus, Building2,
  Calendar, TrendingUp, TrendingDown, Target,
  AlertTriangle, ChevronDown, Clipboard,
} from "lucide-react";
import { toast } from "sonner";
import {
  generateInviteCode, joinHousehold, createHousehold,
  updateMemberRole, removeMember, createCounterAccount,
  generateInviteLink, getMonthlySummary, markMonthlyCheckViewed,
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

interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  netResult: number;
  topCategories: { category: string; amount: number; percentOfTotal: number }[];
  goalsProgress: { name: string; progress: number; deadline: string | null }[];
  biggestExpense: { description: string; amount: number; member: string } | null;
  recommendations: { id: string; type: string; message: string }[];
}

type Props = {
  currentUser: CurrentUser;
  members: Member[];
  household: { id: string; name: string } | null;
  inviteCode: string | null;
  monthlyCheckViewed: boolean;
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "ADMIN")
    return <span className="badge-positive flex items-center gap-1"><Crown size={10} />Admin</span>;
  if (role === "MEMBER")
    return <span className="badge-info flex items-center gap-1"><Shield size={10} />Membro</span>;
  return <span className="badge-info flex items-center gap-1"><Eye size={10} />Visualizador</span>;
}

function RoleDropdown({ currentRole, onSelect, disabled }: {
  currentRole: UserRole;
  onSelect: (role: UserRole) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const roles: { value: UserRole; label: string; icon: React.ReactNode }[] = [
    { value: "ADMIN", label: "Admin", icon: <Crown size={12} /> },
    { value: "MEMBER", label: "Membro", icon: <Shield size={12} /> },
    { value: "VIEWER", label: "Visualizador", icon: <Eye size={12} /> },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-surface-2 border border-border rounded-lg hover:bg-white/5 transition-colors"
      >
        <Shield size={12} className="text-secondary" />
        <ChevronDown size={10} className="text-secondary" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-8 z-50 bg-surface-2 border border-border rounded-xl shadow-lg overflow-hidden min-w-[140px]"
          >
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => { onSelect(r.value); setOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-white/5 transition-colors ${
                  currentRole === r.value ? "text-primary font-semibold" : "text-secondary"
                }`}
              >
                {r.icon}
                {r.label}
                {currentRole === r.value && <Check size={10} className="ml-auto" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel }: {
  title: string; message: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-2 border border-border rounded-2xl p-6 max-w-sm w-full space-y-4"
      >
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-secondary">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-white/5 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn-primary px-4 py-2 text-sm">
            Confirmar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FamiliaPageClient({ currentUser, members, household, inviteCode, monthlyCheckViewed }: Props) {
  const [code, setCode] = useState(inviteCode ?? "");
  const [joinCode, setJoinCode] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterEmail, setCounterEmail] = useState("");
  const [counterPass, setCounterPass] = useState("");
  const [isPending, startTransition] = useTransition();
  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null);
  const [showMonthlyCheck, setShowMonthlyCheck] = useState(false);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [checkViewed, setCheckViewed] = useState(monthlyCheckViewed);

  const isAdmin = currentUser.role === UserRole.ADMIN;

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentMonthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(now);

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

  function handleGenerateInviteLink() {
    startTransition(async () => {
      const res = await generateInviteLink();
      if (res.error) toast.error(res.error);
      else {
        const link = `${window.location.origin}/api/invite/${res.token}`;
        navigator.clipboard.writeText(link);
        toast.success("Link de convite copiado! Válido por 48h.");
      }
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

  function handleRemoveConfirm() {
    if (!removeTarget) return;
    startTransition(async () => {
      const res = await removeMember(removeTarget.id);
      if (res.error) toast.error(res.error);
      else toast.success("Membro removido");
      setRemoveTarget(null);
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

  async function handleOpenMonthlyCheck() {
    setShowMonthlyCheck(true);
    if (!monthlySummary) {
      setLoadingSummary(true);
      try {
        const data = await getMonthlySummary(currentMonthStr);
        setMonthlySummary(data);

        // Mark as viewed
        await markMonthlyCheckViewed(currentMonthStr);
        setCheckViewed(true);
      } catch {
        toast.error("Erro ao carregar resumo mensal");
      }
      setLoadingSummary(false);
    }
  }

  const fmtCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  function generateShareText(): string {
    if (!monthlySummary || !household) return "";
    const s = monthlySummary;

    let text = `📊 Check do Mês — ${household.name}\n`;
    text += `📅 ${currentMonthLabel}\n\n`;
    text += `💰 Receitas: ${fmtCurrency(s.totalIncome)}\n`;
    text += `💸 Despesas: ${fmtCurrency(s.totalExpenses)}\n`;
    text += `📈 Resultado: ${s.netResult >= 0 ? "+" : ""}${fmtCurrency(s.netResult)}\n\n`;

    if (s.topCategories.length > 0) {
      text += `🏷️ Top 5 Categorias:\n`;
      s.topCategories.forEach((c, i) => {
        text += `  ${i + 1}. ${c.category}: ${fmtCurrency(c.amount)} (${c.percentOfTotal}%)\n`;
      });
      text += "\n";
    }

    if (s.goalsProgress.length > 0) {
      text += `🎯 Metas:\n`;
      s.goalsProgress.forEach((g) => {
        text += `  • ${g.name}: ${g.progress}%\n`;
      });
      text += "\n";
    }

    if (s.biggestExpense) {
      text += `💥 Maior gasto: ${s.biggestExpense.description} — ${fmtCurrency(s.biggestExpense.amount)} (${s.biggestExpense.member})\n\n`;
    }

    if (s.recommendations.length > 0) {
      text += `💡 Recomendações:\n`;
      s.recommendations.forEach((r) => {
        text += `  • ${r.message}\n`;
      });
    }

    return text;
  }

  function handleShareSummary() {
    const text = generateShareText();
    navigator.clipboard.writeText(text);
    toast.success("Resumo copiado para a área de transferência!");
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
                  <h2 className="font-bold">Convite</h2>
                  <p className="text-xs text-secondary">Compartilhe para convidar membros</p>
                </div>
              </div>

              {code ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-3 font-mono font-bold tracking-[0.3em] text-xl text-center text-primary">
                    {code}
                  </div>
                  <button onClick={copyCode} className="p-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl transition-colors" title="Copiar código">
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

              <button
                onClick={handleGenerateInviteLink}
                disabled={isPending}
                className="btn-secondary w-full text-sm flex items-center justify-center gap-2"
              >
                <UserPlus size={15} />
                Gerar Link de Convite (48h)
              </button>
            </motion.div>
          )}

          {/* Entrar com código (não-admin) */}
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
                    <p className="font-semibold text-sm truncate">
                      {member.name ?? member.email}
                      {member.id === currentUser.id && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-primary/20 text-primary rounded-md">
                          Você
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <RoleBadge role={member.role} />
                      <span className="text-xs text-secondary">
                        desde {new Date(member.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  {isAdmin && member.id !== currentUser.id && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <RoleDropdown
                        currentRole={member.role}
                        onSelect={(role) => handleRoleChange(member.id, role)}
                        disabled={isPending}
                      />
                      <button
                        onClick={() => setRemoveTarget({ id: member.id, name: member.name ?? member.email })}
                        className="p-2 hover:bg-negative/5 rounded-lg transition-colors"
                        title="Remover membro"
                      >
                        <UserMinus size={14} className="text-negative" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Check do Mês */}
          <motion.div variants={item} className="card-c6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-info/10 rounded-xl"><Calendar size={18} className="text-info" /></div>
              <div className="flex-1">
                <h2 className="font-bold flex items-center gap-2">
                  Check do Mês
                  {!checkViewed && (
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  )}
                </h2>
                <p className="text-xs text-secondary">Resumo financeiro mensal da família</p>
              </div>
            </div>
            <button
              onClick={handleOpenMonthlyCheck}
              disabled={loadingSummary}
              className="btn-primary w-full text-sm flex items-center justify-center gap-2"
            >
              {loadingSummary ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Calendar size={15} />
                  Ver resumo de {currentMonthLabel}
                </>
              )}
            </button>
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

      {/* Remove Confirmation Modal */}
      <AnimatePresence>
        {removeTarget && (
          <ConfirmModal
            title="Remover membro"
            message={`Tem certeza que deseja remover ${removeTarget.name} do grupo familiar?`}
            onConfirm={handleRemoveConfirm}
            onCancel={() => setRemoveTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* Monthly Check Modal */}
      <AnimatePresence>
        {showMonthlyCheck && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setShowMonthlyCheck(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-2 border border-border rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-surface-2 border-b border-border p-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  Check do Mês — {currentMonthLabel}
                </h2>
                <button onClick={() => setShowMonthlyCheck(false)} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                  <X size={18} className="text-secondary" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {loadingSummary ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : monthlySummary ? (
                  <>
                    {/* Result */}
                    <div className={`p-4 rounded-xl border ${
                      monthlySummary.netResult >= 0
                        ? "bg-green-500/5 border-green-500/20"
                        : "bg-red-500/5 border-red-500/20"
                    }`}>
                      <p className="text-xs text-secondary mb-1">Resultado do mês</p>
                      <p className={`text-2xl font-black flex items-center gap-2 ${
                        monthlySummary.netResult >= 0 ? "text-green-500" : "text-red-500"
                      }`}>
                        {monthlySummary.netResult >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        {monthlySummary.netResult >= 0 ? "+" : ""}{fmtCurrency(monthlySummary.netResult)}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-secondary">
                        <span>Receitas: {fmtCurrency(monthlySummary.totalIncome)}</span>
                        <span>Despesas: {fmtCurrency(monthlySummary.totalExpenses)}</span>
                      </div>
                    </div>

                    {/* Top 5 Categories */}
                    {monthlySummary.topCategories.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold">🏷️ Top 5 Categorias</h3>
                        {monthlySummary.topCategories.map((c, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-secondary">{c.category}</span>
                              <span className="font-semibold">{fmtCurrency(c.amount)} ({c.percentOfTotal}%)</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${c.percentOfTotal}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Goals Progress */}
                    {monthlySummary.goalsProgress.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold flex items-center gap-2"><Target size={14} />Progresso das Metas</h3>
                        {monthlySummary.goalsProgress.map((g, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-secondary">{g.name}</span>
                              <span className="font-semibold">{g.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full transition-all"
                                style={{ width: `${Math.min(g.progress, 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Biggest Expense */}
                    {monthlySummary.biggestExpense && (
                      <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                        <p className="text-xs text-secondary mb-1">💥 Maior gasto do período</p>
                        <p className="font-bold text-sm">{monthlySummary.biggestExpense.description}</p>
                        <p className="text-sm text-red-400 font-semibold">{fmtCurrency(monthlySummary.biggestExpense.amount)}</p>
                        <p className="text-xs text-secondary mt-1">por {monthlySummary.biggestExpense.member}</p>
                      </div>
                    )}

                    {/* Recommendations */}
                    {monthlySummary.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold flex items-center gap-2"><AlertTriangle size={14} />Recomendações</h3>
                        {monthlySummary.recommendations.map((r) => (
                          <div key={r.id} className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-xs">
                            {r.message}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Share button */}
                    <button
                      onClick={handleShareSummary}
                      className="btn-secondary w-full text-sm flex items-center justify-center gap-2"
                    >
                      <Clipboard size={15} />
                      Compartilhar resumo
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-secondary text-center py-8">Nenhum dado disponível para este mês.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
