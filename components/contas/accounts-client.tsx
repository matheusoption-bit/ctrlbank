"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { BankAccountCard, SafeBankAccount } from "@/components/cards/BankAccountCard";
import { BankAccountForm } from "@/components/forms/BankAccountForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function AccountsClient({ accounts }: { accounts: SafeBankAccount[] }) {
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
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-white">Contas e Cartões</h2>
          <p className="text-secondary mt-1">Gerencie seu patrimônio e limites.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button
              onClick={handleOpenNew}
              className="hidden md:flex items-center gap-2 btn-primary !w-auto"
            >
              <Plus className="w-5 h-5" />
              Adicionar Nova
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-background border-border text-foreground">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tighter">
                {selectedAccount ? "Editar Conta" : "Adicionar Instituição"}
              </DialogTitle>
            </DialogHeader>
            <BankAccountForm initialData={selectedAccount} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <BankAccountCard key={acc.id} account={acc} onClick={() => handleOpenEdit(acc)} />
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-20 bg-surface/50 rounded-3xl border border-white/5 border-dashed">
          <p className="text-secondary">Nenhuma conta cadastrada ainda.</p>
          <button onClick={handleOpenNew} className="text-primary font-semibold mt-4 hover:underline">
            Adicione sua primeira conta
          </button>
        </div>
      )}

      {/* FAB Mobile */}
      <button
        onClick={handleOpenNew}
        className="md:hidden fixed bottom-20 right-6 z-50 p-4 bg-primary text-black rounded-full shadow-soft-lg active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
