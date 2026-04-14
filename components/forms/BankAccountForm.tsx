"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BankAccountFormValues, bankAccountSchema } from "@/lib/validations/account.schema";
import { createBankAccount, updateBankAccount, deleteBankAccount } from "@/lib/actions/account.actions";
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
import { SafeBankAccount } from "../cards/BankAccountCard";

export function BankAccountForm({
  initialData,
  onSuccess
}: {
  initialData?: SafeBankAccount,
  onSuccess?: () => void
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      id: initialData?.id || undefined,
      name: initialData?.name || "",
      type: initialData?.type || "CHECKING",
      balance: initialData?.balance || 0,
      color: initialData?.color || "#1C1C1E",
      creditLimit: initialData?.creditLimit || 0,
      invoiceClosingDay: initialData?.invoiceClosingDay || 1,
      invoiceDueDay: initialData?.invoiceDueDay || 5,
    },
  });

  const accountType = form.watch("type");

  function onSubmit(values: BankAccountFormValues) {
    setError(null);
    startTransition(async () => {
      const action = initialData ? updateBankAccount : createBankAccount;
      const res = await action(values);

      if (!res.success) {
        setError(res.error || "Ocorreu um erro ao salvar a conta.");
        toast.error("Erro ao salvar", { description: res.error || "Verifique os dados e tente novamente." });
      } else {
        toast.success("Sucesso!", { description: "Conta salva com sucesso." });
        if (onSuccess) onSuccess();
      }
    });
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    if (!confirm("Tem certeza que deseja excluir esta conta?")) return;

    startTransition(async () => {
      const res = await deleteBankAccount(initialData.id!);
      if (!res.success) {
        setError(res.error || "Erro ao excluir.");
        toast.error("Erro ao excluir", { description: res.error || "Não foi possível excluir a conta." });
      } else {
        toast.success("Conta excluída", { description: "A conta foi removida com sucesso." });
        if (onSuccess) onSuccess();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && <div className="p-3 text-sm text-danger bg-danger/10 rounded-xl">{error}</div>}

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="section-label">Tipo da Conta</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-surface border-border h-12 rounded-xl">
                    <SelectValue placeholder="Selecione o tipo..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-surface border-border">
                  <SelectItem value="CHECKING">Conta Corrente</SelectItem>
                  <SelectItem value="SAVINGS">Poupança</SelectItem>
                  <SelectItem value="CREDIT">Cartão de Crédito</SelectItem>
                  <SelectItem value="INVESTMENT">Investimento</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="section-label">Nome da Conta/Cartão</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Nubank, Itaú..." className="bg-surface border-border h-12 rounded-xl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="section-label">{accountType === "CREDIT" ? "Fatura Atual" : "Saldo Atual"}</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" className="bg-surface border-border h-12 rounded-xl text-lg font-semibold" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {accountType === "CREDIT" && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="creditLimit"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="section-label">Limite de Crédito</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" className="bg-surface border-border h-12 rounded-xl" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invoiceClosingDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="section-label">Dia do Corte</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" max="31" className="bg-surface border-border h-12 rounded-xl" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invoiceDueDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="section-label">Vencimento</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" max="31" className="bg-surface border-border h-12 rounded-xl" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="section-label">Cor do Cartão</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    className="w-16 h-12 p-1 rounded-xl bg-surface border-border"
                    value={field.value || "#1C1C1E"}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <Input
                    placeholder="#1C1C1E"
                    className="flex-1 bg-surface border-border h-12 rounded-xl"
                    {...field}
                    value={field.value || ""}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2 flex gap-3">
          <Button type="submit" className="flex-1 btn-primary" disabled={isPending}>
            {isPending ? "Salvando..." : initialData ? "Salvar Alterações" : "Adicionar Conta"}
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
