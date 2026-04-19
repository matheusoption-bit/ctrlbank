"use server";

import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { scopeWhere } from "@/lib/security/scope";
import { getMonthBoundsUtc } from "@/lib/finance/period";

async function getCtx() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { householdId: true } });
  return { userId: user.id, householdId: dbUser?.householdId ?? null };
}

export async function getFluxoMensal(month: number, year: number) {
  const ctx = await getCtx();
  const { start, endExclusive } = getMonthBoundsUtc(year, month);
  const txs = await prisma.transaction.findMany({
    where: { ...scopeWhere(ctx), status: "COMPLETED", ignoreInTotals: false, type: { not: "TRANSFER" }, date: { gte: start, lt: endExclusive } },
    include: { category: true, bankAccount: true },
  });

  const totalEntrada = txs.filter((tx) => tx.type === "INCOME").reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalSaida = txs.filter((tx) => tx.type === "EXPENSE").reduce((sum, tx) => sum + Number(tx.amount), 0);
  const saldoMes = totalEntrada - totalSaida;

  const categoryTotals = new Map<string, number>();
  for (const tx of txs.filter((item) => item.type === "EXPENSE")) {
    const key = tx.category?.name ?? "Sem categoria";
    categoryTotals.set(key, (categoryTotals.get(key) ?? 0) + Number(tx.amount));
  }

  return {
    sankey: {
      nodes: [{ name: "Entradas" }, ...Array.from(categoryTotals.keys()).map((name) => ({ name } as const)), { name: "Saldo" }],
      links: [
        ...Array.from(categoryTotals.entries()).map(([name, value]) => ({ source: "Entradas", target: name, value })),
        { source: "Entradas", target: "Saldo", value: Math.max(saldoMes, 0) },
      ],
    },
    totalEntrada,
    totalSaida,
    saldoMes,
    donutCategorias: Array.from(categoryTotals.entries()).map(([name, value]) => ({ name, value })),
  };
}

export async function getFluxoEvolucao(meses = 6) {
  const now = new Date();
  const points = [] as Array<{ month: string; entrada: number; saida: number; saldo: number }>;
  for (let i = meses - 1; i >= 0; i -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const data = await getFluxoMensal(date.getUTCMonth() + 1, date.getUTCFullYear());
    points.push({ month: `${String(date.getUTCMonth() + 1).padStart(2, "0")}/${date.getUTCFullYear()}`, entrada: data.totalEntrada, saida: data.totalSaida, saldo: data.saldoMes });
  }
  return points;
}
