import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { lucia } from "@/lib/auth";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    const response = NextResponse.json(
      { message: "Login realizado com sucesso", user: { id: user.id, email: user.email } },
      { status: 200 }
    );

    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}
