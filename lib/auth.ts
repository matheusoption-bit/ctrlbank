import { cookies } from "next/headers";
import { prisma } from "./prisma";
import * as bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const SESSION_COOKIE_NAME = "ctrlbank_session";
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

/**
 * Backwards-compatible wrapper for callers that still import the old API.
 * This can be removed once all usages have been migrated to `validateSession`.
 */
export const validateRequest = cache(async () => {
  return validateSession();
});

/**
 * Minimal Lucia-compatible surface for existing callers.
 * This preserves the old exports while delegating to the new session API.
 */
export const lucia = {
  createSession: async (...args: unknown[]) => {
    return (createSession as (...args: unknown[]) => unknown)(...args);
  },
  invalidateSession: async (...args: unknown[]) => {
    return (logout as (...args: unknown[]) => unknown)(...args);
  },
  createSessionCookie: (sessionId: string) => ({
    name: SESSION_COOKIE_NAME,
    value: sessionId,
    attributes: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(
        Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
      ),
    },
  }),
  createBlankSessionCookie: () => ({
    name: SESSION_COOKIE_NAME,
    value: "",
    attributes: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    },
  }),
} as const;

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a random session token
 */
function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Create a new session for a user
 */
export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  await prisma.session.create({
    data: {
      id: token,
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
 * Get the current user from the session
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const session = await prisma.session.findUnique({
      where: { id: token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: token } });
      }
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Validate the current session
 */
export async function validateSession(): Promise<{
  user: SessionUser | null;
  session: Session | null;
}> {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, session: null };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return { user: null, session: null };
    }

    const session = await prisma.session.findUnique({
      where: { id: token },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: token } });
      }
      cookieStore.delete(SESSION_COOKIE_NAME);
      return { user: null, session: null };
    }

    return {
      user,
      session: {
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
      },
    };
  } catch (error) {
    console.error("Error validating session:", error);
    return { user: null, session: null };
  }
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await prisma.session.delete({ where: { id: token } }).catch(() => {
        // Session might already be deleted
      });
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

/**
 * Backwards-compatible wrapper for validateRequest (old Lucia API)
 * This can be removed once all usages have been migrated to validateSession
 */
export async function validateRequest() {
  return validateSession();
}

/**
 * Minimal Lucia-compatible surface for existing callers
 * This preserves the old exports while delegating to the new session API
 */
export const lucia = {
  sessionCookieName: () => SESSION_COOKIE_NAME,
  createSession: createSession,
  invalidateSession: logout,
  createSessionCookie: (sessionId: string) => ({
    name: SESSION_COOKIE_NAME,
    value: sessionId,
    attributes: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
    },
  }),
  createBlankSessionCookie: () => ({
    name: SESSION_COOKIE_NAME,
    value: "",
    attributes: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    },
  }),
} as const;
