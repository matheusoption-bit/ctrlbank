"use client";

import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Sankey } from "recharts";
import ChartCard from "@/components/charts/ChartCard";
import { formatCurrency } from "@/lib/format";

const COLORS = ["#4AC3FF", "#8E7CFF", "#FF6B4A", "#FFD84A", "#2ECC71", "#6B7280"];

export default function FluxoPageClient({ month, year, mensal, evolucao }: {
  month: number;
  year: number;
  mensal: { sankey: { nodes: Array<{ name: string }>; links: Array<{ source: string; target: string; value: number }> }; totalEntrada: number; totalSaida: number; saldoMes: number; donutCategorias: Array<{ name: string; value: number }> };
  evolucao: Array<{ month: string; entrada: number; saida: number; saldo: number }>;
}) {
  return (
    <div className="space-y-6">
      <header><h1 className="text-3xl font-black tracking-tight">Fluxo</h1></header>
      <ChartCard title="Fluxo Soberano" description={`Para onde o seu reino flui — ${String(month).padStart(2, "0")}/${year}.`}>
        {mensal.totalEntrada === 0 ? <p className="text-secondary">Sem entradas no período selecionado.</p> : (
          <div className="h-[320px]" role="img" aria-label="Gráfico de sankey do fluxo mensal">
            <ResponsiveContainer width="100%" height="100%">
              <Sankey data={mensal.sankey as never} nodePadding={30} margin={{ left: 20, right: 20, top: 20, bottom: 20 }} />
            </ResponsiveContainer>
          </div>
        )}
        <div className="grid grid-cols-3 text-sm tabular-nums">
          <p>Entradas: {formatCurrency(mensal.totalEntrada)}</p>
          <p>Saídas: {formatCurrency(mensal.totalSaida)}</p>
          <p>Saldo: {formatCurrency(mensal.saldoMes)}</p>
        </div>
      </ChartCard>

      <div className="grid md:grid-cols-2 gap-4">
        <ChartCard title="Gastos por categoria">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mensal.donutCategorias} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88}>
                  {mensal.donutCategorias.map((_, index) => <Cell key={String(index)} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Evolução (6 meses)">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucao}>
                <XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line type="monotone" dataKey="saldo" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <footer>
        <Link className="text-primary underline" href={`/caixa?month=${month}&year=${year}`}>Abrir Caixa no mesmo período</Link>
      </footer>
    </div>
  );
}
