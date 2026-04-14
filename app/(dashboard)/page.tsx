import React from "react";
import { validateSession } from "@/lib/auth";
import DashboardClient from "@/components/dashboard-client";

export default async function DashboardPage() {
  const { user } = await validateSession();

  // DashboardLayout já redireciona para /login se não autenticado,
  // mas mantemos como fallback de segurança
  if (!user) return null;

  return (
    <DashboardClient
      user={{
        id: user.id,
        email: user.email,
        name: user.name,
      }}
    />
  );
}
