"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, CreditCard } from "lucide-react";
import { BankAccountCard, SafeBankAccount } from "@/components/cards/BankAccountCard";
import { BankAccountForm } from "@/components/forms/BankAccountForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { motion } from "framer-motion";

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

export function AccountsClient({ accounts }: { accounts: SafeBankAccount[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SafeBankAccount | undefined>();

  const handleOpenNew = () => {
    setSelectedAccount(undefined);
    setIsOpen(true);
  };

  const handleOpenEdit = (account: SafeBankAccount) => {
    setSelectedAccount(account);
    setIsOpen(true);
  };

  const handleSuccess = () => {
    setIsOpen(false);
    router.refresh();
  };

  return (
    <motion.div
      className="space-y-6 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex justify-between items-start pt-2" variants={itemVariants}>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contas e Cartões</h1>
          <p className="text-secondary text-sm mt-1">Gerencie seu patrimônio e limites</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <button
            onClick={handleOpenNew}
            className="hidden md:flex items-center gap-2 btn-primary !w-auto text-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
          <DialogContent className="sm:max-w-[425px] bg-background border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {selectedAccount ? "Editar Conta" : "Nova Conta"}
              </DialogTitle>
            </DialogHeader>
            <BankAccountForm initialData={selectedAccount} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {accounts.length === 0 ? (
        <motion.div variants={itemVariants}>
          <EmptyState
            icon={CreditCard}
            title="Nenhuma conta cadastrada"
            description="Adicione sua primeira conta bancária ou cartão de crédito para começar."
            actionLabel="Adicionar Conta"
            onAction={handleOpenNew}
          />
        </motion.div>
      ) : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" variants={itemVariants}>
          {accounts.map((acc) => (
            <BankAccountCard key={acc.id} account={acc} onClick={() => handleOpenEdit(acc)} />
          ))}
        </motion.div>
      )}

      {/* FAB Mobile */}
      <button
        onClick={handleOpenNew}
        className="md:hidden fixed bottom-24 right-5 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-fab flex items-center justify-center active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}
