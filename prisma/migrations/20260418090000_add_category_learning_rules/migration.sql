-- CreateTable
CREATE TABLE "CategoryLearningRule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "householdId" TEXT,
    "descriptionPattern" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoryLearningRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CategoryLearningRule_userId_idx" ON "CategoryLearningRule"("userId");

-- CreateIndex
CREATE INDEX "CategoryLearningRule_householdId_idx" ON "CategoryLearningRule"("householdId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryLearningRule_userId_descriptionPattern_categoryName_key" ON "CategoryLearningRule"("userId", "descriptionPattern", "categoryName");

-- AddForeignKey
ALTER TABLE "CategoryLearningRule" ADD CONSTRAINT "CategoryLearningRule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryLearningRule" ADD CONSTRAINT "CategoryLearningRule_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
