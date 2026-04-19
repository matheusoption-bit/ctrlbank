import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateMonthlyDossierArtifact } from "@/lib/artifacts/service";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { year?: number; month?: number };

  const now = new Date();
  const year = body.year ?? now.getFullYear();
  const month = body.month ?? now.getMonth() + 1;

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { householdId: true } });
  if (!dbUser?.householdId) return NextResponse.json({ error: "Usuário sem household" }, { status: 400 });

  const artifact = await generateMonthlyDossierArtifact({
    householdId: dbUser.householdId,
    userId: user.id,
    year,
    month,
  });

  return NextResponse.json({
    id: artifact.id,
    verificationToken: artifact.verificationToken,
    verificationUrl: (artifact.metadata as Record<string, unknown> | undefined)?.verificationUrl ?? null,
  });
}
