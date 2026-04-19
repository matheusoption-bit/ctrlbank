import { describe, it, expect, beforeEach } from "vitest";
import { decryptTotpSecret, encryptTotpSecret, hashOpaqueToken } from "../lib/security/crypto";

describe("TOTP encryption", () => {
  beforeEach(() => {
    process.env.TOTP_ENCRYPTION_KEYS = "v1:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  });

  it("encrypts and decrypts a TOTP secret", () => {
    const plain = "JBSWY3DPEHPK3PXP";
    const enc = encryptTotpSecret(plain);
    expect(enc.ciphertext).not.toContain(plain);
    expect(enc.keyVersion).toBe("v1");
    expect(decryptTotpSecret(enc.ciphertext, enc.keyVersion)).toBe(plain);
  });

  it("hashes opaque tokens deterministically", () => {
    const hash = hashOpaqueToken("abc123");
    expect(hash).toHaveLength(64);
    expect(hashOpaqueToken("abc123")).toBe(hash);
  });
});
