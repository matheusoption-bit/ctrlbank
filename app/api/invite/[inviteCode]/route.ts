import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { inviteCode: string } }
) {
  const code = params.inviteCode.toUpperCase();
  
  // Verifica se o código é válido
  const household = await prisma.household.findUnique({
    where: { inviteCode: code },
  });

  if (!household) {
    return NextResponse.redirect(new URL("/?error=invalid_invite", req.url));
  }

  // Verifica se o usuário está logado
  const { user } = await validateRequest();

  if (!user) {
    // Se não estiver logado, redireciona para login/registro passando o código
    return NextResponse.redirect(new URL(`/login?invite=${code}`, req.url));
  }

  // Se estiver logado, junta ao household
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  
  if (dbUser?.householdId === household.id) {
    return NextResponse.redirect(new URL("/familia?msg=already_in", req.url));
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      householdId: household.id,
      role: "VIEWER", 
    },
  });

  return NextResponse.redirect(new URL("/familia?success=joined", req.url));
}
