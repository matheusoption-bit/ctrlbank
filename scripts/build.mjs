import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const runtimeDatabaseUrlKeys = [
  "POSTGRES_PRISMA_URL",
  "DATABASE_URL_UNPOOLED",
  "DIRECT_URL",
  "POSTGRES_URL_NON_POOLING",
  "DATABASE_URL",
  "POSTGRES_URL",
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

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      env: process.env,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${code}.`));
    });
  });
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
  await run(npxCommand, ["prisma", "migrate", "deploy"]);

  const runtimeUrl = resolveDatabaseUrl(runtimeDatabaseUrlKeys, "runtime");
  process.env.DATABASE_URL = runtimeUrl.url;
  console.log(`[build] Using ${runtimeUrl.key} for Next.js build.`);
  await run(npxCommand, ["next", "build"]);
}

main().catch((error) => {
  console.error("[build] Failed to prepare Prisma database URL.", error);
  process.exit(1);
});
