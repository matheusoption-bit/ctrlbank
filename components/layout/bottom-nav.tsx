"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, ArrowRightLeft, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Contas", href: "/contas", icon: CreditCard },
  { name: "Transações", href: "/transacoes", icon: ArrowRightLeft },
  { name: "Perfil", href: "/perfil", icon: UserCircle },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 z-50 w-full md:hidden bg-background/80 backdrop-blur-md border-t border-white/10 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          // Para a home (dashboard), só é active se for exatamente "/"
          const isActuallyActive = item.href === "/" ? pathname === "/" : isActive;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActuallyActive ? "text-primary" : "text-secondary hover:text-white"
              )}
            >
              <item.icon className="w-6 h-6" strokeWidth={isActuallyActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
