"use client";

import Link from "next/link";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sankey,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "@/components/charts/ChartCard";
import { formatCurrency, formatMonthYear } from "@/lib/format";
import type { FluxoEvolucaoPoint, FluxoMensal } from "@/app/actions/fluxo";

const CATEGORY_COLORS = [
  "#4AC3FF",
  "#8E7CFF",
  "#FF6B4A",
  "#FFD84A",
  "#2ECC71",
  "#FF4AA5",
  "#D9BFFF",
  "#6B7280",
];

interface Props {
  month: number;
  year: number;
  mensal: FluxoMensal;
  evolucao: FluxoEvolucaoPoint[];
}

export default function FluxoPageClient({ month, year, mensal, evolucao }: Props) {
  const totalCategorias = mensal.donutCategorias.reduce((acc, item) => acc + item.value, 0);
  const hasSankeyData = mensal.sankey.links.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black tracking-[-0.03em] text-foreground">Fluxo</h1>
        <p className="text-[13px] text-secondary">
          Para onde o seu reino flui — {formatMonthYear(month, year)}.
        </p>
      </header>

      <ChartCard
        title="Fluxo Soberano"
        description="Entradas, categorias e saldo remanescente em um só painel."
      >
        {hasSankeyData ? (
          <div className="h-[320px]" role="img" aria-label="Sankey do fluxo mensal">
            <ResponsiveContainer width="100%" height="100%">
              <Sankey
                data={mensal.sankey}
                nodePadding={24}
                nodeWidth={14}
                margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
                link={{ stroke: "hsl(var(--accent))", strokeOpacity: 0.25 }}
                node={{ stroke: "transparent", fill: "hsl(var(--accent))" }}
              />
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-secondary">
            Sem entradas ou categorias suficientes no período selecionado.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <Metric label="Entradas" value={mensal.totalEntrada} tone="positive" />
          <Metric label="Saídas" value={mensal.totalSaida} tone="negative" />
          <Metric label="Saldo do mês" value={mensal.saldoMes} tone={mensal.saldoMes >= 0 ? "positive" : "negative"} />
        </div>
      </ChartCard>

      <div className="grid md:grid-cols-2 gap-4">
        <ChartCard title="Gastos por categoria" description={totalCategorias ? formatCurrency(totalCategorias) : undefined}>
          {mensal.donutCategorias.length > 0 ? (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mensal.donutCategorias}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={88}
                    strokeWidth={0}
                  >
                    {mensal.donutCategorias.map((_, index) => (
                      <Cell key={String(index)} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      background: "hsl(var(--bg-elevated-2))",
                      border: "1px solid hsl(var(--border-strong))",
                      borderRadius: 8,
                      color: "hsl(var(--foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-secondary">Sem despesas categorizadas no período.</p>
          )}
        </ChartCard>

        <ChartCard title="Evolução" description={`Últimos ${evolucao.length} meses`}>
          {evolucao.length > 0 ? (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucao}>
                  <XAxis dataKey="month" stroke="hsl(var(--fg-muted))" fontSize={11} />
                  <YAxis stroke="hsl(var(--fg-muted))" fontSize={11} width={60} tickFormatter={(v: number) => formatCurrency(v, { compact: true })} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      background: "hsl(var(--bg-elevated-2))",
                      border: "1px solid hsl(var(--border-strong))",
                      borderRadius: 8,
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Line type="monotone" dataKey="saldo" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-secondary">Sem histórico suficiente para evolução.</p>
          )}
        </ChartCard>
      </div>

      <footer className="text-sm">
        <Link className="text-primary font-semibold hover:underline" href={`/caixa?month=${month}&year=${year}`}>
          Abrir Caixa no mesmo período →
        </Link>
      </footer>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "positive" | "negative" }) {
  const toneClass = tone === "positive" ? "text-positive" : "text-negative";
  return (
    <div className="rounded-xl border border-border bg-surface-2 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.12em] text-secondary font-bold">{label}</p>
      <p className={`text-lg font-bold tabular-nums ${toneClass}`}>{formatCurrency(value)}</p>
    </div>
  );
}
