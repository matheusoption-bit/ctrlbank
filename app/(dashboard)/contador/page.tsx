import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getCounterSessions } from "@/app/actions/counter";
import ContadorPageClient from "./ContadorPageClient";

export default async function ContadorPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const { sessions, error } = await getCounterSessions();

  if (error) {
    return (
      <div className="p-10 text-center text-negative">
        <p>{error}</p>
      </div>
    );
  }

  return <ContadorPageClient sessions={sessions ?? []} />;
}
