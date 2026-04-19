import { createHmac, timingSafeEqual } from "crypto";
import { findSigningKeyById } from "./keyring";

export type VerificationStatus = "VALID" | "INVALID" | "REVOKED_KEY" | "ARTIFACT_NOT_FOUND" | "MALFORMED" | "UNSUPPORTED";

export function verifySignature({
  payload,
  signature,
  signatureKeyId,
  signatureAlgorithm,
}: {
  payload: Buffer;
  signature: string;
  signatureKeyId: string;
  signatureAlgorithm: string;
}): VerificationStatus {
  if (!payload || !signature || !signatureKeyId) return "MALFORMED";
  if (signatureAlgorithm !== "hmac-sha256") return "UNSUPPORTED";

  const key = findSigningKeyById(signatureKeyId);
  if (!key) return "INVALID";
  if (key.status === "REVOKED") return "REVOKED_KEY";

  const expected = createHmac("sha256", Buffer.from(key.secret, "utf-8")).update(payload).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  if (a.length !== b.length) return "INVALID";
  return timingSafeEqual(a, b) ? "VALID" : "INVALID";
}
