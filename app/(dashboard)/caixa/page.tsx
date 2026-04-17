import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getCashboxOverview, getCashboxTimeline } from "@/app/actions/cashbox";
import CaixaPageClient from "./CaixaPageClient";

export default async function CaixaPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const [overview, timeline] = await Promise.all([
    getCashboxOverview(),
    getCashboxTimeline(50),
  ]);
  const safeOverview = {
    ...overview,
    totalBalance: Number(overview.totalBalance),
    accounts: overview.accounts.map(acc => ({
      ...acc,
      balance: Number(acc.balance),
      user: {
        ...acc.user,
        name: acc.user.name || "Desconhecido"
      }
    }))
  };

  const safeTimeline = timeline.map(tx => ({
    ...tx,
    amount: Number(tx.amount),
    description: tx.description || "Transação",
    user: tx.user ? { ...tx.user, name: tx.user.name || "Desconhecido" } : null
  }));

  return <CaixaPageClient overview={safeOverview} timeline={safeTimeline} />;
}
