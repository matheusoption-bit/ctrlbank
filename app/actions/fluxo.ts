"use server";

import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { scopeWhere } from "@/lib/security/scope";
import { getMonthBoundsUtc } from "@/lib/finance/period";

async function getCtx() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });
  return { userId: user.id, householdId: dbUser?.householdId ?? null };
}

export type FluxoMensal = {
  sankey: {
    nodes: Array<{ name: string }>;
    links: Array<{ source: number; target: number; value: number }>;
  };
  totalEntrada: number;
  totalSaida: number;
  saldoMes: number;
  donutCategorias: Array<{ name: string; value: number }>;
};

export type FluxoEvolucaoPoint = { month: string; entrada: number; saida: number; saldo: number };

export async function getFluxoMensal(month: number, year: number): Promise<FluxoMensal> {
  const ctx = await getCtx();
  const { start, endExclusive } = getMonthBoundsUtc(year, month);
  const txs = await prisma.transaction.findMany({
    where: {
      ...scopeWhere(ctx),
      status: "COMPLETED",
      ignoreInTotals: false,
      type: { not: "TRANSFER" },
      date: { gte: start, lt: endExclusive },
    },
    include: { category: true, bankAccount: true },
  });

  const totalEntrada = txs
    .filter((tx) => tx.type === "INCOME")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalSaida = txs
    .filter((tx) => tx.type === "EXPENSE")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const saldoMes = totalEntrada - totalSaida;

  const categoryTotals = new Map<string, number>();
  for (const tx of txs.filter((item) => item.type === "EXPENSE")) {
    const key = tx.category?.name ?? "Sem categoria";
    categoryTotals.set(key, (categoryTotals.get(key) ?? 0) + Number(tx.amount));
  }

  const categoryNames = Array.from(categoryTotals.keys());
  // Recharts Sankey trabalha com índices numéricos em nodes[].
  const nodes = [{ name: "Entradas" }, ...categoryNames.map((name) => ({ name })), { name: "Saldo" }];
  const saldoIndex = nodes.length - 1;
  const entradasIndex = 0;

  const links = [
    ...categoryNames.map((name, idx) => ({
      source: entradasIndex,
      target: idx + 1,
      value: categoryTotals.get(name) ?? 0,
    })),
    { source: entradasIndex, target: saldoIndex, value: Math.max(saldoMes, 0) },
  ].filter((link) => link.value > 0);

  return {
    sankey: { nodes, links },
    totalEntrada,
    totalSaida,
    saldoMes,
    donutCategorias: categoryNames.map((name) => ({ name, value: categoryTotals.get(name) ?? 0 })),
  };
}

export async function getFluxoEvolucao(meses = 6): Promise<FluxoEvolucaoPoint[]> {
  const now = new Date();
  const points: FluxoEvolucaoPoint[] = [];
  for (let i = meses - 1; i >= 0; i -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const data = await getFluxoMensal(date.getUTCMonth() + 1, date.getUTCFullYear());
    points.push({
      month: `${String(date.getUTCMonth() + 1).padStart(2, "0")}/${date.getUTCFullYear()}`,
      entrada: data.totalEntrada,
      saida: data.totalSaida,
      saldo: data.saldoMes,
    });
  }
  return points;
}
