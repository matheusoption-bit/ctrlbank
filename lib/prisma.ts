import { PrismaClient } from "@prisma/client";
import { resolveRuntimeDatabaseUrl } from "./database-url";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const { key: runtimeDatabaseUrlKey, url: runtimeDatabaseUrl } =
  resolveRuntimeDatabaseUrl();

process.env.DATABASE_URL = runtimeDatabaseUrl;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: runtimeDatabaseUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (
  process.env.NODE_ENV !== "production" &&
  runtimeDatabaseUrlKey !== "DATABASE_URL"
) {
  console.info(`[prisma] Using ${runtimeDatabaseUrlKey} for database access.`);
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
