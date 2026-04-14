import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";
import { prisma } from "./prisma";
import { SESSION_COOKIE_NAME } from "./constants";
import { signToken, verifySignedToken } from "./session-utils";

const SESSION_EXPIRY_DAYS = 30;

export { SESSION_COOKIE_NAME };

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
 *
 * Security notes:
 * - The raw token is HMAC-SHA256 signed with SESSION_SECRET before being
 *   stored in the cookie, preventing cookie forgery at the middleware layer.
 * - Only the SHA-256 hash of the raw token is stored in the database, so a
 *   database leak cannot be used to replay sessions directly.
 */
export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const signedCookieValue = await signToken(token);
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
  cookieStore.set(SESSION_COOKIE_NAME, signedCookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // "strict" prevents the cookie from being sent on any cross-site request,
    // which is appropriate for a financial application.
    sameSite: "strict",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    path: "/",
  });

  return token;
}

/**
 * Validate the current session by reading the cookie, verifying its HMAC
 * signature, hashing the raw token, and performing a single database query
 * that includes the associated user.
 *
 * Returns both the session and user, or nulls if not authenticated.
 *
 * Note: if the database is unavailable this function returns
 * { user: null, session: null } (fail-open for read operations). Callers
 * protecting write operations should surface a 503 response in that case.
 */
export async function validateSession(): Promise<{
  user: SessionUser | null;
  session: Session | null;
}> {
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!cookieValue) {
      return { user: null, session: null };
    }

    // Verify HMAC signature before hitting the database
    const token = await verifySignedToken(cookieValue);
    if (!token) {
      cookieStore.delete(SESSION_COOKIE_NAME);
      return { user: null, session: null };
    }

    const tokenHash = hashSessionToken(token);
    const sessionRecord = await prisma.session.findUnique({
      where: { id: tokenHash },
      include: { user: true },
    });

    if (!sessionRecord || sessionRecord.expiresAt < new Date()) {
      if (sessionRecord) {
        await prisma.session.delete({ where: { id: tokenHash } }).catch((e) => {
          console.error("Failed to delete expired session:", e);
        });
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
 * Invalidate a specific session by its raw (unhashed) token and clear the
 * session cookie.
 *
 * The token is hashed internally before the database lookup so callers should
 * always pass the raw token, never the hash.
 */
export async function invalidateSession(rawToken: string): Promise<void> {
  const tokenHash = hashSessionToken(rawToken);
  await prisma.session.delete({ where: { id: tokenHash } }).catch((e) => {
    console.error("Failed to delete session during invalidation:", e);
  });
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error("Error clearing session cookie:", error);
  }
}

/**
 * Logout the current user by invalidating the session associated with the
 * current request cookie.
 */
export async function logout(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (cookieValue) {
      // Extract raw token from signed cookie value before hashing
      const token = await verifySignedToken(cookieValue);
      if (token) {
        const tokenHash = hashSessionToken(token);
        await prisma.session.delete({ where: { id: tokenHash } }).catch((e) => {
          console.error("Failed to delete session during logout:", e);
        });
      }
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
