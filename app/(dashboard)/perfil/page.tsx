import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PerfilPageClient from "./PerfilPageClient";

export const metadata = { title: "Perfil" };

export default async function PerfilPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true, name: true, email: true, role: true,
      createdAt: true, totpEnabled: true,
      household: { select: { id: true, name: true, inviteCode: true } },
    },
  });

  if (!fullUser) redirect("/login");

  return (
    <PerfilPageClient
      user={{
        ...fullUser,
        createdAt: fullUser.createdAt.toISOString(),
      }}
    />
  );
}
