import { BankAccountType, TransactionStatus, TransactionType } from "@prisma/client";

export type CanonicalAccountLike = {
  balance: number;
  type: BankAccountType;
};

export type CanonicalTransactionLike = {
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  ignoreInTotals: boolean;
};

export type CanonicalTotals = {
  accountingBalance: number;
  netPosition: number;
};

export function computeCanonicalTotals(accounts: CanonicalAccountLike[]): CanonicalTotals {
  return accounts.reduce<CanonicalTotals>(
    (acc, account) => {
      acc.accountingBalance += account.balance;
      if (account.type === BankAccountType.CREDIT) {
        acc.netPosition -= Math.abs(account.balance);
      } else {
        acc.netPosition += account.balance;
      }
      return acc;
    },
    { accountingBalance: 0, netPosition: 0 }
  );
}

export type CanonicalFlow = {
  income: number;
  expense: number;
  net: number;
};

export function computeCanonicalFlow(transactions: CanonicalTransactionLike[]): CanonicalFlow {
  const flow = transactions.reduce(
    (acc, tx) => {
      if (tx.status !== TransactionStatus.COMPLETED || tx.ignoreInTotals) return acc;
      if (tx.type === TransactionType.INCOME) acc.income += tx.amount;
      if (tx.type === TransactionType.EXPENSE) acc.expense += tx.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  return { ...flow, net: flow.income - flow.expense };
}

export const FINANCE_POLICY = {
  accountingBalance: "Soma contábil dos saldos das contas, sem reinterpretar sinal.",
  netPosition: "Posição líquida: contas de crédito entram como exposição (subtrai valor absoluto).",
  flow: "Fluxo considera apenas transações COMPLETED, ignoreInTotals=false e exclui TRANSFER de income/expense.",
} as const;
