"use client";

import { useMemo, useState, useTransition } from "react";
import { TransactionType } from "@prisma/client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { seedDefaultCategoriesForUser, createCategory, updateCategory, deleteCategory } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import CategoryPill from "@/components/finance/CategoryPill";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { COPY } from "@/lib/copy/ctrlbank";

const schema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(TransactionType),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  taxClassification: z.string().optional(),
});

type Category = { id: string; name: string; type: TransactionType; icon: string | null; color: string | null; taxClassification: string | null };

export default function CategoriasPageClient({ categories, categoryCount, uncategorizedCount, monthlyCategoryCounts }: {
  categories: Category[];
  categoryCount: number;
  uncategorizedCount: number;
  uncategorized: Array<{ id: string; description: string | null; amount: number; date: string }>;
  monthlyCategoryCounts: Record<string, number>;
}) {
  const [tab, setTab] = useState<TransactionType>("EXPENSE");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", type: "EXPENSE", icon: "🏷️", color: "#4AC3FF", taxClassification: "" },
  });

  const filtered = useMemo(() => categories.filter((item) => item.type === tab), [categories, tab]);

  function openCreate() {
    setEditing(null);
    form.reset({ name: "", type: tab, icon: "🏷️", color: "#4AC3FF", taxClassification: "" });
    setOpen(true);
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Categorias</h1>
          <p className="text-secondary">{categoryCount} categorias no seu escopo.</p>
        </div>
        <Button onClick={openCreate}>+ Nova categoria</Button>
      </header>

      {categoryCount === 0 && (
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
          <p>{COPY.empty.categories}</p>
          <Button onClick={() => startTransition(async () => { const result = await seedDefaultCategoriesForUser(); toast.success(`${result.created} categorias criadas.`); })}>Aplicar taxonomia padrão</Button>
        </div>
      )}

      {uncategorizedCount > 0 && (
        <div className="sticky top-20 z-20 rounded-xl border border-accent-warning/30 bg-accent-warning/10 px-4 py-3 flex items-center justify-between">
          <p>{uncategorizedCount} transações aguardando categoria.</p>
          <Link href="/categorias/revisar" className="text-accent-warning underline">Revisar agora</Link>
        </div>
      )}

      <div className="flex gap-2">
        {(["EXPENSE", "INCOME", "TRANSFER"] as TransactionType[]).map((type) => (
          <button key={type} className={`rounded-lg px-3 py-1.5 text-sm ${tab === type ? "bg-primary text-black" : "bg-surface-2 text-foreground"}`} onClick={() => setTab(type)}>{type === "EXPENSE" ? "Despesas" : type === "INCOME" ? "Receitas" : "Transferências"}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((category) => (
          <div key={category.id} className="rounded-xl border border-border bg-surface p-4 flex items-center justify-between">
            <div className="space-y-1">
              <CategoryPill name={category.name} color={category.color ?? "#6B7280"} icon={category.icon ?? undefined} />
              <p className="text-xs text-secondary">{monthlyCategoryCounts[category.id] ?? 0} transações no mês</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setEditing(category); form.reset({ name: category.name, type: category.type, icon: category.icon ?? "", color: category.color ?? "#6B7280", taxClassification: category.taxClassification ?? "" }); setOpen(true); }}>Editar</Button>
              <Button variant="outline" onClick={() => startTransition(async () => { const res = await deleteCategory(category.id); if (res.error) toast.error(res.error); else toast.success("Categoria excluída."); })}>Excluir</Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Editar categoria" : "Nova categoria"}</DialogTitle></DialogHeader>
          <form className="space-y-3" onSubmit={form.handleSubmit((values) => startTransition(async () => {
            const res = editing ? await updateCategory(editing.id, values) : await createCategory(values);
            if (res.error) toast.error(res.error); else { toast.success(editing ? "Categoria atualizada." : "Categoria criada."); setOpen(false); }
          }))}>
            <input className="input-c6" placeholder="Nome" {...form.register("name")} />
            <select className="input-c6" {...form.register("type")}>
              <option value="EXPENSE">Despesa</option><option value="INCOME">Receita</option><option value="TRANSFER">Transferência</option>
            </select>
            <input className="input-c6" placeholder="Ícone" {...form.register("icon")} />
            <input className="input-c6" placeholder="#4AC3FF" {...form.register("color")} />
            <input className="input-c6" placeholder="Classificação tributária (opcional)" {...form.register("taxClassification")} />
            <Button type="submit" disabled={isPending}>{isPending ? "Salvando..." : "Salvar"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
