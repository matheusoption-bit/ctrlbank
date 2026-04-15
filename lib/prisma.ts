import { PrismaClient } from "@prisma/client";
import { getDatabaseDebugInfo, resolveRuntimeDatabaseUrl } from "./database-url";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const { key: runtimeDatabaseUrlKey, url: runtimeDatabaseUrl } =
  resolveRuntimeDatabaseUrl();
const runtimeDatabaseDebugInfo = getDatabaseDebugInfo({
  key: runtimeDatabaseUrlKey,
  url: runtimeDatabaseUrl,
});

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

console.info(
  `[prisma] Using ${runtimeDatabaseDebugInfo.key} (${runtimeDatabaseDebugInfo.host}) for database access.`
);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function getRuntimeDatabaseDebugInfo() {
  return runtimeDatabaseDebugInfo;
}
