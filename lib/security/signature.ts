import { createHash, createHmac } from "crypto";
import { getActiveSigningKey } from "./keyring";

export function canonicalizePayload(payload: unknown) {
  if (Buffer.isBuffer(payload)) return payload;
  if (typeof payload === "string") return Buffer.from(payload, "utf-8");

  const ordered = JSON.stringify(payload, Object.keys(payload as object).sort());
  return Buffer.from(ordered, "utf-8");
}

export function computePayloadHash(bytes: Buffer) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function signPayload(bytes: Buffer) {
  const key = getActiveSigningKey();
  const signature = createHmac("sha256", Buffer.from(key.secret, "utf-8")).update(bytes).digest("hex");
  return {
    signature,
    signatureKeyId: key.id,
    signatureAlgorithm: key.algorithm,
    payloadHash: computePayloadHash(bytes),
    payloadDigestAlgorithm: "sha256",
  };
}
