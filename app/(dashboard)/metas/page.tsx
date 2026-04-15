import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getGoals } from "@/app/actions/goals";
import MetasPageClient from "./MetasPageClient";

export const metadata = { title: "Metas" };

export default async function MetasPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const raw = await getGoals();

  // Serialize Prisma Decimal → number, Date → ISO string
  const goals = raw.map((g) => ({
    id:            g.id,
    name:          g.name,
    targetAmount:  Number(g.targetAmount),
    currentAmount: Number(g.currentAmount),
    deadline:      g.deadline?.toISOString() ?? null,
    icon:          g.icon,
    color:         g.color,
    completed:     g.completed,
  }));

  return <MetasPageClient goals={goals} />;
}
