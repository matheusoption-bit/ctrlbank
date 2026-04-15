import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const PRISMA_MIGRATE_MAX_ATTEMPTS = 3;
const PRISMA_MIGRATE_RETRY_DELAY_MS = 5000;

const runtimeDatabaseUrlKeys = [
  "POSTGRES_PRISMA_URL",
  "DATABASE_URL",
  "POSTGRES_URL",
  "DATABASE_URL_UNPOOLED",
  "DIRECT_URL",
  "POSTGRES_URL_NON_POOLING",
];

const migrationDatabaseUrlKeys = [
  "DIRECT_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
  "POSTGRES_PRISMA_URL",
  "DATABASE_URL",
  "POSTGRES_URL",
];

function loadEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);

  if (!existsSync(filePath)) {
    return;
  }

  const contents = readFileSync(filePath, "utf8");

  for (const line of contents.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    let value = trimmedLine.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function loadLocalEnvFiles() {
  loadEnvFile(".env");
  loadEnvFile(".env.production");
  loadEnvFile(".env.local");
  loadEnvFile(".env.production.local");
}

function resolveDatabaseUrl(keys, purpose) {
  for (const key of keys) {
    const value = process.env[key]?.trim();

    if (value) {
      return { key, url: value };
    }
  }

  throw new Error(
    `Missing database URL for ${purpose}. Set one of: ${keys.join(", ")}.`
  );
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["inherit", "pipe", "pipe"],
      shell: process.platform === "win32",
      env: process.env,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdout += text;
      process.stdout.write(text);
    });

    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      process.stderr.write(text);
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      const error = new Error(
        `${command} ${args.join(" ")} exited with code ${code}.`
      );
      error.stdout = stdout;
      error.stderr = stderr;
      reject(error);
    });
  });
}

function isPrismaAdvisoryLockTimeout(error) {
  const output = `${error?.stdout ?? ""}\n${error?.stderr ?? ""}\n${error?.message ?? ""}`;
  return output.includes("P1002") && output.includes("pg_advisory_lock");
}

async function runPrismaMigrateDeploy() {
  for (let attempt = 1; attempt <= PRISMA_MIGRATE_MAX_ATTEMPTS; attempt += 1) {
    try {
      await run(npxCommand, ["prisma", "migrate", "deploy"]);
      return;
    } catch (error) {
      const shouldRetry =
        attempt < PRISMA_MIGRATE_MAX_ATTEMPTS && isPrismaAdvisoryLockTimeout(error);

      if (!shouldRetry) {
        throw error;
      }

      console.warn(
        `[build] Prisma migrate deploy hit an advisory lock timeout. Retrying in ${PRISMA_MIGRATE_RETRY_DELAY_MS / 1000}s (attempt ${attempt + 1}/${PRISMA_MIGRATE_MAX_ATTEMPTS}).`
      );
      await wait(PRISMA_MIGRATE_RETRY_DELAY_MS);
    }
  }
}

async function hasPendingPrismaMigrations() {
  const result = await run(npxCommand, [
    "prisma",
    "migrate",
    "status",
    "--schema",
    "prisma/schema.prisma",
  ]);
  const output = `${result.stdout}\n${result.stderr}`;

  if (output.includes("Database schema is up to date!")) {
    return false;
  }

  if (
    output.includes("Following migration(s) have not yet been applied") ||
    output.includes("Following migrations have not yet been applied")
  ) {
    return true;
  }

  console.warn(
    "[build] Could not confidently determine migration status. Running prisma migrate deploy as a fallback."
  );
  return true;
}

const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

async function main() {
  loadLocalEnvFiles();

  const migrationUrl = resolveDatabaseUrl(
    migrationDatabaseUrlKeys,
    "migration"
  );
  process.env.DATABASE_URL = migrationUrl.url;
  console.log(`[build] Using ${migrationUrl.key} for Prisma migrations.`);
  const hasPendingMigrations = await hasPendingPrismaMigrations();

  if (hasPendingMigrations) {
    await runPrismaMigrateDeploy();
  } else {
    console.log("[build] No pending Prisma migrations. Skipping migrate deploy.");
  }

  const runtimeUrl = resolveDatabaseUrl(runtimeDatabaseUrlKeys, "runtime");
  process.env.DATABASE_URL = runtimeUrl.url;
  console.log(`[build] Using ${runtimeUrl.key} for Next.js build.`);
  await run(npxCommand, ["next", "build"]);
}

main().catch((error) => {
  console.error("[build] Failed to prepare Prisma database URL.", error);
  process.exit(1);
});
