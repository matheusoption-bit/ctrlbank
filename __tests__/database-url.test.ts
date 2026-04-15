import { describe, expect, it } from "vitest";
import {
  resolveMigrationDatabaseUrl,
  resolveRuntimeDatabaseUrl,
} from "../lib/database-url";

describe("resolveRuntimeDatabaseUrl", () => {
  it("prefers the Vercel Prisma URL when available", () => {
    const resolved = resolveRuntimeDatabaseUrl({
      POSTGRES_PRISMA_URL: "postgres://runtime-prisma",
      DATABASE_URL: "postgres://database-url",
      DIRECT_URL: "postgres://direct-url",
    });

    expect(resolved).toEqual({
      key: "POSTGRES_PRISMA_URL",
      url: "postgres://runtime-prisma",
    });
  });

  it("falls back to the unpooled URL before DATABASE_URL", () => {
    const resolved = resolveRuntimeDatabaseUrl({
      DATABASE_URL: "postgres://broken-runtime",
      DATABASE_URL_UNPOOLED: "postgres://safe-direct",
    });

    expect(resolved).toEqual({
      key: "DATABASE_URL_UNPOOLED",
      url: "postgres://safe-direct",
    });
  });

  it("throws a helpful error when no database URL exists", () => {
    expect(() => resolveRuntimeDatabaseUrl({})).toThrow(
      "Missing database URL for runtime"
    );
  });
});

describe("resolveMigrationDatabaseUrl", () => {
  it("prefers DIRECT_URL for migrations", () => {
    const resolved = resolveMigrationDatabaseUrl({
      DIRECT_URL: "postgres://direct-url",
      DATABASE_URL: "postgres://runtime-url",
    });

    expect(resolved).toEqual({
      key: "DIRECT_URL",
      url: "postgres://direct-url",
    });
  });

  it("falls back to POSTGRES_URL_NON_POOLING before DATABASE_URL", () => {
    const resolved = resolveMigrationDatabaseUrl({
      POSTGRES_URL_NON_POOLING: "postgres://non-pooling",
      DATABASE_URL: "postgres://runtime-url",
    });

    expect(resolved).toEqual({
      key: "POSTGRES_URL_NON_POOLING",
      url: "postgres://non-pooling",
    });
  });
});
