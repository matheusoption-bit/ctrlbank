import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { calculateHealthScore } from "@/lib/finance/health";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    // Always derive householdId from the authenticated user to prevent
    // access to other households via query-string tampering.
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { householdId: true }
    });
    const householdId = dbUser?.householdId || null;

    if (!householdId) {
      return NextResponse.json(
        { message: "Household não encontrado" },
        { status: 400 }
      );
    }

    const response = await calculateHealthScore(householdId);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Error calculating health score:", error);
    return NextResponse.json(
      { message: "Erro ao calcular score de saúde" },
      { status: 500 }
    );
  }
}
