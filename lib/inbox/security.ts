import { createHmac, timingSafeEqual } from "crypto";

function safeCompare(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export function verifyPostmarkWebhook(headers: Headers) {
  const expected = process.env.POSTMARK_WEBHOOK_SECRET;
  const received = headers.get("x-postmark-webhook-token") ?? "";

  if (!expected || !received) return false;
  return safeCompare(received, expected);
}

export function verifyTwilioSignature({
  signature,
  authToken,
  url,
  params,
}: {
  signature: string | null;
  authToken: string | undefined;
  url: string;
  params: Record<string, string>;
}) {
  if (!signature || !authToken) return false;

  const sorted = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
  const data = sorted.reduce((acc, [key, value]) => acc + key + value, url);
  const expected = createHmac("sha1", authToken).update(data).digest("base64");

  return safeCompare(signature, expected);
}
