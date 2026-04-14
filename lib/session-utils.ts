/**
 * Edge-compatible session utilities.
 *
 * This file intentionally uses only the Web Crypto API and base64 primitives
 * so that it can be imported in Next.js middleware (Edge runtime) as well as
 * in Node.js route handlers / server components.
 *
 * Cookie format: "{rawToken}.{base64url(HMAC-SHA256(rawToken, SESSION_SECRET))}"
 */

function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64urlToUint8Array(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + padding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer as ArrayBuffer;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Sign a raw session token with HMAC-SHA256 using SESSION_SECRET.
 * Returns a value safe to store in the session cookie:
 *   "{rawToken}.{base64url(signature)}"
 *
 * SESSION_SECRET must be set and at least 32 characters long.
 */
export async function signToken(token: string): Promise<string> {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET env var must be set and at least 32 characters long"
    );
  }
  const key = await getHmacKey(secret);
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(token));
  return `${token}.${bufferToBase64url(signature)}`;
}

/**
 * Verify the HMAC signature embedded in a signed session cookie value.
 * Returns the raw token if the signature is valid, or null if the cookie is
 * missing, malformed, or has been tampered with.
 *
 * If SESSION_SECRET is not configured the function returns null (fail-closed).
 */
export async function verifySignedToken(cookieValue: string): Promise<string | null> {
  const lastDot = cookieValue.lastIndexOf(".");
  if (lastDot === -1) return null;

  const token = cookieValue.slice(0, lastDot);
  const sigBase64url = cookieValue.slice(lastDot + 1);

  if (!token || !sigBase64url) return null;

  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return null;

  try {
    const key = await getHmacKey(secret);
    const encoder = new TextEncoder();
    const sigBytes = base64urlToUint8Array(sigBase64url);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      encoder.encode(token)
    );
    return valid ? token : null;
  } catch {
    return null;
  }
}
