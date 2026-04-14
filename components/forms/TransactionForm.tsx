"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, TransactionFormValues } from "@/lib/validations/transaction.schema";
import { createTransaction, updateTransaction, deleteTransaction } from "@/lib/actions/transaction.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface TransactionFormProps {
  accounts: AccountOption[];
  categories: CategoryOption[];
  initialData?: {
    id: string;
    type: "INCOME" | "EXPENSE" | "TRANSFER";
    amount: number;
    description: string | null;
    date: string;
    bankAccountId: string;
    categoryId: string | null;
    status: "PENDING" | "COMPLETED";
    installmentNumber: number | null;
    totalInstallments: number | null;
    ignoreInTotals: boolean;
  };
  onSuccess?: () => void;
}

function getLocalDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function TransactionForm({ accounts, categories, initialData, onSuccess }: TransactionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      id: initialData?.id || undefined,
      type: initialData?.type || "EXPENSE",
      amount: initialData?.amount || 0,
      description: initialData?.description || "",
      date: initialData?.date ? new Date(initialData.date) : new Date(getLocalDateString()),
      bankAccountId: initialData?.bankAccountId || "",
      categoryId: initialData?.categoryId || null,
      status: initialData?.status || "COMPLETED",
      installmentNumber: initialData?.installmentNumber || null,
      totalInstallments: initialData?.totalInstallments || null,
      ignoreInTotals: initialData?.ignoreInTotals || false,
    },
  });

  const transactionType = form.watch("type");
  const filteredCategories = categories.filter((c) => c.type === transactionType || transactionType === "TRANSFER");

  function onSubmit(values: TransactionFormValues) {
    setError(null);
    startTransition(async () => {
      const action = initialData ? updateTransaction : createTransaction;
      const res = await action(values);

      if (!res.success) {
        setError(res.error || "Erro ao salvar transação.");
        toast.error("Erro", { description: res.error });
      } else {
        toast.success(initialData ? "Transação atualizada" : "Transação registrada");
        if (onSuccess) onSuccess();
      }
    });
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    if (!confirm("Excluir esta transação?")) return;

    startTransition(async () => {
      const res = await deleteTransaction(initialData.id);
      if (!res.success) {
        toast.error("Erro ao excluir", { description: res.error });
      } else {
        toast.success("Transação excluída");
        if (onSuccess) onSuccess();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && <div className="p-3 text-sm text-danger bg-danger/10 rounded-xl">{error}</div>}

        {/* Type Toggle */}
        <div className="space-y-2">
          <label className="section-label">Tipo</label>
          <div className="flex gap-2">
            {(["INCOME", "EXPENSE"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => form.setValue("type", type)}
                className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all ${
                  transactionType === type
                    ? type === "INCOME"
                      ? "bg-success/15 border border-success/40 text-success"
                      : "bg-danger/15 border border-danger/40 text-danger"
                    : "bg-surface border border-border text-secondary hover:bg-surface-elevated"
                }`}
              >
                {type === "INCOME" ? "Receita" : "Despesa"}
              </button>
            ))}
          </div>
        </div>

        {/* Account */}
        <FormField
          control={form.control}
          name="bankAccountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="section-label">Conta</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-surface border-border h-12 rounded-xl">
                    <SelectValue placeholder="Selecione a conta..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-surface border-border">
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="section-label">Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="bg-surface border-border h-12 rounded-xl">
                    <SelectValue placeholder="Selecione a categoria..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-surface border-border">
                  <SelectItem value="none">Sem categoria</SelectItem>
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon && `${cat.icon} `}{cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="section-label">Valor (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  className="bg-surface border-border h-12 rounded-xl text-lg font-semibold"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="section-label">Data</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="bg-surface border-border h-12 rounded-xl"
                  value={field.value instanceof Date ? field.value.toISOString().split("T")[0] : String(field.value)}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="section-label">Descrição</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Supermercado, Salário..."
                  className="bg-surface border-border h-12 rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="pt-2 flex gap-3">
          <Button type="submit" className="flex-1 btn-primary" disabled={isPending}>
            {isPending ? "Salvando..." : initialData ? "Atualizar" : "Registrar"}
          </Button>
          {initialData && (
            <Button type="button" variant="destructive" className="px-6 rounded-xl" onClick={handleDelete} disabled={isPending}>
              Excluir
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
