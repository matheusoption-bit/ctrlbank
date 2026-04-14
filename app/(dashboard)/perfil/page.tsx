import { validateSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserCircle, Mail, Shield, LogOut, Home } from "lucide-react";
import { handleLogout } from "@/lib/actions/auth.actions";
import { PremiumCard } from "@/components/ui/premium-card";

export default async function PerfilPage() {
  const { user } = await validateSession();
  if (!user) redirect("/login");

  const firstName = user.name?.split(" ")[0] || user.email.split("@")[0];
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-semibold tracking-tight">Meu Perfil</h1>
        <p className="text-secondary text-sm mt-1">Gerencie sua conta</p>
      </div>

      {/* Avatar */}
      <PremiumCard className="flex flex-col items-center text-center py-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-primary">{initials}</span>
        </div>
        <p className="text-lg font-semibold">{user.name || firstName}</p>
        <p className="text-sm text-secondary mt-0.5">{user.email}</p>
      </PremiumCard>

      {/* Info Cards */}
      <div className="space-y-2">
        <PremiumCard className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Mail className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <p className="section-label">Email</p>
            <p className="text-sm font-medium mt-0.5">{user.email}</p>
          </div>
        </PremiumCard>

        <PremiumCard className="flex items-center gap-4">
          <div className="p-2 bg-success/10 rounded-lg">
            <Shield className="w-5 h-5 text-success" strokeWidth={1.5} />
          </div>
          <div>
            <p className="section-label">Segurança</p>
            <p className="text-sm font-medium mt-0.5">Conta protegida</p>
          </div>
        </PremiumCard>

        <PremiumCard className="flex items-center gap-4">
          <div className="p-2 bg-info/10 rounded-lg">
            <Home className="w-5 h-5 text-info" strokeWidth={1.5} />
          </div>
          <div>
            <p className="section-label">Household</p>
            <p className="text-sm font-medium mt-0.5">Família {firstName}</p>
          </div>
        </PremiumCard>
      </div>

      {/* Logout */}
      <form action={handleLogout}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 btn-outline text-danger border-danger/30 hover:bg-danger/10 hover:border-danger"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </form>
    </div>
  );
}
