"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, ArrowRightLeft, Tag, UserCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { handleLogout } from "@/lib/actions/auth.actions";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Contas e Cartões", href: "/contas", icon: CreditCard },
  { name: "Transações", href: "/transacoes", icon: ArrowRightLeft },
  { name: "Categorias", href: "/categorias", icon: Tag },
  { name: "Meu Perfil", href: "/perfil", icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-border bg-[#0D0D0D] sticky top-0">
      {/* Logo */}
      <div className="px-7 pt-8 pb-6">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Ctrl<span className="text-primary">Bank</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-secondary hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <form action={handleLogout}>
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-3 w-full text-secondary hover:text-danger hover:bg-danger/10 rounded-xl transition-colors text-sm"
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
            Sair da Conta
          </button>
        </form>
      </div>
    </aside>
  );
}
