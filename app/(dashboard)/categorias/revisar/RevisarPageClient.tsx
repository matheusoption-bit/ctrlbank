"use client";

import { useState, useTransition } from "react";
import { applyCategoryBulk } from "@/app/actions/categories";
import { formatCurrency } from "@/lib/format";
import CategoryPill from "@/components/finance/CategoryPill";
import { COPY } from "@/lib/copy/ctrlbank";
import { toast } from "sonner";

export default function RevisarPageClient({ rows, categories }: {
  rows: Array<{ id: string; merchant: string; amount: number; date: string; suggestion: { suggestedCategoryId: string | null; confidence: number; source: string } | null }>;
  categories: Array<{ id: string; name: string; icon: string | null; color: string | null }>;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [targetCategoryId, setTargetCategoryId] = useState<string>("");
  const [createRule, setCreateRule] = useState(true);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-5 pb-24">
      <header><h1 className="text-3xl font-black tracking-tight">Revisar {rows.length} transações</h1></header>
      <div className="grid gap-3">
        {rows.map((row) => {
          const suggested = categories.find((c) => c.id === row.suggestion?.suggestedCategoryId);
          return (
            <article key={row.id} className="rounded-xl border border-border bg-surface p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{row.merchant}</p>
                  <p className="text-xs text-secondary tabular-nums">{formatCurrency(row.amount)} · {new Date(row.date).toLocaleDateString("pt-BR")}</p>
                </div>
                <input aria-label={`Selecionar ${row.merchant}`} type="checkbox" checked={selected.includes(row.id)} onChange={(e) => setSelected((prev) => e.target.checked ? [...prev, row.id] : prev.filter((id) => id !== row.id))} />
              </div>
              {suggested ? <CategoryPill name={suggested.name} color={suggested.color ?? "#6B7280"} icon={suggested.icon ?? undefined} size="sm" /> : <p className="text-sm text-secondary">Sem sugestão automática.</p>}
              <p className="text-xs text-secondary">Confiança: {Math.round((row.suggestion?.confidence ?? 0) * 100)}%</p>
            </article>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-[260px] bg-surface border-t border-border p-3">
        <div className="max-w-[1120px] mx-auto flex flex-wrap items-center gap-3">
          <button className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => setSelected(rows.map((r) => r.id))}>Selecionar todas</button>
          <select className="input-c6 max-w-xs" value={targetCategoryId} onChange={(e) => setTargetCategoryId(e.target.value)}>
            <option value="">Selecione categoria alvo</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={createRule} onChange={(e) => setCreateRule(e.target.checked)} /> {COPY.actions.createRule}</label>
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
            disabled={!targetCategoryId || selected.length === 0 || isPending}
            onClick={() => startTransition(async () => {
              const res = await applyCategoryBulk({ transactionIds: selected, categoryId: targetCategoryId, createRule });
              toast.success(`${res.updated} transações atualizadas.`);
            })}
          >
            {COPY.actions.applyAll}
          </button>
        </div>
      </div>
    </div>
  );
}
