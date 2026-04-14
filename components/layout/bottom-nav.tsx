"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, ArrowRightLeft, Tag, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Início", href: "/", icon: Home },
  { name: "Contas", href: "/contas", icon: CreditCard },
  { name: "Transações", href: "/transacoes", icon: ArrowRightLeft },
  { name: "Categorias", href: "/categorias", icon: Tag },
  { name: "Perfil", href: "/perfil", icon: UserCircle },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 z-50 w-full md:hidden bg-[#0A0A0A] border-t border-border pb-safe">
      <div className="flex justify-around items-center h-18 px-1">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative",
                isActive ? "text-primary" : "text-secondary"
              )}
            >
              <item.icon
                className="w-6 h-6"
                strokeWidth={isActive ? 2 : 1.5}
              />
              {/* Label only when active (C6 pattern) */}
              <span
                className={cn(
                  "text-[10px] font-medium transition-all duration-200",
                  isActive ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
                )}
              >
                {item.name}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
