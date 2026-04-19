import Link from "next/link";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scopeWhere } from "@/lib/security/scope";
import { getQuotaUsage } from "@/lib/quotas/service";
import { disableExperiment, rollbackActivePolicy } from "@/app/actions/governance";

export default async function ProcessamentosPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { householdId: true } });
  const scoped = scopeWhere({ userId: user.id, householdId: dbUser?.householdId ?? null });

  const events = await prisma.aiCaptureEvent.findMany({
    where: scoped,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      sourceDocument: {
        select: { id: true, sourceChannel: true, sourceType: true, originalName: true, sha256: true },
      },
      ingestionLogs: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          stage: true,
          status: true,
          errorCode: true,
          errorMessage: true,
          createdAt: true,
          transactionId: true,
        },
      },
      qualityFlags: {
        orderBy: { createdAt: "desc" },
        select: { id: true, code: true, severity: true, status: true },
      },
    },
  });

  const [artifacts, quotas, jobs, activePolicies, calibrations, experiments, qualityMetrics] = await Promise.all([
    prisma.signedArtifact.findMany({
      where: { householdId: dbUser?.householdId ?? undefined },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.householdQuota.findMany({
      where: { householdId: dbUser?.householdId ?? undefined },
    }),
    prisma.automationJobRun.findMany({
      where: { OR: [{ householdId: dbUser?.householdId ?? undefined }, { householdId: null }] },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.policyVersion.findMany({
      where: { householdId: dbUser?.householdId ?? undefined, status: "ACTIVE" },
      orderBy: { activatedAt: "desc" },
      take: 10,
    }),
    prisma.calibrationRun.findMany({
      where: { householdId: dbUser?.householdId ?? undefined },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.experiment.findMany({
      where: { householdId: dbUser?.householdId ?? undefined },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    prisma.productQualityMetricSnapshot.findMany({
      where: { householdId: dbUser?.householdId ?? undefined },
      orderBy: { computedAt: "desc" },
      take: 20,
    }),
  ]);

  const quotaUsage = await Promise.all(
    quotas.map(async (quota) => ({
      quota,
      usage: (await getQuotaUsage(quota.householdId, quota.capability, quota.provider)).usage,
    }))
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Atividade · Processamentos</h1>
        <p className="text-secondary mt-1">Histórico operacional auditável: documento de origem, timeline, flags e resultado de commit.</p>
      </header>

      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-secondary">
            <tr>
              <th className="text-left p-3">Data</th>
              <th className="text-left p-3">Canal / Origem</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Stage</th>
              <th className="text-left p-3">Flags</th>
              <th className="text-left p-3">Correlação</th>
              <th className="text-left p-3">Detalhe</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const latest = event.ingestionLogs[event.ingestionLogs.length - 1];
              const hasReview = event.reviewState === "REQUIRED";
              const hasDuplicate = event.qualityFlags.some((flag) => flag.code.includes("DUPLICATE"));
              const status = latest?.status ?? "-";
              const stage = latest?.stage ?? event.processingStage ?? "-";

              return (
                <tr key={event.id} className="border-t border-border align-top">
                  <td className="p-3">{event.createdAt.toLocaleString("pt-BR")}</td>
                  <td className="p-3">
                    <p>{event.sourceDocument?.sourceChannel ?? event.source}</p>
                    <p className="text-xs text-secondary">{event.sourceDocument?.originalName ?? event.inputType}</p>
                  </td>
                  <td className="p-3 text-xs uppercase">
                    {status}
                    {hasReview ? <p className="text-amber-500">review_required</p> : null}
                    {hasDuplicate ? <p className="text-amber-500">duplicate</p> : null}
                  </td>
                  <td className="p-3 text-xs">{stage}</td>
                  <td className="p-3 text-xs">
                    {event.qualityFlags.length === 0
                      ? "-"
                      : event.qualityFlags.slice(0, 2).map((flag) => `${flag.code}(${flag.severity})`).join(", ")}
                  </td>
                  <td className="p-3 font-mono text-[11px]">{event.correlationId ?? event.captureGroupId ?? event.id}</td>
                  <td className="p-3">
                    <details>
                      <summary className="cursor-pointer text-primary">Timeline</summary>
                      <div className="mt-2 space-y-1 text-xs">
                        <p>sourceDocument: {event.sourceDocument?.id ?? "-"}</p>
                        {event.ingestionLogs.map((log) => (
                          <p key={log.id}>
                            {log.createdAt.toLocaleTimeString("pt-BR")} · {log.stage} · {log.status}
                            {log.errorCode ? ` · ${log.errorCode}` : ""}
                          </p>
                        ))}
                      </div>
                    </details>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-surface p-4 space-y-3 lg:col-span-2">
          <h2 className="font-semibold">Evidências assinadas</h2>
          <div className="space-y-2 text-sm">
            {artifacts.map((artifact) => (
              <div key={artifact.id} className="border border-border rounded-xl p-3">
                <p className="font-medium">{artifact.artifactType}</p>
                <p className="text-xs text-secondary">{artifact.createdAt.toLocaleString("pt-BR")} · key {artifact.signatureKeyId}</p>
                <a className="text-xs text-primary hover:underline" href={`/verify/${artifact.verificationToken}`} target="_blank" rel="noreferrer">
                  Verificar autenticidade
                </a>
              </div>
            ))}
            {artifacts.length === 0 ? <p className="text-secondary">Nenhum artefato assinado ainda.</p> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
          <h2 className="font-semibold">Quotas</h2>
          <div className="space-y-2 text-xs">
            {quotaUsage.map((row) => (
              <div key={row.quota.id} className="rounded-lg border border-border p-2">
                <p className="font-medium">{row.quota.capability} {row.quota.provider ? `· ${row.quota.provider}` : ""}</p>
                <p>requests: {row.usage.requests}/{row.quota.maxRequests ?? "∞"}</p>
                <p>tokens in/out: {row.usage.tokensIn}/{row.usage.tokensOut}</p>
                <p>uso: {row.usage.usagePct.toFixed(1)}%</p>
              </div>
            ))}
            {quotaUsage.length === 0 ? <p className="text-secondary">Sem políticas de quota configuradas.</p> : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 space-y-2">
        <h2 className="font-semibold">Saúde das automações</h2>
        <div className="grid md:grid-cols-2 gap-2 text-xs">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-lg border border-border p-2">
              <p className="font-medium">{job.jobName}</p>
              <p>{job.status} · itens {job.itemCount}</p>
              <p className="text-secondary">{job.createdAt.toLocaleString("pt-BR")}</p>
            </div>
          ))}
          {jobs.length === 0 ? <p className="text-secondary">Nenhuma execução registrada.</p> : null}
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
          <h2 className="font-semibold">Qualidade e fricção (Wave 5)</h2>
          <div className="space-y-2 text-xs">
            {qualityMetrics.map((metric) => (
              <div key={metric.id} className="rounded-lg border border-border p-2">
                <p className="font-medium">{metric.metricCode}</p>
                <p>{(metric.metricValue * 100).toFixed(1)}%</p>
                <p className="text-secondary">{metric.computedAt.toLocaleString("pt-BR")}</p>
              </div>
            ))}
            {qualityMetrics.length === 0 ? <p className="text-secondary">Sem snapshots de qualidade ainda.</p> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
          <h2 className="font-semibold">Políticas ativas e rollback</h2>
          {activePolicies.map((policy) => (
            <div key={policy.id} className="rounded-lg border border-border p-3 text-xs space-y-2">
              <p className="font-medium">{policy.policyType} v{policy.version}</p>
              <p className="text-secondary">Ativada em {policy.activatedAt?.toLocaleString("pt-BR") ?? "-"}</p>
              <form action={async () => {
                "use server";
                await rollbackActivePolicy(policy.policyType);
              }}>
                <button className="rounded-lg border border-border px-2 py-1 hover:bg-white/5">Rollback seguro</button>
              </form>
            </div>
          ))}
          {activePolicies.length === 0 ? <p className="text-secondary text-xs">Sem políticas ativas.</p> : null}
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
          <h2 className="font-semibold">Calibrações recentes</h2>
          {calibrations.map((run) => (
            <div key={run.id} className="rounded-lg border border-border p-2 text-xs">
              <p className="font-medium">{run.policyType} · {run.mode}</p>
              <p>{run.applied ? "aplicada" : "recomendação"} · {run.reason ?? "-"}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
          <h2 className="font-semibold">Experimentos / Kill switch</h2>
          {experiments.map((experiment) => (
            <div key={experiment.id} className="rounded-lg border border-border p-2 text-xs space-y-2">
              <p className="font-medium">{experiment.key}</p>
              <p>{experiment.status} · {experiment.targetScope}</p>
              {experiment.status === "RUNNING" ? (
                <form action={async () => {
                  "use server";
                  await disableExperiment(experiment.id);
                }}>
                  <button className="rounded-lg border border-border px-2 py-1 hover:bg-white/5">Desligar experimento</button>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <Link href="/inbox" className="inline-flex text-sm font-semibold text-primary hover:underline">
        Voltar para Inbox
      </Link>
    </div>
  );
}
