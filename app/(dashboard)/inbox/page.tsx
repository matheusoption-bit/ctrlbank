import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import InboxPageClient from "./InboxPageClient";

export default async function InboxPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  let events: Array<{
    id: string;
    source: string;
    inputType: string;
    createdAt: Date;
    decision: string;
    captureGroupId: string | null;
    createdTransactionId: string | null;
    normalizedDraft: unknown;
  }> = [];
  let eventsLoadError: string | null = null;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { householdId: true },
    });

    const scopeOr = [{ userId: user.id }, ...(dbUser?.householdId ? [{ householdId: dbUser.householdId }] : [])];

    events = await prisma.aiCaptureEvent.findMany({
      where: { OR: scopeOr },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        source: true,
        inputType: true,
        createdAt: true,
        decision: true,
        captureGroupId: true,
        createdTransactionId: true,
        normalizedDraft: true,
      },
    });
  } catch (error) {
    console.error("[inbox/page] failed to load events", error);
    eventsLoadError = "Não foi possível carregar o histórico agora. Você ainda pode enviar novos arquivos.";
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Inbox</h1>
        <p className="text-secondary mt-1">Solte comprovantes, extratos e faturas. A IA lê, organiza e propõe — você aprova.</p>
      </header>

      <InboxPageClient
        events={events.map((event) => ({
          ...event,
          createdAt: event.createdAt.toISOString(),
          normalizedDraft:
            event.normalizedDraft && typeof event.normalizedDraft === "object"
              ? (event.normalizedDraft as { description?: string; amount?: number; categoryName?: string })
              : null,
        }))}
        eventsLoadError={eventsLoadError}
      />
    </div>
  );
}
