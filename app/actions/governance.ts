"use server";

import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rollbackPolicy, activatePolicyVersion } from "@/lib/policy/engine";
import { killExperiment } from "@/lib/experiments/service";

async function resolveHouseholdForUser(userId: string) {
  const dbUser = await prisma.user.findUnique({ where: { id: userId }, select: { householdId: true } });
  return dbUser?.householdId ?? null;
}

export async function rollbackActivePolicy(policyType: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");
  const householdId = await resolveHouseholdForUser(user.id);
  return rollbackPolicy(policyType, householdId);
}

export async function activatePolicy(policyVersionId: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");
  return activatePolicyVersion({ policyVersionId, actorUserId: user.id });
}

export async function disableExperiment(experimentId: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");
  return killExperiment(experimentId);
}
