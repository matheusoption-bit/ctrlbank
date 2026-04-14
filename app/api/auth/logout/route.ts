import { NextResponse } from "next/server";
import { validateSession, logout } from "@/lib/auth";

export async function POST() {
  try {
    const { session } = await validateSession();

    if (!session) {
      return NextResponse.json(
        { message: "Não autenticado" },
        { status: 401 }
      );
    }

    await logout();

    return NextResponse.json(
      { message: "Logout realizado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Erro ao fazer logout" },
      { status: 500 }
    );
  }
}
