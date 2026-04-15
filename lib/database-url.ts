const RUNTIME_DATABASE_URL_KEYS = [
  "POSTGRES_PRISMA_URL",
  "DATABASE_URL",
  "POSTGRES_URL",
  "DATABASE_URL_UNPOOLED",
  "DIRECT_URL",
  "POSTGRES_URL_NON_POOLING",
] as const;

const MIGRATION_DATABASE_URL_KEYS = [
  "DIRECT_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
  "POSTGRES_PRISMA_URL",
  "DATABASE_URL",
  "POSTGRES_URL",
] as const;

type DatabaseUrlKey =
  | (typeof RUNTIME_DATABASE_URL_KEYS)[number]
  | (typeof MIGRATION_DATABASE_URL_KEYS)[number];

export interface ResolvedDatabaseUrl {
  key: DatabaseUrlKey;
  url: string;
}

export interface DatabaseDebugInfo {
  key: DatabaseUrlKey;
  host: string;
}

function pickDatabaseUrl(
  keys: readonly DatabaseUrlKey[],
  env: NodeJS.ProcessEnv
): ResolvedDatabaseUrl | null {
  for (const key of keys) {
    const rawValue = env[key];

    if (!rawValue) {
      continue;
    }

    const url = rawValue.trim();

    if (url.length === 0) {
      continue;
    }

    return { key, url };
  }

  return null;
}

function resolveDatabaseUrl(
  keys: readonly DatabaseUrlKey[],
  env: NodeJS.ProcessEnv,
  purpose: "runtime" | "migration"
): ResolvedDatabaseUrl {
  const resolved = pickDatabaseUrl(keys, env);

  if (!resolved) {
    throw new Error(
      `Missing database URL for ${purpose}. Set one of: ${keys.join(", ")}.`
    );
  }

  return resolved;
}

export function resolveRuntimeDatabaseUrl(
  env: NodeJS.ProcessEnv = process.env
): ResolvedDatabaseUrl {
  return resolveDatabaseUrl(RUNTIME_DATABASE_URL_KEYS, env, "runtime");
}

export function resolveMigrationDatabaseUrl(
  env: NodeJS.ProcessEnv = process.env
): ResolvedDatabaseUrl {
  return resolveDatabaseUrl(MIGRATION_DATABASE_URL_KEYS, env, "migration");
}

export function getDatabaseDebugInfo(
  resolved: ResolvedDatabaseUrl
): DatabaseDebugInfo {
  try {
    const parsed = new URL(resolved.url);
    return {
      key: resolved.key,
      host: parsed.host,
    };
  } catch {
    return {
      key: resolved.key,
      host: "invalid-url",
    };
  }
}
