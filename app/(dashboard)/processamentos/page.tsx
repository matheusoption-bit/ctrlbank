import Link from "next/link";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scopeWhere } from "@/lib/security/scope";

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

      <Link href="/inbox" className="inline-flex text-sm font-semibold text-primary hover:underline">
        Voltar para Inbox
      </Link>
    </div>
  );
}
