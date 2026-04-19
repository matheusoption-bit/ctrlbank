import { prisma } from "@/lib/prisma";
import { encryptTotpSecret } from "@/lib/security/crypto";

async function main() {
  const users = await prisma.user.findMany({
    where: { totpSecret: { not: null }, totpSecretEnc: null },
    select: { id: true, totpSecret: true },
  });

  for (const user of users) {
    if (!user.totpSecret) continue;
    const encrypted = encryptTotpSecret(user.totpSecret);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totpSecretEnc: encrypted.ciphertext,
        totpSecretKeyVersion: encrypted.keyVersion,
      },
    });
  }

  console.log(`Backfilled ${users.length} TOTP secret(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
