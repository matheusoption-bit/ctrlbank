import { DetectedSubscriptionStatus } from "@prisma/client";
import AssinaturasPageClient from "@/app/(dashboard)/assinaturas/AssinaturasPageClient";
import { getSubscriptionsPageData } from "@/app/actions/subscriptions";

export const metadata = { title: "Assinaturas" };

function parseStatus(value: string | undefined): DetectedSubscriptionStatus | "ALL" {
  if (!value) return "ALL";
  if (Object.values(DetectedSubscriptionStatus).includes(value as DetectedSubscriptionStatus)) {
    return value as DetectedSubscriptionStatus;
  }
  return "ALL";
}

export default async function AssinaturasPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const initialSearch = params.search?.trim() ?? "";
  const initialStatus = parseStatus(params.status);

  const pageData = await getSubscriptionsPageData({
    search: initialSearch,
    status: initialStatus === "ALL" ? undefined : initialStatus,
  });

  return (
    <AssinaturasPageClient
      initialSearch={initialSearch}
      initialStatus={initialStatus}
      summary={pageData.summary}
      subscriptions={pageData.data}
    />
  );
}
