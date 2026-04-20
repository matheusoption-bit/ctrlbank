"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SearchResultGroup as SearchResultGroupType } from "@/lib/search/contracts";
import { cn } from "@/lib/utils";

type SearchResultGroupProps = {
  group: SearchResultGroupType;
  activeItemId?: string | null;
  onHoverItem?: (id: string) => void;
};

export function SearchResultGroup({ group, activeItemId, onHoverItem }: SearchResultGroupProps) {
  return (
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/80">{group.title}</h2>
          <p className="mt-1 text-sm text-white/45">{group.description}</p>
        </div>
        <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/60">
          {group.items.length}
        </span>
      </div>

      <div className="space-y-2">
        {group.items.map((item) => {
          const active = activeItemId === item.id;
          return (
            <Link
              key={`${group.key}-${item.id}`}
              href={item.href}
              onMouseEnter={() => onHoverItem?.(item.id)}
              className={cn(
                "group flex items-center gap-4 rounded-2xl border px-4 py-3 transition-all duration-150",
                active
                  ? "border-primary/40 bg-primary/10"
                  : "border-white/[0.06] bg-black/10 hover:border-white/15 hover:bg-white/[0.03]",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                  {item.label ? (
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-white/55">
                      {item.label}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 truncate text-sm text-white/50">{item.subtitle}</p>
              </div>

              <div className="flex items-center gap-3">
                {item.value ? <span className="text-sm font-medium text-white/80">{item.value}</span> : null}
                <ArrowRight className="h-4 w-4 text-white/35 transition-transform group-hover:translate-x-0.5 group-hover:text-white/75" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default SearchResultGroup;
