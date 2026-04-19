import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ inviteCode: string }> }
) {
  const { inviteCode } = await params;
  const code = inviteCode.toUpperCase();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = await enforceRateLimit({
    key: `invite:route:${ip}:${code}`,
    limit: 30,
    windowSeconds: 60 * 30,
  });
  if (!limit.allowed) {
    return NextResponse.redirect(new URL("/?error=rate_limited", req.url));
  }
  
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
      role: "MEMBER", 
    },
  });

  return NextResponse.redirect(new URL("/familia?success=joined", req.url));
}
