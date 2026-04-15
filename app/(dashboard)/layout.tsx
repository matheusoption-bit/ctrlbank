import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import DashboardLayoutClient from "@/components/layout/DashboardLayoutClient";
import AIChatWidget from "@/components/chat/AIChatWidget";

/**
 * Dashboard Layout – Server Component
 *
 * Valida sessão no servidor antes de renderizar qualquer filho.
 * Passa apenas dados seguros (nome do usuário) para o client component.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, session } = await validateRequest();

  if (!user || !session) {
    redirect("/login");
  }

  const aiEnabled = !!process.env.GROQ_API_KEY;

  return (
    <DashboardLayoutClient userName={user.name}>
      {children}
      {aiEnabled && <AIChatWidget />}
    </DashboardLayoutClient>
  );
}
