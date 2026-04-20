"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, Sparkles } from "lucide-react";
import { searchGlobal } from "@/app/actions/search";
import { SearchGlobalResponse } from "@/lib/search/contracts";
import { EmptyState } from "@/components/ui/empty-state";
import SearchResultGroup from "@/components/subscriptions/SearchResultGroup";

type BuscarPageClientProps = {
  initialQuery: string;
  initialResults: SearchGlobalResponse;
};

export default function BuscarPageClient({ initialQuery, initialResults }: BuscarPageClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchGlobalResponse>(initialResults);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPending, startTransition] = useTransition();

  const flattenedItems = useMemo(
    () => results.groups.flatMap((group) => group.items),
    [results.groups],
  );

  useEffect(() => {
    const nextQuery = query.trim();
    const timeout = window.setTimeout(() => {
      startTransition(async () => {
        const nextResults = await searchGlobal(nextQuery);
        setResults(nextResults);
        setActiveIndex(0);
      });
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (activeIndex >= flattenedItems.length) {
      setActiveIndex(flattenedItems.length > 0 ? 0 : -1);
    }
  }, [activeIndex, flattenedItems.length]);

  const activeItemId = flattenedItems[activeIndex]?.id ?? null;

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (flattenedItems.length === 0) return;
      setActiveIndex((currentIndex) => (currentIndex + 1) % flattenedItems.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (flattenedItems.length === 0) return;
      setActiveIndex((currentIndex) => (currentIndex - 1 + flattenedItems.length) % flattenedItems.length);
      return;
    }

    if (event.key === "Enter") {
      const activeItem = flattenedItems[activeIndex];
      if (!activeItem) return;
      event.preventDefault();
      router.push(activeItem.href);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
              <Sparkles className="h-3.5 w-3.5" />
              Busca Global
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">Buscar</h1>
            <p className="max-w-2xl text-sm text-white/55">
              Encontre movimentos, contas, assinaturas, merchants e evidências a partir de uma única consulta.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px]">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Resultados</p>
              <p className="mt-2 text-2xl font-semibold text-white">{results.totalResults}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Grupos</p>
              <p className="mt-2 text-2xl font-semibold text-white">{results.groups.length}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Atalho</p>
              <p className="mt-2 text-sm font-medium text-white/80">↑ ↓ navegar · Enter abrir</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-white/[0.08] bg-black/20 p-4">
          <label htmlFor="global-search" className="mb-3 block text-sm font-semibold text-white/80">
            Buscar em todo o CtrlBank
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
            <Search className="h-5 w-5 text-white/45" />
            <input
              id="global-search"
              type="search"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar movimentos, contas, assinaturas ou evidências"
              className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/30"
            />
            {isPending ? <Loader2 className="h-4 w-4 animate-spin text-white/55" /> : null}
          </div>
          <p className="mt-3 text-sm text-white/45">
            Tolerante a merchant sujo, descrições curtas e nomes de conta. As assinaturas entram como classe própria de resultado.
          </p>
        </div>
      </section>

      {!query.trim() ? (
        <section className="rounded-[28px] border border-dashed border-white/[0.08] bg-white/[0.02] p-10">
          <EmptyState
            icon={Search}
            title="Comece por um termo-chave"
            description="Experimente um merchant, uma assinatura, uma conta, um valor conhecido ou o nome de um documento processado."
          />
        </section>
      ) : results.totalResults === 0 && !isPending ? (
        <section className="rounded-[28px] border border-dashed border-white/[0.08] bg-white/[0.02] p-10">
          <EmptyState
            icon={Search}
            title="Nada apareceu nesta busca"
            description="Tente outro merchant, uma parte da descrição do movimento, o nome da conta ou a assinatura esperada."
          />
        </section>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {results.groups.map((group) => (
            <SearchResultGroup
              key={group.key}
              group={group}
              activeItemId={activeItemId}
              onHoverItem={(itemId) => {
                const index = flattenedItems.findIndex((item) => item.id === itemId);
                if (index >= 0) setActiveIndex(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
