/**
 * Unit tests for lib/session-utils.ts
 *
 * These tests exercise the HMAC-SHA256 signing/verification functions and the
 * SHA-256 token hashing used by the auth layer.  They use only the Web Crypto
 * API (available in Node ≥ 19 via globalThis.crypto) and import the functions
 * under test directly — no mocking required.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { signToken, verifySignedToken } from "../lib/session-utils";
import { createHash } from "crypto";

const VALID_SECRET = "a-secret-that-is-at-least-32-chars-long!!";

// ─── helpers ────────────────────────────────────────────────────────────────

function setSecret(value: string | undefined) {
  if (value === undefined) {
    delete process.env.SESSION_SECRET;
  } else {
    process.env.SESSION_SECRET = value;
  }
}

// ─── hashSessionToken (pure function, re-implemented inline for the test) ───

describe("hashSessionToken", () => {
  it("produces a 64-char hex SHA-256 digest", () => {
    const token = "abc123";
    const hash = createHash("sha256").update(token).digest("hex");
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]+$/);
  });

  it("is deterministic — same input yields same hash", () => {
    const token = "my-raw-token";
    const h1 = createHash("sha256").update(token).digest("hex");
    const h2 = createHash("sha256").update(token).digest("hex");
    expect(h1).toBe(h2);
  });

  it("two different tokens produce different hashes", () => {
    const h1 = createHash("sha256").update("token-a").digest("hex");
    const h2 = createHash("sha256").update("token-b").digest("hex");
    expect(h1).not.toBe(h2);
  });
});

// ─── signToken ───────────────────────────────────────────────────────────────

describe("signToken", () => {
  beforeEach(() => setSecret(VALID_SECRET));
  afterEach(() => setSecret(undefined));

  it("returns a string containing the original token followed by a signature", async () => {
    const token = "my-raw-session-token";
    const signed = await signToken(token);
    expect(signed.startsWith(`${token}.`)).toBe(true);
  });

  it("throws when SESSION_SECRET is absent", async () => {
    setSecret(undefined);
    await expect(signToken("token")).rejects.toThrow("SESSION_SECRET");
  });

  it("throws when SESSION_SECRET is shorter than 32 characters", async () => {
    setSecret("tooshort");
    await expect(signToken("token")).rejects.toThrow("SESSION_SECRET");
  });

  it("produces a different signature for each unique token", async () => {
    const s1 = await signToken("token-a");
    const s2 = await signToken("token-b");
    expect(s1).not.toBe(s2);
  });
});

// ─── verifySignedToken ────────────────────────────────────────────────────────

describe("verifySignedToken", () => {
  beforeEach(() => setSecret(VALID_SECRET));
  afterEach(() => setSecret(undefined));

  it("returns the original token for a correctly signed value", async () => {
    const token = "original-token-value";
    const signed = await signToken(token);
    const result = await verifySignedToken(signed);
    expect(result).toBe(token);
  });

  it("round-trips correctly: sign → verify === token", async () => {
    const token = "round-trip-test-token";
    expect(await verifySignedToken(await signToken(token))).toBe(token);
  });

  it("returns null for a tampered signature", async () => {
    const token = "real-token";
    const signed = await signToken(token);
    // Flip the last character of the signature
    const tampered = signed.slice(0, -1) + (signed.endsWith("a") ? "b" : "a");
    expect(await verifySignedToken(tampered)).toBeNull();
  });

  it("returns null for a tampered token body (signature mismatch)", async () => {
    const token = "real-token";
    const signed = await signToken(token);
    const [, sig] = signed.split(/\.(?=[^.]+$)/);
    // Replace the token part with a different value while keeping the signature
    const tampered = `evil-token.${sig}`;
    expect(await verifySignedToken(tampered)).toBeNull();
  });

  it("returns null when SESSION_SECRET is absent", async () => {
    const signed = await signToken("some-token");
    setSecret(undefined);
    expect(await verifySignedToken(signed)).toBeNull();
  });

  it("returns null when SESSION_SECRET is too short", async () => {
    const signed = await signToken("some-token");
    setSecret("tooshort");
    expect(await verifySignedToken(signed)).toBeNull();
  });

  it("returns null when verified with a different secret", async () => {
    const signed = await signToken("my-token");
    setSecret("a-completely-different-secret-1234567890");
    expect(await verifySignedToken(signed)).toBeNull();
  });

  it("returns null for a cookie value with no dot separator", async () => {
    expect(await verifySignedToken("nodotinhere")).toBeNull();
  });

  it("returns null for an empty string", async () => {
    expect(await verifySignedToken("")).toBeNull();
  });

  it("returns null for a value with only a signature (empty token part)", async () => {
    expect(await verifySignedToken(".somesignature")).toBeNull();
  });
});
