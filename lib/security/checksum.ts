import { createHash, createHmac, timingSafeEqual } from "crypto";

const CAPTURE_SIGNING_KEY_ID = process.env.CAPTURE_SIGNING_KEY_ID ?? "v1";

function getCaptureSigningKey() {
  const key = process.env.CAPTURE_SIGNING_KEY;
  if (!key) return null;
  return Buffer.from(key, "utf-8");
}

export function computeSha256(input: string | Buffer) {
  return createHash("sha256").update(input).digest("hex");
}

export function canonicalizeTextPayload(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

export function sealCapturePayload(payload: unknown) {
  const key = getCaptureSigningKey();
  const serialized = JSON.stringify(payload);
  const sealedPayload = Buffer.from(serialized, "utf-8").toString("base64");

  if (!key) {
    return {
      sealedPayload,
      signature: null,
      signatureKeyId: null,
    };
  }

  const signature = createHmac("sha256", key).update(sealedPayload).digest("hex");
  return {
    sealedPayload,
    signature,
    signatureKeyId: CAPTURE_SIGNING_KEY_ID,
  };
}

export function verifySealedCapturePayload(sealedPayload: string, signature: string) {
  const key = getCaptureSigningKey();
  if (!key) return false;

  const expected = createHmac("sha256", key).update(sealedPayload).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
