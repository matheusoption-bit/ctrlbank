"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, ArrowRightLeft, UserCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { handleLogout } from "@/lib/actions/auth.actions";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Contas e Cartões", href: "/contas", icon: CreditCard },
  { name: "Transações", href: "/transacoes", icon: ArrowRightLeft },
  { name: "Meu Perfil", href: "/perfil", icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-white/10 bg-background/50 sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tighter text-white">
          Ctrl<span className="text-primary">Bank</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary font-semibold" 
                  : "text-secondary hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <form action={handleLogout}>
          <button 
            type="submit"
            className="flex items-center gap-3 px-4 py-3 w-full text-secondary hover:text-danger hover:bg-danger/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair da Conta
          </button>
        </form>
      </div>
    </aside>
  );
}
