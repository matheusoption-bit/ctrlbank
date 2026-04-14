import React from "react";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import DashboardClient from "@/components/dashboard-client";

export default async function DashboardPage() {
  const { user, session } = await validateRequest();

  // Redirect to login if not authenticated
  if (!user || !session) {
    redirect("/login");
  }

  // Type assertion to ensure proper typing for the client component
  const userData = {
    id: user.id,
    email: (user as any).email,
    name: (user as any).name,
  };

  return <DashboardClient user={userData} />;
}
