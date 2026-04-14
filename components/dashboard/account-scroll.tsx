"use client";

import { BankAccountCard, SafeBankAccount } from "@/components/cards/BankAccountCard";

interface AccountScrollProps {
  accounts: SafeBankAccount[];
}

export function AccountScroll({ accounts }: AccountScrollProps) {
  if (accounts.length === 0) return null;

  return (
    <section className="space-y-3">
      <h3 className="section-label px-1">Minhas Contas</h3>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-1 px-1">
        {accounts.map((account) => (
          <div key={account.id} className="snap-start">
            <BankAccountCard account={account} compact />
          </div>
        ))}
      </div>
    </section>
  );
}
