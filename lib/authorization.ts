import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export interface AuthorizedUser {
  id: string;
  email: string;
  name: string | null;
  householdId: string | null;
  role: UserRole;
}

/**
 * Get the full authenticated user context including householdId and role.
 * Throws if not authenticated or user not found.
 */
export async function getAuthorizedUser(): Promise<AuthorizedUser> {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, name: true, householdId: true, role: true },
  });
  if (!fullUser) throw new Error("Usuário não encontrado");

  return fullUser;
}

/**
 * Check if the user can perform write operations (POST/PUT/DELETE).
 * VIEWERs cannot write. Returns true if allowed.
 */
export function canWrite(role: UserRole): boolean {
  return role !== UserRole.VIEWER;
}

/**
 * Check if the user is an ADMIN.
 */
export function isAdmin(role: UserRole): boolean {
  return role === UserRole.ADMIN;
}

/**
 * Check if a resource belongs to the user's household.
 * Prevents cross-household access.
 */
export function belongsToHousehold(
  resourceHouseholdId: string | null,
  userHouseholdId: string | null
): boolean {
  if (!resourceHouseholdId || !userHouseholdId) return false;
  return resourceHouseholdId === userHouseholdId;
}

/**
 * Validate that the authenticated user has write permission.
 * Returns the authorized user or throws/returns error.
 */
export async function requireWriteAccess(): Promise<AuthorizedUser> {
  const user = await getAuthorizedUser();
  if (!canWrite(user.role)) {
    throw new Error("Permissão negada: somente leitura");
  }
  return user;
}

/**
 * Validate that the authenticated user is an ADMIN.
 */
export async function requireAdmin(): Promise<AuthorizedUser> {
  const user = await getAuthorizedUser();
  if (!isAdmin(user.role)) {
    throw new Error("Permissão negada: apenas administradores");
  }
  return user;
}
