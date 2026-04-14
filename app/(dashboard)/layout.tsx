import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { validateSession } from "@/lib/auth";
import { initializeHousehold } from "@/lib/actions/household.actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateSession();

  if (!user) {
    redirect("/login");
  }

  // Assegura que o household existe para o usuário logado
  await initializeHousehold();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar Desktop */}
      <Sidebar />

      <div className="flex-1 flex flex-col w-full pb-18 md:pb-0">
        {/* Header Mobile */}
        <Header userName={user.name} />

        <main className="flex-1 w-full max-w-4xl mx-auto px-5 py-6 md:px-10 md:py-8">
          {children}
        </main>

        {/* Bottom Nav Mobile */}
        <BottomNav />
      </div>
    </div>
  );
}
