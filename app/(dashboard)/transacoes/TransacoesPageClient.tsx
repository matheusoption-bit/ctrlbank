"use client";

import React, { useState, useTransition, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, X, Check, ArrowUpRight,
  ArrowDownLeft, ArrowLeftRight, Trash2, Pencil, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/format";
import { createTransaction, deleteTransaction } from "@/app/actions/transactions";
import { TransactionType, TransactionStatus, BankAccountType } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Account { id: string; name: string; type: BankAccountType; color: string | null; icon: string | null }
interface Category { id: string; name: string; type: TransactionType; icon: string | null; color: string | null }
interface Transaction {
  id: string; type: TransactionType; status: TransactionStatus;
  amount: number | string; description: string | null; date: Date | string;
  bankAccount: { name: string; color: string | null; icon: string | null };
  category: { name: string; icon: string | null; color: string | null } | null;
  user: { id: string; name: string | null };
}

// ─── Transaction Type Icons ───────────────────────────────────────────────────

function TypeBadge({ type }: { type: TransactionType }) {
  if (type === "INCOME") return (
    <span className="badge-positive"><ArrowUpRight size={11} />Receita</span>
  );
  if (type === "EXPENSE") return (
    <span className="badge-negative"><ArrowDownLeft size={11} />Despesa</span>
  );
  return (
    <span className="badge-info"><ArrowLeftRight size={11} />Transfer.</span>
  );
}

// ─── New Transaction Modal ────────────────────────────────────────────────────

function TransactionModal({
  accounts, categories, initialType, onClose,
}: {
  accounts: Account[];
  categories: Category[];
  initialType?: TransactionType;
  onClose: () => void;
}) {
  const [type, setType] = useState<TransactionType>(initialType ?? "EXPENSE");
  const [isPending, startTransition] = useTransition();

  const filteredCategories = categories.filter((c) => c.type === type || type === "TRANSFER");

  const now = new Date();
  const localDateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createTransaction({
        bankAccountId: fd.get("bankAccountId") as string,
        categoryId:    fd.get("categoryId") as string || null,
        type,
        status:        fd.get("status") as TransactionStatus ?? "COMPLETED",
        amount:        Number(fd.get("amount")),
        description:   fd.get("description") as string || null,
        date:          new Date(fd.get("date") as string),
      });

      if (result.error) toast.error(result.error);
      else { toast.success("Transação registrada!"); onClose(); }
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
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-lg">Nova Transação</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X size={18} className="text-secondary" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Tipo */}
          <div className="grid grid-cols-3 gap-2">
            {(["EXPENSE", "INCOME", "TRANSFER"] as TransactionType[]).map((t) => (
              <button
                key={t} type="button" onClick={() => setType(t)}
                className={`py-2 rounded-xl text-sm font-semibold border transition-all ${
                  type === t
                    ? t === "INCOME"
                      ? "bg-positive/10 border-positive/40 text-positive"
                      : t === "EXPENSE"
                      ? "bg-negative/10 border-negative/40 text-negative"
                      : "bg-info/10 border-info/40 text-info"
                    : "bg-surface-2 border-border text-secondary"
                }`}
              >
                {t === "INCOME" ? "Receita" : t === "EXPENSE" ? "Despesa" : "Transfer."}
              </button>
            ))}
          </div>

          {/* Valor */}
          <div className="space-y-1.5">
            <label className="section-label">Valor (R$)</label>
            <input
              name="amount" type="number" step="0.01" min="0.01"
              placeholder="0,00" required
              className="input-c6 w-full text-xl font-bold"
            />
          </div>

          {/* Conta */}
          <div className="space-y-1.5">
            <label className="section-label">Conta</label>
            <div className="relative">
              <select name="bankAccountId" required className="input-c6 w-full appearance-none pr-10">
                <option value="">Selecione uma conta</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.icon} {a.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
            </div>
          </div>

          {/* Categoria */}
          {type !== "TRANSFER" && (
            <div className="space-y-1.5">
              <label className="section-label">Categoria</label>
              <div className="relative">
                <select name="categoryId" className="input-c6 w-full appearance-none pr-10">
                  <option value="">Sem categoria</option>
                  {filteredCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
              </div>
            </div>
          )}

          {/* Descrição */}
          <div className="space-y-1.5">
            <label className="section-label">Descrição</label>
            <input
              name="description" type="text" maxLength={200}
              placeholder="Ex: Almoço, Salário, etc."
              className="input-c6 w-full"
            />
          </div>

          {/* Data + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="section-label">Data</label>
              <input name="date" type="date" defaultValue={localDateStr} required className="input-c6 w-full" />
            </div>
            <div className="space-y-1.5">
              <label className="section-label">Status</label>
              <div className="relative">
                <select name="status" className="input-c6 w-full appearance-none pr-8">
                  <option value="COMPLETED">Efetivado</option>
                  <option value="PENDING">Pendente</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <label className="section-label">Notas (opcional)</label>
            <textarea name="notes" rows={2} maxLength={500} placeholder="Observações..."
              className="input-c6 w-full resize-none" />
          </div>

          <button type="submit" disabled={isPending} className="btn-primary w-full">
            {isPending
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><Check size={16} /> Registrar Transação</>
            }
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } };

export default function TransacoesPageClient({
  initialTransactions, totalCount, accounts, categories, currentUserId,
}: {
  initialTransactions: Transaction[];
  totalCount: number;
  accounts: Account[];
  categories: Category[];
  currentUserId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isPending, startTransition] = useTransition();

  const updateFilter = useCallback((key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set(key, val);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  function handleDelete(id: string) {
    if (!confirm("Excluir esta transação?")) return;
    startTransition(async () => {
      const result = await deleteTransaction(id);
      if (result.error) toast.error(result.error);
      else { toast.success("Transação excluída"); router.refresh(); }
    });
  }

  const activeFilters = ["type", "categoryId", "bankAccountId", "dateFrom", "dateTo", "q"]
    .filter((k) => searchParams.get(k));

  return (
    <motion.div className="space-y-5" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.header variants={item} className="flex items-center justify-between pt-2">
        <div>
          <p className="section-label mb-1">{totalCount} transaç{totalCount !== 1 ? "ões" : "ão"}</p>
          <h1 className="text-3xl font-black tracking-tight">Extrato</h1>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary px-4 py-2 text-sm">
          <Plus size={16} /> Nova
        </button>
      </motion.header>

      {/* Filtros */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Buscar transações..."
              defaultValue={searchParams.get("q") ?? ""}
              onChange={(e) => updateFilter("q", e.target.value)}
              className="input-c6-sm pl-9 w-full"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all flex items-center gap-1.5 ${
              showFilters || activeFilters.length > 0
                ? "bg-primary/10 border-primary/40 text-primary"
                : "bg-surface-2 border-border text-secondary"
            }`}
          >
            <Filter size={15} />
            {activeFilters.length > 0 && (
              <span className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* Tipo */}
                <div className="relative">
                  <select
                    className="input-c6-sm w-full appearance-none pr-8"
                    value={searchParams.get("type") ?? ""}
                    onChange={(e) => updateFilter("type", e.target.value)}
                  >
                    <option value="">Todos os tipos</option>
                    <option value="INCOME">Receitas</option>
                    <option value="EXPENSE">Despesas</option>
                    <option value="TRANSFER">Transferências</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                </div>

                {/* Conta */}
                <div className="relative">
                  <select
                    className="input-c6-sm w-full appearance-none pr-8"
                    value={searchParams.get("bankAccountId") ?? ""}
                    onChange={(e) => updateFilter("bankAccountId", e.target.value)}
                  >
                    <option value="">Todas as contas</option>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                </div>

                {/* Data De */}
                <input
                  type="date"
                  className="input-c6-sm w-full"
                  value={searchParams.get("dateFrom") ?? ""}
                  onChange={(e) => updateFilter("dateFrom", e.target.value)}
                />

                {/* Data Até */}
                <input
                  type="date"
                  className="input-c6-sm w-full"
                  value={searchParams.get("dateTo") ?? ""}
                  onChange={(e) => updateFilter("dateTo", e.target.value)}
                />
              </div>

              {activeFilters.length > 0 && (
                <button
                  onClick={() => {
                    activeFilters.forEach((k) => updateFilter(k, ""));
                    setShowFilters(false);
                  }}
                  className="text-xs text-negative font-semibold mt-2 flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  <X size={12} /> Limpar filtros
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Lista */}
      {initialTransactions.length === 0 ? (
        <motion.div variants={item} className="card-c6 text-center py-16 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto">
            <ArrowLeftRight size={22} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Nenhuma transação</h3>
            <p className="text-secondary text-sm mt-1">
              {activeFilters.length > 0
                ? "Nenhuma transação encontrada com os filtros atuais."
                : "Comece registrando sua primeira transação."}
            </p>
          </div>
          {activeFilters.length === 0 && (
            <button onClick={() => setShowModal(true)} className="btn-primary px-6 mx-auto w-fit text-sm">
              <Plus size={16} /> Registrar
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div variants={container} className="space-y-2">
          {initialTransactions.map((tx) => {
            const amount = Number(tx.amount);
            const isIncome = tx.type === "INCOME";
            const isMine = tx.user.id === currentUserId;

            return (
              <motion.div
                key={tx.id}
                variants={item}
                className="card-c6-sm flex items-center gap-3 group hover:border-white/10 transition-all"
                whileHover={{ x: 2 }}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${tx.category?.color ?? "#3A3A3C"}22` }}
                >
                  {tx.category?.icon ?? (isIncome ? "💰" : "💸")}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {tx.description ?? tx.category?.name ?? "Transação"}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <TypeBadge type={tx.type} />
                    <span className="text-xs text-secondary">
                      {formatDate(tx.date, { short: true, relative: true })}
                    </span>
                  </div>
                  <p className="text-xs text-secondary/70 mt-0.5">
                    {isMine ? "Lançado por você" : `Lançado por ${tx.user.name ?? "familiar"}`}
                    {" · "}{tx.bankAccount.name}
                  </p>
                </div>

                {/* Amount + Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <p className={`text-sm font-black tabular-nums ${isIncome ? "amount-positive" : tx.type === "TRANSFER" ? "text-info" : "amount-negative"}`}>
                    {isIncome ? "+" : tx.type === "EXPENSE" ? "-" : ""}
                    {formatCurrency(Math.abs(amount))}
                  </p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDelete(tx.id)}
                      disabled={isPending}
                      className="p-1.5 hover:bg-negative/10 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={13} className="text-negative" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <TransactionModal
            accounts={accounts}
            categories={categories}
            onClose={() => { setShowModal(false); router.refresh(); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
