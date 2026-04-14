import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { lucia } from "@/lib/auth";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "A senha deve ter pelo menos 6 caracteres" },
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
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        name: name || undefined,
      },
    });

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    const response = NextResponse.json(
      { message: "Conta criada com sucesso", user: { id: user.id, email: user.email } },
      { status: 201 }
    );

    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Erro ao criar conta" },
      { status: 500 }
    );
  }
}
