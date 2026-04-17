"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { handleLogout } from "@/lib/actions/auth.actions";
import {
  LayoutDashboard,
  Wallet,
  Target,
  Settings,
  LogOut,
  BookOpen,
  Sparkles,
  Inbox,
  Users,
  History,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { href: "/saude",         icon: LayoutDashboard, label: "Saúde"         },
  { href: "/caixa",         icon: Wallet,          label: "Caixa"         },
  { href: "/inbox",         icon: Inbox,           label: "Inbox"         },
  { href: "/processamentos", icon: History,         label: "Histórico"     },
  { href: "/metas",         icon: Target,          label: "Metas"         },
  { href: "/relatorios",    icon: BookOpen,        label: "Relatórios"    },
  { href: "/familia",       icon: Users,           label: "Família"       },
  { href: "/configuracoes", icon: Settings,        label: "Configurações" },
];

const MOBILE_NAV_ITEMS = [
  { href: "/saude",     icon: LayoutDashboard, label: "Saúde"    },
  { href: "/caixa",     icon: Wallet,          label: "Caixa"    },
  { id: "composer",     icon: Sparkles,        label: "Composer" },
  { href: "/inbox",     icon: Inbox,           label: "Inbox"    },
  { href: "/metas",     icon: Target,          label: "Metas"    },
];

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userName: string | null;
  familyBadge?: boolean;
}

export default function DashboardLayoutClient({
  children,
  userName,
  familyBadge = false,
}: DashboardLayoutClientProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const initials = userName
    ? userName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="min-h-dvh bg-background">
      {/* ── Sidebar (desktop) ─────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[260px] min-h-dvh bg-[#030303] border-r border-white/[0.06] fixed top-0 left-0 z-40">
        {/* Brand */}
        <div className="px-7 pt-8 pb-6">
          <Link href="/" className="inline-flex items-baseline gap-0.5">
            <span className="text-lg font-black tracking-[-0.04em] text-primary">Ctrl</span>
            <span className="text-lg font-black tracking-[-0.04em] text-foreground">Bank</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {SIDEBAR_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            const showBadge = href === "/familia" && familyBadge;
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group ${
                  active
                    ? "text-primary"
                    : "text-[#6b6b6b] hover:text-white/80 hover:bg-white/[0.03]"
                }`}
              >
                <Icon
                  className={`flex-shrink-0 transition-colors ${
                    active ? "text-primary" : "group-hover:text-white/80"
                  }`}
                  size={17}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                {label}
                {showBadge && (
                  <span className="ml-auto w-1.5 h-1.5 bg-accent-danger rounded-full animate-pulse flex-shrink-0" />
                )}
                {active && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 w-[3px] h-5 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-3 pb-6 space-y-2">
          {userName && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[11px] font-bold text-primary flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground truncate">{userName}</p>
                <p className="text-[10px] text-[#555] leading-none mt-0.5">Administrador</p>
              </div>
            </div>
          )}
          <form action={handleLogout}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[13px] font-medium text-[#555] hover:text-white/70 hover:bg-white/[0.03] transition-all"
            >
              <LogOut size={16} className="flex-shrink-0" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="md:pl-[260px] w-full min-h-dvh">
        <div
          className="max-w-[1120px] mx-auto px-5 pb-safe-nav md:py-10 md:px-8 lg:px-10"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
        >
          {children}
        </div>
      </main>

      {/* ── Bottom Nav (mobile) ──────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        {/* Gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none" />

        <div
          className="relative mx-3 flex flex-col justify-end"
          style={{ marginBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/[0.06] rounded-2xl px-1.5 py-1.5 flex items-center justify-around shadow-soft-xl">
            {MOBILE_NAV_ITEMS.map((item) => {
              if (item.id === "composer") {
                const Icon = item.icon;
                return (
                  <button
                    key="composer"
                    onClick={() => {
                      window.dispatchEvent(new Event("toggle-composer"));
                    }}
                    className="relative -top-5 w-[52px] h-[52px] rounded-full bg-primary shadow-[0_0_24px_rgba(25,255,99,0.35)] flex items-center justify-center text-black transition-transform active:scale-90 hover:shadow-[0_0_32px_rgba(25,255,99,0.5)]"
                    aria-label="Assistente IA"
                  >
                    <Icon size={22} fill="currentColor" />
                  </button>
                );
              }

              const href = item.href as string;
              const active = isActive(href);
              const Icon = item.icon;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-150 min-w-0 ${
                    active ? "text-primary" : "text-[#555]"
                  }`}
                >
                  <Icon size={19} strokeWidth={active ? 2.2 : 1.6} />
                  <span className={`text-[9px] font-semibold leading-none ${active ? "" : "opacity-70"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
