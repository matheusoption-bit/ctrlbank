"use server";

import { authenticator } from "otplib";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

// ─── Setup 2FA — generate secret & QR URI ─────────────────────────────────

export async function setup2FA() {
  const { user } = await validateRequest();
  if (!user) return { error: "Não autenticado" };

  const secret = authenticator.generateSecret(20);
  const uri    = authenticator.keyuri(user.email, "CtrlBank", secret);

  // Persist pending secret (not yet enabled — user must verify code first)
  await prisma.user.update({
    where: { id: user.id },
    data:  { totpSecret: secret, totpEnabled: false },
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
  if (!dbUser?.totpSecret) return { error: "Nenhum segredo configurado" };

  const valid = authenticator.check(code, dbUser.totpSecret);
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
  if (!dbUser?.totpSecret || !dbUser.totpEnabled) return { error: "2FA não está ativado" };

  const valid = authenticator.check(code, dbUser.totpSecret);
  if (!valid) return { error: "Código incorreto. Tente novamente." };

  await prisma.user.update({
    where: { id: user.id },
    data:  { totpSecret: null, totpEnabled: false },
  });

  revalidatePath("/configuracoes");
  return { success: true };
}

// ─── Verify 2FA at login ──────────────────────────────────────────────────

export async function verify2FACode(userId: string, code: string): Promise<boolean> {
  const dbUser = await prisma.user.findUnique({
    where:  { id: userId },
    select: { totpSecret: true, totpEnabled: true },
  });

  if (!dbUser?.totpEnabled || !dbUser.totpSecret) return true; // 2FA not set up → pass
  return authenticator.check(code, dbUser.totpSecret);
}
