"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "familia";
}

function normalizeE164(value: string) {
  const phone = value.trim();
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null;
}

function generateLinkToken() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = randomBytes(6);
  return Array.from(bytes)
    .map((byte) => alphabet[byte % alphabet.length])
    .join("");
}

async function getCurrentUserConfig() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");

  return prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      phone: true,
      whatsappNumber: true,
      whatsappLinkToken: true,
      whatsappLinkTokenExpiresAt: true,
      household: { select: { name: true } },
    },
  });
}

export async function getInboxCaptureSettings() {
  const user = await getCurrentUserConfig();
  if (!user) throw new Error("Usuário não encontrado");

  const domain = process.env.INBOX_CAPTURE_DOMAIN ?? "seudominio.com";
  const householdSlug = toSlug(user.household?.name ?? user.email.split("@")[0] ?? "familia");

  const hasValidToken =
    !!user.whatsappLinkToken &&
    !!user.whatsappLinkTokenExpiresAt &&
    user.whatsappLinkTokenExpiresAt > new Date();

  return {
    dedicatedEmail: `inbox+${householdSlug}@${domain}`,
    twilioNumber: process.env.TWILIO_WHATSAPP_NUMBER ?? "whatsapp:+14155238886",
    phone: user.phone,
    whatsappNumber: user.whatsappNumber,
    whatsappLinkToken: hasValidToken ? user.whatsappLinkToken : null,
    whatsappLinkTokenExpiresAt: hasValidToken ? user.whatsappLinkTokenExpiresAt : null,
  };
}

export async function saveWhatsappPhone(formData: FormData) {
  const user = await getCurrentUserConfig();
  if (!user) throw new Error("Usuário não encontrado");

  const phoneInput = formData.get("phone")?.toString() ?? "";
  const phone = normalizeE164(phoneInput);
  if (!phone) {
    throw new Error("Número inválido. Use formato E.164 (ex: +5511999999999)");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { phone },
  });

  revalidatePath("/configuracoes");
}

export async function generateWhatsappToken() {
  const user = await getCurrentUserConfig();
  if (!user) throw new Error("Usuário não encontrado");

  const token = generateLinkToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      whatsappLinkToken: token,
      whatsappLinkTokenExpiresAt: expiresAt,
    },
  });

  revalidatePath("/configuracoes");
}

export async function unlinkWhatsappNumber() {
  const user = await getCurrentUserConfig();
  if (!user) throw new Error("Usuário não encontrado");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      whatsappNumber: null,
      whatsappLinkToken: null,
      whatsappLinkTokenExpiresAt: null,
    },
  });

  revalidatePath("/configuracoes");
}
