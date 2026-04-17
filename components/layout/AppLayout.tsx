"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Wallet, 
  Inbox, 
  Target, 
  Users, 
  BarChart3, 
  Settings2,
  Menu,
  X,
  Sun,
  Moon,
  User as UserIcon,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/saude", icon: Activity, label: "Saúde" },
  { href: "/caixa", icon: Wallet, label: "Caixa" },
  { href: "/inbox", icon: Inbox, label: "Inbox", badge: 3 },
  { href: "/metas", icon: Target, label: "Metas" },
  { href: "/familia", icon: Users, label: "Família" },
  { href: "/relatorios", icon: BarChart3, label: "Relatórios" },
  { href: "/configuracoes", icon: Settings2, label: "Configurações" },
];

interface AppLayoutProps {
  children: React.ReactNode;
  user: { name: string | null; email: string } | null;
  householdName?: string;
}

export default function AppLayout({ children, user, householdName = "Minha Família" }: AppLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <div className={cn("min-h-screen bg-background text-foreground flex flex-col md:flex-row", isDark ? "dark" : "")}>
      
      {/* ── Sidebar (Desktop) ── */}
      <aside className="hidden md:flex flex-col w-72 bg-surface border-r border-border sticky top-0 h-screen z-30">
        <div className="p-8">
          <Link href="/saude" className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tighter">
              <span className="text-primary">Ctrl</span>
              <span className="text-white">Bank</span>
            </h1>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, icon: Icon, label, badge }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group",
                  active 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-secondary hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={20} className={cn("transition-colors", active ? "text-primary" : "group-hover:text-white")} />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-black">
                    {badge}
                  </span>
                )}
                {active && (
                  <motion.div 
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black border border-primary/30">
              {user?.name?.charAt(0) || <UserIcon size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white">{user?.name || "Usuário"}</p>
              <p className="text-[10px] text-secondary font-medium uppercase tracking-wider truncate">{householdName}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="flex-1 flex items-center justify-center p-2.5 rounded-xl bg-surface-2 border border-border text-secondary hover:text-white transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <form action="/api/auth/logout" method="POST" className="flex-1">
              <button className="w-full flex items-center justify-center p-2.5 rounded-xl bg-surface-2 border border-border text-secondary hover:text-negative transition-colors">
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* ── Mobile Header ── */}
      <header className="md:hidden flex items-center justify-between p-4 bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <Link href="/saude">
          <h1 className="text-xl font-black tracking-tighter">
            <span className="text-primary">Ctrl</span>
            <span className="text-white">Bank</span>
          </h1>
        </Link>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-secondary"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black border border-primary/30 text-xs">
            {user?.name?.charAt(0) || <UserIcon size={16} />}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto p-6 md:p-12 pb-32 md:pb-12">
          {children}
        </div>
      </main>

      {/* ── Bottom Nav (Mobile) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-xl border-t border-border px-2 py-3 pb-safe-area flex items-center justify-around">
        {NAV_ITEMS.slice(0, 5).map(({ href, icon: Icon, label, badge }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[64px] transition-all",
                active ? "text-primary" : "text-secondary"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl relative transition-all",
                active ? "bg-primary/10" : ""
              )}>
                <Icon size={22} />
                {badge && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] px-1 rounded-full min-w-[14px] text-center font-black border-2 border-surface">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold">{label}</span>
            </Link>
          );
        })}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="flex flex-col items-center gap-1 min-w-[64px] text-secondary"
        >
          <div className="p-2">
            <Menu size={22} />
          </div>
          <span className="text-[10px] font-bold">Mais</span>
        </button>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-surface z-50 md:hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-border">
                <h2 className="font-black text-xl">Menu</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-secondary">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 p-4 space-y-2">
                {NAV_ITEMS.map(({ href, icon: Icon, label, badge }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all",
                        active ? "bg-primary/10 text-primary" : "text-secondary"
                      )}
                    >
                      <Icon size={24} />
                      <span className="flex-1">{label}</span>
                      {badge && (
                        <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-black">
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
              <div className="p-6 border-t border-border">
                <form action="/api/auth/logout" method="POST">
                  <button className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-surface-2 border border-border text-negative font-bold">
                    <LogOut size={20} /> Sair da Conta
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
