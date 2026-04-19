import { ExperimentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function isExperimentEnabled(input: { key: string; householdId?: string | null; userId?: string | null }) {
  const now = new Date();
  const experiment = await prisma.experiment.findFirst({
    where: {
      key: input.key,
      status: ExperimentStatus.RUNNING,
      OR: input.householdId ? [{ householdId: input.householdId }, { householdId: null }] : [{ householdId: null }],
      AND: [{ OR: [{ startAt: null }, { startAt: { lte: now } }] }, { OR: [{ endAt: null }, { endAt: { gte: now } }] }],
    },
    orderBy: [{ householdId: "desc" }, { createdAt: "desc" }],
  });

  if (!experiment) return { enabled: false, reason: "inactive" };

  const config = (experiment.config as any) ?? {};
  const allocation = Number(config.allocationPct ?? 100);
  if (allocation >= 100) return { enabled: true, experiment };

  const hashBase = `${input.userId ?? "anon"}:${experiment.id}`;
  const bucket = [...hashBase].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 100;
  return { enabled: bucket < allocation, experiment, bucket };
}

export async function killExperiment(experimentId: string) {
  return prisma.experiment.update({ where: { id: experimentId }, data: { status: ExperimentStatus.KILLED, endAt: new Date() } });
}
