"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Wallet, CreditCard, PiggyBank, TrendingUp,
  MoreVertical, Pencil, Trash2, X, Check,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { createAccount, updateAccount, deleteAccount } from "@/app/actions/accounts";

// ─── Types ────────────────────────────────────────────────────────────────────

type BankAccountType = "CHECKING" | "SAVINGS" | "CREDIT" | "INVESTMENT";

interface BankAccount {
  id: string; name: string; type: BankAccountType;
  balance: number | string; color: string | null; icon: string | null;
  creditLimit?: number | string | null;
  invoiceClosingDay?: number | null;
  invoiceDueDay?: number | null;
  isDefault?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ACCOUNT_TYPES = [
  { value: "CHECKING"   as BankAccountType, label: "Conta Corrente", icon: Wallet,     color: "#FF2D55" },
  { value: "SAVINGS"    as BankAccountType, label: "Poupança",       icon: PiggyBank,  color: "#34C759" },
  { value: "CREDIT"     as BankAccountType, label: "Cartão Crédito", icon: CreditCard, color: "#FF9500" },
  { value: "INVESTMENT" as BankAccountType, label: "Investimento",   icon: TrendingUp, color: "#0A84FF" },
];

const ACCOUNT_COLORS = ["#FF2D55","#34C759","#FF9500","#0A84FF","#BF5AF2","#FFD60A","#30D158","#64D2FF"];

function getTypeInfo(type: BankAccountType) {
  return ACCOUNT_TYPES.find((t) => t.value === type) ?? ACCOUNT_TYPES[0];
}

// ─── Account Form ─────────────────────────────────────────────────────────────

interface AccountFormData {
  name: string; type: BankAccountType; balance: string; color: string;
  icon: string; creditLimit: string; invoiceClosingDay: string; invoiceDueDay: string;
  createSetupBalance: boolean; isDefault: boolean;
}

const EMPTY_FORM: AccountFormData = {
  name: "", type: "CHECKING", balance: "0",
  color: "#FF2D55", icon: "💳", creditLimit: "", invoiceClosingDay: "", invoiceDueDay: "",
  createSetupBalance: false, isDefault: false,
};

function AccountFormModal({ editing, onClose }: { editing?: BankAccount; onClose: () => void }) {
  const [form, setForm] = useState<AccountFormData>({
    ...EMPTY_FORM,
    ...(editing ? {
      name: editing.name, type: editing.type,
      balance: String(Number(editing.balance)),
      color: editing.color ?? "#FF2D55", icon: editing.icon ?? "💳",
      creditLimit: editing.creditLimit ? String(Number(editing.creditLimit)) : "",
      invoiceClosingDay: editing.invoiceClosingDay ? String(editing.invoiceClosingDay) : "",
      invoiceDueDay: editing.invoiceDueDay ? String(editing.invoiceDueDay) : "",
      createSetupBalance: false,
      isDefault: editing.isDefault ?? false,
    } : {}),
  });
  const [isPending, startTransition] = useTransition();

  function set(field: keyof AccountFormData, val: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        name: form.name, type: form.type, balance: Number(form.balance),
        color: form.color, icon: form.icon,
        creditLimit: form.creditLimit ? Number(form.creditLimit) : undefined,
        invoiceClosingDay: form.invoiceClosingDay ? Number(form.invoiceClosingDay) : undefined,
        invoiceDueDay: form.invoiceDueDay ? Number(form.invoiceDueDay) : undefined,
        createSetupBalance: form.createSetupBalance,
        isDefault: form.isDefault,
      };
      const result = editing
        ? await updateAccount({ ...payload, id: editing.id })
        : await createAccount(payload);

      if (result.error) toast.error(result.error);
      else { toast.success(editing ? "Conta atualizada!" : "Conta criada!"); onClose(); }
    });
  }

  const isCredit = form.type === "CREDIT";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="w-full max-w-md bg-surface border border-border rounded-3xl shadow-soft-xl overflow-hidden"
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-lg">{editing ? "Editar Conta" : "Nova Conta"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl">
            <X size={18} className="text-secondary" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Tipo */}
          <div className="space-y-2">
            <p className="section-label">Tipo de Conta</p>
            <div className="grid grid-cols-2 gap-2">
              {ACCOUNT_TYPES.map(({ value, label, icon: Icon, color }) => (
                <button key={value} type="button" onClick={() => set("type", value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    form.type === value ? "border-primary/50 bg-primary/10 text-white" : "border-border bg-surface-2 text-secondary hover:border-white/20"
                  }`}>
                  <Icon size={16} style={{ color: form.type === value ? color : undefined }} />{label}
                </button>
              ))}
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-1.5">
            <label className="section-label">Nome</label>
            <input type="text" value={form.name} required maxLength={50}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Ex: Nubank Conta" className="input-c6 w-full" />
          </div>

          {/* Saldo */}
          <div className="space-y-1.5">
            <label className="section-label">Saldo Atual (R$)</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-secondary text-sm font-semibold pointer-events-none">R$</span>
              <CurrencyInput value={form.balance} onValueChange={(v) => set("balance", v)} className="input-c6 w-full pl-9" placeholder="0,00" />
            </div>
            <label className="flex items-center gap-2 mt-2 pt-2 text-sm text-secondary cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" checked={form.createSetupBalance} onChange={(e) => set("createSetupBalance", e.target.checked)} className="rounded border-white/20 bg-surface text-primary" />
              <span>Gerar transação de {editing ? 'Ajuste' : 'Saldo Inicial'}</span>
            </label>
            <label className="flex items-center gap-2 mt-2 pt-2 text-sm text-secondary cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => set("isDefault", e.target.checked)} className="rounded border-white/20 bg-surface text-primary" />
              <span>Marcar como conta padrão do AI Composer</span>
            </label>
          </div>

          {/* Crédito */}
          {isCredit && (
            <>
              <div className="space-y-1.5">
                <label className="section-label">Limite de Crédito (R$)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-secondary text-sm font-semibold pointer-events-none">R$</span>
                  <CurrencyInput value={form.creditLimit} onValueChange={(v) => set("creditLimit", v)} className="input-c6 w-full pl-9" placeholder="0,00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="section-label">Fechamento</label>
                  <input type="number" min={1} max={31} placeholder="Dia"
                    value={form.invoiceClosingDay}
                    onChange={(e) => set("invoiceClosingDay", e.target.value)} className="input-c6 w-full" />
                </div>
                <div className="space-y-1.5">
                  <label className="section-label">Vencimento</label>
                  <input type="number" min={1} max={31} placeholder="Dia"
                    value={form.invoiceDueDay}
                    onChange={(e) => set("invoiceDueDay", e.target.value)} className="input-c6 w-full" />
                </div>
              </div>
            </>
          )}

          {/* Cor */}
          <div className="space-y-2">
            <label className="section-label">Cor</label>
            <div className="flex gap-2 flex-wrap">
              {ACCOUNT_COLORS.map((c) => (
                <button key={c} type="button" onClick={() => set("color", c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === c ? "border-white scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <button type="submit" disabled={isPending} className="btn-primary w-full mt-2">
            {isPending
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><Check size={16} /> {editing ? "Salvar alterações" : "Criar conta"}</>}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

export default function ContasPageClient({ accounts }: { accounts: BankAccount[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BankAccount | undefined>();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);

  function handleDelete(id: string) {
    if (!confirm("Excluir esta conta?")) return;
    startTransition(async () => {
      const result = await deleteAccount(id);
      if (result.error) toast.error(result.error);
      else toast.success("Conta excluída");
      setMenuOpen(null);
    });
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.header variants={item} className="flex items-center justify-between pt-2">
        <div>
          <p className="section-label mb-1">Patrimônio</p>
          <h1 className="text-3xl font-black tracking-tight">Contas</h1>
        </div>
        <motion.button
          onClick={() => { setEditing(undefined); setShowForm(true); }}
          className="btn-primary px-4 py-2 text-sm"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        >
          <Plus size={16} /> Nova Conta
        </motion.button>
      </motion.header>

      {/* Saldo Total */}
      <motion.div variants={item} className="card-c6 relative overflow-hidden bg-black">
        <p className="section-label mb-2">Saldo Total</p>
        <p className={`text-5xl font-black tabular-nums ${totalBalance >= 0 ? "text-foreground" : "text-negative"}`}>
          {formatCurrency(totalBalance)}
        </p>
        <p className="text-xs text-secondary mt-2">{accounts.length} conta{accounts.length !== 1 ? "s" : ""}</p>
      </motion.div>

      {/* Lista */}
      {accounts.length === 0 ? (
        <motion.div variants={item} className="card-c6 text-center py-16 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto">
            <Wallet size={24} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Nenhuma conta</h3>
            <p className="text-secondary text-sm mt-1">Crie sua primeira conta para começar.</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary px-6 mx-auto w-fit text-sm">
            <Plus size={16} /> Criar conta
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {accounts.map((acc) => {
            const info = getTypeInfo(acc.type);
            const color = acc.color ?? info.color;
            const balance = Number(acc.balance);
            const isCredit = acc.type === "CREDIT";

            return (
              <motion.div
                key={acc.id}
                variants={item}
                className="account-card flex flex-col justify-between min-h-[200px] group relative border-l-4"
                style={{ borderLeftColor: color }}
              >
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-1">
                    <p className="text-[10px] text-secondary font-black uppercase tracking-widest flex items-center gap-2">
                      {info.label}
                      {acc.isDefault && <span className="text-primary bg-primary/20 px-1 py-0.5 rounded text-[8px]">PADRÃO AI</span>}
                    </p>
                    <h3 className="text-xl font-black text-white/90">{acc.name}</h3>
                  </div>
                  <div className="flex gap-2 relative">
                    <button
                      onClick={() => { setEditing(acc); setShowForm(true); }}
                      className="p-2 rounded-xl bg-white/5 border border-white/5 text-secondary hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="p-2 rounded-xl bg-white/5 border border-white/5 text-negative hover:bg-negative/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 relative z-10 mt-6">
                  <div>
                    <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-1">
                      {isCredit ? "Fatura Atual" : "Saldo disponível"}
                    </p>
                    <p className="text-4xl font-black tabular-nums tracking-tight">
                      {formatCurrency(Math.abs(balance))}
                    </p>
                  </div>

                  {isCredit && acc.creditLimit && (
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-secondary">
                        <span>Limite usado</span>
                        <span>{formatCurrency(Number(acc.creditLimit))} de limite</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((Math.abs(balance) / Number(acc.creditLimit)) * 100, 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <AccountFormModal editing={editing} onClose={() => { setShowForm(false); setEditing(undefined); }} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
