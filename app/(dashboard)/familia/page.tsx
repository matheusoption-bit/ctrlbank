import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getHouseholdMembers, hasMonthlyCheckBeenViewed } from "@/app/actions/household";
import FamiliaPageClient from "./FamiliaPageClient";

export const metadata = { title: "Família" };

export default async function FamiliaPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const fullUser = await import("@/lib/prisma").then(({ prisma }) =>
    prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, householdId: true, role: true, name: true, email: true },
    })
  );

  const { members, household, inviteCode } = await getHouseholdMembers();

  // Check if monthly check has been viewed
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthlyCheckViewed = await hasMonthlyCheckBeenViewed(currentMonthStr);

  return (
    <FamiliaPageClient
      currentUser={{
        id: fullUser?.id ?? user.id,
        name: fullUser?.name ?? user.name,
        email: fullUser?.email ?? user.email,
        role: fullUser?.role ?? "ADMIN",
        householdId: fullUser?.householdId ?? null,
      }}
      members={members}
      household={household ? { id: household.id, name: household.name } : null}
      inviteCode={inviteCode}
      monthlyCheckViewed={monthlyCheckViewed}
    />
  );
}
