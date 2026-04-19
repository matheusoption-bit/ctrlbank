import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { getRuntimeDatabaseDebugInfo } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const preferredRegion = "gru1";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const rate = await enforceRateLimit({
      key: `auth:register:${ip}:${normalizedEmail || "unknown"}`,
      limit: 5,
      windowSeconds: 60 * 30,
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { message: "Muitas tentativas. Aguarde antes de cadastrar." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
      );
    }

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

    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
      return NextResponse.json(
        { message: "A senha deve ter entre 6 e 255 caracteres" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Este email já está registrado" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password_hash: passwordHash,
        name: name && typeof name === "string" ? name : null,
      },
    });

    // Create session (sets the session cookie internally)
    await createSession(user.id);

    return NextResponse.json(
      {
        message: "Conta criada com sucesso",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientInitializationError
    ) {
      console.error("Database error during registration:", {
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
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Erro ao criar conta. Tente novamente." },
      { status: 500 }
    );
  }
}
