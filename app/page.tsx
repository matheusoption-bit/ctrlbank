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

  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  return <DashboardClient user={userData} />;
}
