import { authenticator } from "otplib";
import { prisma } from "@/lib/prisma";
import { decryptTotpSecret } from "@/lib/security/crypto";

export async function verify2FACodeForUser(userId: string, code: string): Promise<boolean> {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { totpEnabled: true, totpSecret: true, totpSecretEnc: true, totpSecretKeyVersion: true },
  });

  const secret = dbUser?.totpSecretEnc && dbUser.totpSecretKeyVersion
    ? decryptTotpSecret(dbUser.totpSecretEnc, dbUser.totpSecretKeyVersion)
    : dbUser?.totpSecret;

  if (!dbUser?.totpEnabled || !secret) return true;
  return authenticator.check(code, secret);
}
