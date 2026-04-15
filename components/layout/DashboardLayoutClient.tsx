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
  BotMessageSquare,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/",             icon: LayoutDashboard, label: "Início"      },
  { href: "/contas",       icon: Wallet,          label: "Contas"      },
  { href: "/transacoes",   icon: ArrowLeftRight,  label: "Extrato"     },
  { href: "/orcamentos",   icon: PieChart,        label: "Orçamentos"  },
  { href: "/relatorios",   icon: BookOpen,        label: "Relatórios"  },
];

const SIDEBAR_ITEMS = [
  ...NAV_ITEMS,
  { href: "/categorias",    icon: Tag,              label: "Categorias"    },
  { href: "/metas",         icon: Target,           label: "Metas"         },
  { href: "/recorrentes",   icon: Repeat,           label: "Recorrentes"   },
  { href: "/integracoes",   icon: Puzzle,           label: "Integrações"   },
  { href: "/familia",       icon: Users,            label: "Família"       },
  { href: "/perfil",        icon: Settings,         label: "Meu Perfil"    },
];

const FAB_OPTIONS = [
  { icon: ArrowUpRight,  label: "Nova Receita",     type: "income",   color: "bg-positive" },
  { icon: ArrowDownLeft, label: "Nova Despesa",      type: "expense",  color: "bg-negative" },
  { icon: RefreshCw,     label: "Transferência",    type: "transfer", color: "bg-info"     },
];

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userName: string | null;
}

export default function DashboardLayoutClient({
  children,
  userName,
}: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const [fabOpen, setFabOpen] = useState(false);

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
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-24 md:py-10 md:px-10">
          {children}
        </div>
      </main>

      {/* ── Bottom Nav (mobile) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        {/* Gradiente de fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none" />

        <div
          className="relative mx-4 mb-3 max-h-dvh flex flex-col justify-end"
          style={{ marginBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="bg-surface/95 backdrop-blur-xl border border-border rounded-2xl px-2 py-2 flex items-center justify-around shadow-soft-xl">
            {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
              const active = isActive(href);
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
                  <span className="text-[10px] font-semibold leading-none">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── FAB Rosa – Nova Transação (apenas mobile) ── */}
      <div className="fixed z-50 md:hidden"
        style={{
          right: "1.25rem",
          bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* Opções do FAB */}
        <AnimatePresence>
          {fabOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-16 right-0 flex flex-col gap-3 items-end"
            >
              {FAB_OPTIONS.map(({ icon: Icon, label, type, color }) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3"
                >
                  <span className="bg-surface border border-border text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-soft whitespace-nowrap">
                    {label}
                  </span>
                  <Link
                    href={`/transacoes/nova?tipo=${type}`}
                    onClick={() => setFabOpen(false)}
                    className={`w-11 h-11 rounded-full ${color} text-white flex items-center justify-center shadow-soft-md transition-all hover:scale-110 active:scale-95`}
                  >
                    <Icon size={18} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão principal */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFabOpen(!fabOpen)}
          className="w-14 h-14 rounded-full bg-primary text-white shadow-glow-primary flex items-center justify-center transition-all duration-200"
          aria-label={fabOpen ? "Fechar menu" : "Nova transação"}
        >
          <motion.div
            animate={{ rotate: fabOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {fabOpen ? <X size={24} /> : <Plus size={24} />}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
