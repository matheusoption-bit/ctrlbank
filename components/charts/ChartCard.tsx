import React from "react";

export default function ChartCard({ title, children, description }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-4 space-y-3">
      <header>
        <h2 className="font-bold">{title}</h2>
        {description ? <p className="text-xs text-secondary">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}
