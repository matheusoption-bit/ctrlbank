import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

  // Check if monthly check has been viewed for notification badge
  let familyBadge = false;
  let hasHouseholdTeam = false;
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { householdId: true, role: true },
    });

    if (dbUser?.householdId) {
      const householdMembersCount = await prisma.user.count({
        where: { householdId: dbUser.householdId },
      });
      hasHouseholdTeam = householdMembersCount > 1;
    }

    if (dbUser?.householdId && dbUser.role === "ADMIN") {
      const now = new Date();
      const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      const viewExists = await prisma.monthlyCheckView.findFirst({
        where: {
          householdId: dbUser.householdId,
          month: currentMonthStr,
          userId: user.id,
        },
      });

      familyBadge = !viewExists;
    }
  } catch {
    // Non-critical - don't break layout
  }

  const aiEnabled = !!process.env.GEMINI_API_KEY;

  return (
    <DashboardLayoutClient
      userName={user.name}
      familyBadge={familyBadge}
      hasHouseholdTeam={hasHouseholdTeam}
    >
      {children}
      {aiEnabled && <AIChatWidget />}
    </DashboardLayoutClient>
  );
}
