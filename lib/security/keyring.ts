export type SigningKey = {
  id: string;
  algorithm: "hmac-sha256";
  status: "ACTIVE" | "RETIRED" | "REVOKED";
  secret: string;
  activatedAt?: string;
  retiredAt?: string;
  revokedAt?: string;
};

function parseKeyring(): SigningKey[] {
  const raw = process.env.ARTIFACT_SIGNING_KEYRING_JSON;
  if (!raw) {
    throw new Error("ARTIFACT_SIGNING_KEYRING_JSON is required");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid ARTIFACT_SIGNING_KEYRING_JSON");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Signing keyring must be a non-empty array");
  }

  const keys = parsed.map((item) => {
    const key = item as Partial<SigningKey>;
    if (!key.id || !key.secret) throw new Error("Every signing key must define id and secret");
    if (key.algorithm !== "hmac-sha256") throw new Error(`Unsupported algorithm for key ${key.id}`);
    if (!key.status || !["ACTIVE", "RETIRED", "REVOKED"].includes(key.status)) {
      throw new Error(`Invalid status for key ${key.id}`);
    }

    return {
      id: key.id,
      algorithm: "hmac-sha256" as const,
      status: key.status,
      secret: key.secret,
      activatedAt: key.activatedAt,
      retiredAt: key.retiredAt,
      revokedAt: key.revokedAt,
    };
  });

  const active = keys.filter((key) => key.status === "ACTIVE");
  if (active.length !== 1) {
    throw new Error("Exactly one ACTIVE signing key is required");
  }

  return keys;
}

export function getSigningKeyring() {
  return parseKeyring();
}

export function getActiveSigningKey() {
  return getSigningKeyring().find((key) => key.status === "ACTIVE")!;
}

export function findSigningKeyById(keyId: string) {
  return getSigningKeyring().find((key) => key.id === keyId) ?? null;
}
