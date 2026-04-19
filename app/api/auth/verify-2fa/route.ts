import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verify2FACodeForUser } from "@/lib/security/totp";
import { clearLogin2FAChallenge, getLogin2FAChallenge, loginChallengeMaxAttempts } from "@/lib/security/auth-challenge";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (typeof code !== "string" || !/^\d{6}$/.test(code.trim())) {
      return NextResponse.json({ message: "Código inválido" }, { status: 400 });
    }

    const challenge = await getLogin2FAChallenge();
    if (!challenge || challenge.purpose !== "LOGIN_2FA") {
      return NextResponse.json({ message: "Desafio inválido" }, { status: 401 });
    }

    const rate = await enforceRateLimit({
      key: `auth:2fa:${ip}:${challenge.id}`,
      limit: loginChallengeMaxAttempts,
      windowSeconds: 60 * 10,
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { message: "Muitas tentativas de código. Aguarde para tentar novamente." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
      );
    }

    if (challenge.expiresAt < new Date()) {
      await clearLogin2FAChallenge();
      return NextResponse.json({ message: "Desafio expirado" }, { status: 401 });
    }

    if (challenge.consumedAt) {
      await clearLogin2FAChallenge();
      return NextResponse.json({ message: "Desafio já utilizado" }, { status: 409 });
    }

    if (challenge.attempts >= loginChallengeMaxAttempts) {
      return NextResponse.json({ message: "Desafio bloqueado temporariamente" }, { status: 429 });
    }

    const valid = await verify2FACodeForUser(challenge.userId, code.trim());
    if (!valid) {
      await prisma.authChallenge.update({
        where: { id: challenge.id },
        data: { attempts: { increment: 1 } },
      });
      return NextResponse.json({ message: "Código inválido" }, { status: 401 });
    }

    await prisma.authChallenge.update({
      where: { id: challenge.id },
      data: { consumedAt: new Date() },
    });

    await createSession(challenge.userId);
    await clearLogin2FAChallenge();

    return NextResponse.json({ message: "2FA validado com sucesso", success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientInitializationError
    ) {
      return NextResponse.json({ message: "Serviço temporariamente indisponível" }, { status: 503 });
    }

    console.error("verify-2fa error", error);
    return NextResponse.json({ message: "Erro ao validar segundo fator" }, { status: 500 });
  }
}
