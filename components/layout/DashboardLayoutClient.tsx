"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { handleLogout } from "@/lib/actions/auth.actions";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Tag,
  PieChart,
  Users,
  Target,
  Settings,
  Plus,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  LogOut,
  BookOpen,
  Repeat,
  Puzzle,
  Sparkles,
  Inbox,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { href: "/",              icon: LayoutDashboard, label: "Saúde"         },
  { href: "/caixa",         icon: Wallet,          label: "Caixa"         },
  { href: "/inbox",         icon: Inbox,           label: "Inbox"         },
  { href: "/metas",         icon: Target,          label: "Metas"         },
  { href: "/relatorios",    icon: BookOpen,        label: "Relatórios"    },
  { href: "/familia",       icon: Users,           label: "Família"       },
  { href: "/configuracoes", icon: Settings,        label: "Configurações" },
];

const MOBILE_NAV_ITEMS = [
  { href: "/",          icon: LayoutDashboard, label: "Saúde"    },
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
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="min-h-dvh bg-background">
      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden md:flex flex-col w-72 min-h-dvh bg-black border-r border-white/5 fixed top-0 left-0 z-40">
        {/* Logo */}
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tighter">
              <span className="text-primary">Ctrl</span>
              <span className="text-white">Bank</span>
            </h1>
          </Link>
        </div>

        {/* User info */}
        {userName && (
          <div className="px-4 py-3 border-b border-border">
            <p className="text-secondary text-xs">Olá,</p>
            <p className="font-semibold text-sm truncate">{userName}</p>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {SIDEBAR_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            const showBadge = href === "/familia" && familyBadge;
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-secondary hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 flex-shrink-0 transition-colors ${
                    active ? "text-primary" : "group-hover:text-white"
                  }`}
                  size={18}
                />
                {label}
                {showBadge && (
                  <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                )}
                {active && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 w-0.5 h-6 bg-primary rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <form action={handleLogout}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-secondary hover:bg-white/5 hover:text-white transition-all w-full"
            >
              <LogOut size={18} className="flex-shrink-0" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="md:pl-72 w-full min-h-dvh">
        <div
          className="max-w-6xl mx-auto px-4 pb-safe-nav md:py-10 md:px-10"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
        >
          {children}
        </div>
      </main>

      {/* ── Bottom Nav (mobile) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        {/* Gradiente de fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none" />

        <div
          className="relative mx-4 mb-3 max-h-dvh flex flex-col justify-end"
          style={{ marginBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="bg-surface/95 backdrop-blur-xl border border-border rounded-2xl px-2 py-2 flex items-center justify-around shadow-soft-xl">
            {MOBILE_NAV_ITEMS.map((item) => {
              if (item.id === "composer") {
                const Icon = item.icon;
                return (
                  <button
                    key="composer"
                    onClick={() => {
                      // Dispara o evento pro AIChatWidget abrir
                      window.dispatchEvent(new Event("toggle-composer"));
                    }}
                    className="relative -top-6 w-14 h-14 rounded-full bg-primary shadow-glow-primary flex items-center justify-center text-white transition-transform active:scale-95"
                    aria-label="Assistente IA"
                  >
                    <Icon size={24} fill="currentColor" />
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
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-150 min-w-0 ${
                    active ? "text-primary" : "text-secondary"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-150 ${
                      active ? "bg-primary/10" : ""
                    }`}
                  >
                    <Icon size={20} className={active ? "text-primary" : ""} />
                  </div>
                  <span className="text-[10px] font-semibold leading-none">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

    </div>
  );
}
