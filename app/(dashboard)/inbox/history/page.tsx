import Link from "next/link";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function InboxHistoryPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { householdId: true } });
  const scopeOr = [{ userId: user.id }, ...(dbUser?.householdId ? [{ householdId: dbUser.householdId }] : [])];

  const events = await prisma.aiCaptureEvent.findMany({
    where: { OR: scopeOr },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      captureGroupId: true,
      source: true,
      inputType: true,
      decision: true,
      createdAt: true,
      createdTransactionId: true,
    },
  });

  const grouped = new Map<string, typeof events>();
  for (const event of events) {
    const key = event.captureGroupId || event.id;
    grouped.set(key, [...(grouped.get(key) ?? []), event]);
  }

  const rows = Array.from(grouped.entries()).map(([groupId, groupEvents]) => {
    const createdAt = groupEvents[0]?.createdAt;
    const processed = groupEvents.filter((item) => Boolean(item.createdTransactionId)).length;
    const pending = groupEvents.filter((item) => item.decision === "transaction_draft" || item.decision === "batch_review").length;
    const errors = groupEvents.filter((item) => item.decision === "clarification_needed").length;

    const status = errors > 0 ? "erro" : pending > 0 ? "pendente" : "processado";

    return {
      groupId,
      createdAt,
      channels: Array.from(new Set(groupEvents.map((item) => item.source))).join(", "),
      inputTypes: Array.from(new Set(groupEvents.map((item) => item.inputType))).join(", "),
      detected: groupEvents.length,
      processed,
      pending,
      errors,
      status,
    };
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Inbox · Histórico</h1>
        <p className="text-secondary mt-1">Uploads com status processado, pendente ou erro, com opção de reprocessar.</p>
      </header>

      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-secondary">
            <tr>
              <th className="text-left p-3">Data</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Canal / Entrada</th>
              <th className="text-left p-3">Itens</th>
              <th className="text-left p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.groupId} className="border-t border-border">
                <td className="p-3">{row.createdAt?.toLocaleString("pt-BR")}</td>
                <td className="p-3 uppercase text-xs">{row.status}</td>
                <td className="p-3">
                  <p>{row.channels}</p>
                  <p className="text-xs text-secondary">{row.inputTypes}</p>
                </td>
                <td className="p-3">{row.detected}</td>
                <td className="p-3">
                  <Link href={`/inbox${row.groupId ? `?captureGroupId=${row.groupId}` : ""}`} className="text-primary hover:underline">
                    Reprocessar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link href="/inbox" className="inline-flex text-sm font-semibold text-primary hover:underline">
        Voltar para Inbox
      </Link>
    </div>
  );
}
