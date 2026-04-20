import { COPY } from "@/lib/copy/ctrlbank";
import { searchGlobal } from "@/app/actions/search";
import BuscarPageClient from "@/app/(dashboard)/buscar/BuscarPageClient";

export const metadata = { title: COPY.search.title };

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const initialQuery = params.q?.trim() ?? "";
  const initialResults = initialQuery
    ? await searchGlobal(initialQuery)
    : { query: "", groups: [], totalResults: 0 };

  return <BuscarPageClient initialQuery={initialQuery} initialResults={initialResults} />;
}
