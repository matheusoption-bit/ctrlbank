"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { TransactionForm } from "@/components/forms/TransactionForm";
import { CSVImportDialog } from "@/components/transacoes/CSVImportDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { FAB } from "@/components/ui/fab";
import { ArrowRightLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

interface AccountOption {
  id: string;
  name: string;
  type: string;
}

interface CategoryOption {
  id: string;
  name: string;
  type: string;
  icon: string | null;
}

interface TransactionItem {
  id: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  description: string | null;
  amount: number;
  date: string;
  bankAccountId: string;
  categoryId: string | null;
  status: "PENDING" | "COMPLETED";
  installmentNumber: number | null;
  totalInstallments: number | null;
  ignoreInTotals: boolean;
  category: { name: string; icon: string | null; color: string | null } | null;
  bankAccount: { name: string } | null;
}

interface TransactionsClientProps {
  accounts: AccountOption[];
  categories: CategoryOption[];
  transactions: TransactionItem[];
}

// Group transactions by date
function groupByDate(transactions: TransactionItem[]): Map<string, TransactionItem[]> {
  const groups = new Map<string, TransactionItem[]>();

  for (const tx of transactions) {
    const dateKey = tx.date.split("T")[0]; // YYYY-MM-DD
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(tx);
  }

  return groups;
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00"); // Avoid timezone issues
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === yesterday.toDateString()) return "Ontem";

  return format(date, "d 'de' MMMM", { locale: ptBR });
}

export function TransactionsClient({ accounts, categories, transactions }: TransactionsClientProps) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCSVOpen, setIsCSVOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | undefined>();
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || "");

  const grouped = groupByDate(transactions);

  const handleOpenNew = () => {
    setSelectedTransaction(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (tx: TransactionItem) => {
    setSelectedTransaction(tx);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    setSelectedTransaction(undefined);
    router.refresh();
  };

  return (
    <motion.div
      className="space-y-6 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header className="flex justify-between items-start pt-2" variants={itemVariants}>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Transações</h1>
          <p className="text-secondary text-sm mt-1">Suas movimentações financeiras</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsCSVOpen(true)}
            className="hidden md:flex items-center gap-2 btn-secondary !w-auto text-sm"
          >
            <Upload className="w-4 h-4" />
            Importar CSV
          </button>
          <button
            onClick={handleOpenNew}
            className="hidden md:flex items-center gap-2 btn-primary !w-auto text-sm"
          >
            Nova Transação
          </button>
        </div>
      </motion.header>

      {/* Transaction list grouped by date */}
      {transactions.length === 0 ? (
        <motion.div variants={itemVariants}>
          <EmptyState
            icon={ArrowRightLeft}
            title="Nenhuma transação"
            description="Registre sua primeira movimentação ou importe um extrato CSV."
            actionLabel="Nova Transação"
            onAction={handleOpenNew}
          />
        </motion.div>
      ) : (
        <motion.div className="space-y-6" variants={itemVariants}>
          {Array.from(grouped.entries()).map(([dateKey, txs]) => (
            <div key={dateKey} className="space-y-1">
              {/* Date group header */}
              <p className="section-label px-1 py-2">{formatDateLabel(dateKey)}</p>

              {txs.map((tx) => (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => handleOpenEdit(tx)}
                  className="flex items-center gap-4 w-full text-left px-4 py-3.5 rounded-xl hover:bg-white/[0.02] transition-colors"
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{
                      backgroundColor: tx.category?.color
                        ? `${tx.category.color}18`
                        : "rgba(161, 161, 170, 0.1)",
                    }}
                  >
                    {tx.category?.icon || (tx.type === "INCOME" ? "💰" : "📄")}
                  </div>

                  {/* Description */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {tx.description || "Sem descrição"}
                    </p>
                    <p className="text-xs text-secondary truncate">
                      {tx.category?.name || "Sem categoria"}
                      {tx.bankAccount && ` • ${tx.bankAccount.name}`}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`text-sm font-semibold ${
                        tx.type === "INCOME" ? "text-success" : "text-white"
                      }`}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {tx.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                    {tx.installmentNumber && tx.totalInstallments && (
                      <p className="text-2xs text-secondary">{tx.installmentNumber}/{tx.totalInstallments}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </motion.div>
      )}

      {/* FAB */}
      <FAB onClick={handleOpenNew} />

      {/* Transaction Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[440px] bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {selectedTransaction ? "Editar Transação" : "Nova Transação"}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm
            accounts={accounts}
            categories={categories}
            initialData={selectedTransaction}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* CSV Import Dialog */}
      <CSVImportDialog
        open={isCSVOpen}
        onOpenChange={setIsCSVOpen}
        bankAccountId={selectedAccount}
        onSuccess={() => { router.refresh(); }}
      />
    </motion.div>
  );
}
