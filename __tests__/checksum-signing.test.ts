import { describe, expect, it, beforeEach } from "vitest";
import { canonicalizeTextPayload, computeSha256, sealCapturePayload, verifySealedCapturePayload } from "../lib/security/checksum";

describe("capture checksum + signature", () => {
  beforeEach(() => {
    process.env.CAPTURE_SIGNING_KEY = "wave2-secret";
    process.env.CAPTURE_SIGNING_KEY_ID = "test-v1";
  });

  it("creates deterministic sha256 from canonical text", () => {
    const a = computeSha256(canonicalizeTextPayload("A\r\nB\n"));
    const b = computeSha256(canonicalizeTextPayload("A\nB"));
    expect(a).toBe(b);
  });

  it("detects tampering in sealed payload", () => {
    const sealed = sealCapturePayload({ value: 10, text: "mercado" });
    expect(sealed.signature).toBeTruthy();
    expect(verifySealedCapturePayload(sealed.sealedPayload, sealed.signature!)).toBe(true);

    const tamperedPayload = `${sealed.sealedPayload}x`;
    expect(verifySealedCapturePayload(tamperedPayload, sealed.signature!)).toBe(false);
  });
});
