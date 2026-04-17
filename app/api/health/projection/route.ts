import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedUser } from "@/lib/authorization";
import { calculateProjection } from "@/lib/finance/health";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthorizedUser();
    const householdId = authUser.householdId;

    if (!householdId) {
      return NextResponse.json(
        { message: "Household não encontrado" },
        { status: 400 }
      );
    }

    const response = await calculateProjection(householdId);
    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {
    if (error?.message === "Não autenticado" || error?.message === "Usuário não encontrado") {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    console.error("Error calculating cash flow projection:", error);
    return NextResponse.json(
      { message: "Erro ao calcular projeção de caixa" },
      { status: 500 }
    );
  }
}
