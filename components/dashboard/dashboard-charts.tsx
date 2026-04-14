"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/currency";

interface ChartDataPoint {
  month: string;
  income: number;
  expense: number;
}

interface DashboardChartsProps {
  data: ChartDataPoint[];
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <section className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <div>
          <h3 className="text-lg font-semibold">Evolução Mensal</h3>
          <p className="text-secondary text-xs mt-0.5">Receitas vs Despesas</p>
        </div>
      </div>

      <div className="card-premium h-[280px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00C853" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00C853" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF3B5C" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#FF3B5C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1A1A1E"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#A1A1AA"
              style={{ fontSize: "11px" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#A1A1AA"
              style={{ fontSize: "11px" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1C1C1E",
                border: "1px solid #2A2A2E",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                padding: "10px 14px",
                fontSize: "13px",
              }}
              labelStyle={{ color: "#FFFFFF", fontWeight: "600", marginBottom: "4px" }}
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === "income" ? "Receitas" : "Despesas",
              ]}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#00C853"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#incomeGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#00C853", strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#FF3B5C"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#expenseGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#FF3B5C", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
