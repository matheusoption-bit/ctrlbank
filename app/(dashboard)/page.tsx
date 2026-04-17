import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";

/**
 * Root Dashboard page – Server Component.
 * Redireciona para /saude, tornando-a a home canônica.
 */
export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  redirect("/saude");
}
