import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { hash } from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

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
      where: { email },
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
        email,
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
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Erro ao criar conta. Tente novamente." },
      { status: 500 }
    );
  }
}
