import { beforeEach, describe, expect, it } from "vitest";
import { getActiveSigningKey, getSigningKeyring } from "../lib/security/keyring";
import { canonicalizePayload, signPayload } from "../lib/security/signature";
import { verifySignature } from "../lib/security/verification";

describe("wave4 signing lifecycle", () => {
  beforeEach(() => {
    process.env.ARTIFACT_SIGNING_KEYRING_JSON = JSON.stringify([
      { id: "k-old", algorithm: "hmac-sha256", status: "RETIRED", secret: "old-secret" },
      { id: "k-live", algorithm: "hmac-sha256", status: "ACTIVE", secret: "live-secret" },
    ]);
  });

  it("uses the active key for new signatures", () => {
    expect(getActiveSigningKey().id).toBe("k-live");
    const sig = signPayload(Buffer.from("hello"));
    expect(sig.signatureKeyId).toBe("k-live");
  });

  it("retired key still verifies historical signature", () => {
    process.env.ARTIFACT_SIGNING_KEYRING_JSON = JSON.stringify([
      { id: "k-old", algorithm: "hmac-sha256", status: "ACTIVE", secret: "old-secret" },
    ]);
    const payload = Buffer.from("historical");
    const oldSig = signPayload(payload);

    process.env.ARTIFACT_SIGNING_KEYRING_JSON = JSON.stringify([
      { id: "k-old", algorithm: "hmac-sha256", status: "RETIRED", secret: "old-secret" },
      { id: "k-new", algorithm: "hmac-sha256", status: "ACTIVE", secret: "new-secret" },
    ]);

    expect(verifySignature({ payload, signature: oldSig.signature, signatureAlgorithm: "hmac-sha256", signatureKeyId: "k-old" })).toBe("VALID");
  });

  it("revoked key produces explicit revoked status", () => {
    process.env.ARTIFACT_SIGNING_KEYRING_JSON = JSON.stringify([
      { id: "k-rev", algorithm: "hmac-sha256", status: "REVOKED", secret: "rev-secret" },
      { id: "k-new", algorithm: "hmac-sha256", status: "ACTIVE", secret: "new-secret" },
    ]);

    const payload = Buffer.from("x");
    const fake = signPayload(payload);
    expect(fake.signatureKeyId).toBe("k-new");
    expect(verifySignature({ payload, signature: fake.signature, signatureAlgorithm: "hmac-sha256", signatureKeyId: "k-rev" })).toBe("REVOKED_KEY");
  });

  it("canonical payload is deterministic", () => {
    const a = canonicalizePayload({ b: 2, a: 1 }).toString("utf-8");
    const b = canonicalizePayload({ a: 1, b: 2 }).toString("utf-8");
    expect(a).toBe(b);
  });

  it("requires exactly one active key", () => {
    process.env.ARTIFACT_SIGNING_KEYRING_JSON = JSON.stringify([
      { id: "k1", algorithm: "hmac-sha256", status: "ACTIVE", secret: "1" },
      { id: "k2", algorithm: "hmac-sha256", status: "ACTIVE", secret: "2" },
    ]);
    expect(() => getSigningKeyring()).toThrow(/Exactly one ACTIVE/);
  });
});
