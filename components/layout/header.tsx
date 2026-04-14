"use client";

import { LogOut } from "lucide-react";
import { handleLogout } from "@/lib/actions/auth.actions";

interface HeaderProps {
  userName: string | null;
}

export function Header({ userName }: HeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-40 w-full bg-[#0A0A0A] border-b border-border">
      <div className="flex items-center justify-between h-14 px-5">
        <h1 className="text-lg font-bold tracking-tight text-white">
          Ctrl<span className="text-primary">Bank</span>
        </h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-secondary max-w-[100px] truncate">
            {userName ? `Olá, ${userName.split(" ")[0]}` : "Olá"}
          </span>
          <form action={handleLogout}>
            <button
              type="submit"
              className="p-2 text-secondary hover:text-danger rounded-lg hover:bg-white/[0.04] transition-colors"
              aria-label="Sair"
            >
              <LogOut className="w-4.5 h-4.5" strokeWidth={1.5} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
