import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import IntegracoesPageClient from "./IntegracoesPageClient";

export const metadata = { title: "Integrações" };

export default async function IntegracoesPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true, role: true },
  });

  const connections = dbUser?.householdId
    ? await prisma.bankConnection.findMany({
        where: { householdId: dbUser.householdId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <IntegracoesPageClient
      connections={connections.map((c) => ({
        id: c.id,
        provider: c.provider,
        externalId: c.externalId,
        status: c.status,
        lastSyncAt: c.lastSyncAt?.toISOString() ?? null,
        createdAt: c.createdAt.toISOString(),
      }))}
      isAdmin={dbUser?.role === "ADMIN"}
    />
  );
}
