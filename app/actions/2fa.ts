"use server";

import { authenticator } from "otplib";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { decryptTotpSecret, encryptTotpSecret } from "@/lib/security/crypto";
import { verify2FACodeForUser } from "@/lib/security/totp";

// ─── Setup 2FA — generate secret & QR URI ─────────────────────────────────

export async function setup2FA() {
  const { user } = await validateRequest();
  if (!user) return { error: "Não autenticado" };

  const secret = authenticator.generateSecret(20);
  const uri    = authenticator.keyuri(user.email, "CtrlBank", secret);

  // Persist pending secret (not yet enabled — user must verify code first)
  const encrypted = encryptTotpSecret(secret);
  await prisma.user.update({
    where: { id: user.id },
    data:  {
      totpSecret: secret, // legacy fallback; kept temporarily for migration compatibility
      totpSecretEnc: encrypted.ciphertext,
      totpSecretKeyVersion: encrypted.keyVersion,
      totpEnabled: false,
    },
  });

  return { success: true, secret, uri };
}

// ─── Verify & Enable 2FA ──────────────────────────────────────────────────

export async function enable2FA(formData: FormData) {
  const { user } = await validateRequest();
  if (!user) return { error: "Não autenticado" };

  const code = (formData.get("code") as string ?? "").trim();
  if (!/^\d{6}$/.test(code)) return { error: "Código inválido (6 dígitos)" };

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  const secret = dbUser?.totpSecretEnc && dbUser.totpSecretKeyVersion
    ? decryptTotpSecret(dbUser.totpSecretEnc, dbUser.totpSecretKeyVersion)
    : dbUser?.totpSecret;
  if (!secret) return { error: "Nenhum segredo configurado" };

  const valid = authenticator.check(code, secret);
  if (!valid) return { error: "Código incorreto. Tente novamente." };

  await prisma.user.update({
    where: { id: user.id },
    data:  { totpEnabled: true },
  });

  revalidatePath("/configuracoes");
  return { success: true };
}

// ─── Disable 2FA ──────────────────────────────────────────────────────────

export async function disable2FA(formData: FormData) {
  const { user } = await validateRequest();
  if (!user) return { error: "Não autenticado" };

  const code = (formData.get("code") as string ?? "").trim();
  if (!/^\d{6}$/.test(code)) return { error: "Código inválido (6 dígitos)" };

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  const secret = dbUser?.totpSecretEnc && dbUser.totpSecretKeyVersion
    ? decryptTotpSecret(dbUser.totpSecretEnc, dbUser.totpSecretKeyVersion)
    : dbUser?.totpSecret;
  if (!secret || !dbUser?.totpEnabled) return { error: "2FA não está ativado" };

  const valid = authenticator.check(code, secret);
  if (!valid) return { error: "Código incorreto. Tente novamente." };

  await prisma.user.update({
    where: { id: user.id },
    data:  {
      totpSecret: null,
      totpSecretEnc: null,
      totpSecretKeyVersion: null,
      totpEnabled: false,
    },
  });

  revalidatePath("/configuracoes");
  return { success: true };
}

// ─── Verify 2FA at login ──────────────────────────────────────────────────

export async function verify2FACode(userId: string, code: string): Promise<boolean> {
  return verify2FACodeForUser(userId, code);
}
