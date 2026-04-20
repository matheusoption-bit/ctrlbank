"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { DetectedSubscriptionStatus } from "@prisma/client";
import { confirmDetectedSubscription, hideDetectedSubscription, syncDetectedSubscriptions } from "@/app/actions/subscriptions";
import { DetectedSubscriptionSummary, DetectedSubscriptionView } from "@/lib/subscriptions/contracts";
import SubscriptionCard from "@/components/subscriptions/SubscriptionCard";
import { EmptyState } from "@/components/ui/empty-state";

type AssinaturasPageClientProps = {
  initialSearch: string;
  initialStatus: DetectedSubscriptionStatus | "ALL";
  summary: DetectedSubscriptionSummary;
  subscriptions: DetectedSubscriptionView[];
};

const STATUS_OPTIONS: Array<{ value: DetectedSubscriptionStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "Todas" },
  { value: DetectedSubscriptionStatus.ACTIVE, label: "Ativas" },
  { value: DetectedSubscriptionStatus.POSSIBLE, label: "Possíveis" },
  { value: DetectedSubscriptionStatus.PRICE_CHANGED, label: "Mudança de preço" },
  { value: DetectedSubscriptionStatus.DUPLICATE_SUSPECTED, label: "Duplicidade" },
  { value: DetectedSubscriptionStatus.INACTIVE, label: "Inativas" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function AssinaturasPageClient({
  initialSearch,
  initialStatus,
  summary,
  subscriptions,
}: AssinaturasPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const activeStatus = initialStatus;
  const highlightedCounts = useMemo(
    () => [
      { label: "Mensal estimado", value: formatCurrency(summary.totalMonthly) },
      { label: "Possíveis cortes", value: formatCurrency(summary.potentialCutMonthly) },
      { label: "Ativas", value: String(summary.activeCount) },
      { label: "Mudança de preço", value: String(summary.priceChangedCount) },
    ],
    [summary],
  );

  function pushParams(nextSearch: string, nextStatus: DetectedSubscriptionStatus | "ALL") {
    const params = new URLSearchParams(searchParams.toString());
    if (nextSearch.trim()) params.set("search", nextSearch.trim());
    else params.delete("search");

    if (nextStatus !== "ALL") params.set("status", nextStatus);
    else params.delete("status");

    router.push(`${pathname}?${params.toString()}`);
  }

  function submitSearch() {
    pushParams(search, activeStatus);
  }

  function changeStatus(nextStatus: DetectedSubscriptionStatus | "ALL") {
    pushParams(search, nextStatus);
  }

  function runSync() {
    startTransition(async () => {
      await syncDetectedSubscriptions();
      router.refresh();
    });
  }

  function confirmSubscription(id: string) {
    setBusyId(id);
    startTransition(async () => {
      await confirmDetectedSubscription(id);
      setBusyId(null);
      router.refresh();
    });
  }

  function hideSubscription(id: string) {
    setBusyId(id);
    startTransition(async () => {
      await hideDetectedSubscription(id);
      setBusyId(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
              Controle recorrente
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">Assinaturas</h1>
            <p className="max-w-3xl text-sm leading-6 text-white/55">
              Detectamos cobranças recorrentes, reconciliamos merchants com marcas conhecidas e explicamos por que cada assinatura foi marcada.
            </p>
          </div>

          <button
            type="button"
            onClick={runSync}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Reprocessar detecção
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {highlightedCounts.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_auto]">
          <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
            <label htmlFor="subscription-search" className="mb-3 block text-sm font-semibold text-white/80">
              Buscar por merchant, marca ou conta
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
              <Search className="h-5 w-5 text-white/45" />
              <input
                id="subscription-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") submitSearch();
                }}
                placeholder="Ex.: Netflix, OpenAI, cartão black"
                className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/30"
              />
              <button
                type="button"
                onClick={submitSearch}
                className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Aplicar
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            {STATUS_OPTIONS.map((option) => {
              const active = option.value === activeStatus;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => changeStatus(option.value)}
                  className={active
                    ? "rounded-full border border-primary/40 bg-primary/15 px-3 py-2 text-sm font-semibold text-white"
                    : "rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm font-semibold text-white/65 transition hover:bg-white/[0.05] hover:text-white"
                  }
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {subscriptions.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-white/[0.08] bg-white/[0.02] p-10">
          <EmptyState
            icon={Search}
            title="Nenhuma assinatura apareceu neste filtro"
            description="Reprocesse a detecção ou ajuste o merchant, a conta ou o status esperado para ampliar a busca."
          />
        </section>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onConfirm={confirmSubscription}
              onHide={hideSubscription}
              isBusy={isPending && busyId === subscription.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
