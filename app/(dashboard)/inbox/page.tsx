import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import InboxPageClient from "./InboxPageClient";

export default async function InboxPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });

  const events = await prisma.aiCaptureEvent.findMany({
    where: {
      OR: [
        { userId: user.id },
        ...(dbUser?.householdId ? [{ householdId: dbUser.householdId }] : []),
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      source: true,
      inputType: true,
      createdAt: true,
      rawText: true,
      normalizedDraft: true,
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Inbox</h1>
        <p className="text-secondary mt-1">Central de captura de eventos e movimentos.</p>
      </header>

      <InboxPageClient
        events={events.map((event) => ({
          ...event,
          createdAt: event.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
