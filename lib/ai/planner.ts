import { prisma } from "@/lib/prisma";
import { createRecommendation } from "./composer";

export async function syncFinancialPlan(planId: string) {
  const plan = await prisma.financialPlan.findUnique({
    where: { id: planId }
  });

  if (!plan || !plan.isActive) return null;

  const whereScope = plan.visibility === "HOUSEHOLD" && plan.householdId
    ? { householdId: plan.householdId }
    : { userId: plan.userId };

  const now = new Date();
  
  // Dedup/update logic: keep one current monthly snapshot per plan.
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const existingSnapshot = await prisma.planProgressSnapshot.findFirst({
    where: {
      planId: plan.id,
      createdAt: { gte: currentMonthStart, lt: nextMonthStart }
    }
  });

  // Calculate actual progress: net balance since plan creation
  const txs = await prisma.transaction.findMany({
    where: {
      ...whereScope,
      date: { gte: plan.createdAt },
      status: "COMPLETED",
      ignoreInTotals: false,
    },
    select: { type: true, amount: true }
  });

  const income = txs.filter(t => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0);
  const expense = txs.filter(t => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);
  const netSavings = Math.max(0, income - expense); // Prevent negative progress

  let progressPercentage = 0;
  let isOnTrack = true;

  const targetAmt = Number(plan.targetAmount || 0);
  const monthlyReq = Number(plan.monthlyRequiredAmount || 0);

  if (targetAmt > 0) {
    progressPercentage = (netSavings / targetAmt) * 100;
  } else if (monthlyReq > 0) {
    // If no absolute target but a monthly goal exists, track vs time elapsed
    const msPassed = now.getTime() - plan.createdAt.getTime();
    const monthsPassed = Math.max(1, msPassed / (1000 * 60 * 60 * 24 * 30));
    const expectedSavings = monthlyReq * monthsPassed;
    progressPercentage = (netSavings / expectedSavings) * 100;
  }

  if (progressPercentage > 100) progressPercentage = 100;

  let projectedCompletion: Date | null = null;
  if (targetAmt > 0 && netSavings > 0) {
    const msPassed = now.getTime() - plan.createdAt.getTime();
    const monthsPassed = Math.max(1 / 30, msPassed / (1000 * 60 * 60 * 24 * 30));
    const monthlySavingsRate = netSavings / monthsPassed;
    if (monthlySavingsRate > 0) {
      const remaining = Math.max(0, targetAmt - netSavings);
      const monthsRemaining = remaining / monthlySavingsRate;
      projectedCompletion = new Date(now);
      projectedCompletion.setMonth(projectedCompletion.getMonth() + Math.ceil(monthsRemaining));
    }
  }

  // Determine track status (allow 10% tolerance depending on months passed, but generally simple > 85% is on track)
  if (monthlyReq > 0) {
    const msPassed = now.getTime() - plan.createdAt.getTime();
    const monthsPassed = Math.max(1, msPassed / (1000 * 60 * 60 * 24 * 30));
    const expectedSavings = monthlyReq * monthsPassed;
    if (netSavings < expectedSavings * 0.8) {
      isOnTrack = false;
    }
  }

  const snapshot = existingSnapshot
    ? await prisma.planProgressSnapshot.update({
        where: { id: existingSnapshot.id },
        data: {
          currentAmount: netSavings,
          progressPercentage,
          projectedCompletion,
          isOnTrack,
        },
      })
    : await prisma.planProgressSnapshot.create({
        data: {
          planId: plan.id,
          currentAmount: netSavings,
          progressPercentage,
          projectedCompletion,
          isOnTrack,
        }
      });

  // Generate Recommendation if off-track and no recent rec exists
  if (!isOnTrack) {
    const existingRec = await prisma.aiRecommendation.findFirst({
      where: {
        relatedPlanId: plan.id,
        type: "plan_progress",
        createdAt: { gte: currentMonthStart }
      }
    });

    if (!existingRec) {
      await createRecommendation(plan.userId, plan.householdId, {
        visibility: plan.visibility,
        relatedPlanId: plan.id,
        type: "plan_progress",
        message: `Atenção: O plano "${plan.title}" está abaixo do ritmo esperado. Você economizou R$ ${netSavings.toFixed(2)} até agora.`,
        actionLabel: "Ver Orçamentos",
        actionTarget: "/orcamentos",
        score: 80
      });
    }
  }

  return snapshot;
}

export async function syncAllActivePlans() {
  const plans = await prisma.financialPlan.findMany({
    where: { isActive: true }
  });

  const results = [];
  for (const p of plans) {
    try {
      const snap = await syncFinancialPlan(p.id);
      results.push({ planId: p.id, status: snap ? "synced" : "skipped" });
    } catch (e) {
      console.error(`Failed to sync plan ${p.id}`, e);
      results.push({ planId: p.id, status: "error" });
    }
  }
  return results;
}
