import { prisma } from "@/lib/prisma";
import { generateFinancialPlanSnapshotArtifact, generateMonthlyDossierArtifact, verifyArtifactByToken } from "@/lib/artifacts/service";
import { getQuotaUsage } from "@/lib/quotas/service";

async function main() {
  const [, , command, ...args] = process.argv;

  try {
    switch (command) {
      case "verify-artifact": {
        const token = args[0];
        if (!token) throw new Error("Usage: ctrlbank verify-artifact <token>");
        const res = await verifyArtifactByToken(token);
        console.log(JSON.stringify(res, null, 2));
        process.exit(res.status === "VALID" ? 0 : 2);
      }
      case "export-dossier": {
        const [householdId, userId, yearStr, monthStr] = args;
        if (!householdId || !userId) throw new Error("Usage: ctrlbank export-dossier <householdId> <userId> [year] [month]");
        const now = new Date();
        const year = yearStr ? Number(yearStr) : now.getFullYear();
        const month = monthStr ? Number(monthStr) : now.getMonth() + 1;
        const artifact = await generateMonthlyDossierArtifact({ householdId, userId, year, month });
        console.log(JSON.stringify({ id: artifact.id, verificationToken: artifact.verificationToken, metadata: artifact.metadata }, null, 2));
        return;
      }
      case "snapshot-plan": {
        const [planId, actorUserId] = args;
        if (!planId) throw new Error("Usage: ctrlbank snapshot-plan <planId> [actorUserId]");
        const artifact = await generateFinancialPlanSnapshotArtifact({ planId, actorUserId: actorUserId ?? null });
        console.log(JSON.stringify({ id: artifact.id, verificationToken: artifact.verificationToken }, null, 2));
        return;
      }
      case "quota-report": {
        const [householdId, capability, provider] = args;
        if (!householdId || !capability) throw new Error("Usage: ctrlbank quota-report <householdId> <capability> [provider]");
        const report = await getQuotaUsage(householdId, capability, provider ?? null);
        console.log(JSON.stringify(report, null, 2));
        return;
      }
      case "reprocess-processing": {
        const [correlationId] = args;
        if (!correlationId) throw new Error("Usage: ctrlbank reprocess-processing <correlationId>");
        const logs = await prisma.ingestionLog.findMany({ where: { correlationId }, orderBy: { createdAt: "asc" } });
        console.log(JSON.stringify({ correlationId, totalLogs: logs.length, latest: logs.at(-1) ?? null }, null, 2));
        return;
      }
      default:
        console.log("Commands: verify-artifact, export-dossier, snapshot-plan, quota-report, reprocess-processing");
        process.exit(1);
    }
  } catch (error: any) {
    console.error(error?.message ?? error);
    process.exit(1);
  }
}

main();
