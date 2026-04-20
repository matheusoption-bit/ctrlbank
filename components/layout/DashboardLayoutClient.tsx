"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { handleLogout } from "@/lib/actions/auth.actions";
import {
  Menu,
  Search,
  Clock3,
  User,
  X,
  Home,
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
  GitBranch,
  Tags,
  Repeat2,
} from "lucide-react";

const MOBILE_NAV_ITEMS = [
  { href: "/",          icon: Home,            label: "Início"   },
  { href: "/caixa",     icon: Wallet,          label: "Caixa"    },
  { id: "composer",     icon: Sparkles,        label: "Composer" },
  { href: "/inbox",     icon: Inbox,           label: "Inbox"    },
  { href: "/saude",     icon: LayoutDashboard, label: "Saúde"    },
];

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userName: string | null;
  familyBadge?: boolean;
  hasHouseholdTeam?: boolean;
}

export default function DashboardLayoutClient({
  children,
  userName,
  familyBadge = false,
  hasHouseholdTeam = false,
}: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isActive = (href: string) => {
    const normalizedHref = href.split("#")[0]?.split("?")[0] ?? href;
    return normalizedHref === "/"
      ? pathname === "/"
      : pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`);
  };

  const initials = userName
    ? userName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const sidebarItems = [
    { href: "/", icon: Home, label: "Início" },
    { href: "/saude", icon: LayoutDashboard, label: "Saúde" },
    { href: "/fluxo", icon: GitBranch, label: "Fluxo" },
    { href: "/caixa", icon: Wallet, label: "Caixa" },
    { href: "/assinaturas", icon: Repeat2, label: "Assinaturas" },
    { href: "/inbox", icon: Inbox, label: "Inbox" },
    { href: "/processamentos", icon: History, label: "Processamentos" },
    { href: "/metas", icon: Target, label: "Metas" },
    { href: "/relatorios", icon: BookOpen, label: "Relatórios" },
    hasHouseholdTeam
      ? { href: "/familia", icon: Users, label: "Família" }
      : { href: "/configuracoes#convidar", icon: Users, label: "Convidar família" },
    { href: "/configuracoes", icon: Settings, label: "Configurações" },
  ];

  const mobileDrawerSections = [
    {
      title: "Operação",
      items: [
        { href: "/", label: "Início", icon: Home },
        { href: "/saude", label: "Saúde", icon: LayoutDashboard },
        { href: "/caixa", label: "Caixa", icon: Wallet },
        { href: "/assinaturas", label: "Assinaturas", icon: Repeat2 },
        { href: "/inbox", label: "Inbox", icon: Inbox },
        { href: "/processamentos", label: "Processamentos", icon: History },
        { href: "/metas", label: "Metas", icon: Target },
        { href: "/relatorios", label: "Relatórios", icon: BookOpen },
        { href: "/fluxo", label: "Fluxo", icon: GitBranch },
      ],
    },
    {
      title: "Configuração",
      items: [
        { href: "/contas", label: "Contas", icon: Wallet },
        { href: "/categorias", label: "Categorias", icon: Tags },
        { href: "/configuracoes", label: "Configurações", icon: Settings },
      ],
    },
    {
      title: "Família",
      items: hasHouseholdTeam
        ? [{ href: "/familia", label: "Família", icon: Users }]
        : [{ href: "/configuracoes#convidar", label: "Convidar família", icon: Users }],
    },
  ];

  return (
    <div className="min-h-dvh bg-background">
      {/* ── Sidebar (desktop) ─────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[260px] min-h-dvh bg-surface border-r border-border fixed top-0 left-0 z-40">
        {/* Brand */}
        <div className="px-7 pt-8 pb-6">
          <Link href="/" aria-label="CtrlBank Início" className="inline-flex items-baseline gap-0.5">
            <span className="text-lg font-black tracking-[-0.04em] text-accent-primary">Ctrl</span>
            <span className="text-lg font-black tracking-[-0.04em] text-foreground">Bank</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {sidebarItems.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            const showBadge = href === "/familia" && familyBadge;
            return (
              <Link
                key={`${href}-${label}`}
                href={href}
                aria-label={label}
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

      <header className="fixed top-0 left-0 right-0 md:left-[260px] z-50 border-b border-white/[0.06] bg-[#080808]/90 backdrop-blur-xl">
        <div
          className="max-w-[1120px] mx-auto px-4 md:px-8 lg:px-10 h-[64px] flex items-center justify-between"
          style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        >
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.08] text-[#b8b8b8] hover:text-white hover:bg-white/[0.04] transition-colors md:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={19} />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            <Link
              href="/buscar"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.08] text-[#b8b8b8] hover:text-white hover:bg-white/[0.04] transition-colors"
              aria-label="Buscar"
            >
              <Search size={18} />
            </Link>
            <Link
              href="/processamentos"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.08] text-[#b8b8b8] hover:text-white hover:bg-white/[0.04] transition-colors"
              aria-label="Atividade"
            >
              <Clock3 size={18} />
            </Link>
            <Link
              href="/configuracoes"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.08] text-[#b8b8b8] hover:text-white hover:bg-white/[0.04] transition-colors"
              aria-label="Perfil e configurações"
            >
              <User size={18} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="md:pl-[260px] w-full min-h-dvh">
        <div
          className="max-w-[1120px] mx-auto px-5 pb-safe-nav md:py-10 md:px-8 lg:px-10"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 5.25rem)" }}
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
                    className="relative -top-5 w-[52px] h-[52px] rounded-full bg-primary shadow-[var(--shadow-glow)] flex items-center justify-center text-black transition-transform active:scale-90 hover:shadow-[var(--shadow-glow)]"
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
                  aria-label={item.label}
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

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
              aria-label="Fechar menu"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed left-0 top-0 bottom-0 z-[61] w-[88vw] max-w-[360px] bg-[#090909] border-r border-white/[0.08] md:hidden flex flex-col"
              style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
            >
              <div className="h-[64px] px-4 flex items-center justify-between border-b border-white/[0.06]">
                <p className="text-base font-bold">Menu</p>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.08] text-[#b8b8b8]"
                  aria-label="Fechar menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
                {mobileDrawerSections.map((section) => (
                  <section key={section.title} className="space-y-1.5">
                    <h2 className="px-2 text-[11px] uppercase tracking-[0.12em] text-[#727272] font-semibold">
                      {section.title}
                    </h2>
                    {section.items.map(({ href, label, icon: Icon }) => {
                      const active = isActive(href);
                      return (
                        <Link
                          key={href}
                          href={href}
                          aria-label={label}
                          onClick={() => setIsDrawerOpen(false)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-[#c4c4c4] hover:bg-white/[0.04] hover:text-white"
                          }`}
                        >
                          <Icon size={17} />
                          {label}
                        </Link>
                      );
                    })}
                  </section>
                ))}
              </div>

              <div
                className="px-3 pt-3 pb-4 border-t border-white/[0.06]"
                style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
              >
                <form action={handleLogout}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#c4c4c4] hover:bg-white/[0.04] hover:text-white transition-colors"
                  >
                    <LogOut size={17} />
                    Sair
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
