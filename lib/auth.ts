import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";
import { prisma } from "./prisma";

export const SESSION_COOKIE_NAME = "ctrlbank_session";
const SESSION_EXPIRY_DAYS = 30;

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Create a new session for a user and set the session cookie.
 * The token is hashed before being stored in the database so that a
 * database leak cannot be used to replay sessions.
 */
export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  await prisma.session.create({
    data: {
      id: tokenHash,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    path: "/",
  });

  return token;
}

/**
 * Validate the current session by reading the cookie, hashing the token,
 * and performing a single database query that includes the user.
 * Returns both the session and user, or nulls if not authenticated.
 */
export async function validateSession(): Promise<{
  user: SessionUser | null;
  session: Session | null;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return { user: null, session: null };
    }

    const tokenHash = hashSessionToken(token);
    const sessionRecord = await prisma.session.findUnique({
      where: { id: tokenHash },
      include: { user: true },
    });

    if (!sessionRecord || sessionRecord.expiresAt < new Date()) {
      if (sessionRecord) {
        await prisma.session.delete({ where: { id: tokenHash } }).catch(() => {});
      }
      cookieStore.delete(SESSION_COOKIE_NAME);
      return { user: null, session: null };
    }

    return {
      user: {
        id: sessionRecord.user.id,
        email: sessionRecord.user.email,
        name: sessionRecord.user.name,
      },
      session: {
        id: sessionRecord.id,
        userId: sessionRecord.userId,
        expiresAt: sessionRecord.expiresAt,
      },
    };
  } catch (error) {
    console.error("Error validating session:", error);
    return { user: null, session: null };
  }
}

/**
 * Get the current authenticated user.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const { user } = await validateSession();
  return user;
}

/**
 * Invalidate the specified session and clear the session cookie.
 */
export async function invalidateSession(sessionId: string): Promise<void> {
  try {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error("Error invalidating session:", error);
  }
}

/**
 * Logout the current user by invalidating the session from the cookie.
 */
export async function logout(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      const tokenHash = hashSessionToken(token);
      await prisma.session.delete({ where: { id: tokenHash } }).catch(() => {});
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

/**
 * Backwards-compatible alias for validateSession.
 * Prefer using validateSession directly in new code.
 */
export async function validateRequest() {
  return validateSession();
}
