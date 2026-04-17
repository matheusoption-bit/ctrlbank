ALTER TABLE "User"
ADD COLUMN "phone" TEXT,
ADD COLUMN "whatsappNumber" TEXT,
ADD COLUMN "whatsappLinkToken" TEXT,
ADD COLUMN "whatsappLinkTokenExpiresAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "User_whatsappNumber_key" ON "User"("whatsappNumber");
CREATE INDEX "User_phone_idx" ON "User"("phone");
CREATE INDEX "User_whatsappLinkToken_idx" ON "User"("whatsappLinkToken");
