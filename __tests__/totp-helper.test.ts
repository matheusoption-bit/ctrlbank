import { beforeEach, describe, expect, it, vi } from "vitest";
import { authenticator } from "otplib";
import { encryptTotpSecret } from "../lib/security/crypto";

const { findUnique } = vi.hoisted(() => ({ findUnique: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique },
  },
}));

import { verify2FACodeForUser } from "../lib/security/totp";

describe("verify2FACodeForUser", () => {
  beforeEach(() => {
    process.env.TOTP_ENCRYPTION_KEYS = "v1:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
    findUnique.mockReset();
  });

  it("passes when 2FA is disabled", async () => {
    findUnique.mockResolvedValue({ totpEnabled: false, totpSecret: null, totpSecretEnc: null, totpSecretKeyVersion: null });
    await expect(verify2FACodeForUser("u1", "123456")).resolves.toBe(true);
  });

  it("validates encrypted secret", async () => {
    const secret = authenticator.generateSecret(20);
    const code = authenticator.generate(secret);
    const enc = encryptTotpSecret(secret);

    findUnique.mockResolvedValue({ totpEnabled: true, totpSecret: null, totpSecretEnc: enc.ciphertext, totpSecretKeyVersion: enc.keyVersion });

    await expect(verify2FACodeForUser("u1", code)).resolves.toBe(true);
    await expect(verify2FACodeForUser("u1", "000000")).resolves.toBe(false);
  });
});
