import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";

const CURRENT_VERSION = "v1";
const ALGO = "aes-256-gcm";

function parseKeys(): Record<string, Buffer> {
  const raw = process.env.TOTP_ENCRYPTION_KEYS;
  if (!raw) {
    throw new Error("TOTP_ENCRYPTION_KEYS env var is required");
  }

  const parsed: Record<string, Buffer> = {};
  for (const entry of raw.split(",").map((v) => v.trim()).filter(Boolean)) {
    const [version, key] = entry.split(":");
    if (!version || !key) continue;
    const buf = Buffer.from(key, "base64");
    if (buf.length !== 32) {
      throw new Error(`TOTP key ${version} must decode to 32 bytes`);
    }
    parsed[version] = buf;
  }

  if (!parsed[CURRENT_VERSION]) {
    throw new Error(`Missing ${CURRENT_VERSION} key in TOTP_ENCRYPTION_KEYS`);
  }

  return parsed;
}

export type EncryptedSecret = {
  ciphertext: string;
  keyVersion: string;
};

export function encryptTotpSecret(secret: string): EncryptedSecret {
  const keys = parseKeys();
  const key = keys[CURRENT_VERSION];
  const iv = randomBytes(12);

  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const payload = Buffer.concat([iv, authTag, encrypted]).toString("base64");
  return { ciphertext: payload, keyVersion: CURRENT_VERSION };
}

export function decryptTotpSecret(ciphertext: string, keyVersion: string): string {
  const keys = parseKeys();
  const key = keys[keyVersion];
  if (!key) throw new Error(`Unknown TOTP key version: ${keyVersion}`);

  const payload = Buffer.from(ciphertext, "base64");
  const iv = payload.subarray(0, 12);
  const authTag = payload.subarray(12, 28);
  const encrypted = payload.subarray(28);

  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

export function hashOpaqueToken(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
