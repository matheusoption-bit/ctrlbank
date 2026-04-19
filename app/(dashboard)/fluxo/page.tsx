import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getFluxoEvolucao, getFluxoMensal } from "@/app/actions/fluxo";
import FluxoPageClient from "./FluxoPageClient";

export const metadata = { title: "Fluxo" };

export default async function FluxoPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; range?: string }>;
}) {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const params = await searchParams;
  const now = new Date();
  const month = Number(params.month ?? now.getMonth() + 1);
  const year = Number(params.year ?? now.getFullYear());

  const [mensal, evolucao] = await Promise.all([
    getFluxoMensal(month, year),
    getFluxoEvolucao(Number(params.range ?? 6)),
  ]);

  return <FluxoPageClient month={month} year={year} mensal={mensal} evolucao={evolucao} />;
}
