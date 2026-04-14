"use client";

import { LogOut } from "lucide-react";
import { handleLogout } from "@/lib/actions/auth.actions";

interface HeaderProps {
  userName: string | null;
}

export function Header({ userName }: HeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center justify-between h-16 px-6">
        <h1 className="text-xl font-bold tracking-tighter text-white">
          Ctrl<span className="text-primary">Bank</span>
        </h1>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-secondary max-w-[100px] truncate">
            {userName ? `Olá, ${userName.split(" ")[0]}` : "Olá"}
          </span>
          <form action={handleLogout}>
            <button
              type="submit"
              className="p-2 text-secondary hover:text-danger rounded-full hover:bg-white/5 transition-colors"
              aria-label="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
