import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getAccounts } from "@/app/actions/accounts";
import ContasPageClient from "./ContasPageClient";

export const metadata = { title: "Contas" };

export default async function ContasPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const raw = await getAccounts();

  // Serialize Prisma Decimal → number before passing to Client Component
  const accounts = raw.map((a) => ({
    id:               a.id,
    name:             a.name,
    type:             a.type,
    balance:          Number(a.balance),
    color:            a.color,
    icon:             a.icon,
    creditLimit:      a.creditLimit != null ? Number(a.creditLimit) : null,
    invoiceClosingDay: a.invoiceClosingDay,
    invoiceDueDay:    a.invoiceDueDay,
  }));

  return <ContasPageClient accounts={accounts} />;
}
