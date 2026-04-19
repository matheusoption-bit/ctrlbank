import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { hashOpaqueToken } from "@/lib/security/crypto";
import { signToken, verifySignedToken } from "@/lib/session-utils";

const COOKIE_NAME = "ctrlbank_auth_challenge";
const TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

export async function createLogin2FAChallenge(userId: string, ip: string | null, userAgent: string | null) {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashOpaqueToken(rawToken);
  const expiresAt = new Date(Date.now() + TTL_MINUTES * 60_000);

  await prisma.authChallenge.create({
    data: {
      userId,
      tokenHash,
      purpose: "LOGIN_2FA",
      expiresAt,
      ip,
      userAgent,
      attempts: 0,
    },
  });

  const signed = await signToken(rawToken);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: TTL_MINUTES * 60,
  });
}

export async function clearLogin2FAChallenge() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getLogin2FAChallenge() {
  const cookieStore = await cookies();
  const signed = cookieStore.get(COOKIE_NAME)?.value;
  if (!signed) return null;
  const rawToken = await verifySignedToken(signed);
  if (!rawToken) return null;

  const challenge = await prisma.authChallenge.findUnique({
    where: { tokenHash: hashOpaqueToken(rawToken) },
  });

  return challenge;
}

export const loginChallengeMaxAttempts = MAX_ATTEMPTS;
