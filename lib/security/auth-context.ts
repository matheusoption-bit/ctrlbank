import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";

export class ServiceUnavailableError extends Error {
  status = 503;
  constructor(message = "Serviço temporariamente indisponível") {
    super(message);
    this.name = "ServiceUnavailableError";
  }
}

export async function requireAuthenticatedUser() {
  const { user } = await validateSession();
  if (!user) throw new Error("Não autenticado");
  return user;
}

export async function requireWriteContext() {
  const user = await requireAuthenticatedUser();
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, role: true, householdId: true },
    });

    if (!dbUser) throw new Error("Usuário não encontrado");
    return dbUser;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientInitializationError
    ) {
      throw new ServiceUnavailableError();
    }
    throw error;
  }
}
