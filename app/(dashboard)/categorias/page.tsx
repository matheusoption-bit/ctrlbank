import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getCategories } from "@/app/actions/categories";
import CategoriasPageClient from "./CategoriasPageClient";

export const metadata = { title: "Categorias" };

export default async function CategoriasPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const categories = await getCategories();

  return <CategoriasPageClient categories={categories} />;
}
