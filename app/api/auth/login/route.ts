import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { getRuntimeDatabaseDebugInfo } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";
export const preferredRegion = "gru1";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || email.length < 3 || email.length > 255) {
      return NextResponse.json(
        { message: "Email inválido" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 1 || password.length > 255) {
      return NextResponse.json(
        { message: "Senha inválida" },
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
    const passwordMatch = await compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    // Create session (sets the session cookie internally)
    await createSession(user.id);

    return NextResponse.json(
      {
        message: "Login realizado com sucesso",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientInitializationError
    ) {
      console.error("Database error during login:", {
        database: getRuntimeDatabaseDebugInfo(),
        name: error.name,
        code: "code" in error ? error.code : undefined,
        message: error.message,
      });
      return NextResponse.json(
        { message: "Serviço temporariamente indisponível. Tente novamente." },
        { status: 503 }
      );
    }
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Erro ao fazer login. Tente novamente." },
      { status: 500 }
    );
  }
}
