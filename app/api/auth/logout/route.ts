import { NextRequest, NextResponse } from "next/server";
import { validateRequest, lucia } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return NextResponse.json(
        { message: "Não autenticado" },
        { status: 401 }
      );
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    const response = NextResponse.json(
      { message: "Logout realizado com sucesso" },
      { status: 200 }
    );

    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Erro ao fazer logout" },
      { status: 500 }
    );
  }
}
