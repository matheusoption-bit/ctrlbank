# AUDIT_CTRLBANK

## 1. IDENTIDADE DO PROJETO

- Nome: `ctrlbank`
- Versão: `0.1.0`
- Descrição: `não encontrado`
- Última data de commit no main/master: `não encontrado (branch main/master ausente localmente)`
- Total de commits: `165`

### Branches existentes
```bash
* work
```

### Autores nos commits
```bash
Matheus Petri
anthropic-code-agent[bot]
copilot-swe-agent[bot]
matheusoption-bit
```

## 2. STACK E DEPENDÊNCIAS

### package.json (completo)
```json
{
  "name": "ctrlbank",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "node scripts/build.mjs",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run",
    "postinstall": "prisma generate",
    "backlog:export": "tsx scripts/generate-backlog.ts",
    "backfill:totp": "tsx scripts/backfill-totp-secrets.ts",
    "ctrlbank": "tsx scripts/cli/ctrlbank.ts"
  },
  "dependencies": {
    "@google/genai": "^1.50.1",
    "@hookform/resolvers": "^3.10.0",
    "@prisma/client": "^5.21.1",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@types/pdf-parse": "^1.1.5",
    "@types/xlsx": "^0.0.35",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "framer-motion": "^11.11.9",
    "geist": "^1.7.0",
    "jspdf": "^4.2.1",
    "lucide-react": "^0.468.0",
    "next": "16.2.3",
    "openai": "^6.34.0",
    "otplib": "^12.0.1",
    "papaparse": "^5.5.3",
    "pdf-parse": "^2.4.5",
    "qrcode.react": "^4.2.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.72.1",
    "recharts": "^2.13.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^2.5.4",
    "tailwindcss-animate": "^1.0.7",
    "xlsx": "^0.18.5",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.17.1",
    "@types/papaparse": "^5.5.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.0.0",
    "eslint-config-next": "^16.0.0",
    "postcss": "^8.4.47",
    "prisma": "^5.21.1",
    "tailwindcss": "^3.4.14",
    "tsx": "^4.21.0",
    "typescript": "^5.6.3",
    "vitest": "^4.1.4"
  }
}
```

- Package manager detectado: `npm (package-lock.json)`

- Node version detectada: `não encontrado`

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### tailwind.config.ts
```ts
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Core (Editorial Dark) ──────────────────────────────
        background:   "#050505",
        foreground:   "#f5f5f0",
        surface:      "#0b0b0b",
        "surface-2":  "#141414",
        "surface-3":  "#1e1e1e",
        secondary:    "#8a8a8a",
        border:       "rgba(255,255,255,0.10)",

        // ── Design System Tokens Enterprise (6.1) ─────────────────────────────
        "surface-primary":   "#050505",
        "surface-secondary": "#0b0b0b",
        "surface-card":      "#141414",
        "border-subtle":     "rgba(255,255,255,0.10)",
        "text-primary":      "#f5f5f0",
        "text-muted":        "#8a8a8a",

        // ── Accent Semântico ───────────────────────────────────────────────────
        "accent-primary": "#19FF63",
        "accent-warning": "#f59e0b",
        "accent-danger":  "#ef4444",

        // ── Primary Brand (Neon Green) ─────────────────────────────────
        primary: {
          DEFAULT:    "#19FF63",
          50:         "#E6FFE6",
          100:        "#CCFFCC",
          200:        "#99FF99",
          300:        "#66FF66",
          400:        "#33FF33",
          500:        "#19FF63",
          600:        "#00E64D",
          700:        "#00B33C",
          800:        "#00802B",
          900:        "#004D1A",
          foreground: "#050505",
        },
        accent: {
          DEFAULT:    "#19FF63",
          foreground: "#050505",
        },

        // ── Aliases e Brand Secundários ────────────────
        brand: {
          primary: "#19FF63",
        },
        positive:  "#19FF63",
        negative:  "#ef4444",
        warning:   "#f59e0b",
        info:      "#00E5FF",
        success:   "#19FF63",
        danger:    "#ef4444",

        // ── shadcn/ui base tokens ──────────────────────────────────────────────
        card:        { DEFAULT: "#0b0b0b", foreground: "#f5f5f0" },
        popover:     { DEFAULT: "#141414", foreground: "#f5f5f0" },
        muted:       { DEFAULT: "#1e1e1e", foreground: "#8a8a8a" },
        destructive: { DEFAULT: "#ef4444", foreground: "#f5f5f0" },
        input:       "#141414",
        ring:        "#19FF63",
      },
      borderRadius: {
        "3xl":   "24px",
        "4xl":   "32px",
        "20px":  "20px",
        "16px":  "16px",
        "12px":  "12px",
      },
      boxShadow: {
        soft:            "0 2px 12px rgba(0, 0, 0, 0.4)",
        "soft-md":       "0 4px 20px rgba(0, 0, 0, 0.5)",
        "soft-lg":       "0 8px 32px rgba(0, 0, 0, 0.6)",
        "soft-xl":       "0 16px 48px rgba(0, 0, 0, 0.7)",
        "glow-primary":  "0 0 20px rgba(25, 255, 99, 0.3)",
        "glow-positive": "0 0 20px rgba(25, 255, 99, 0.3)",
      },
      spacing: {
        "4.5":        "1.125rem",
        "5.5":        "1.375rem",
        "18":         "4.5rem",
        "22":         "5.5rem",
        "bottom-nav": "5rem",
      },
      fontSize: {
        "2xs":  ["0.625rem", { lineHeight: "0.75rem" }],
        "hero": ["3.5rem", { lineHeight: "1", fontWeight: "900", letterSpacing: "-0.04em" }],
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "var(--font-inter)", "sans-serif"],
        sans:    ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        inter:   ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        geist:   ["var(--font-geist-sans)", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-up-fade": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(25, 255, 99, 0)" },
          "50%":      { boxShadow: "0 0 0 8px rgba(25, 255, 99, 0.15)" },
        },
        "count-up": {
          "0%":   { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer:          "shimmer 2s linear infinite",
        "slide-up-fade":  "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in":       "scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-glow":     "pulse-glow 2s ease-in-out infinite",
        "count-up":       "count-up 0.6s ease-out",
      },
    },
  },
  plugins: [animate],
};

export default config;
```

### vite.config.ts / next.config.js
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async redirects() {
    return [
      {
        source: '/transacoes',
        destination: '/caixa',
        permanent: true,
      },
      {
        source: '/orcamentos',
        destination: '/metas',
        permanent: true,
      },
      {
        source: '/categorias',
        destination: '/configuracoes',
        permanent: true,
      },
      {
        source: '/recorrentes',
        destination: '/configuracoes',
        permanent: true,
      },
      {
        source: '/integracoes',
        destination: '/configuracoes',
        permanent: true,
      },
      {
        source: '/perfil',
        destination: '/configuracoes',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

### postcss.config.js
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### components.json
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

## 3. ÁRVORE DE ARQUIVOS
```bash
tree não disponível: /bin/sh: 1: tree: not found

Listagem manual raiz (até 2 níveis)

Listagem manual de ./app (até 4 níveis)
./app
./app/(dashboard)
./app/(dashboard)/DashboardPageClient.tsx
./app/(dashboard)/buscar
./app/(dashboard)/buscar/page.tsx
./app/(dashboard)/caixa
./app/(dashboard)/caixa/CaixaPageClient.tsx
./app/(dashboard)/caixa/page.tsx
./app/(dashboard)/configuracoes
./app/(dashboard)/configuracoes/page.tsx
./app/(dashboard)/contas
./app/(dashboard)/contas/ContasPageClient.tsx
./app/(dashboard)/contas/page.tsx
./app/(dashboard)/familia
./app/(dashboard)/familia/FamiliaPageClient.tsx
./app/(dashboard)/familia/page.tsx
./app/(dashboard)/inbox
./app/(dashboard)/inbox/InboxPageClient.tsx
./app/(dashboard)/inbox/history
./app/(dashboard)/inbox/history/page.tsx
./app/(dashboard)/inbox/page.tsx
./app/(dashboard)/layout.tsx
./app/(dashboard)/loading.tsx
./app/(dashboard)/metas
./app/(dashboard)/metas/MetasPageClient.tsx
./app/(dashboard)/metas/page.tsx
./app/(dashboard)/page.tsx
./app/(dashboard)/processamentos
./app/(dashboard)/processamentos/page.tsx
./app/(dashboard)/relatorios
./app/(dashboard)/relatorios/RelatoriosPageClient.tsx
./app/(dashboard)/relatorios/page.tsx
./app/(dashboard)/saude
./app/(dashboard)/saude/SaudePageClient.tsx
./app/(dashboard)/saude/page.tsx
./app/actions
./app/actions/2fa.ts
./app/actions/accounts.ts
./app/actions/ai
./app/actions/ai/conversation.ts
./app/actions/ai/recommendations.ts
./app/actions/ai/review.ts
./app/actions/budgets.ts
./app/actions/cashbox.ts
./app/actions/categories.ts
./app/actions/counter.ts
./app/actions/finance-insights.ts
./app/actions/goals.ts
./app/actions/governance.ts
./app/actions/health.ts
./app/actions/household.ts
./app/actions/inbox.ts
./app/actions/recurring.ts
./app/actions/transactions.ts
./app/api
./app/api/ai
./app/api/ai/chat
./app/api/ai/chat/route.ts
./app/api/ai/composer
./app/api/ai/composer/route.ts
./app/api/artifacts
./app/api/artifacts/monthly-dossier
./app/api/artifacts/monthly-dossier/route.ts
./app/api/artifacts/verify
./app/api/artifacts/verify/[token]
./app/api/auth
./app/api/auth/login
./app/api/auth/login/route.ts
./app/api/auth/logout
./app/api/auth/logout/route.ts
./app/api/auth/register
./app/api/auth/register/route.ts
./app/api/auth/verify-2fa
./app/api/auth/verify-2fa/route.ts
./app/api/cron
./app/api/cron/export-backlog
./app/api/cron/export-backlog/route.ts
./app/api/cron/plan-sync
./app/api/cron/plan-sync/route.ts
./app/api/cron/recurring
./app/api/cron/recurring/route.ts
./app/api/cron/wave4
./app/api/cron/wave4/route.ts
./app/api/cron/wave5
./app/api/cron/wave5/route.ts
./app/api/familia
./app/api/familia/monthly-summary
./app/api/familia/monthly-summary/route.ts
./app/api/governance
./app/api/governance/summary
./app/api/governance/summary/route.ts
./app/api/health
./app/api/health/projection
./app/api/health/projection/route.ts
./app/api/health/recommendations
./app/api/health/recommendations/generate
./app/api/health/score
./app/api/health/score/route.ts
./app/api/inbox
./app/api/inbox/confirm
./app/api/inbox/confirm/route.ts
./app/api/inbox/email-webhook
./app/api/inbox/email-webhook/route.ts
./app/api/inbox/parse
./app/api/inbox/parse/route.ts
./app/api/inbox/whatsapp-link
./app/api/inbox/whatsapp-link/route.ts
./app/api/inbox/whatsapp-webhook
./app/api/inbox/whatsapp-webhook/route.ts
./app/api/invite
./app/api/invite/[inviteCode]
./app/api/invite/[inviteCode]/route.ts
./app/api/receipt-scan
./app/api/receipt-scan/route.ts
./app/contador
./app/contador/[token]
./app/contador/[token]/ContadorPublicClient.tsx
./app/contador/[token]/page.tsx
./app/globals.css
./app/layout.tsx
./app/login
./app/login/page.tsx
./app/manifest.ts
./app/register
./app/register/page.tsx
./app/share
./app/share/route.ts
./app/verify
./app/verify/[token]
./app/verify/[token]/page.tsx
```

## 4. ROTEAMENTO E NAVEGAÇÃO

### app/layout.tsx
```tsx
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CtrlBank — Saúde Financeira Familiar",
    template: "%s | CtrlBank — Saúde Financeira Familiar",
  },
  description: "O CtrlBank não registra gastos. Ele governa a saúde financeira da família.",
  keywords: ["saúde financeira", "governança familiar", "família", "planejamento", "receitas", "despesas"],
  authors: [{ name: "CtrlBank" }],
  creator: "CtrlBank",
  applicationName: "CtrlBank",
  appleWebApp: {
    capable: true,
    title: "CtrlBank",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "CtrlBank",
    description: "O CtrlBank não registra gastos. Ele governa a saúde financeira da família.",
    type: "website",
    locale: "pt_BR",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f0f0f",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`dark scroll-smooth ${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-background text-foreground antialiased overflow-x-hidden min-h-dvh"
        suppressHydrationWarning
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fafafa",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
            },
            classNames: {
              success: "!border-accent-primary/30",
              error:   "!border-accent-danger/30",
              warning: "!border-accent-warning/30",
            },
          }}
        />
      </body>
    </html>
  );
}
```

### app/page.tsx
```tsx
não encontrado
```

### src/main.tsx ou src/index.tsx
```tsx
não encontrado
```

### Arquivos com definições de rota / redirect / metadata
```text
app/(dashboard)/buscar/page.tsx
app/(dashboard)/caixa/page.tsx
app/(dashboard)/contas/page.tsx
app/(dashboard)/familia/page.tsx
app/(dashboard)/inbox/history/page.tsx
app/(dashboard)/inbox/page.tsx
app/(dashboard)/layout.tsx
app/(dashboard)/metas/page.tsx
app/(dashboard)/page.tsx
app/(dashboard)/processamentos/page.tsx
app/(dashboard)/relatorios/page.tsx
app/(dashboard)/saude/page.tsx
app/api/invite/[inviteCode]/route.ts
app/layout.tsx
app/share/route.ts
```

#### app/(dashboard)/buscar/page.tsx
```tsx
export const metadata = { title: "Buscar" };

export default function BuscarPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Buscar</h1>
        <p className="text-secondary mt-1">Encontre informações do produto em um só lugar.</p>
      </header>

      <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
        <label htmlFor="global-search" className="text-sm font-semibold text-foreground">
          Busca global
        </label>
        <input
          id="global-search"
          type="search"
          placeholder="Buscar por transação, conta, merchant ou upload"
          className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <p className="text-sm text-secondary">
          Em breve você poderá buscar transações, contas, merchants, uploads e histórico operacional.
        </p>
      </section>
    </div>
  );
}
```

#### app/(dashboard)/caixa/page.tsx
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getCashboxOverview, getCashboxTimeline } from "@/app/actions/cashbox";
import CaixaPageClient from "./CaixaPageClient";

export default async function CaixaPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const [overview, timeline] = await Promise.all([
    getCashboxOverview(),
    getCashboxTimeline(50),
  ]);
  const safeOverview = {
    ...overview,
    totalBalance: Number(overview.totalBalance),
    accounts: overview.accounts.map(acc => ({
      ...acc,
      balance: Number(acc.balance),
      user: {
        ...acc.user,
        name: acc.user.name || "Desconhecido"
      }
    }))
  };

  const safeTimeline = timeline.map(tx => ({
    ...tx,
    amount: Number(tx.amount),
    description: tx.description || "Transação",
    user: tx.user ? { ...tx.user, name: tx.user.name || "Desconhecido" } : null
  }));

  return <CaixaPageClient overview={safeOverview} timeline={safeTimeline} />;
}
```

#### app/(dashboard)/contas/page.tsx
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getAccounts } from "@/app/actions/accounts";
import ContasPageClient from "./ContasPageClient";

export const metadata = { title: "Contas" };

export default async function ContasPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const raw = await getAccounts();

  // Serialize Prisma Decimal → number before passing to Client Component
  const accounts = raw.map((a) => ({
    id:               a.id,
    name:             a.name,
    type:             a.type,
    balance:          Number(a.balance),
    color:            a.color,
    icon:             a.icon,
    creditLimit:      a.creditLimit != null ? Number(a.creditLimit) : null,
    invoiceClosingDay: a.invoiceClosingDay,
    invoiceDueDay:    a.invoiceDueDay,
  }));

  return <ContasPageClient accounts={accounts} />;
}
```

#### app/(dashboard)/familia/page.tsx
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getHouseholdMembers, hasMonthlyCheckBeenViewed } from "@/app/actions/household";
import FamiliaPageClient from "./FamiliaPageClient";

export const metadata = { title: "Família" };

export default async function FamiliaPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const fullUser = await import("@/lib/prisma").then(({ prisma }) =>
    prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, householdId: true, role: true, name: true, email: true },
    })
  );

  const { members, household, inviteCode } = await getHouseholdMembers();

  // Check if monthly check has been viewed
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthlyCheckViewed = await hasMonthlyCheckBeenViewed(currentMonthStr);

  return (
    <FamiliaPageClient
      currentUser={{
        id: fullUser?.id ?? user.id,
        name: fullUser?.name ?? user.name,
        email: fullUser?.email ?? user.email,
        role: fullUser?.role ?? "ADMIN",
        householdId: fullUser?.householdId ?? null,
      }}
      members={members}
      household={household ? { id: household.id, name: household.name } : null}
      inviteCode={inviteCode}
      monthlyCheckViewed={monthlyCheckViewed}
    />
  );
}
```

#### app/(dashboard)/inbox/history/page.tsx
```tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function InboxHistoryPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { householdId: true } });
  const scopeOr = [{ userId: user.id }, ...(dbUser?.householdId ? [{ householdId: dbUser.householdId }] : [])];

  const events = await prisma.aiCaptureEvent.findMany({
    where: { OR: scopeOr },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      captureGroupId: true,
      source: true,
      inputType: true,
      decision: true,
      createdAt: true,
      createdTransactionId: true,
    },
  });

  const grouped = new Map<string, typeof events>();
  for (const event of events) {
    const key = event.captureGroupId || event.id;
    grouped.set(key, [...(grouped.get(key) ?? []), event]);
  }

  const rows = Array.from(grouped.entries()).map(([groupId, groupEvents]) => {
    const createdAt = groupEvents[0]?.createdAt;
    const processed = groupEvents.filter((item) => Boolean(item.createdTransactionId)).length;
    const pending = groupEvents.filter((item) => item.decision === "transaction_draft" || item.decision === "batch_review").length;
    const errors = groupEvents.filter((item) => item.decision === "clarification_needed").length;

    const status = errors > 0 ? "erro" : pending > 0 ? "pendente" : "processado";

    return {
      groupId,
      createdAt,
      channels: Array.from(new Set(groupEvents.map((item) => item.source))).join(", "),
      inputTypes: Array.from(new Set(groupEvents.map((item) => item.inputType))).join(", "),
      detected: groupEvents.length,
      processed,
      pending,
      errors,
      status,
    };
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Inbox · Histórico</h1>
        <p className="text-secondary mt-1">Uploads com status processado, pendente ou erro, com opção de reprocessar.</p>
      </header>

      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-secondary">
            <tr>
              <th className="text-left p-3">Data</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Canal / Entrada</th>
              <th className="text-left p-3">Itens</th>
              <th className="text-left p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.groupId} className="border-t border-border">
                <td className="p-3">{row.createdAt?.toLocaleString("pt-BR")}</td>
                <td className="p-3 uppercase text-xs">{row.status}</td>
                <td className="p-3">
                  <p>{row.channels}</p>
                  <p className="text-xs text-secondary">{row.inputTypes}</p>
                </td>
                <td className="p-3">{row.detected}</td>
                <td className="p-3">
                  <Link href={`/inbox${row.groupId ? `?captureGroupId=${row.groupId}` : ""}`} className="text-primary hover:underline">
                    Reprocessar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link href="/inbox" className="inline-flex text-sm font-semibold text-primary hover:underline">
        Voltar para Inbox
      </Link>
    </div>
  );
}
```

#### app/(dashboard)/inbox/page.tsx
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import InboxPageClient from "./InboxPageClient";

export default async function InboxPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  let events: Array<{
    id: string;
    source: string;
    inputType: string;
    createdAt: Date;
    decision: string;
    captureGroupId: string | null;
    createdTransactionId: string | null;
    normalizedDraft: unknown;
  }> = [];
  let eventsLoadError: string | null = null;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { householdId: true },
    });

    const scopeOr = [{ userId: user.id }, ...(dbUser?.householdId ? [{ householdId: dbUser.householdId }] : [])];

    events = await prisma.aiCaptureEvent.findMany({
      where: { OR: scopeOr },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        source: true,
        inputType: true,
        createdAt: true,
        decision: true,
        captureGroupId: true,
        createdTransactionId: true,
        normalizedDraft: true,
      },
    });
  } catch (error) {
    console.error("[inbox/page] failed to load events", error);
    eventsLoadError = "Não foi possível carregar o histórico agora. Você ainda pode enviar novos arquivos.";
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Inbox</h1>
        <p className="text-secondary mt-1">Central de captura inteligente de evidências financeiras.</p>
      </header>

      <InboxPageClient
        events={events.map((event) => ({
          ...event,
          createdAt: event.createdAt.toISOString(),
          normalizedDraft:
            event.normalizedDraft && typeof event.normalizedDraft === "object"
              ? (event.normalizedDraft as { description?: string; amount?: number; categoryName?: string })
              : null,
        }))}
        eventsLoadError={eventsLoadError}
      />
    </div>
  );
}
```

#### app/(dashboard)/layout.tsx
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayoutClient from "@/components/layout/DashboardLayoutClient";
import AIChatWidget from "@/components/chat/AIChatWidget";

/**
 * Dashboard Layout – Server Component
 *
 * Valida sessão no servidor antes de renderizar qualquer filho.
 * Passa apenas dados seguros (nome do usuário) para o client component.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, session } = await validateRequest();

  if (!user || !session) {
    redirect("/login");
  }

  // Check if monthly check has been viewed for notification badge
  let familyBadge = false;
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { householdId: true, role: true },
    });

    if (dbUser?.householdId && dbUser.role === "ADMIN") {
      const now = new Date();
      const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      const viewExists = await prisma.monthlyCheckView.findFirst({
        where: {
          householdId: dbUser.householdId,
          month: currentMonthStr,
          userId: user.id,
        },
      });

      familyBadge = !viewExists;
    }
  } catch {
    // Non-critical - don't break layout
  }

  const aiEnabled = !!process.env.GEMINI_API_KEY;

  return (
    <DashboardLayoutClient userName={user.name} familyBadge={familyBadge}>
      {children}
      {aiEnabled && <AIChatWidget />}
    </DashboardLayoutClient>
  );
}
```

#### app/(dashboard)/metas/page.tsx
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGoals } from "@/app/actions/goals";
import MetasPageClient from "./MetasPageClient";

export const metadata = { title: "Metas" };

export default async function MetasPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const raw = await getGoals();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });

  // Serialize Prisma Decimal → number, Date → ISO string
  const goals = raw.map((g) => ({
    id:            g.id,
    name:          g.name,
    targetAmount:  Number(g.targetAmount),
    currentAmount: Number(g.currentAmount),
    deadline:      g.deadline?.toISOString() ?? null,
    icon:          g.icon,
    color:         g.color,
    completed:     g.completed,
  }));

  return <MetasPageClient goals={goals} hasHouseholdId={!!dbUser?.householdId} />;
}
```

#### app/(dashboard)/page.tsx
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";

/**
 * Root Dashboard page – Server Component.
 * Redireciona para /saude, tornando-a a home canônica.
 */
export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  redirect("/saude");
}
```

#### app/(dashboard)/processamentos/page.tsx
```tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scopeWhere } from "@/lib/security/scope";
import { getQuotaUsage } from "@/lib/quotas/service";
import { disableExperiment, rollbackActivePolicy } from "@/app/actions/governance";

export default async function ProcessamentosPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { householdId: true } });
  const scoped = scopeWhere({ userId: user.id, householdId: dbUser?.householdId ?? null });

  const events = await prisma.aiCaptureEvent.findMany({
    where: scoped,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      sourceDocument: {
        select: { id: true, sourceChannel: true, sourceType: true, originalName: true, sha256: true },
      },
      ingestionLogs: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          stage: true,
          status: true,
          errorCode: true,
          errorMessage: true,
          createdAt: true,
          transactionId: true,
        },
      },
      qualityFlags: {
        orderBy: { createdAt: "desc" },
        select: { id: true, code: true, severity: true, status: true },
      },
    },
  });

  const [artifacts, quotas, jobs, activePolicies, calibrations, experiments, qualityMetrics] = await Promise.all([
    prisma.signedArtifact.findMany({
      where: { householdId: dbUser?.householdId ?? undefined },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.householdQuota.findMany({
      where: { householdId: dbUser?.householdId ?? undefined },
    }),
    prisma.automationJobRun.findMany({
      where: { OR: [{ householdId: dbUser?.householdId ?? undefined }, { householdId: null }] },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.policyVersion.findMany({
      where: { householdId: dbUser?.householdId ?? undefined, status: "ACTIVE" },
      orderBy: { activatedAt: "desc" },
      take: 10,
    }),
    prisma.calibrationRun.findMany({
      where: { householdId: dbUser?.householdId ?? undefined },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.experiment.findMany({
      where: { householdId: dbUser?.householdId ?? undefined },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    prisma.productQualityMetricSnapshot.findMany({
      where: { householdId: dbUser?.householdId ?? undefined },
      orderBy: { computedAt: "desc" },
      take: 20,
    }),
  ]);

  const quotaUsage = await Promise.all(
    quotas.map(async (quota) => ({
      quota,
      usage: (await getQuotaUsage(quota.householdId, quota.capability, quota.provider)).usage,
    }))
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Atividade · Processamentos</h1>
        <p className="text-secondary mt-1">Histórico operacional auditável: documento de origem, timeline, flags e resultado de commit.</p>
      </header>

      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-secondary">
            <tr>
              <th className="text-left p-3">Data</th>
              <th className="text-left p-3">Canal / Origem</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Stage</th>
              <th className="text-left p-3">Flags</th>
              <th className="text-left p-3">Correlação</th>
              <th className="text-left p-3">Detalhe</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const latest = event.ingestionLogs[event.ingestionLogs.length - 1];
              const hasReview = event.reviewState === "REQUIRED";
              const hasDuplicate = event.qualityFlags.some((flag) => flag.code.includes("DUPLICATE"));
              const status = latest?.status ?? "-";
              const stage = latest?.stage ?? event.processingStage ?? "-";

              return (
                <tr key={event.id} className="border-t border-border align-top">
                  <td className="p-3">{event.createdAt.toLocaleString("pt-BR")}</td>
                  <td className="p-3">
                    <p>{event.sourceDocument?.sourceChannel ?? event.source}</p>
                    <p className="text-xs text-secondary">{event.sourceDocument?.originalName ?? event.inputType}</p>
                  </td>
                  <td className="p-3 text-xs uppercase">
                    {status}
                    {hasReview ? <p className="text-amber-500">review_required</p> : null}
                    {hasDuplicate ? <p className="text-amber-500">duplicate</p> : null}
                  </td>
                  <td className="p-3 text-xs">{stage}</td>
                  <td className="p-3 text-xs">
                    {event.qualityFlags.length === 0
                      ? "-"
                      : event.qualityFlags.slice(0, 2).map((flag) => `${flag.code}(${flag.severity})`).join(", ")}
                  </td>
                  <td className="p-3 font-mono text-[11px]">{event.correlationId ?? event.captureGroupId ?? event.id}</td>
                  <td className="p-3">
                    <details>
                      <summary className="cursor-pointer text-primary">Timeline</summary>
                      <div className="mt-2 space-y-1 text-xs">
                        <p>sourceDocument: {event.sourceDocument?.id ?? "-"}</p>
                        {event.ingestionLogs.map((log) => (
                          <p key={log.id}>
                            {log.createdAt.toLocaleTimeString("pt-BR")} · {log.stage} · {log.status}
                            {log.errorCode ? ` · ${log.errorCode}` : ""}
                          </p>
                        ))}
                      </div>
                    </details>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-surface p-4 space-y-3 lg:col-span-2">
          <h2 className="font-semibold">Evidências assinadas</h2>
          <div className="space-y-2 text-sm">
            {artifacts.map((artifact) => (
              <div key={artifact.id} className="border border-border rounded-xl p-3">
                <p className="font-medium">{artifact.artifactType}</p>
                <p className="text-xs text-secondary">{artifact.createdAt.toLocaleString("pt-BR")} · key {artifact.signatureKeyId}</p>
                <a className="text-xs text-primary hover:underline" href={`/verify/${artifact.verificationToken}`} target="_blank" rel="noreferrer">
                  Verificar autenticidade
                </a>
              </div>
            ))}
            {artifacts.length === 0 ? <p className="text-secondary">Nenhum artefato assinado ainda.</p> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
          <h2 className="font-semibold">Quotas</h2>
          <div className="space-y-2 text-xs">
            {quotaUsage.map((row) => (
              <div key={row.quota.id} className="rounded-lg border border-border p-2">
                <p className="font-medium">{row.quota.capability} {row.quota.provider ? `· ${row.quota.provider}` : ""}</p>
                <p>requests: {row.usage.requests}/{row.quota.maxRequests ?? "∞"}</p>
                <p>tokens in/out: {row.usage.tokensIn}/{row.usage.tokensOut}</p>
                <p>uso: {row.usage.usagePct.toFixed(1)}%</p>
              </div>
            ))}
            {quotaUsage.length === 0 ? <p className="text-secondary">Sem políticas de quota configuradas.</p> : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 space-y-2">
        <h2 className="font-semibold">Saúde das automações</h2>
        <div className="grid md:grid-cols-2 gap-2 text-xs">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-lg border border-border p-2">
              <p className="font-medium">{job.jobName}</p>
              <p>{job.status} · itens {job.itemCount}</p>
              <p className="text-secondary">{job.createdAt.toLocaleString("pt-BR")}</p>
            </div>
          ))}
          {jobs.length === 0 ? <p className="text-secondary">Nenhuma execução registrada.</p> : null}
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
          <h2 className="font-semibold">Qualidade e fricção (Wave 5)</h2>
          <div className="space-y-2 text-xs">
            {qualityMetrics.map((metric) => (
              <div key={metric.id} className="rounded-lg border border-border p-2">
                <p className="font-medium">{metric.metricCode}</p>
                <p>{(metric.metricValue * 100).toFixed(1)}%</p>
                <p className="text-secondary">{metric.computedAt.toLocaleString("pt-BR")}</p>
              </div>
            ))}
            {qualityMetrics.length === 0 ? <p className="text-secondary">Sem snapshots de qualidade ainda.</p> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
          <h2 className="font-semibold">Políticas ativas e rollback</h2>
          {activePolicies.map((policy) => (
            <div key={policy.id} className="rounded-lg border border-border p-3 text-xs space-y-2">
              <p className="font-medium">{policy.policyType} v{policy.version}</p>
              <p className="text-secondary">Ativada em {policy.activatedAt?.toLocaleString("pt-BR") ?? "-"}</p>
              <form action={async () => {
                "use server";
                await rollbackActivePolicy(policy.policyType);
              }}>
                <button className="rounded-lg border border-border px-2 py-1 hover:bg-white/5">Rollback seguro</button>
              </form>
            </div>
          ))}
          {activePolicies.length === 0 ? <p className="text-secondary text-xs">Sem políticas ativas.</p> : null}
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
          <h2 className="font-semibold">Calibrações recentes</h2>
          {calibrations.map((run) => (
            <div key={run.id} className="rounded-lg border border-border p-2 text-xs">
              <p className="font-medium">{run.policyType} · {run.mode}</p>
              <p>{run.applied ? "aplicada" : "recomendação"} · {run.reason ?? "-"}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
          <h2 className="font-semibold">Experimentos / Kill switch</h2>
          {experiments.map((experiment) => (
            <div key={experiment.id} className="rounded-lg border border-border p-2 text-xs space-y-2">
              <p className="font-medium">{experiment.key}</p>
              <p>{experiment.status} · {experiment.targetScope}</p>
              {experiment.status === "RUNNING" ? (
                <form action={async () => {
                  "use server";
                  await disableExperiment(experiment.id);
                }}>
                  <button className="rounded-lg border border-border px-2 py-1 hover:bg-white/5">Desligar experimento</button>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <Link href="/inbox" className="inline-flex text-sm font-semibold text-primary hover:underline">
        Voltar para Inbox
      </Link>
    </div>
  );
}
```

#### app/(dashboard)/relatorios/page.tsx
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getMonthlyEvolution, getTransactions } from "@/app/actions/transactions";
import { getCategories } from "@/app/actions/categories";
import { getAccounts } from "@/app/actions/accounts";
import { getHouseholdMembers } from "@/app/actions/household";
import RelatoriosPageClient from "./RelatoriosPageClient";
import { getMonthBoundsUtc } from "@/lib/finance/period";

export const metadata = { title: "Relatórios" };

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const now = new Date();
  const month = Number(searchParams.month ?? now.getMonth() + 1);
  const year  = Number(searchParams.year  ?? now.getFullYear());
  const bankAccountId = searchParams.bankAccountId;

  const { start: startDate, endExclusive } = getMonthBoundsUtc(year, month);
  const endDate = new Date(endExclusive.getTime() - 1);

  const [evolution, txResult, categories, accounts, { members }] = await Promise.all([
    getMonthlyEvolution(),
    getTransactions({
      limit: 1000,
      dateFrom: startDate,
      dateTo: endDate,
      bankAccountId,
    }),
    getCategories(),
    getAccounts(),
    getHouseholdMembers(),
  ]);

  const transactions = txResult.data ?? [];

  return (
    <RelatoriosPageClient
      evolution={evolution}
      transactions={transactions.map(tx => ({
        ...tx,
        amount: Number(tx.amount),
        date: typeof tx.date === "string" ? tx.date : tx.date.toISOString(),
        user: tx.user ?? null,
      }))}
      categories={categories}
      accounts={accounts}
      members={members.map(m => ({ id: m.id, name: m.name, email: m.email }))}
      currentMonth={month}
      currentYear={year}
    />
  );
}
```

#### app/(dashboard)/saude/page.tsx
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getHealthScore, getProjection, getConsolidatedBalance, getBurnRate } from "@/app/actions/health";
import { getActiveRecommendations } from "@/app/actions/ai/recommendations";
import { getMemberContributions } from "@/app/actions/household";
import { getFinanceInsights } from "@/app/actions/finance-insights";
import { prisma } from "@/lib/prisma";
import SaudePageClient from "./SaudePageClient";

export default async function SaudePage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  const [healthScore, projection, balance, burnRate, recommendations, memberContributions, financeInsights] = await Promise.all([
    getHealthScore(),
    getProjection(),
    getConsolidatedBalance(),
    getBurnRate(),
    getActiveRecommendations(),
    getMemberContributions(),
    getFinanceInsights(),
  ]);

  return (
    <SaudePageClient
      healthScore={healthScore}
      projection={projection}
      balance={balance}
      burnRate={burnRate}
      recommendations={recommendations}
      memberContributions={memberContributions}
      userRole={dbUser?.role ?? "ADMIN"}
      financeInsights={financeInsights}
    />
  );
}
```

#### app/api/invite/[inviteCode]/route.ts
```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ inviteCode: string }> }
) {
  const { inviteCode } = await params;
  const code = inviteCode.toUpperCase();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = await enforceRateLimit({
    key: `invite:route:${ip}:${code}`,
    limit: 30,
    windowSeconds: 60 * 30,
  });
  if (!limit.allowed) {
    return NextResponse.redirect(new URL("/?error=rate_limited", req.url));
  }
  
  // Verifica se o código é válido
  const household = await prisma.household.findUnique({
    where: { inviteCode: code },
  });

  if (!household) {
    return NextResponse.redirect(new URL("/?error=invalid_invite", req.url));
  }

  // Verifica se o usuário está logado
  const { user } = await validateRequest();

  if (!user) {
    // Se não estiver logado, redireciona para login/registro passando o código
    return NextResponse.redirect(new URL(`/login?invite=${code}`, req.url));
  }

  // Se estiver logado, junta ao household
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  
  if (dbUser?.householdId === household.id) {
    return NextResponse.redirect(new URL("/familia?msg=already_in", req.url));
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      householdId: household.id,
      role: "MEMBER", 
    },
  });

  return NextResponse.redirect(new URL("/familia?success=joined", req.url));
}
```

#### app/layout.tsx
```tsx
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CtrlBank — Saúde Financeira Familiar",
    template: "%s | CtrlBank — Saúde Financeira Familiar",
  },
  description: "O CtrlBank não registra gastos. Ele governa a saúde financeira da família.",
  keywords: ["saúde financeira", "governança familiar", "família", "planejamento", "receitas", "despesas"],
  authors: [{ name: "CtrlBank" }],
  creator: "CtrlBank",
  applicationName: "CtrlBank",
  appleWebApp: {
    capable: true,
    title: "CtrlBank",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "CtrlBank",
    description: "O CtrlBank não registra gastos. Ele governa a saúde financeira da família.",
    type: "website",
    locale: "pt_BR",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f0f0f",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`dark scroll-smooth ${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-background text-foreground antialiased overflow-x-hidden min-h-dvh"
        suppressHydrationWarning
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fafafa",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
            },
            classNames: {
              success: "!border-accent-primary/30",
              error:   "!border-accent-danger/30",
              warning: "!border-accent-warning/30",
            },
          }}
        />
      </body>
    </html>
  );
}
```

#### app/share/route.ts
```ts
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { processAiIngest } from "@/lib/ai/ingest";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  
  if (!user) {
    // Se não estiver logado, redireciona para login
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });

  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString() || "";
    const text = formData.get("text")?.toString() || "";
    const urlStr = formData.get("url")?.toString() || "";
    const file = formData.get("image") as File | null;

    let content = [title, text, urlStr].filter(Boolean).join(" ");
    let inputType: "text" | "image" | "text+image" | "pdf" | "csv" = "text";
    let imageBase64: string | undefined;
    let mimeType: string | undefined;

    if (file && file.size > 0) {
      if (file.type === "application/pdf") {
         inputType = "pdf";
      } else if (file.type === "text/csv" || file.type === "application/vnd.ms-excel") {
         inputType = "csv";
         const bytes = await file.arrayBuffer();
         content = new TextDecoder("utf-8").decode(bytes); // For CSV, just put in content
      } else if (file.type.startsWith("image/")) {
         inputType = content ? "text+image" : "image";
      }

      if (inputType !== "csv") {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        imageBase64 = buffer.toString("base64");
        mimeType = file.type;
      }
    }

    let captureGroupId: string | null = null;

    if (content || imageBase64) {
      const result = await processAiIngest({
        userId: user.id,
        householdId: dbUser?.householdId ?? null,
        mode: "Registrar",
        inputType,
        content: content || undefined,
        imageBase64,
        mimeType,
      });

      captureGroupId = result.captureGroupId;
    }

    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.searchParams.set("shared", "success");
    if (captureGroupId) {
      redirectUrl.searchParams.set("captureGroupId", captureGroupId);
    }
    return NextResponse.redirect(redirectUrl);

  } catch (err: any) {
    console.error("[share-target] Erro:", err);
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.searchParams.set("share_error", "1");
    return NextResponse.redirect(redirectUrl);
  }
}
```

### Todos os arquivos page.tsx em app/
```text
app/(dashboard)/buscar/page.tsx
app/(dashboard)/caixa/page.tsx
app/(dashboard)/configuracoes/page.tsx
app/(dashboard)/contas/page.tsx
app/(dashboard)/familia/page.tsx
app/(dashboard)/inbox/history/page.tsx
app/(dashboard)/inbox/page.tsx
app/(dashboard)/metas/page.tsx
app/(dashboard)/page.tsx
app/(dashboard)/processamentos/page.tsx
app/(dashboard)/relatorios/page.tsx
app/(dashboard)/saude/page.tsx
app/contador/[token]/page.tsx
app/login/page.tsx
app/register/page.tsx
app/verify/[token]/page.tsx
```

#### app/(dashboard)/buscar/page.tsx (27 linhas)
```tsx
export const metadata = { title: "Buscar" };

export default function BuscarPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Buscar</h1>
        <p className="text-secondary mt-1">Encontre informações do produto em um só lugar.</p>
      </header>

      <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
        <label htmlFor="global-search" className="text-sm font-semibold text-foreground">
          Busca global
        </label>
        <input
          id="global-search"
          type="search"
          placeholder="Buscar por transação, conta, merchant ou upload"
          className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <p className="text-sm text-secondary">
          Em breve você poderá buscar transações, contas, merchants, uploads e histórico operacional.
        </p>
      </section>
    </div>
  );
}
```

#### app/(dashboard)/caixa/page.tsx (35 linhas)
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getCashboxOverview, getCashboxTimeline } from "@/app/actions/cashbox";
import CaixaPageClient from "./CaixaPageClient";

export default async function CaixaPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const [overview, timeline] = await Promise.all([
    getCashboxOverview(),
    getCashboxTimeline(50),
  ]);
  const safeOverview = {
    ...overview,
    totalBalance: Number(overview.totalBalance),
    accounts: overview.accounts.map(acc => ({
      ...acc,
      balance: Number(acc.balance),
      user: {
        ...acc.user,
        name: acc.user.name || "Desconhecido"
      }
    }))
  };

  const safeTimeline = timeline.map(tx => ({
    ...tx,
    amount: Number(tx.amount),
    description: tx.description || "Transação",
    user: tx.user ? { ...tx.user, name: tx.user.name || "Desconhecido" } : null
  }));

  return <CaixaPageClient overview={safeOverview} timeline={safeTimeline} />;
}
```

#### app/(dashboard)/contas/page.tsx (28 linhas)
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getAccounts } from "@/app/actions/accounts";
import ContasPageClient from "./ContasPageClient";

export const metadata = { title: "Contas" };

export default async function ContasPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const raw = await getAccounts();

  // Serialize Prisma Decimal → number before passing to Client Component
  const accounts = raw.map((a) => ({
    id:               a.id,
    name:             a.name,
    type:             a.type,
    balance:          Number(a.balance),
    color:            a.color,
    icon:             a.icon,
    creditLimit:      a.creditLimit != null ? Number(a.creditLimit) : null,
    invoiceClosingDay: a.invoiceClosingDay,
    invoiceDueDay:    a.invoiceDueDay,
  }));

  return <ContasPageClient accounts={accounts} />;
}
```

#### app/(dashboard)/familia/page.tsx (41 linhas)
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getHouseholdMembers, hasMonthlyCheckBeenViewed } from "@/app/actions/household";
import FamiliaPageClient from "./FamiliaPageClient";

export const metadata = { title: "Família" };

export default async function FamiliaPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const fullUser = await import("@/lib/prisma").then(({ prisma }) =>
    prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, householdId: true, role: true, name: true, email: true },
    })
  );

  const { members, household, inviteCode } = await getHouseholdMembers();

  // Check if monthly check has been viewed
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthlyCheckViewed = await hasMonthlyCheckBeenViewed(currentMonthStr);

  return (
    <FamiliaPageClient
      currentUser={{
        id: fullUser?.id ?? user.id,
        name: fullUser?.name ?? user.name,
        email: fullUser?.email ?? user.email,
        role: fullUser?.role ?? "ADMIN",
        householdId: fullUser?.householdId ?? null,
      }}
      members={members}
      household={household ? { id: household.id, name: household.name } : null}
      inviteCode={inviteCode}
      monthlyCheckViewed={monthlyCheckViewed}
    />
  );
}
```

#### app/(dashboard)/inbox/page.tsx (70 linhas)
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import InboxPageClient from "./InboxPageClient";

export default async function InboxPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  let events: Array<{
    id: string;
    source: string;
    inputType: string;
    createdAt: Date;
    decision: string;
    captureGroupId: string | null;
    createdTransactionId: string | null;
    normalizedDraft: unknown;
  }> = [];
  let eventsLoadError: string | null = null;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { householdId: true },
    });

    const scopeOr = [{ userId: user.id }, ...(dbUser?.householdId ? [{ householdId: dbUser.householdId }] : [])];

    events = await prisma.aiCaptureEvent.findMany({
      where: { OR: scopeOr },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        source: true,
        inputType: true,
        createdAt: true,
        decision: true,
        captureGroupId: true,
        createdTransactionId: true,
        normalizedDraft: true,
      },
    });
  } catch (error) {
    console.error("[inbox/page] failed to load events", error);
    eventsLoadError = "Não foi possível carregar o histórico agora. Você ainda pode enviar novos arquivos.";
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Inbox</h1>
        <p className="text-secondary mt-1">Central de captura inteligente de evidências financeiras.</p>
      </header>

      <InboxPageClient
        events={events.map((event) => ({
          ...event,
          createdAt: event.createdAt.toISOString(),
          normalizedDraft:
            event.normalizedDraft && typeof event.normalizedDraft === "object"
              ? (event.normalizedDraft as { description?: string; amount?: number; categoryName?: string })
              : null,
        }))}
        eventsLoadError={eventsLoadError}
      />
    </div>
  );
}
```

#### app/(dashboard)/metas/page.tsx (33 linhas)
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGoals } from "@/app/actions/goals";
import MetasPageClient from "./MetasPageClient";

export const metadata = { title: "Metas" };

export default async function MetasPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const raw = await getGoals();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true }
  });

  // Serialize Prisma Decimal → number, Date → ISO string
  const goals = raw.map((g) => ({
    id:            g.id,
    name:          g.name,
    targetAmount:  Number(g.targetAmount),
    currentAmount: Number(g.currentAmount),
    deadline:      g.deadline?.toISOString() ?? null,
    icon:          g.icon,
    color:         g.color,
    completed:     g.completed,
  }));

  return <MetasPageClient goals={goals} hasHouseholdId={!!dbUser?.householdId} />;
}
```

#### app/(dashboard)/page.tsx (13 linhas)
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";

/**
 * Root Dashboard page – Server Component.
 * Redireciona para /saude, tornando-a a home canônica.
 */
export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  redirect("/saude");
}
```

#### app/(dashboard)/relatorios/page.tsx (59 linhas)
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getMonthlyEvolution, getTransactions } from "@/app/actions/transactions";
import { getCategories } from "@/app/actions/categories";
import { getAccounts } from "@/app/actions/accounts";
import { getHouseholdMembers } from "@/app/actions/household";
import RelatoriosPageClient from "./RelatoriosPageClient";
import { getMonthBoundsUtc } from "@/lib/finance/period";

export const metadata = { title: "Relatórios" };

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const now = new Date();
  const month = Number(searchParams.month ?? now.getMonth() + 1);
  const year  = Number(searchParams.year  ?? now.getFullYear());
  const bankAccountId = searchParams.bankAccountId;

  const { start: startDate, endExclusive } = getMonthBoundsUtc(year, month);
  const endDate = new Date(endExclusive.getTime() - 1);

  const [evolution, txResult, categories, accounts, { members }] = await Promise.all([
    getMonthlyEvolution(),
    getTransactions({
      limit: 1000,
      dateFrom: startDate,
      dateTo: endDate,
      bankAccountId,
    }),
    getCategories(),
    getAccounts(),
    getHouseholdMembers(),
  ]);

  const transactions = txResult.data ?? [];

  return (
    <RelatoriosPageClient
      evolution={evolution}
      transactions={transactions.map(tx => ({
        ...tx,
        amount: Number(tx.amount),
        date: typeof tx.date === "string" ? tx.date : tx.date.toISOString(),
        user: tx.user ?? null,
      }))}
      categories={categories}
      accounts={accounts}
      members={members.map(m => ({ id: m.id, name: m.name, email: m.email }))}
      currentMonth={month}
      currentYear={year}
    />
  );
}
```

#### app/(dashboard)/saude/page.tsx (41 linhas)
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getHealthScore, getProjection, getConsolidatedBalance, getBurnRate } from "@/app/actions/health";
import { getActiveRecommendations } from "@/app/actions/ai/recommendations";
import { getMemberContributions } from "@/app/actions/household";
import { getFinanceInsights } from "@/app/actions/finance-insights";
import { prisma } from "@/lib/prisma";
import SaudePageClient from "./SaudePageClient";

export default async function SaudePage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  const [healthScore, projection, balance, burnRate, recommendations, memberContributions, financeInsights] = await Promise.all([
    getHealthScore(),
    getProjection(),
    getConsolidatedBalance(),
    getBurnRate(),
    getActiveRecommendations(),
    getMemberContributions(),
    getFinanceInsights(),
  ]);

  return (
    <SaudePageClient
      healthScore={healthScore}
      projection={projection}
      balance={balance}
      burnRate={burnRate}
      recommendations={recommendations}
      memberContributions={memberContributions}
      userRole={dbUser?.role ?? "ADMIN"}
      financeInsights={financeInsights}
    />
  );
}
```

#### app/contador/[token]/page.tsx (44 linhas)
```tsx
import { getCounterReports } from "@/app/actions/counter";
import ContadorPublicClient from "./ContadorPublicClient";
import { Shield } from "lucide-react";

export default async function PublicCounterPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const res = await getCounterReports(token);

  if (res.error || !res.transactions) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background text-white p-4">
        <div className="card-c6 max-w-sm text-center">
          <Shield size={48} className="mx-auto mb-4 text-negative" />
          <h1 className="text-xl font-bold mb-2">Acesso Inválido</h1>
          <p className="text-sm text-secondary">{res.error ?? "Token desconhecido ou expirado."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-white">
      {/* Banner Público */}
      <div className="bg-primary text-white text-xs font-bold text-center py-2 px-4 shadow-soft">
        Modo Somente Leitura — Acesso Contador
      </div>
      
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <header className="mb-8">
          <p className="section-label">Acesso Concedido por {res.householdName ?? "Família"}</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">{res.sessionLabel ?? "Diagnóstico do período"} – {res.year}</h1>
          <p className="text-sm text-secondary mt-2">
            Este relatório contém todas as movimentações consolidadas do ano-calendário {res.year}, organizadas para fechamento e declaração.
          </p>
        </header>

        <ContadorPublicClient 
          transactions={res.transactions.map(t => ({ ...t, amount: Number(t.amount) }))} 
          year={res.year!} 
        />
      </div>
    </div>
  );
}
```

#### app/verify/[token]/page.tsx (22 linhas)
```tsx
import { verifyArtifactByToken } from "@/lib/artifacts/service";

export default async function VerifyArtifactPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await verifyArtifactByToken(token);

  const metadata = (result.artifact?.metadata as Record<string, unknown> | null) ?? null;

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-black tracking-tight">Verificação de artefato</h1>
      <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
        <p><strong>Status:</strong> {result.status}</p>
        <p><strong>Tipo:</strong> {result.artifact?.artifactType ?? "-"}</p>
        <p><strong>Criado em:</strong> {result.artifact?.createdAt ? new Date(result.artifact.createdAt).toLocaleString("pt-BR") : "-"}</p>
        <p><strong>Chave:</strong> {result.artifact?.signatureKeyId ?? "-"}</p>
        <p><strong>Período:</strong> {String(metadata?.period ?? "-")}</p>
      </div>
      <p className="text-sm text-secondary">Esta página confirma autenticidade e integridade do artefato sem expor conteúdo financeiro sensível.</p>
    </div>
  );
}
```

### Layouts principais
```text
app/(dashboard)/layout.tsx
app/layout.tsx
components/layout/AppLayout.tsx
components/layout/DashboardLayoutClient.tsx
```

#### app/(dashboard)/layout.tsx
```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayoutClient from "@/components/layout/DashboardLayoutClient";
import AIChatWidget from "@/components/chat/AIChatWidget";

/**
 * Dashboard Layout – Server Component
 *
 * Valida sessão no servidor antes de renderizar qualquer filho.
 * Passa apenas dados seguros (nome do usuário) para o client component.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, session } = await validateRequest();

  if (!user || !session) {
    redirect("/login");
  }

  // Check if monthly check has been viewed for notification badge
  let familyBadge = false;
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { householdId: true, role: true },
    });

    if (dbUser?.householdId && dbUser.role === "ADMIN") {
      const now = new Date();
      const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      const viewExists = await prisma.monthlyCheckView.findFirst({
        where: {
          householdId: dbUser.householdId,
          month: currentMonthStr,
          userId: user.id,
        },
      });

      familyBadge = !viewExists;
    }
  } catch {
    // Non-critical - don't break layout
  }

  const aiEnabled = !!process.env.GEMINI_API_KEY;

  return (
    <DashboardLayoutClient userName={user.name} familyBadge={familyBadge}>
      {children}
      {aiEnabled && <AIChatWidget />}
    </DashboardLayoutClient>
  );
}
```

#### app/layout.tsx
```tsx
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CtrlBank — Saúde Financeira Familiar",
    template: "%s | CtrlBank — Saúde Financeira Familiar",
  },
  description: "O CtrlBank não registra gastos. Ele governa a saúde financeira da família.",
  keywords: ["saúde financeira", "governança familiar", "família", "planejamento", "receitas", "despesas"],
  authors: [{ name: "CtrlBank" }],
  creator: "CtrlBank",
  applicationName: "CtrlBank",
  appleWebApp: {
    capable: true,
    title: "CtrlBank",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "CtrlBank",
    description: "O CtrlBank não registra gastos. Ele governa a saúde financeira da família.",
    type: "website",
    locale: "pt_BR",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f0f0f",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`dark scroll-smooth ${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-background text-foreground antialiased overflow-x-hidden min-h-dvh"
        suppressHydrationWarning
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fafafa",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
            },
            classNames: {
              success: "!border-accent-primary/30",
              error:   "!border-accent-danger/30",
              warning: "!border-accent-warning/30",
            },
          }}
        />
      </body>
    </html>
  );
}
```

#### components/layout/AppLayout.tsx
```tsx
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
```

#### components/layout/DashboardLayoutClient.tsx
```tsx
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
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { href: "/",             icon: Home,            label: "Início"        },
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

const MOBILE_DRAWER_SECTIONS = [
  {
    title: "Operação",
    items: [
      { href: "/", label: "Início", icon: Home },
      { href: "/saude", label: "Saúde", icon: LayoutDashboard },
      { href: "/caixa", label: "Caixa", icon: Wallet },
      { href: "/inbox", label: "Inbox", icon: Inbox },
      { href: "/processamentos", label: "Processamentos", icon: History },
      { href: "/metas", label: "Metas", icon: Target },
    ],
  },
  {
    title: "Gestão",
    items: [
      { href: "/relatorios", label: "Relatórios", icon: BookOpen },
      { href: "/familia", label: "Família", icon: Users },
      { href: "/contas", label: "Contas", icon: Wallet },
    ],
  },
  {
    title: "Sistema",
    items: [{ href: "/configuracoes", label: "Configurações", icon: Settings }],
  },
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

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
                {MOBILE_DRAWER_SECTIONS.map((section) => (
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
```

### Navegação persistente (bottom nav/sidebar)
```text
components/layout/AppLayout.tsx
components/layout/DashboardLayoutClient.tsx
```

#### components/layout/AppLayout.tsx
```tsx
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
```

#### components/layout/DashboardLayoutClient.tsx
```tsx
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
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { href: "/",             icon: Home,            label: "Início"        },
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

const MOBILE_DRAWER_SECTIONS = [
  {
    title: "Operação",
    items: [
      { href: "/", label: "Início", icon: Home },
      { href: "/saude", label: "Saúde", icon: LayoutDashboard },
      { href: "/caixa", label: "Caixa", icon: Wallet },
      { href: "/inbox", label: "Inbox", icon: Inbox },
      { href: "/processamentos", label: "Processamentos", icon: History },
      { href: "/metas", label: "Metas", icon: Target },
    ],
  },
  {
    title: "Gestão",
    items: [
      { href: "/relatorios", label: "Relatórios", icon: BookOpen },
      { href: "/familia", label: "Família", icon: Users },
      { href: "/contas", label: "Contas", icon: Wallet },
    ],
  },
  {
    title: "Sistema",
    items: [{ href: "/configuracoes", label: "Configurações", icon: Settings }],
  },
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

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
                {MOBILE_DRAWER_SECTIONS.map((section) => (
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
```

## 5. DESIGN SYSTEM ATUAL

### src/index.css ou src/globals.css ou app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─────────────────────────────────────────────
   CSS Custom Properties – Design System Editorial Neon
   ───────────────────────────────────────────── */
:root {
  /* ── Design System Enterprise ── */
  --background: #050505;
  --foreground: #f5f5f0;
  --primary: #19FF63;
  --primary-rgb: 25, 255, 99;
  --surface: #0b0b0b;
  --surface-2: #141414;
  --secondary: #8a8a8a;
  --border: rgba(255,255,255,0.10);
  --positive: #19FF63;
  --positive-rgb: 25, 255, 99;
  --negative: #ef4444;
  --negative-rgb: 239, 68, 68;
  --warning: #f59e0b;
  --info: #00E5FF;

  /* Spacing */
  --bottom-nav-height: 5rem;
  --safe-area-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-top: env(safe-area-inset-top, 0px);
}

/* ─────────────────────────────────────────────
   Base Reset
   ───────────────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  color-scheme: dark;
  -webkit-text-size-adjust: 100%;
  /* Safe areas aplicadas apenas nos componentes específicos — não no html */
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-inter, "system-ui"), -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  min-height: 100dvh;
}

/* ─────────────────────────────────────────────
   Component Classes – Premium C6 Bank Style
   ───────────────────────────────────────────── */
@layer components {

  /* Cards ─ sólidos, minimalistas */
  .card-c6 {
    @apply bg-surface border border-white/10 rounded-[16px] p-6
           transition-all duration-300;
  }

  .card-c6-sm {
    @apply bg-surface border border-white/10 rounded-[12px] p-4
           transition-all duration-300;
  }

  .card-c6-interactive {
    @apply card-c6 cursor-pointer
           hover:border-white/10 hover:bg-white/[0.02]
           active:scale-[0.99];
  }

  /* Physical card style (contas/cartões) */
  .account-card {
    @apply relative overflow-hidden rounded-[16px] p-6
           bg-surface border border-white/10
           transition-all duration-300;
  }

  /* Saldo hero – número grande e pesado */
  .balance-hero {
    @apply text-6xl md:text-7xl font-black tracking-tighter leading-none;
    font-feature-settings: "tnum" 1, "kern" 1;
  }

  /* Botões */
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2
           bg-primary text-white font-semibold
           py-3 px-6 rounded-full
           transition-all duration-200
           hover:bg-primary-600 hover:shadow-glow-primary
           active:scale-95
           disabled:opacity-50 disabled:cursor-not-allowed
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center gap-2
           bg-surface-2 text-white font-semibold
           py-3 px-6 rounded-full border border-border
           transition-all duration-200
           hover:bg-white/10 hover:border-white/20
           active:scale-95
           disabled:opacity-50 disabled:cursor-not-allowed
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20;
  }

  .btn-ghost {
    @apply inline-flex items-center justify-center gap-2
           text-secondary font-medium py-2 px-4 rounded-full
           transition-all duration-200
           hover:bg-white/5 hover:text-white
           active:scale-95;
  }

  .btn-outline {
    @apply inline-flex items-center justify-center gap-2
           border border-border bg-transparent text-white font-semibold
           py-3 px-6 rounded-full
           transition-all duration-200
           hover:bg-white/5 hover:border-white/20
           active:scale-95
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  /* FAB – Floating Action Button */
  .fab-button {
    @apply fixed bottom-[calc(var(--bottom-nav-height)+1.5rem)] right-5
           w-14 h-14 rounded-full
           bg-primary text-white shadow-glow-primary
           flex items-center justify-center
           transition-all duration-200
           hover:scale-110 hover:bg-primary-600
           active:scale-95
           z-50;
    /* iOS safe area */
    bottom: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px) + 1.5rem);
  }

  /* Inputs */
  .input-c6 {
    @apply w-full bg-surface-2 border border-border rounded-[12px]
           px-4 py-3 text-white placeholder:text-secondary/60
           transition-all duration-150
           focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50
           disabled:opacity-40 disabled:cursor-not-allowed;
  }

  .input-c6-sm {
    @apply input-c6 py-2 text-sm rounded-[10px];
  }

  /* Badges financeiros */
  .badge-positive {
    @apply inline-flex items-center gap-1 px-2.5 py-1
           bg-positive/10 text-positive text-xs font-semibold rounded-full;
  }

  .badge-negative {
    @apply inline-flex items-center gap-1 px-2.5 py-1
           bg-negative/10 text-negative text-xs font-semibold rounded-full;
  }

  .badge-warning {
    @apply inline-flex items-center gap-1 px-2.5 py-1
           bg-warning/10 text-warning text-xs font-semibold rounded-full;
  }

  .badge-info {
    @apply inline-flex items-center gap-1 px-2.5 py-1
           bg-info/10 text-info text-xs font-semibold rounded-full;
  }

  /* Progress bar orçamento */
  .budget-bar {
    @apply h-2 rounded-full overflow-hidden bg-surface-2;
  }

  .budget-bar-fill {
    @apply h-full rounded-full transition-all duration-500;
  }

  /* Section labels */
  .section-label {
    @apply text-xs font-semibold uppercase tracking-widest text-secondary;
  }

  /* Skeleton loading */
  .skeleton {
    @apply animate-shimmer rounded-xl;
    background: linear-gradient(
      90deg,
      #141414 0%,
      #1e1e1e 50%,
      #141414 100%
    );
    background-size: 200% 100%;
  }

  /* Divider */
  .divider {
    @apply border-0 border-t border-border my-1;
  }

  /* Selected tab */
  .tab-active {
    @apply text-primary;
  }

  /* Texto financeiro */
  .amount-positive { @apply text-positive font-bold tabular-nums; }
  .amount-negative { @apply text-negative font-bold tabular-nums; }
  .amount-neutral  { @apply text-foreground font-bold tabular-nums; }
}

/* ─────────────────────────────────────────────
   Scrollbar Premium
   ───────────────────────────────────────────── */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: var(--secondary); }

/* Scrollbar horizontal elegante (contas/cartões) */
.scroll-horizontal {
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.scroll-horizontal::-webkit-scrollbar { display: none; }
.scroll-snap-start { scroll-snap-align: start; }

/* ─────────────────────────────────────────────
   Animations
   ───────────────────────────────────────────── */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

@keyframes pulseScale {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.05); }
}

.animate-fade-in    { animation: fadeIn 0.3s ease-out; }
.animate-slide-up   { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.animate-shimmer    { animation: shimmer 2s linear infinite; }
.animate-pulse-scale { animation: pulseScale 2s ease-in-out infinite; }

/* ─────────────────────────────────────────────
   Utility – número com fonte tabelada
   ───────────────────────────────────────────── */
.tabular-nums { font-variant-numeric: tabular-nums; }

/* Bottom nav safe area padding */
.pb-safe-nav {
  padding-bottom: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px) + 1.5rem);
}
```

### Arquivos em components/ui/ com contagem de linhas
```text
components/ui/CopyButton.tsx: 21
components/ui/CurrencyInput.tsx: 72
components/ui/EmptyState.tsx: 78
components/ui/MoneyDisplay.tsx: 120
components/ui/ReceiptScanButton.tsx: 161
components/ui/button.tsx: 56
components/ui/card.tsx: 79
components/ui/dialog.tsx: 122
components/ui/dropdown-menu.tsx: 200
components/ui/empty-state.tsx: 48
components/ui/fab.tsx: 43
components/ui/form.tsx: 178
components/ui/input.tsx: 22
components/ui/label.tsx: 26
components/ui/premium-card.tsx: 78
components/ui/select.tsx: 160
components/ui/skeleton.tsx: 92
```

### components/ui/button.tsx
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### components/ui/card.tsx
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

### components/ui/input.tsx
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

### Fontes importadas (index.html, _document.tsx, imports de fonte)
```text
app/layout.tsx:2:import { GeistSans } from "geist/font/sans";
app/layout.tsx:51:      className={`dark scroll-smooth ${GeistSans.variable}`}
components/chat/AIChatWidget.tsx:56:  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
components/chat/AIChatWidget.tsx:236:      timerIntervalRef.current = setInterval(() => {
components/chat/AIChatWidget.tsx:249:    clearInterval(timerIntervalRef.current!);
components/chat/AIChatWidget.tsx:257:      clearInterval(timerIntervalRef.current!);
components/chat/AICards.tsx:61:  const [internalDraft, setInternalDraft] = React.useState(draft);
components/chat/AICards.tsx:95:            <CurrencyInput value={internalDraft.amount || ""} onValueChange={(v) => setInternalDraft({...internalDraft, amount: v ? Number(v) : null})} className="input-c6-sm w-full pl-9 font-bold" required placeholder="0,00" />
components/chat/AICards.tsx:100:          <input type="text" value={internalDraft.description} onChange={(e) => setInternalDraft({...internalDraft, description: e.target.value})} className="input-c6-sm w-full" required />
components/chat/AICards.tsx:108:            <select value={internalDraft.accountId || ""} onChange={(e) => setInternalDraft({...internalDraft, accountId: e.target.value})} className={`input-c6-sm w-full appearance-none pr-8 ${missingFields?.includes("account") && !internalDraft.accountId ? "border-negative/50 bg-negative/5" : ""}`} required>
components/chat/AICards.tsx:118:            <select value={internalDraft.categoryId || ""} onChange={(e) => setInternalDraft({...internalDraft, categoryId: e.target.value})} className="input-c6-sm w-full appearance-none pr-8">
components/chat/AICards.tsx:139:  const [internalItems, setInternalItems] = React.useState(items);
components/chat/AICards.tsx:155:    setInternalItems(prev => prev.filter((_, idx) => idx !== i));
app/globals.css:48:  font-family: var(--font-inter, "system-ui"), -apple-system, "Segoe UI", sans-serif;
app/(dashboard)/inbox/InboxPageClient.tsx:164:              {loading ? "Processando..." : "Interpretar"}
app/api/cron/plan-sync/route.ts:21:    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
```

## 6. COMPONENTES DE NEGÓCIO EXISTENTES
| Caminho | Linhas | Export default | Props (assinatura do tipo) |
|---|---|---|---|

| `components/chat/AICards.tsx` | 299 | não | `{ 
  draft, txId, onUndo
}: { 
  draft: AIComposerTransactionDraft, txId: string, onUndo: (` |

| `components/chat/AIChatWidget.tsx` | 672 | sim | `` |

| `components/dashboard-client.tsx` | 217 | sim | `{ user }: DashboardClientProps` |

| `components/layout/AppLayout.tsx` | 248 | sim | `{ children, user, householdName = "Minha Família" }: AppLayoutProps` |

| `components/layout/DashboardLayoutClient.tsx` | 354 | sim | `{
  children,
  userName,
  familyBadge = false,
}: DashboardLayoutClientProps` |


### components/chat/AIChatWidget.tsx (672 linhas)
```tsx
"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, X, Send, Loader2, Camera, BarChart3, Search, Paperclip, CheckSquare, Copy, MessageSquare, Mic, Square, Trash2, ChevronUp, Lightbulb
} from "lucide-react";
import { toast } from "sonner";
import { getAccounts } from "@/app/actions/accounts";
import { getCategories } from "@/app/actions/categories";
import { getAiCaptureGroup } from "@/app/actions/ai/review";
import { getConversationHistory } from "@/app/actions/ai/conversation";
import { AIComposerBatchDraftItem, AIComposerResponse, AIComposerTransactionDraft, AIComposerMode } from "@/lib/ai/contracts";

import { SuccessCard, DraftReviewCard, BatchReviewCard, NextBestActionCard, SavedPlanCard, ProductFeedbackCard } from "./AICards";

type ComposerMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode: string;
  timestamp: string;
  metadata?: any;
};

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [mode, setMode] = useState<AIComposerMode>("Registrar");
  
  const [composerState, setComposerState] = useState<"idle" | "loading" | "review" | "batch_review" | "success" | "clarification" | "chat_mode">("idle");
  const [responseMsg, setResponseMsg] = useState("");
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  
  const [draft, setDraft] = useState<AIComposerTransactionDraft | null>(null);
  const [batchDrafts, setBatchDrafts] = useState<AIComposerBatchDraftItem[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [createdTxId, setCreatedTxId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ComposerMessage[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Audio Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date);
  };

  const appendMessage = (role: "user" | "assistant", content: string, currentMode: string, metadata?: any) => {
    if (!content.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role,
        content,
        mode: currentMode,
        timestamp: formatTimestamp(new Date()),
        metadata
      },
    ]);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("captureGroupId") || params.get("shared") || params.get("share_error")) {
      setOpen(true);
    }

    const handleToggle = () => {
      setOpen(prev => {
        if (!prev) setComposerState("idle");
        return !prev;
      });
    };
    window.addEventListener("toggle-composer", handleToggle);
    return () => window.removeEventListener("toggle-composer", handleToggle);
  }, []);

  useEffect(() => {
    const syncViewport = () => setIsMobile(window.innerWidth < 768);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const fetchHistory = async (cursor?: string) => {
    setIsLoadingHistory(true);
    try {
      const res = await getConversationHistory(20, cursor);
      if (res.conversationId) setConversationId(res.conversationId);
      if (res.nextCursor) setNextCursor(res.nextCursor);
      else setNextCursor(null);

      if (res.messages.length > 0) {
        const formatted = res.messages.map((m: any) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          mode: m.mode,
          timestamp: formatTimestamp(new Date(m.createdAt)),
          metadata: m.metadata
        }));
        
        if (cursor) {
           setMessages(prev => [...formatted, ...prev]);
        } else {
           setMessages(formatted);
           setTimeout(() => {
             messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
           }, 100);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (open && accounts.length === 0) {
      startTransition(async () => {
        const [accs, cats] = await Promise.all([getAccounts(), getCategories()]);
        setAccounts(accs);
        setCategories(cats);
        await fetchHistory(); // Fetch initial history
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const params = new URLSearchParams(window.location.search);
    const captureGroupId = params.get("captureGroupId");
    const shared = params.get("shared");
    const shareError = params.get("share_error");

    if (shareError) {
      toast.error("Falha ao processar o conteúdo compartilhado.");
      params.delete("share_error");
      window.history.replaceState({}, "", `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`);
      return;
    }

    if (!captureGroupId) {
      if (shared) {
        toast.success("Conteúdo compartilhado processado.");
        params.delete("shared");
        window.history.replaceState({}, "", `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`);
      }
      return;
    }

    startTransition(async () => {
      const items = await getAiCaptureGroup(captureGroupId);

      if (items.length === 1) {
        setDraft(items[0].draft);
        setActiveEventId(items[0].eventId);
        setMissingFields(items[0].draft.accountId ? [] : ["account"]);
        setComposerState(items[0].draft.accountId ? "review" : "clarification");
      } else if (items.length > 1) {
        setBatchDrafts(items);
        setComposerState("batch_review");
      } else if (shared) {
        toast.success("Conteúdo compartilhado processado.");
      }

      params.delete("shared");
      params.delete("captureGroupId");
      window.history.replaceState({}, "", `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`);
    });
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    if (file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setInput(text);
        setImageBase64(null);
        setMimeType("text/csv");
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setImageBase64(base64.split(",")[1]);
        setMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      toast.error("Não foi possível acessar o microfone.");
    }
  };

  const cancelAudioRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    clearInterval(timerIntervalRef.current!);
    setIsRecording(false);
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  const stopAndSendAudio = () => {
    if (mediaRecorderRef.current && isRecording) {
      clearInterval(timerIntervalRef.current!);
      const currentDurationSeconds = recordingTime;
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(",")[1];
          setImageBase64(base64data);
          setMimeType("audio/webm");
          setFileName("VoiceNote");
          setIsRecording(false);
          setRecordingTime(0);
          
          // Trigger send directly
          executeSend(undefined, base64data, "audio/webm", "audio", currentDurationSeconds * 1000);
        };
      };
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  const formatAudioTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  async function executeSend(overrideInput?: string, overrideBase64?: string, overrideMime?: string, forcedInputType?: string, audioDurationMs?: number) {
    const finalInput = overrideInput ?? input;
    const finalBase64 = overrideBase64 ?? imageBase64;
    const finalMime = overrideMime ?? mimeType;

    if (!finalInput.trim() && !finalBase64) return;
    
    setComposerState("loading");
    setResponseMsg("");
    setDraft(null);
    setBatchDrafts([]);
    setMissingFields([]);
    setCreatedTxId(null);
    setActiveEventId(null);

    let inputType = forcedInputType ?? "text";
    if (!forcedInputType) {
      if (finalMime === "application/pdf") {
        inputType = "pdf";
      } else if (finalMime === "text/csv") {
        inputType = "csv";
      } else if (finalBase64) {
        inputType = finalInput.trim() ? "text+image" : "image";
      }
    }

    const payload = { 
      mode,
      inputType, 
      imageBase64: inputType === "text" || inputType === "csv" ? undefined : finalBase64, 
      content: finalInput.trim() || undefined,
      mimeType: inputType === "text" || inputType === "csv" ? undefined : finalMime,
      conversationId: conversationId || undefined,
      audioDurationMs
    };

    const userMessageDisplay =
      inputType === "audio" ? `🎤 Áudio enviado (${formatAudioTime(Math.floor((audioDurationMs || 0)/1000))})` :
      (inputType === "pdf" && fileName ? `📄 PDF enviado: ${fileName}` : "") ||
      (inputType === "csv" && fileName ? `🧾 CSV enviado: ${fileName}` : "") ||
      (finalBase64 && fileName ? `🖼️ Arquivo enviado: ${fileName}` : "") ||
      (finalBase64 ? "🖼️ Arquivo enviado" : "") ||
      (finalInput.trim().length > 120 ? `${finalInput.trim().slice(0, 120)}...` : finalInput.trim());

    appendMessage("user", userMessageDisplay, mode);

    if (inputType !== "csv" && inputType !== "audio") {
       setInput("");
    } else if (inputType === "csv") {
       setInput(""); 
    }

    try {
      const res = await fetch("/api/ai/composer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Falha ao extrair dados");
      }

      const composerData: AIComposerResponse = data;
      setActiveEventId(composerData.eventId);
      if (composerData.conversationId) {
        setConversationId(composerData.conversationId);
      }
      
      setImageBase64(null);
      setFileName(null);
      setMimeType(null);

      if (composerData.intent === "chat_reply") {
        setComposerState("chat_mode");
        // We do not setResponseMsg for continuous chat, we just append to messages array.
        appendMessage("assistant", composerData.message, mode);
      } else if (composerData.intent === "transaction_created") {
        setComposerState("success");
        setCreatedTxId(composerData.createdTransactionId);
        setDraft(composerData.transactionDraft);
        appendMessage("assistant", composerData.message, mode);
      } else if (composerData.intent === "batch_review") {
        setComposerState("batch_review");
        setBatchDrafts(composerData.batchDrafts || []);
        appendMessage("assistant", composerData.message, mode);
      } else if (composerData.intent === "transaction_draft") {
        setComposerState("review");
        setDraft(composerData.transactionDraft);
        appendMessage("assistant", composerData.message, mode);
      } else if (composerData.intent === "saved_plan") {
        setComposerState("chat_mode");
        appendMessage("assistant", composerData.message, mode, { intent: "saved_plan", planData: composerData.transactionDraft, savedPlanId: composerData.savedPlanId });
      } else {
        setComposerState("clarification");
        setResponseMsg(composerData.message);
        setDraft(composerData.transactionDraft);
        setMissingFields(composerData.missingFields || []);
        appendMessage("assistant", composerData.message, mode);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Falha na comunicação com o AI Composer.";
      setComposerState("clarification");
      setResponseMsg(message);
      toast.error(message);
      appendMessage("assistant", message, mode);
    }
  }

  const modes: AIComposerMode[] = ["Registrar", "Revisar", "Perguntar", "Planejar", "Sugerir"];

  return (
    <>
      <motion.button
        onClick={() => {
          setOpen(!open);
          if (!open) setComposerState("idle");
        }}
        className="hidden md:flex fixed z-50 w-14 h-14 rounded-full bg-primary shadow-glow-primary items-center justify-center text-white"
        style={{
          right: "1.25rem",
          bottom: "1.25rem",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open
            ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={22} /></motion.span>
            : <motion.span key="open"  initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Sparkles size={22} fill="currentColor" /></motion.span>
          }
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 28, stiffness: 380 }}
            className="fixed z-50 bg-surface border border-border rounded-3xl shadow-soft-xl flex flex-col overflow-hidden"
            style={{
              right: isMobile ? "0.5rem" : "1.25rem",
              left: isMobile ? "0.5rem" : "auto",
              top: isMobile ? "calc(env(safe-area-inset-top, 0px) + 0.5rem)" : "auto",
              bottom: isMobile ? "calc(5.5rem + env(safe-area-inset-bottom, 0px))" : "5.5rem",
              width: "auto",
              maxWidth: isMobile ? "none" : "400px",
              maxHeight: isMobile ? "calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 6.5rem)" : "650px",
            }}
          >
            {/* Context/Operating Header Modes */}
            <div className="flex bg-surface-2/80 backdrop-blur-md px-2 pt-2 border-b border-border/50 items-end overflow-x-auto no-scrollbar">
               {modes.map(m => (
                 <button 
                  key={m} 
                  onClick={() => setMode(m)}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${mode === m ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-foreground'}`}
                 >
                   {m}
                 </button>
               ))}
            </div>

            {/* Inbox Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {nextCursor && (
                 <div className="flex justify-center mb-4">
                    <button onClick={() => fetchHistory(nextCursor)} disabled={isLoadingHistory} className="text-xs bg-surface-2 border border-border/50 px-3 py-1.5 rounded-full text-secondary hover:text-white flex items-center gap-1 transition-colors">
                       {isLoadingHistory ? <Loader2 size={12} className="animate-spin" /> : <ChevronUp size={12} />}
                       Carregar anteriores
                    </button>
                 </div>
              )}

              {messages.length > 0 && (
                <div className="space-y-3 pb-2">
                  {messages.map((message) => (
                    <div key={message.id} className="flex flex-col">
                       <div
                         className={`rounded-2xl border px-3 py-2.5 ${
                           message.role === "user"
                             ? "ml-auto border-primary/20 bg-primary/10 max-w-[85%]"
                             : "mr-auto border-border bg-surface-2 max-w-[90%]"
                         }`}
                       >
                         <div className="flex items-center justify-between gap-3 mb-1">
                           <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-secondary opacity-70">
                             <MessageSquare size={10} />
                             <span>{message.role === "user" ? "Você" : message.mode}</span>
                             <span>{message.timestamp}</span>
                           </div>
                           <button
                             type="button"
                             onClick={async () => {
                               await navigator.clipboard.writeText(message.content);
                               toast.success("Mensagem copiada.");
                             }}
                             className="text-secondary hover:text-white transition-colors"
                             aria-label="Copiar mensagem"
                           >
                             <Copy size={10} />
                           </button>
                         </div>
                         <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                         
                         {message.metadata?.intent === "saved_plan" && message.metadata.planData && (
                            <div className="mt-2 text-left">
                               <SavedPlanCard planId={message.metadata.savedPlanId} planData={message.metadata.planData} />
                            </div>
                         )}
                         {message.metadata?.intent === "product_feedback_logged" && message.metadata.normalizedFeedback && (
                            <div className="mt-2 text-left">
                               <ProductFeedbackCard feedbackId={message.metadata.feedbackId} normalizedFeedback={message.metadata.normalizedFeedback} />
                            </div>
                         )}
                       </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
              
              {composerState === "idle" && messages.length === 0 && !isLoadingHistory && (
                <div className="flex flex-col items-center justify-center text-center h-40 space-y-3 opacity-60">
                   {mode === "Registrar" && <Sparkles size={32} className="text-secondary" />}
                   {mode === "Revisar" && <CheckSquare size={32} className="text-secondary" />}
                   {mode === "Perguntar" && <Search size={32} className="text-secondary" />}
                   {mode === "Planejar" && <BarChart3 size={32} className="text-secondary" />}
                   {mode === "Sugerir" && <Lightbulb size={32} className="text-secondary" />}
                  <p className="text-sm font-medium">O que vamos fazer?</p>
                  <p className="text-xs text-secondary/70 px-4">
                    {mode === "Registrar" && "Digite, fale, cole um print, anexe PDF ou CSV."}
                    {mode === "Revisar" && "Visualize drafts e lotes aguardando aprovação."}
                    {mode === "Perguntar" && "Tire dúvidas sobre a saúde financeira da sua família."}
                    {mode === "Planejar" && "Descubra como você está indo em relação às metas e orçamentos."}
                    {mode === "Sugerir" && "Sugira melhorias, reporte bugs ou novas funcionalidades."}
                  </p>
                </div>
              )}

              {composerState === "loading" && (
                <div className="flex flex-col items-center justify-center text-center h-24 space-y-3">
                  <Loader2 size={24} className="animate-spin text-primary" />
                  <p className="text-sm font-medium animate-pulse">Pensando...</p>
                </div>
              )}

              {/* Action Cards Overlays */}
              {composerState === "success" && draft && createdTxId && (
                <SuccessCard 
                  draft={draft} 
                  txId={createdTxId} 
                  onUndo={() => {
                    setComposerState("idle");
                    setCreatedTxId(null);
                    setDraft(null);
                  }}
                />
              )}

              {composerState === "batch_review" && batchDrafts.length > 0 && (
                <BatchReviewCard 
                  items={batchDrafts}
                  onComplete={() => {
                    setComposerState("idle");
                    setBatchDrafts([]);
                  }}
                />
              )}

              {composerState === "clarification" && missingFields.includes("account") && (
                <NextBestActionCard missingAccount={true} onSwitchToReview={() => setComposerState("review")} />
              )}

              {composerState === "clarification" && !missingFields.includes("account") && responseMsg && !draft && (
                <div className="card-c6 border-info/30 bg-info/5 space-y-2">
                  <p className="font-bold text-sm text-info">Incompleto</p>
                  <p className="text-xs text-secondary">{responseMsg}</p>
                </div>
              )}

              {(composerState === "review" || (composerState === "clarification" && draft && !missingFields.includes("account"))) && draft && (
                <DraftReviewCard 
                  draft={draft} 
                  missingFields={missingFields} 
                  accounts={accounts} 
                  categories={categories} 
                  eventId={activeEventId}
                  onApproved={() => {
                    setComposerState("idle");
                    setDraft(null);
                  }}
                />
              )}
            </div>

            {/* Omni Input */}
            <div className="p-3 border-t border-border/50 bg-surface-2/40 relative">
              {isRecording ? (
                 <div className="flex items-center justify-between bg-negative/10 border border-negative/30 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-3 text-negative font-semibold text-sm">
                       <span className="flex h-2 w-2 relative">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-negative opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 bg-negative"></span>
                       </span>
                       Gravando... {formatAudioTime(recordingTime)}
                    </div>
                    <div className="flex gap-2">
                       <button onClick={cancelAudioRecording} className="p-2 bg-surface text-secondary hover:text-white rounded-full transition-colors"><Trash2 size={16} /></button>
                       <button onClick={stopAndSendAudio} className="p-2 bg-primary text-white hover:bg-primary/80 rounded-full transition-colors"><Square size={16} fill="currentColor" /></button>
                    </div>
                 </div>
              ) : (
                <>
                  {(fileName || imageBase64) && mimeType !== "text/csv" && (
                    <div className="mb-2 px-3 py-2 rounded-xl bg-surface border border-primary/20 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2 text-xs truncate max-w-[80%]">
                        <Paperclip size={12} className="text-primary"/> 
                        <span className="truncate">{fileName || "Anexo adicionado"}</span>
                      </div>
                      <button onClick={() => { setImageBase64(null); setFileName(null); setMimeType(null); }} className="p-1 rounded-full text-secondary hover:bg-negative/80 hover:text-white transition-colors"><X size={12} /></button>
                    </div>
                  )}
                  {fileName && mimeType === "text/csv" && (
                    <div className="mb-2 px-3 py-2 rounded-xl bg-surface border border-primary/20 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2 text-xs truncate max-w-[80%]">
                        <BarChart3 size={12} className="text-primary"/> 
                        <span className="truncate">{fileName}</span>
                      </div>
                      <button onClick={() => { setInput(""); setFileName(null); setMimeType(null); }} className="p-1 rounded-full text-secondary hover:bg-negative/80 hover:text-white transition-colors"><X size={12} /></button>
                    </div>
                  )}
                  
                  <div className="flex gap-2 items-end bg-surface border border-border shadow-soft rounded-2xl p-1 relative focus-within:border-white/20 transition-colors">
                    <input type="file" accept="image/*,.pdf,.csv" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-9 h-9 rounded-xl flex flex-shrink-0 items-center justify-center text-secondary hover:text-white hover:bg-white/5 transition-all mb-0.5">
                      <Camera size={18} />
                    </button>
                    
                    <textarea
                      value={mimeType === "text/csv" ? "(CSV Carregado) " : input}
                      onChange={(e) => {
                         if (mimeType !== "text/csv") setInput(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); executeSend(); }
                      }}
                      placeholder={mode === "Perguntar" ? "Pergunte algo..." : "Escreva, fale, cole um print..."}
                      className="flex-1 bg-transparent text-sm min-h-[40px] max-h-24 resize-none outline-none placeholder:text-secondary/60 py-2.5 disabled:opacity-50"
                      disabled={composerState === "loading" || mimeType === "text/csv"}
                      rows={(input.match(/\n/g)||[]).length + 1 > 3 ? 3 : (input.match(/\n/g)||[]).length + 1}
                    />
                    
                    {input.trim() || imageBase64 ? (
                       <button
                         type="button"
                         onClick={() => executeSend()}
                         disabled={composerState === "loading"}
                         className="w-9 h-9 rounded-xl bg-primary flex flex-shrink-0 items-center justify-center text-white disabled:opacity-40 transition-opacity mb-0.5"
                       >
                         {composerState === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                       </button>
                    ) : (
                       <button
                         type="button"
                         onClick={startAudioRecording}
                         disabled={composerState === "loading"}
                         className="w-9 h-9 rounded-xl bg-surface-2 flex flex-shrink-0 items-center justify-center text-secondary hover:text-white hover:bg-white/10 transition-colors mb-0.5"
                       >
                         <Mic size={18} />
                       </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```


### components/layout/DashboardLayoutClient.tsx (354 linhas)
```tsx
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
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { href: "/",             icon: Home,            label: "Início"        },
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

const MOBILE_DRAWER_SECTIONS = [
  {
    title: "Operação",
    items: [
      { href: "/", label: "Início", icon: Home },
      { href: "/saude", label: "Saúde", icon: LayoutDashboard },
      { href: "/caixa", label: "Caixa", icon: Wallet },
      { href: "/inbox", label: "Inbox", icon: Inbox },
      { href: "/processamentos", label: "Processamentos", icon: History },
      { href: "/metas", label: "Metas", icon: Target },
    ],
  },
  {
    title: "Gestão",
    items: [
      { href: "/relatorios", label: "Relatórios", icon: BookOpen },
      { href: "/familia", label: "Família", icon: Users },
      { href: "/contas", label: "Contas", icon: Wallet },
    ],
  },
  {
    title: "Sistema",
    items: [{ href: "/configuracoes", label: "Configurações", icon: Settings }],
  },
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

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
                {MOBILE_DRAWER_SECTIONS.map((section) => (
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
```


### components/chat/AICards.tsx (299 linhas)
```tsx
import React, { useTransition } from "react";
import { Check, Undo2, ChevronDown, Sparkles, AlertTriangle, Settings2, LayoutList, Loader2, Trash, BarChart3 } from "lucide-react";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { AIComposerBatchDraftItem, AIComposerTransactionDraft } from "@/lib/ai/contracts";
import Link from "next/link";
import { approveAiDraft } from "@/app/actions/ai/review";
import { toast } from "sonner";
import { undoTransaction } from "@/app/actions/transactions";
import { formatCurrency } from "@/lib/format";

export function SuccessCard({ 
  draft, txId, onUndo
}: { 
  draft: AIComposerTransactionDraft, txId: string, onUndo: () => void 
}) {
  const [isPending, startTransition] = useTransition();

  const handleUndo = () => {
    startTransition(async () => {
      const result = await undoTransaction(txId);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Transação desfeita.");
        onUndo();
      }
    });
  };

  return (
    <div className="card-c6 space-y-3 border border-border/40 relative overflow-hidden bg-surface">
      <div className="absolute top-0 left-0 w-1 h-full bg-positive"></div>
      <div className="flex items-center gap-2 text-positive">
        <Check size={18} />
        <p className="font-bold text-sm">Movimento registrado com sucesso!</p>
      </div>

      <div className="space-y-1">
        <p className="text-xl font-black">{formatCurrency(Number(draft.amount ?? 0))}</p>
        <p className="text-sm text-secondary font-medium">{draft.description}</p>
      </div>

      <div className="flex gap-2 flex-wrap pt-2">
        {draft.accountName && <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-secondary font-semibold border border-white/10">{draft.accountName}</span>}
        {draft.categoryName && <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-secondary font-semibold border border-white/10">{draft.categoryName}</span>}
        <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-[10px] font-semibold border border-primary/20">Auto-Saved</span>
      </div>

      <button onClick={handleUndo} disabled={isPending} className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 bg-surface-2 border border-border rounded-xl text-sm font-semibold hover:border-negative/50 hover:text-negative hover:bg-negative/5 transition-all">
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Undo2 size={16} />} 
        Desfazer instantâneo
      </button>
    </div>
  );
}

export function DraftReviewCard({ 
  draft, missingFields, accounts, categories, eventId, onApproved
}: { 
  draft: AIComposerTransactionDraft, missingFields: string[], accounts: any[], categories: any[], eventId: string | null, onApproved: () => void 
}) {
  const [internalDraft, setInternalDraft] = React.useState(draft);
  const [isPending, startTransition] = useTransition();

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await approveAiDraft(internalDraft, eventId);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Movimento aprovado e aprendizado salvo!");
        onApproved();
      }
    });
  };

  return (
    <div className="bg-surface-2 border border-border rounded-2xl p-4 shadow-soft">
      <div className="mb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center justify-between pb-1">
          Quick Review
          <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded flex items-center gap-1">
            <Sparkles size={8} /> {(internalDraft.confidence.overall * 100).toFixed(0)}% Match
          </span>
        </p>
        <p className="text-xs text-secondary leading-relaxed pt-1">
          Revise os dados abaixo.
        </p>
      </div>

      <form onSubmit={submitReview} className="space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] text-secondary font-semibold">Valor</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-secondary text-sm font-semibold pointer-events-none">R$</span>
            <CurrencyInput value={internalDraft.amount || ""} onValueChange={(v) => setInternalDraft({...internalDraft, amount: v ? Number(v) : null})} className="input-c6-sm w-full pl-9 font-bold" required placeholder="0,00" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-secondary font-semibold">Descrição Rápida</label>
          <input type="text" value={internalDraft.description} onChange={(e) => setInternalDraft({...internalDraft, description: e.target.value})} className="input-c6-sm w-full" required />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-secondary font-semibold flex justify-between">
            Conta 
            {missingFields?.includes("account") && <span className="text-negative font-bold">Obrigatório</span>}
          </label>
          <div className="relative">
            <select value={internalDraft.accountId || ""} onChange={(e) => setInternalDraft({...internalDraft, accountId: e.target.value})} className={`input-c6-sm w-full appearance-none pr-8 ${missingFields?.includes("account") && !internalDraft.accountId ? "border-negative/50 bg-negative/5" : ""}`} required>
              <option value="">Selecione de onde saiu / onde entrou...</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-secondary font-semibold">Categoria</label>
          <div className="relative">
            <select value={internalDraft.categoryId || ""} onChange={(e) => setInternalDraft({...internalDraft, categoryId: e.target.value})} className="input-c6-sm w-full appearance-none pr-8">
              <option value="">Outros...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          </div>
        </div>

        <button type="submit" disabled={isPending} className="btn-primary w-full py-2 mt-4 text-sm font-bold flex gap-2 items-center justify-center">
          {isPending ? <Loader2 size={16} className="animate-spin text-white" /> : <><Check size={16}/> Salvar Manualmente</>}
        </button>
      </form>
    </div>
  );
}

export function BatchReviewCard({ 
  items, onComplete 
}: { 
  items: AIComposerBatchDraftItem[], onComplete: () => void 
}) {
  const [internalItems, setInternalItems] = React.useState(items);
  const [isPending, startTransition] = React.useTransition();

  const handleApproveAll = () => {
    startTransition(async () => {
       for (const item of internalItems) {
          const d = item.draft;
          if (!d.accountId || !d.amount || !d.description) continue; // skip invalid in batch
          await approveAiDraft(d, item.eventId);
       }
       toast.success("Lote aprovado!");
       onComplete();
    });
  };

  const removeDraft = (i: number) => {
    setInternalItems(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 shadow-soft">
       <div className="mb-4">
         <p className="text-xs font-bold flex items-center gap-2"><LayoutList size={16} className="text-primary"/> Batch Import</p>
         <p className="text-[11px] text-secondary">Temos {internalItems.length} itens aguardando aprovação.</p>
       </div>
       <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
         {internalItems.map((item, i) => {
            const d = item.draft;
            return (
            <div key={i} className="flex flex-col gap-1 p-2 bg-surface-2 border border-border/50 rounded-xl relative">
              <div className="flex justify-between items-start">
                 <p className="text-sm font-bold">{formatCurrency(Number(d.amount ?? 0))}</p>
                 <button onClick={() => removeDraft(i)} className="text-secondary hover:text-negative"><Trash size={12} /></button>
              </div>
              <p className="text-[10px] text-secondary truncate">{d.description}</p>
              <div className="flex gap-1">
                 <span className={`text-[9px] px-1 rounded ${d.accountId ? "bg-primary/10 text-primary" : "bg-negative/20 text-negative"}`}>{d.accountId ? "Conta OK" : "Sem Conta"}</span>
                 <span className={`text-[9px] px-1 rounded ${d.amount ? "bg-primary/10 text-primary" : "bg-negative/20 text-negative"}`}>{d.amount ? "Valor OK" : "Sem Valor"}</span>
              </div>
            </div>
         )})}
       </div>
       {internalItems.length > 0 && (
         <button onClick={handleApproveAll} disabled={isPending} className="btn-primary w-full py-2 mt-4 text-sm font-bold flex justify-center">
            {isPending ? <Loader2 size={16} className="animate-spin text-white" /> : "Aprovar Lote Válido"}
         </button>
       )}
    </div>
  );
}

export function NextBestActionCard({ 
  missingAccount, onSwitchToReview
}: { 
  missingAccount: boolean;
  onSwitchToReview: () => void;
}) {
  return (
    <div className="card-c6 border-primary/30 bg-primary/5 space-y-3">
      <div className="flex gap-2 items-start text-primary">
        <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
        <p className="font-bold text-sm leading-tight">
          {missingAccount ? "Defina uma conta padrão para liberar o autosave." : "Informações faltantes para autosave."}
        </p>
      </div>
      {missingAccount && (
        <div className="flex flex-col gap-2 pt-1">
          <Link href="/contas?highlightDefault=1&from=ai-composer" className="flex items-center justify-center gap-2 w-full py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:scale-[1.02] transition-transform">
            <Settings2 size={16} /> Definir conta padrão
          </Link>
          <button onClick={onSwitchToReview} className="text-xs font-semibold text-secondary hover:text-white transition-colors py-1">
            Revisar manualmente
          </button>
        </div>
      )}
    </div>
  );
}

export function SavedPlanCard({ planId, planData }: { planId?: string, planData: any }) {
  return (
    <div className="card-c6 border border-primary/20 bg-surface space-y-3 relative overflow-hidden mt-2">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/80"></div>
      <div className="flex items-center gap-2 text-primary font-bold pb-2 border-b border-border/50">
        <Sparkles size={16} /> Plano Salvo
      </div>
      <div>
        <p className="font-black text-sm">{planData.title || "Objetivo Financeiro"}</p>
        <p className="text-xs text-secondary mt-1">{planData.summary}</p>
      </div>
      {(planData.targetAmount || planData.monthlyRequiredAmount) && (
         <div className="grid grid-cols-2 gap-2 mt-2">
            {planData.targetAmount && (
               <div className="p-2 bg-surface-2 rounded-lg text-xs">
                  <p className="text-secondary mb-1">Alvo</p>
                  <p className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(planData.targetAmount))}</p>
               </div>
            )}
            {planData.monthlyRequiredAmount && (
               <div className="p-2 bg-surface-2 rounded-lg text-xs">
                  <p className="text-secondary mb-1">Poupar/Mês</p>
                  <p className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(planData.monthlyRequiredAmount))}</p>
               </div>
            )}
         </div>
      )}
      <div className="w-full py-2 mt-2 text-xs font-bold flex gap-2 items-center justify-center bg-primary/10 text-primary border border-primary/20 rounded-xl">
        <BarChart3 size={14}/> Plano salvo nesta conversa
      </div>
    </div>
  );
}

export function RecommendationCard({ recommendation }: { recommendation: { message: string, type: string, actionLabel?: string, actionTarget?: string } }) {
  return (
    <div className="card-c6 border border-info/20 bg-info/5 space-y-2 relative overflow-hidden mt-2">
      <div className="absolute top-0 left-0 w-1 h-full bg-info/80"></div>
      <div className="flex gap-2 text-sm text-foreground items-start">
         <Sparkles size={16} className="text-info shrink-0 mt-0.5" />
         <p className="leading-relaxed">{recommendation.message}</p>
      </div>
      {recommendation.actionLabel && recommendation.actionTarget && (
         <Link href={recommendation.actionTarget} className="mt-2 inline-flex border border-info/30 bg-info/10 text-info hover:bg-info hover:text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-colors">
            {recommendation.actionLabel}
         </Link>
      )}
    </div>
  );
}

export function ProductFeedbackCard({ feedbackId, normalizedFeedback }: { feedbackId?: string, normalizedFeedback: any }) {
  return (
    <div className="card-c6 border border-secondary/20 bg-surface space-y-3 relative overflow-hidden mt-2">
      <div className="absolute top-0 left-0 w-1 h-full bg-secondary/80"></div>
      <div className="flex items-center gap-2 text-secondary font-bold pb-2 border-b border-border/50">
        <Sparkles size={16} /> Sugestão Registrada
      </div>
      <div>
        <p className="font-black text-sm">{normalizedFeedback.title || "Feedback de Produto"}</p>
        <p className="text-xs text-secondary mt-1">{normalizedFeedback.summary}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="p-2 bg-surface-2 rounded-lg text-[10px]">
          <p className="text-secondary mb-1 uppercase font-bold tracking-tighter">Tipo</p>
          <p className="font-bold truncate">{normalizedFeedback.type}</p>
        </div>
        <div className="p-2 bg-surface-2 rounded-lg text-[10px]">
          <p className="text-secondary mb-1 uppercase font-bold tracking-tighter">Área</p>
          <p className="font-bold truncate">{normalizedFeedback.area}</p>
        </div>
        <div className="p-2 bg-surface-2 rounded-lg text-[10px]">
          <p className="text-secondary mb-1 uppercase font-bold tracking-tighter">Impacto</p>
          <p className="font-bold truncate">{normalizedFeedback.impact}</p>
        </div>
      </div>
      <div className="w-full py-2 mt-2 text-[10px] font-bold flex gap-2 items-center justify-center bg-secondary/10 text-secondary border border-secondary/20 rounded-xl">
        ID: #{feedbackId}
      </div>
    </div>
  );
}
```


### components/layout/AppLayout.tsx (248 linhas)
```tsx
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
```


### components/dashboard-client.tsx (217 linhas)
```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Eye,
  EyeOff,
  ChevronRight,
  CreditCard,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

/* ─── tipos ─── */
interface DashboardClientProps {
  user: { id: string; email: string; name: string | null };
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
};

/* ─── mock data enquanto API não está conectada ─── */
const MOCK = {
  totalBalance: 34_850.8,
  monthIncome: 9_700.0,
  monthExpense: 3_247.5,
  accounts: [
    { id: "1", name: "Conta Corrente", type: "CHECKING", balance: 12_450.8, color: "#FF2D55" },
    { id: "2", name: "Poupança",        type: "SAVINGS",  balance: 5_230.5,  color: "#34C759" },
    { id: "3", name: "Investimentos",   type: "INVESTMENT", balance: 18_750.0, color: "#0A84FF" },
    { id: "4", name: "Nubank",          type: "CREDIT",   balance: -2_150.0,  color: "#FF2D55" },
  ],
  recentTransactions: [
    { id: "1", type: "EXPENSE", description: "Supermercado",          icon: "🛒", amount: 245.50,  date: "Hoje",   category: "Alimentação" },
    { id: "2", type: "INCOME",  description: "Salário Mensal",         icon: "💰", amount: 8500.00, date: "Hoje",   category: "Salário" },
    { id: "3", type: "EXPENSE", description: "Uber",                   icon: "🚗", amount: 32.00,   date: "Ontem",  category: "Transporte" },
    { id: "4", type: "EXPENSE", description: "Netflix",                icon: "🎬", amount: 54.90,   date: "Ontem",  category: "Streaming" },
    { id: "5", type: "INCOME",  description: "Freelance - Projeto Web", icon: "💻", amount: 1200.00, date: "5 abr.", category: "Freelance" },
  ],
};

export default function DashboardClient({ user }: DashboardClientProps) {
  const [showBalance, setShowBalance] = useState(true);
  const firstName = user.name?.split(" ")[0] || user.email.split("@")[0];
  const netMonth = MOCK.monthIncome - MOCK.monthExpense;

  return (
    <motion.div
      className="space-y-6 pb-8"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* ── Greeting ── */}
      <motion.section variants={item} className="pt-2">
        <p className="text-secondary text-sm font-medium">Olá, {firstName} 👋</p>

        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-secondary text-xs uppercase tracking-widest font-semibold mb-1">Saldo total</p>
            <div className="flex items-center gap-3">
              <h1
                className="text-5xl font-black tracking-tight tabular-nums leading-none"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {showBalance ? formatCurrency(MOCK.totalBalance) : "R$ ••••••"}
              </h1>
              <motion.button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 text-secondary hover:text-white rounded-full hover:bg-white/5 transition-colors"
                whileTap={{ scale: 0.9 }}
                aria-label={showBalance ? "Esconder saldo" : "Mostrar saldo"}
              >
                {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Stats Row ── */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        {/* Receitas */}
        <div className="card-c6-sm flex flex-col gap-1.5">
          <div className="p-2 bg-positive/10 rounded-lg w-fit">
            <ArrowUpRight className="w-4 h-4 text-positive" />
          </div>
          <p className="text-[10px] text-secondary font-semibold uppercase tracking-wider">Receitas</p>
          <p className="text-base font-bold text-positive tabular-nums">
            {showBalance ? formatCurrency(MOCK.monthIncome) : "••••"}
          </p>
        </div>

        {/* Despesas */}
        <div className="card-c6-sm flex flex-col gap-1.5">
          <div className="p-2 bg-negative/10 rounded-lg w-fit">
            <ArrowDownLeft className="w-4 h-4 text-negative" />
          </div>
          <p className="text-[10px] text-secondary font-semibold uppercase tracking-wider">Despesas</p>
          <p className="text-base font-bold text-negative tabular-nums">
            {showBalance ? formatCurrency(MOCK.monthExpense) : "••••"}
          </p>
        </div>

        {/* Balanço */}
        <div className="card-c6-sm flex flex-col gap-1.5">
          <div className={`p-2 rounded-lg w-fit ${netMonth >= 0 ? "bg-positive/10" : "bg-negative/10"}`}>
            <TrendingUp className={`w-4 h-4 ${netMonth >= 0 ? "text-positive" : "text-negative"}`} />
          </div>
          <p className="text-[10px] text-secondary font-semibold uppercase tracking-wider">Balanço</p>
          <p className={`text-base font-bold tabular-nums ${netMonth >= 0 ? "text-positive" : "text-negative"}`}>
            {showBalance ? formatCurrency(Math.abs(netMonth)) : "••••"}
          </p>
        </div>
      </motion.div>

      {/* ── Contas Scroll ── */}
      <motion.section variants={item} className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-[15px]">Minhas Contas</h2>
          <Link href="/caixa" className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:opacity-80 transition-opacity">
            Ver todas <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-3 scroll-horizontal pb-1 -mx-4 px-4">
          {MOCK.accounts.map((acc) => (
            <div
              key={acc.id}
              className="flex-shrink-0 w-[200px] account-card scroll-snap-start"
            >
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-secondary" />
                <p className="text-xs text-secondary font-medium">{acc.type}</p>
              </div>
              <p className="text-sm font-semibold text-white/90 mb-1">{acc.name}</p>
              <p
                className="text-xl font-black tabular-nums"
                style={{ color: acc.balance >= 0 ? "#FFFFFF" : "#FF3B30" }}
              >
                {showBalance
                  ? formatCurrency(Math.abs(acc.balance))
                  : "••••"}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Últimas Transações ── */}
      <motion.section variants={item} className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-[15px]">Última Movimentação</h2>
          <Link href="/caixa" className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:opacity-80 transition-opacity">
            Ver todas <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="card-c6 p-0 divide-y divide-border overflow-hidden">
          {MOCK.recentTransactions.map((tx, i) => {
            const isIncome = tx.type === "INCOME";
            return (
              <motion.div
                key={tx.id}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: isIncome ? "rgba(52,199,89,0.12)" : "rgba(255,59,48,0.12)" }}
                >
                  {tx.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{tx.description}</p>
                  <p className="text-[11px] text-secondary">{tx.category} · {tx.date}</p>
                </div>

                <p
                  className={`text-sm font-bold tabular-nums flex-shrink-0 ${isIncome ? "text-positive" : "text-foreground"}`}
                >
                  {isIncome ? "+" : "-"}{formatCurrency(Math.abs(tx.amount))}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── FAB (mobile) ── */}
      <Link
        href="/caixa"
        className="md:hidden fixed z-50 w-14 h-14 bg-primary text-white rounded-full shadow-glow-primary flex items-center justify-center active:scale-95 transition-transform"
        style={{ right: "1.25rem", bottom: "calc(6rem + env(safe-area-inset-bottom, 0px))" }}
        aria-label="Registrar movimento"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </motion.div>
  );
}
```

## 7. MODELO DE DADOS
### Definições encontradas por busca (`type`, `interface`, `z.object`, `Database`, `schema`)

#### __tests__/transaction-schema.test.ts:8
```ts

// ─── Inline schemas (mirror of lib/validations/transaction.schema.ts) ────────

const TransactionType    = z.enum(["INCOME", "EXPENSE", "TRANSFER"]);
const TransactionStatus  = z.enum(["COMPLETED", "PENDING"]);

const csvTransactionRowSchema = z.object({
  date:        z.coerce.date(),
  description: z.string().min(1).max(200),
  amount:      z.coerce.number().positive(),
// ... (N linhas omitidas)
```

#### __tests__/transaction-schema.test.ts:13
```ts

const csvTransactionRowSchema = z.object({
  date:        z.coerce.date(),
  description: z.string().min(1).max(200),
  amount:      z.coerce.number().positive(),
  type:        TransactionType,
  status:      TransactionStatus.default("COMPLETED"),
});

// ─── Tests ────────────────────────────────────────────────────────────────────
// ... (N linhas omitidas)
```

#### app/(dashboard)/DashboardPageClient.tsx:19
```tsx

interface User { id: string; email: string; name: string | null }

interface BankAccount {
  id: string; name: string; type: string;
  balance: number | string; color: string | null; icon: string | null;
}

interface Transaction {
  id: string; type: string; amount: number | string;
// ... (N linhas omitidas)
```

#### app/(dashboard)/DashboardPageClient.tsx:21
```tsx

interface BankAccount {
  id: string; name: string; type: string;
  balance: number | string; color: string | null; icon: string | null;
}

interface Transaction {
  id: string; type: string; amount: number | string;
  description: string | null; date: Date | string;
  bankAccount: { name: string; color: string | null; icon: string | null };
// ... (N linhas omitidas)
```

#### app/(dashboard)/DashboardPageClient.tsx:26
```tsx

interface Transaction {
  id: string; type: string; amount: number | string;
  description: string | null; date: Date | string;
  bankAccount: { name: string; color: string | null; icon: string | null };
  category: { name: string; icon: string | null; color: string | null } | null;
  user: { id: string; name: string | null };
}

interface CategoryBreakdown {
// ... (N linhas omitidas)
```

#### app/(dashboard)/DashboardPageClient.tsx:34
```tsx

interface CategoryBreakdown {
  categoryId: string | null;
  amount: number;
  category: { id: string; name: string; icon: string | null; color: string | null } | null;
}

interface Summary {
  totalBalance: number;
  monthIncome: number;
// ... (N linhas omitidas)
```

#### app/(dashboard)/DashboardPageClient.tsx:40
```tsx

interface Summary {
  totalBalance: number;
  monthIncome: number;
  monthExpense: number;
  accounts: BankAccount[];
  recentTransactions: Transaction[];
  categoryBreakdown: CategoryBreakdown[];
}

// ... (N linhas omitidas)
```

#### app/(dashboard)/DashboardPageClient.tsx:49
```tsx

interface EvolutionItem {
  month: string; income: number; expense: number; balance: number;
}

interface ForecastItem {
  day: string; actual: number | null; forecast: number;
}

interface Props {
// ... (N linhas omitidas)
```

#### app/(dashboard)/DashboardPageClient.tsx:53
```tsx

interface ForecastItem {
  day: string; actual: number | null; forecast: number;
}

interface Props {
  user: User;
  summary: Summary;
  evolution: EvolutionItem[];
  forecast: ForecastItem[];
// ... (N linhas omitidas)
```

#### app/(dashboard)/DashboardPageClient.tsx:57
```tsx

interface Props {
  user: User;
  summary: Summary;
  evolution: EvolutionItem[];
  forecast: ForecastItem[];
  recommendations?: any[];
}

// ─── Animation Variants ───────────────────────────────────────────────────────
// ... (N linhas omitidas)
```

#### app/(dashboard)/caixa/CaixaPageClient.tsx:19
```tsx
/* ── Types ────────────────────────────────────────────── */
interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
  icon?: string | null;
  color?: string | null;
  user: { name: string; id: string };
}
// ... (N linhas omitidas)
```

#### app/(dashboard)/caixa/CaixaPageClient.tsx:29
```tsx

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  date: Date;
  status: string;
  user?: { name: string } | null;
  bankAccount?: { name: string; color?: string | null; icon?: string | null } | null;
// ... (N linhas omitidas)
```

#### app/(dashboard)/caixa/CaixaPageClient.tsx:40
```tsx

interface CaixaPageClientProps {
  overview: {
    accounts: Account[];
    totalBalance: number;
  };
  timeline: Transaction[];
}

/* ── Helpers ──────────────────────────────────────────── */
// ... (N linhas omitidas)
```

#### app/(dashboard)/contas/ContasPageClient.tsx:16
```tsx

type BankAccountType = "CHECKING" | "SAVINGS" | "CREDIT" | "INVESTMENT";

interface BankAccount {
  id: string; name: string; type: BankAccountType;
  balance: number | string; color: string | null; icon: string | null;
  creditLimit?: number | string | null;
  invoiceClosingDay?: number | null;
  invoiceDueDay?: number | null;
  isDefault?: boolean;
// ... (N linhas omitidas)
```

#### app/(dashboard)/contas/ContasPageClient.tsx:18
```tsx

interface BankAccount {
  id: string; name: string; type: BankAccountType;
  balance: number | string; color: string | null; icon: string | null;
  creditLimit?: number | string | null;
  invoiceClosingDay?: number | null;
  invoiceDueDay?: number | null;
  isDefault?: boolean;
}

// ... (N linhas omitidas)
```

#### app/(dashboard)/contas/ContasPageClient.tsx:44
```tsx

interface AccountFormData {
  name: string; type: BankAccountType; balance: string; color: string;
  icon: string; creditLimit: string; invoiceClosingDay: string; invoiceDueDay: string;
  createSetupBalance: boolean; isDefault: boolean;
}

const EMPTY_FORM: AccountFormData = {
  name: "", type: "CHECKING", balance: "0",
  color: "#FF2D55", icon: "💳", creditLimit: "", invoiceClosingDay: "", invoiceDueDay: "",
// ... (N linhas omitidas)
```

#### app/(dashboard)/familia/FamiliaPageClient.tsx:19
```tsx

interface Member {
  id: string; name: string | null; email: string;
  role: UserRole; createdAt: Date | string;
}

interface CurrentUser {
  id: string; name: string | null; email: string;
  role: UserRole; householdId: string | null;
}
// ... (N linhas omitidas)
```

#### app/(dashboard)/familia/FamiliaPageClient.tsx:24
```tsx

interface CurrentUser {
  id: string; name: string | null; email: string;
  role: UserRole; householdId: string | null;
}

interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  netResult: number;
// ... (N linhas omitidas)
```

#### app/(dashboard)/familia/FamiliaPageClient.tsx:29
```tsx

interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  netResult: number;
  topCategories: { category: string; amount: number; percentOfTotal: number }[];
  goalsProgress: { name: string; progress: number; deadline: string | null }[];
  biggestExpense: { description: string; amount: number; member: string } | null;
  recommendations: { id: string; type: string; message: string }[];
}
// ... (N linhas omitidas)
```

#### app/(dashboard)/familia/FamiliaPageClient.tsx:39
```tsx

type Props = {
  currentUser: CurrentUser;
  members: Member[];
  household: { id: string; name: string } | null;
  inviteCode: string | null;
  monthlyCheckViewed: boolean;
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
// ... (N linhas omitidas)
```

#### app/(dashboard)/inbox/InboxPageClient.tsx:7
```tsx

type DraftLike = {
  description?: string;
  amount?: number;
  categoryName?: string;
};

type InboxEvent = {
  id: string;
  source: string;
// ... (N linhas omitidas)
```

#### app/(dashboard)/inbox/InboxPageClient.tsx:13
```tsx

type InboxEvent = {
  id: string;
  source: string;
  inputType: string;
  createdAt: string;
  decision: string;
  captureGroupId: string | null;
  createdTransactionId: string | null;
  normalizedDraft: DraftLike | null;
// ... (N linhas omitidas)
```

#### app/(dashboard)/inbox/InboxPageClient.tsx:24
```tsx

type ParsedItem = {
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
};

type ParseResponse = {
  items: ParsedItem[];
// ... (N linhas omitidas)
```

#### app/(dashboard)/inbox/InboxPageClient.tsx:31
```tsx

type ParseResponse = {
  items: ParsedItem[];
  captureEventId?: string;
  correlationId?: string;
  reviewRequired?: boolean;
  qualityFlags?: Array<{ code: string; severity: string }>;
};

type Props = {
// ... (N linhas omitidas)
```

#### app/(dashboard)/inbox/InboxPageClient.tsx:39
```tsx

type Props = {
  events: InboxEvent[];
  eventsLoadError?: string | null;
};

function sourceBadge(channel: string, inputType: string) {
  if (inputType === "ofx") return "via OFX";
  if (inputType === "csv") return "via CSV";
  if (inputType === "pdf") return "via PDF";
// ... (N linhas omitidas)
```

#### app/(dashboard)/metas/MetasPageClient.tsx:16
```tsx

interface Goal {
  id: string; name: string; targetAmount: number; currentAmount: number;
  deadline: string | null; icon: string | null; color: string | null;
  completed: boolean;
}

// ─── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({
// ... (N linhas omitidas)
```

#### app/(dashboard)/relatorios/RelatoriosPageClient.tsx:15
```tsx

interface Transaction {
  id: string; type: string; amount: number;
  description: string | null; date: string;
  bankAccount: { name: string; color: string | null };
  category: { name: string; icon: string | null; color: string | null } | null;
  user?: { id: string; name: string | null } | null;
  status: string;
  ignoreInTotals: boolean;
}
// ... (N linhas omitidas)
```

#### app/(dashboard)/relatorios/RelatoriosPageClient.tsx:24
```tsx
}
interface Category { id: string; name: string; icon: string | null; color: string | null; type: string }
interface Account   { id: string; name: string; color: string | null }
interface HouseholdMember { id: string; name: string | null; email: string }
interface Evolution { month: string; income: number; expense: number; balance: number }

interface Props {
  evolution: Evolution[];
  transactions: Transaction[];
  categories: Category[];
// ... (N linhas omitidas)
```

#### app/(dashboard)/relatorios/RelatoriosPageClient.tsx:25
```tsx
interface Category { id: string; name: string; icon: string | null; color: string | null; type: string }
interface Account   { id: string; name: string; color: string | null }
interface HouseholdMember { id: string; name: string | null; email: string }
interface Evolution { month: string; income: number; expense: number; balance: number }

interface Props {
  evolution: Evolution[];
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
// ... (N linhas omitidas)
```

#### app/(dashboard)/relatorios/RelatoriosPageClient.tsx:26
```tsx
interface Account   { id: string; name: string; color: string | null }
interface HouseholdMember { id: string; name: string | null; email: string }
interface Evolution { month: string; income: number; expense: number; balance: number }

interface Props {
  evolution: Evolution[];
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  members: HouseholdMember[];
// ... (N linhas omitidas)
```

#### app/(dashboard)/relatorios/RelatoriosPageClient.tsx:27
```tsx
interface HouseholdMember { id: string; name: string | null; email: string }
interface Evolution { month: string; income: number; expense: number; balance: number }

interface Props {
  evolution: Evolution[];
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  members: HouseholdMember[];
  currentMonth: number;
// ... (N linhas omitidas)
```

#### app/(dashboard)/relatorios/RelatoriosPageClient.tsx:29
```tsx

interface Props {
  evolution: Evolution[];
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  members: HouseholdMember[];
  currentMonth: number;
  currentYear: number;
}
// ... (N linhas omitidas)
```

#### app/(dashboard)/saude/SaudePageClient.tsx:10
```tsx
/* ── Types ────────────────────────────────────────────── */
interface HealthScoreData {
  score: number;
  classification: "Saudável" | "Atenção" | "Risco";
  breakdown: { spending: number; growth: number; commitments: number; goals: number };
}
interface ProjectionData {
  currentBalance: number;
  projectedBalance30d: number;
  daysUntilZero: number | null;
// ... (N linhas omitidas)
```

#### app/(dashboard)/saude/SaudePageClient.tsx:15
```tsx
}
interface ProjectionData {
  currentBalance: number;
  projectedBalance30d: number;
  daysUntilZero: number | null;
  message: string;
  projectionPoints: Array<{ day: number; balance: number }>;
}
interface BalanceData { current: number; lastMonth: number; change: number }
interface BurnRateData { last30Days: number; previous30Days: number; changePercent: number }
// ... (N linhas omitidas)
```

#### app/(dashboard)/saude/SaudePageClient.tsx:22
```tsx
}
interface BalanceData { current: number; lastMonth: number; change: number }
interface BurnRateData { last30Days: number; previous30Days: number; changePercent: number }
interface Recommendation { id: string; type: string; message: string; score: number; createdAt: Date }
interface MemberContribution { id: string; name: string; amount: number; percent: number }
interface FinanceInsights {
  totalMonth: number;
  topCategories: Array<{ category: string; amount: number }>;
  alert: { type: "warning"; message: string } | null;
  recommendation: { message: string; impact: number } | null;
// ... (N linhas omitidas)
```

#### app/(dashboard)/saude/SaudePageClient.tsx:23
```tsx
interface BalanceData { current: number; lastMonth: number; change: number }
interface BurnRateData { last30Days: number; previous30Days: number; changePercent: number }
interface Recommendation { id: string; type: string; message: string; score: number; createdAt: Date }
interface MemberContribution { id: string; name: string; amount: number; percent: number }
interface FinanceInsights {
  totalMonth: number;
  topCategories: Array<{ category: string; amount: number }>;
  alert: { type: "warning"; message: string } | null;
  recommendation: { message: string; impact: number } | null;
  average: number;
// ... (N linhas omitidas)
```

#### app/(dashboard)/saude/SaudePageClient.tsx:24
```tsx
interface BurnRateData { last30Days: number; previous30Days: number; changePercent: number }
interface Recommendation { id: string; type: string; message: string; score: number; createdAt: Date }
interface MemberContribution { id: string; name: string; amount: number; percent: number }
interface FinanceInsights {
  totalMonth: number;
  topCategories: Array<{ category: string; amount: number }>;
  alert: { type: "warning"; message: string } | null;
  recommendation: { message: string; impact: number } | null;
  average: number;
}
// ... (N linhas omitidas)
```

#### app/(dashboard)/saude/SaudePageClient.tsx:25
```tsx
interface Recommendation { id: string; type: string; message: string; score: number; createdAt: Date }
interface MemberContribution { id: string; name: string; amount: number; percent: number }
interface FinanceInsights {
  totalMonth: number;
  topCategories: Array<{ category: string; amount: number }>;
  alert: { type: "warning"; message: string } | null;
  recommendation: { message: string; impact: number } | null;
  average: number;
}
interface SaudePageClientProps {
// ... (N linhas omitidas)
```

#### app/(dashboard)/saude/SaudePageClient.tsx:26
```tsx
interface MemberContribution { id: string; name: string; amount: number; percent: number }
interface FinanceInsights {
  totalMonth: number;
  topCategories: Array<{ category: string; amount: number }>;
  alert: { type: "warning"; message: string } | null;
  recommendation: { message: string; impact: number } | null;
  average: number;
}
interface SaudePageClientProps {
  healthScore: HealthScoreData | null;
// ... (N linhas omitidas)
```

#### app/(dashboard)/saude/SaudePageClient.tsx:33
```tsx
}
interface SaudePageClientProps {
  healthScore: HealthScoreData | null;
  projection: ProjectionData | null;
  balance: BalanceData;
  burnRate: BurnRateData;
  recommendations: Recommendation[];
  memberContributions: MemberContribution[];
  userRole: string;
  financeInsights: FinanceInsights;
// ... (N linhas omitidas)
```

#### app/actions/accounts.ts:12
```ts

const CreateAccountSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(50),
  type: z.nativeEnum(BankAccountType),
  balance: z.coerce.number().default(0),
  color: z.string().optional(),
  icon: z.string().optional(),
  creditLimit: z.coerce.number().optional(),
  invoiceClosingDay: z.coerce.number().min(1).max(31).optional(),
  invoiceDueDay: z.coerce.number().min(1).max(31).optional(),
// ... (N linhas omitidas)
```

#### app/actions/budgets.ts:10
```ts

const BudgetSchema = z.object({
  categoryId: z.string().cuid("Categoria inválida"),
  amount:     z.coerce.number().positive("Valor deve ser positivo"),
  month:      z.coerce.number().int().min(1).max(12),
  year:       z.coerce.number().int().min(2020).max(2099),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

// ... (N linhas omitidas)
```

#### app/actions/categories.ts:11
```ts

const CategorySchema = z.object({
  name:  z.string().min(1).max(50),
  type:  z.nativeEnum(TransactionType),
  icon:  z.string().max(10).optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
});

// ─── Helper ──────────────────────────────────────────────────────────────────

// ... (N linhas omitidas)
```

#### app/actions/goals.ts:10
```ts

const GoalSchema = z.object({
  name:          z.string().min(1).max(80),
  targetAmount:  z.coerce.number().positive("Valor alvo deve ser positivo"),
  currentAmount: z.coerce.number().min(0).default(0),
  deadline:      z.coerce.date().optional().nullable(),
  icon:          z.string().max(10).optional().nullable(),
  color:         z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
});

// ... (N linhas omitidas)
```

#### app/actions/household.ts:335
```ts

  const schema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
  });

  const parsed = schema.safeParse({ email, password });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
// ... (N linhas omitidas)
```

#### app/actions/household.ts:340
```ts

  const parsed = schema.safeParse({ email, password });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "Email já cadastrado" };

  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

// ... (N linhas omitidas)
```

#### app/actions/recurring.ts:39
```ts

const RecurringSchema = z.object({
  id: z.string().optional(),
  bankAccountId: z.string().min(1),
  categoryId: z.string().nullable().optional(),
  type: z.nativeEnum(TransactionType),
  amount: z.coerce.number().positive(),
  description: z.string().min(1),
  frequency: z.nativeEnum(RecurringFrequency),
  nextDate: z.string().min(1),
// ... (N linhas omitidas)
```

#### app/actions/transactions.ts:17
```ts

const CreateTransactionSchema = z.object({
  bankAccountId:    z.string().cuid("Conta inválida"),
  categoryId:       z.string().cuid().optional().nullable(),
  type:             z.nativeEnum(TransactionType),
  status:           z.nativeEnum(TransactionStatus).default("COMPLETED"),
  amount:           z.coerce.number().positive("Valor deve ser positivo"),
  description:      z.string().max(200).optional().nullable(),
  date:             z.coerce.date(),
  installmentNumber: z.coerce.number().int().positive().optional().nullable(),
// ... (N linhas omitidas)
```

#### app/actions/transactions.ts:35
```ts

const ListTransactionsSchema = z.object({
  page:         z.coerce.number().int().positive().default(1),
  limit:        z.coerce.number().int().positive().max(100).default(20),
  type:         z.nativeEnum(TransactionType).optional(),
  categoryId:   z.string().cuid().optional(),
  bankAccountId: z.string().cuid().optional(),
  userId:       z.string().cuid().optional(),
  dateFrom:     z.coerce.date().optional(),
  dateTo:       z.coerce.date().optional(),
// ... (N linhas omitidas)
```

#### app/actions/transactions.ts:116
```ts

export type ManagedTransactionParams = {
  userId: string;
  householdId: string | null;
  bankAccountId: string;
  categoryId?: string | null;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description?: string | null;
// ... (N linhas omitidas)
```

#### app/actions/transactions.ts:255
```ts

export type CreateTransactionBatchInput = {
  date: Date;
  amount: number;
  description: string;
  type: "expense" | "income";
};

export async function createTransactionBatch(items: CreateTransactionBatchInput[]) {
  const ctx = await getAuthContext();
// ... (N linhas omitidas)
```

#### app/actions/transactions.ts:392
```ts
        : []),
      // Remover (noop sem tags no schema)
      // Atualizar transação
      prisma.transaction.update({
        where: { id },
        data: {
          bankAccountId,
          categoryId:        categoryId ?? null,
          type,
          status,
// ... (N linhas omitidas)
```

#### app/api/ai/chat/route.ts:11
```ts

const BodySchema = z.object({
  message: z.string().min(1).max(1000),
});

export async function POST(req: NextRequest) {
  // Auth
  const { user } = await validateRequest();
  if (!user) return new Response("Unauthorized", { status: 401 });

// ... (N linhas omitidas)
```

#### app/api/ai/composer/route.ts:10
```ts

const BodySchema = z.object({
  mode: z.enum(["Registrar", "Revisar", "Perguntar", "Planejar", "Sugerir"]).default("Registrar"),
  inputType: z.enum(["text", "image", "text+image", "audio", "pdf", "csv"]),
  content: z.string().optional(),
  imageBase64: z.string().optional(),
  mimeType: z.string().optional(),
  conversationId: z.string().optional(),
  audioDurationMs: z.number().optional(),
});
// ... (N linhas omitidas)
```

#### app/api/auth/login/route.ts:107
```ts
    ) {
      console.error("Database error during login:", {
        database: getRuntimeDatabaseDebugInfo(),
        name: error.name,
        code: "code" in error ? error.code : undefined,
        message: error.message,
      });
      return NextResponse.json(
        { message: "Serviço temporariamente indisponível. Tente novamente." },
        { status: 503 }
// ... (N linhas omitidas)
```

#### app/api/auth/register/route.ts:95
```ts
    ) {
      console.error("Database error during registration:", {
        database: getRuntimeDatabaseDebugInfo(),
        name: error.name,
        code: "code" in error ? error.code : undefined,
        message: error.message,
      });
      return NextResponse.json(
        { message: "Serviço temporariamente indisponível. Tente novamente." },
        { status: 503 }
// ... (N linhas omitidas)
```

#### app/api/inbox/email-webhook/route.ts:10
```ts

type PostmarkAttachment = {
  Name?: string;
  ContentType?: string;
  Content?: string;
};

type PostmarkInboundPayload = {
  From?: string;
  Subject?: string;
// ... (N linhas omitidas)
```

#### app/api/inbox/email-webhook/route.ts:16
```ts

type PostmarkInboundPayload = {
  From?: string;
  Subject?: string;
  TextBody?: string;
  HtmlBody?: string;
  Attachments?: PostmarkAttachment[];
};

function extractEmail(from: string | undefined) {
// ... (N linhas omitidas)
```

#### app/contador/[token]/ContadorPublicClient.tsx:8
```tsx

interface Transaction {
  id: string; amount: number | string; type: string; date: Date | string; description: string | null;
  category: { id: string; name: string; taxClassification: string | null; icon: string | null; color: string | null } | null;
  bankAccount: { id: string; name: string; color: string | null };
  user: { id: string; name: string | null };
}

export default function ContadorPublicClient({ transactions, year }: { transactions: Transaction[], year: number }) {
  
// ... (N linhas omitidas)
```

#### components/chat/AIChatWidget.tsx:17
```tsx

type ComposerMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode: string;
  timestamp: string;
  metadata?: any;
};

// ... (N linhas omitidas)
```

#### components/dashboard-client.tsx:18
```tsx
/* ─── tipos ─── */
interface DashboardClientProps {
  user: { id: string; email: string; name: string | null };
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const container = {
  hidden: { opacity: 0 },
// ... (N linhas omitidas)
```

#### components/layout/AppLayout.tsx:34
```tsx

interface AppLayoutProps {
  children: React.ReactNode;
  user: { name: string | null; email: string } | null;
  householdName?: string;
}

export default function AppLayout({ children, user, householdName = "Minha Família" }: AppLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// ... (N linhas omitidas)
```

#### components/layout/DashboardLayoutClient.tsx:73
```tsx

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userName: string | null;
  familyBadge?: boolean;
}

export default function DashboardLayoutClient({
  children,
  userName,
// ... (N linhas omitidas)
```

#### components/ui/CurrencyInput.tsx:6
```tsx

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string | number;
  onValueChange: (val: string) => void;
}

export function CurrencyInput({ value, onValueChange, className, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  // Sync prop value -> display (initial mostly)
// ... (N linhas omitidas)
```

#### components/ui/EmptyState.tsx:4
```tsx
import React from "react";
import { type LucideIcon } from "lucide-react";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
}

interface EmptyStateProps {
// ... (N linhas omitidas)
```

#### components/ui/EmptyState.tsx:6
```tsx

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
// ... (N linhas omitidas)
```

#### components/ui/EmptyState.tsx:12
```tsx

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: EmptyStateAction;
  badge?: string;
  badgeVariant?: "warning" | "info" | "neutral";
  className?: string;
}
// ... (N linhas omitidas)
```

#### components/ui/MoneyDisplay.tsx:6
```tsx

type MoneySize = "sm" | "md" | "lg" | "hero";

interface MoneyDisplayProps {
  amount: number;
  currency?: string;
  size?: MoneySize;
  /** Se true, aplica cor semântica: positivo = accent-primary, negativo = accent-danger */
  semantic?: boolean;
  /** Força cor de delta positivo (ex: variação de saldo) */
// ... (N linhas omitidas)
```

#### components/ui/MoneyDisplay.tsx:8
```tsx

interface MoneyDisplayProps {
  amount: number;
  currency?: string;
  size?: MoneySize;
  /** Se true, aplica cor semântica: positivo = accent-primary, negativo = accent-danger */
  semantic?: boolean;
  /** Força cor de delta positivo (ex: variação de saldo) */
  delta?: boolean;
  className?: string;
// ... (N linhas omitidas)
```

#### components/ui/ReceiptScanButton.tsx:7
```tsx

interface ScannedData {
  valor: number | null;
  data: string;
  estabelecimento: string | null;
  categoria: string;
  descricao: string | null;
  tipo: "INCOME" | "EXPENSE";
}

// ... (N linhas omitidas)
```

#### components/ui/ReceiptScanButton.tsx:16
```tsx

interface ReceiptScanButtonProps {
  onScanComplete: (data: ScannedData) => void;
  className?: string;
}

export default function ReceiptScanButton({
  onScanComplete,
  className = "",
}: ReceiptScanButtonProps) {
// ... (N linhas omitidas)
```

#### components/ui/button.tsx:3
```tsx
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
// ... (N linhas omitidas)
```

#### components/ui/button.tsx:36
```tsx

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
// ... (N linhas omitidas)
```

#### components/ui/empty-state.tsx:4
```tsx
import React from "react";
import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
// ... (N linhas omitidas)
```

#### components/ui/empty-state.tsx:7
```tsx

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
// ... (N linhas omitidas)
```

#### components/ui/fab.tsx:12
```tsx

interface FABProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function FAB({ onClick, label = "Registrar Movimento", className }: FABProps) {
  return (
    <motion.button
// ... (N linhas omitidas)
```

#### components/ui/form.tsx:10
```tsx
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider
// ... (N linhas omitidas)
```

#### components/ui/form.tsx:11
```tsx
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

// ... (N linhas omitidas)
```

#### components/ui/form.tsx:12
```tsx
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
// ... (N linhas omitidas)
```

#### components/ui/form.tsx:20
```tsx

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

// ... (N linhas omitidas)
```

#### components/ui/form.tsx:69
```tsx

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
// ... (N linhas omitidas)
```

#### components/ui/label.tsx:5
```tsx
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
// ... (N linhas omitidas)
```

#### components/ui/premium-card.tsx:13
```tsx

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bank";
  hover?: boolean;
}

const variantClasses = {
  default: "card-premium",
  elevated: "card-premium bg-surface-elevated",
  bank: "card-bank",
// ... (N linhas omitidas)
```

#### components/ui/skeleton.tsx:7
```tsx

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "circle" | "chart";
}

export function Skeleton({ className, variant = "text", ...props }: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full rounded-lg",
    card: "h-40 w-full rounded-3xl",
    circle: "h-12 w-12 rounded-full",
// ... (N linhas omitidas)
```

#### lib/ai/composer.ts:81
```ts

export type CreateAiCaptureEventInput = {
  userId: string;
  householdId: string | null;
  captureGroupId?: string | null;
  source: string;
  inputType: string;
  rawText: string | null;
  normalizedDraft: any | null;
  confidenceOverall: number;
// ... (N linhas omitidas)
```

#### lib/ai/contracts.ts:5
```ts

export type AIComposerIntent =
  | "chat_reply"
  | "transaction_created"
  | "transaction_draft"
  | "clarification_needed"
  | "batch_review"
  | "saved_plan"
  | "product_feedback_logged";

// ... (N linhas omitidas)
```

#### lib/ai/contracts.ts:14
```ts

export type AIComposerMode = "Registrar" | "Revisar" | "Perguntar" | "Planejar" | "Sugerir";

export type AIComposerTransactionDraft = {
  amount: number | null;
  date: string | null; // YYYY-MM-DD
  description: string;
  transactionType: "INCOME" | "EXPENSE" | "TRANSFER";
  categoryName: string | null;
  categoryId: string | null;
// ... (N linhas omitidas)
```

#### lib/ai/contracts.ts:16
```ts

export type AIComposerTransactionDraft = {
  amount: number | null;
  date: string | null; // YYYY-MM-DD
  description: string;
  transactionType: "INCOME" | "EXPENSE" | "TRANSFER";
  categoryName: string | null;
  categoryId: string | null;
  accountId: string | null;
  accountName: string | null;
// ... (N linhas omitidas)
```

#### lib/ai/contracts.ts:37
```ts

export type AIComposerBatchDraftItem = {
  eventId: string | null;
  draft: AIComposerTransactionDraft;
};

export type AIComposerResponse = {
  intent: AIComposerIntent;
  message: string;
  requiresReview: boolean;
// ... (N linhas omitidas)
```

#### lib/ai/contracts.ts:42
```ts

export type AIComposerResponse = {
  intent: AIComposerIntent;
  message: string;
  requiresReview: boolean;
  autoSaved: boolean;
  transactionDraft: AIComposerTransactionDraft | null;
  batchDrafts?: AIComposerBatchDraftItem[];
  createdTransactionId: string | null;
  savedPlanId?: string | null;
// ... (N linhas omitidas)
```

#### lib/ai/ingest.ts:58
```ts

export type ProcessIngestInput = {
  userId: string;
  householdId: string | null;
  mode: AIComposerMode;
  inputType: "text" | "image" | "text+image" | "audio" | "pdf" | "csv";
  content?: string;
  imageBase64?: string;
  mimeType?: string; // image/jpeg, application/pdf, audio/webm etc.
  disableAutoSave?: boolean;
// ... (N linhas omitidas)
```

#### lib/ai/prompt-guard.ts:1
```ts
export type PromptGuardResult = {
  taintLevel: "LOW" | "MEDIUM" | "HIGH";
  suspiciousPatterns: string[];
  outOfDomain: boolean;
  shouldEscalateToReview: boolean;
};

const INJECTION_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  { label: "prompt_override", regex: /(ignore\s+(all|previous|prior)\s+instructions|system\s+prompt|developer\s+message)/i },
// ... (N linhas omitidas)
```

#### lib/ai/providers/gemini.ts:36
```ts

  async generateStructured(prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any> {
    const isJsonFormat = opts?.responseFormat === "json_object" || !!schema;

    const response = await this.client.models.generateContent({
      model: this.defaultModel,
      contents: prompt,
      config: {
        systemInstruction: opts?.systemPrompt,
        temperature: opts?.temperature,
// ... (N linhas omitidas)
```

#### lib/ai/providers/gemini.ts:37
```ts
  async generateStructured(prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any> {
    const isJsonFormat = opts?.responseFormat === "json_object" || !!schema;

    const response = await this.client.models.generateContent({
      model: this.defaultModel,
      contents: prompt,
      config: {
        systemInstruction: opts?.systemPrompt,
        temperature: opts?.temperature,
        responseMimeType: isJsonFormat ? "application/json" : "text/plain",
// ... (N linhas omitidas)
```

#### lib/ai/providers/gemini.ts:48
```ts
        // but we rely on robust parsing from `extractJsonFromModelOutput` as fallback always
        responseSchema: schema ? schema : undefined, 
      }
    });

    if (!response.text) throw new Error("Gemini returned empty response");
    
    return extractJsonFromModelOutput(response.text);
  }

// ... (N linhas omitidas)
```

#### lib/ai/providers/nvidia.ts:48
```ts

  async generateStructured(prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any> {
    const messages: any[] = [];
    
    // Suggesting to the model that it MUST return JSON is crucial for non-native JSON mode models
    let sysPrompt = opts?.systemPrompt || "";
    if (opts?.responseFormat === "json_object") {
       sysPrompt += "\n\nVocê DEVE retornar APENAS UM JSON VÁLIDO. Nenhuma outra formatação ou texto é permitida.";
    }

// ... (N linhas omitidas)
```

#### lib/ai/providers/registry.ts:97
```ts

  async generateStructured(capability: AICapability, prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any> {
    return this.executeWithFallback(capability, false, provider => provider.generateStructured(prompt, schema, opts), opts);
  }

  async generateMultimodal(capability: AICapability, prompt: string, media: AIMediaFile, opts?: AIGenerationOptions): Promise<any> {
    return this.executeWithFallback(capability, true, provider => provider.generateMultimodal(prompt, media, opts), opts);
  }
}
// ... (N linhas omitidas)
```

#### lib/ai/providers/registry.ts:98
```ts
  async generateStructured(capability: AICapability, prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any> {
    return this.executeWithFallback(capability, false, provider => provider.generateStructured(prompt, schema, opts), opts);
  }

  async generateMultimodal(capability: AICapability, prompt: string, media: AIMediaFile, opts?: AIGenerationOptions): Promise<any> {
    return this.executeWithFallback(capability, true, provider => provider.generateMultimodal(prompt, media, opts), opts);
  }
}
// ... (N linhas omitidas)
```

#### lib/ai/providers/types.ts:1
```ts
export type AICapability =
  | "transaction_extract"
  | "conversation"
  | "planning"
  | "suggestion"
  | "transcription";

export interface AIProviderConfig {
  apiKey: string;
// ... (N linhas omitidas)
```

#### lib/ai/providers/types.ts:8
```ts

export interface AIProviderConfig {
  apiKey: string;
  defaultModel?: string; // Optional if provider supplies its own default
}

export interface AIGenerationOptions {
  systemPrompt?: string;
  responseFormat?: "json_object" | "text";
  temperature?: number;
// ... (N linhas omitidas)
```

#### lib/ai/providers/types.ts:13
```ts

export interface AIGenerationOptions {
  systemPrompt?: string;
  responseFormat?: "json_object" | "text";
  temperature?: number;
  providerHint?: "gemini" | "openai" | "nvidia";
  allowFallback?: boolean;
}

export interface AIMediaFile {
// ... (N linhas omitidas)
```

#### lib/ai/providers/types.ts:21
```ts

export interface AIMediaFile {
  base64: string;
  mimeType: string;
}

export interface AIProvider {
  id: string;
  
  // Checking capability based on task and if media is present
// ... (N linhas omitidas)
```

#### lib/ai/providers/types.ts:26
```ts

export interface AIProvider {
  id: string;
  
  // Checking capability based on task and if media is present
  supports(capability: AICapability, hasMedia: boolean): boolean;

  generateText(prompt: string, opts?: AIGenerationOptions): Promise<string>;
  
  // Can either take a JSON schema or a text prompt formatted as JSON request
// ... (N linhas omitidas)
```

#### lib/ai/providers/types.ts:34
```ts
  
  // Can either take a JSON schema or a text prompt formatted as JSON request
  generateStructured(prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any>;
  
  generateMultimodal(prompt: string, media: AIMediaFile, opts?: AIGenerationOptions): Promise<any>;
}

// ... (N linhas omitidas)
```

#### lib/ai/providers/types.ts:35
```ts
  // Can either take a JSON schema or a text prompt formatted as JSON request
  generateStructured(prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any>;
  
  generateMultimodal(prompt: string, media: AIMediaFile, opts?: AIGenerationOptions): Promise<any>;
}

// ... (N linhas omitidas)
```

#### lib/ai/review-protocol/types.ts:3
```ts

export type MissingField = "amount" | "date" | "description" | "category" | "account" | "transactionType";

export type ReviewDecision = {
  intent: AIComposerResponse["intent"];
  message: string;
  requiresReview: boolean;
  canCommit: boolean;
};

// ... (N linhas omitidas)
```

#### lib/ai/review-protocol/types.ts:5
```ts

export type ReviewDecision = {
  intent: AIComposerResponse["intent"];
  message: string;
  requiresReview: boolean;
  canCommit: boolean;
};

export type ResolvedDraft = {
  draft: AIComposerTransactionDraft;
// ... (N linhas omitidas)
```

#### lib/ai/review-protocol/types.ts:12
```ts

export type ResolvedDraft = {
  draft: AIComposerTransactionDraft;
  missingFields: MissingField[];
};
// ... (N linhas omitidas)
```

#### lib/ai/router.ts:4
```ts
import { isExperimentEnabled } from "@/lib/experiments/service";
export type RouterInput = {
  capability: AICapability;
  inputType: "text" | "image" | "text+image" | "audio" | "pdf" | "csv";
  textLength: number;
  taintLevel?: "LOW" | "MEDIUM" | "HIGH";
};

export type RouterDecision = {
  providerHint: "gemini" | "openai" | "nvidia";
// ... (N linhas omitidas)
```

#### lib/ai/router.ts:11
```ts

export type RouterDecision = {
  providerHint: "gemini" | "openai" | "nvidia";
  allowFallback: boolean;
  reason: string;
};

function isOpenAiEnabled() {
  return process.env.OPENAI_API_KEY && process.env.AI_ENABLE_OPENAI === "true";
}
// ... (N linhas omitidas)
```

#### lib/auth.ts:11
```ts

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
}

export interface Session {
  id: string;
  userId: string;
// ... (N linhas omitidas)
```

#### lib/auth.ts:17
```ts

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}
// ... (N linhas omitidas)
```

#### lib/authorization.ts:5
```ts

export interface AuthorizedUser {
  id: string;
  email: string;
  name: string | null;
  householdId: string | null;
  role: UserRole;
}

/**
// ... (N linhas omitidas)
```

#### lib/calibration/service.ts:5
```ts

type CalibrationInput = {
  householdId: string;
  policyType: string;
  mode?: CalibrationMode;
  minSampleSize?: number;
  maxStepPct?: number;
  cooldownHours?: number;
};

// ... (N linhas omitidas)
```

#### lib/database-url.ts:19
```ts

type DatabaseUrlKey =
  | (typeof RUNTIME_DATABASE_URL_KEYS)[number]
  | (typeof MIGRATION_DATABASE_URL_KEYS)[number];

export interface ResolvedDatabaseUrl {
  key: DatabaseUrlKey;
  url: string;
}

// ... (N linhas omitidas)
```

#### lib/database-url.ts:23
```ts

export interface ResolvedDatabaseUrl {
  key: DatabaseUrlKey;
  url: string;
}

export interface DatabaseDebugInfo {
  key: DatabaseUrlKey;
  host: string;
}
// ... (N linhas omitidas)
```

#### lib/database-url.ts:28
```ts

export interface DatabaseDebugInfo {
  key: DatabaseUrlKey;
  host: string;
}

function pickDatabaseUrl(
  keys: readonly DatabaseUrlKey[],
  env: NodeJS.ProcessEnv
): ResolvedDatabaseUrl | null {
// ... (N linhas omitidas)
```

#### lib/finance/alerts.ts:4
```ts

export type FinanceAlert = {
  type: "warning";
  message: string;
};

export async function generateFinanceAlerts(userId: string, householdId?: string | null): Promise<FinanceAlert[]> {
  const alerts: FinanceAlert[] = [];
  const monthly = await getMonthlySpendingByCategory(userId, householdId);
  const average = await getAverageSpending(userId, householdId);
// ... (N linhas omitidas)
```

#### lib/finance/analysis.ts:3
```ts

export type CategoryTotals = Record<string, number>;

function getMonthRange(referenceDate = new Date()) {
  const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export async function getMonthlySpendingByCategory(userId: string, householdId?: string | null) {
// ... (N linhas omitidas)
```

#### lib/finance/contracts.ts:1
```ts
export type FinanceSignalLevel = "attention" | "risk" | "direction";

export type FinanceSignal = {
  level: FinanceSignalLevel;
  signal: string;
  source: string;
  explanation: string;
  nextStep: string;
};
// ... (N linhas omitidas)
```

#### lib/finance/contracts.ts:3
```ts

export type FinanceSignal = {
  level: FinanceSignalLevel;
  signal: string;
  source: string;
  explanation: string;
  nextStep: string;
};
// ... (N linhas omitidas)
```

#### lib/finance/core.ts:3
```ts

export interface AuthContext {
  id: string;
  householdId: string | null;
}

/**
 * Cria o escopo de segurança para consultas financeiras (Contas, Transações, Categorias).
 *
 * @param ctx AuthContext atual do usuário
// ... (N linhas omitidas)
```

#### lib/finance/core.ts:33
```ts

export interface AnalyticFilterParams {
  month?: number;
  year?: number;
  bankAccountId?: string;
  categoryId?: string;
}

/**
 * Cria os filtros analíticos unificados que definem o que "vale" para o DRE,
// ... (N linhas omitidas)
```

#### lib/finance/deduplication.ts:5
```ts

export type NormalizedIngestedTransaction = {
  date: Date;
  amount: number;
  description: string;
  type: "income" | "expense";
  source: string;
};

export type DeduplicationResult =
// ... (N linhas omitidas)
```

#### lib/finance/deduplication.ts:13
```ts

export type DeduplicationResult =
  | {
      status: "new";
    }
  | {
      status: "duplicate";
      existingId: string;
    };

// ... (N linhas omitidas)
```

#### lib/finance/deduplication.ts:22
```ts

type DedupInput = {
  userId: string;
  householdId: string | null;
  item: NormalizedIngestedTransaction;
};

function normalizeDescription(value: string) {
  return value
    .normalize("NFD")
// ... (N linhas omitidas)
```

#### lib/finance/health.ts:4
```ts

interface ScoreBreakdown {
  spending: number;
  growth: number;
  commitments: number;
  goals: number;
}

export interface HealthScoreData {
  score: number;
// ... (N linhas omitidas)
```

#### lib/finance/health.ts:11
```ts

export interface HealthScoreData {
  score: number;
  classification: "Saudável" | "Atenção" | "Risco";
  breakdown: ScoreBreakdown;
}

export async function calculateHealthScore(householdId: string): Promise<HealthScoreData> {
  const now = new Date();
  const monthStart = startOfMonth(now);
// ... (N linhas omitidas)
```

#### lib/finance/health.ts:167
```ts

export interface ProjectionData {
  currentBalance: number;
  projectedBalance30d: number;
  daysUntilZero: number | null;
  message: string;
  projectionPoints: Array<{ day: number; balance: number }>;
}

export async function calculateProjection(householdId: string): Promise<ProjectionData> {
// ... (N linhas omitidas)
```

#### lib/finance/kernel.ts:3
```ts

export type CanonicalAccountLike = {
  balance: number;
  type: BankAccountType;
};

export type CanonicalTransactionLike = {
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
// ... (N linhas omitidas)
```

#### lib/finance/kernel.ts:8
```ts

export type CanonicalTransactionLike = {
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  ignoreInTotals: boolean;
};

export type CanonicalTotals = {
  accountingBalance: number;
// ... (N linhas omitidas)
```

#### lib/finance/kernel.ts:15
```ts

export type CanonicalTotals = {
  accountingBalance: number;
  netPosition: number;
};

export function computeCanonicalTotals(accounts: CanonicalAccountLike[]): CanonicalTotals {
  return accounts.reduce<CanonicalTotals>(
    (acc, account) => {
      acc.accountingBalance += account.balance;
// ... (N linhas omitidas)
```

#### lib/finance/kernel.ts:35
```ts

export type CanonicalFlow = {
  income: number;
  expense: number;
  net: number;
};

export function computeCanonicalFlow(transactions: CanonicalTransactionLike[]): CanonicalFlow {
  const flow = transactions.reduce(
    (acc, tx) => {
// ... (N linhas omitidas)
```

#### lib/finance/normalize.ts:3
```ts

export type NormalizedInboxTransaction = {
  date: Date;
  amount: number;
  description: string;
  type: "expense" | "income";
};

export function normalizeInboxItems(items: ParsedInboxItem[]): NormalizedInboxTransaction[] {
  return items
// ... (N linhas omitidas)
```

#### lib/finance/period.ts:1
```ts
export type MonthBounds = {
  start: Date;
  endExclusive: Date;
};

export function getMonthBoundsUtc(year: number, month: number): MonthBounds {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Invalid year/month for UTC bounds");
  }
// ... (N linhas omitidas)
```

#### lib/finance/quality.ts:6
```ts

type Severity = "LOW" | "MEDIUM" | "HIGH";

export type QualitySignal = {
  code: "OUTLIER_AMOUNT" | "DUPLICATE_SUSPECTED" | "CATEGORY_CONFLICT";
  severity: Severity;
  reason: string;
};

export type QualityEvaluation = {
// ... (N linhas omitidas)
```

#### lib/finance/quality.ts:8
```ts

export type QualitySignal = {
  code: "OUTLIER_AMOUNT" | "DUPLICATE_SUSPECTED" | "CATEGORY_CONFLICT";
  severity: Severity;
  reason: string;
};

export type QualityEvaluation = {
  riskScore: number;
  requiresReview: boolean;
// ... (N linhas omitidas)
```

#### lib/finance/quality.ts:14
```ts

export type QualityEvaluation = {
  riskScore: number;
  requiresReview: boolean;
  signals: QualitySignal[];
};

function mean(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((acc, v) => acc + v, 0) / values.length;
// ... (N linhas omitidas)
```

#### lib/finance/recommendations.ts:4
```ts

export type FinanceRecommendation = {
  message: string;
  impact: number;
};

export async function generateFinanceRecommendations(userId: string, householdId?: string | null): Promise<FinanceRecommendation[]> {
  const monthly = await getMonthlySpendingByCategory(userId, householdId);
  const average = await getAverageSpending(userId, householdId);
  const alerts = await generateFinanceAlerts(userId, householdId);
// ... (N linhas omitidas)
```

#### lib/inbox/parse.ts:7
```ts

export type InboxChannel = "manual" | "email" | "whatsapp" | "import";
export type InboxInputType = "text" | "image" | "pdf" | "csv" | "ofx" | "audio";
export type InboxDocumentKind = "statement" | "invoice" | "receipt" | "unknown";

function buildRawTextEnvelope(rawInput: string, documentKind: InboxDocumentKind, inputHash?: string) {
  const hashPrefix = inputHash ? `[HASH:${inputHash}] ` : "";
  return `${hashPrefix}[${documentKind.toUpperCase()}] ${rawInput}`;
}

// ... (N linhas omitidas)
```

#### lib/inbox/parse.ts:8
```ts
export type InboxChannel = "manual" | "email" | "whatsapp" | "import";
export type InboxInputType = "text" | "image" | "pdf" | "csv" | "ofx" | "audio";
export type InboxDocumentKind = "statement" | "invoice" | "receipt" | "unknown";

function buildRawTextEnvelope(rawInput: string, documentKind: InboxDocumentKind, inputHash?: string) {
  const hashPrefix = inputHash ? `[HASH:${inputHash}] ` : "";
  return `${hashPrefix}[${documentKind.toUpperCase()}] ${rawInput}`;
}

export async function parseInboxRawInput({
// ... (N linhas omitidas)
```

#### lib/inbox/parse.ts:9
```ts
export type InboxInputType = "text" | "image" | "pdf" | "csv" | "ofx" | "audio";
export type InboxDocumentKind = "statement" | "invoice" | "receipt" | "unknown";

function buildRawTextEnvelope(rawInput: string, documentKind: InboxDocumentKind, inputHash?: string) {
  const hashPrefix = inputHash ? `[HASH:${inputHash}] ` : "";
  return `${hashPrefix}[${documentKind.toUpperCase()}] ${rawInput}`;
}

export async function parseInboxRawInput({
  userId,
// ... (N linhas omitidas)
```

#### lib/inbox/parser.ts:4
```ts

export type ParsedInboxItem = {
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
};

function buildIsoDate(day: string, month: string, year?: string) {
  const now = new Date();
// ... (N linhas omitidas)
```

#### lib/inbox/pipeline.ts:7
```ts

type CaptureInput = {
  rawInput: string;
  channel: InboxChannel;
  inputType: InboxInputType;
  documentKind: InboxDocumentKind;
  fileName?: string | null;
};

type DetectedType = "bank_statement" | "receipt" | "invoice";
// ... (N linhas omitidas)
```

#### lib/inbox/pipeline.ts:15
```ts

type DetectedType = "bank_statement" | "receipt" | "invoice";
type DetectedSource = "nubank" | "itau" | "unknown";

type IngestionItem = {
  index: number;
  fileName: string | null;
  detectedType: DetectedType;
  source: DetectedSource;
  normalized: NormalizedIngestedTransaction | null;
// ... (N linhas omitidas)
```

#### lib/inbox/pipeline.ts:16
```ts
type DetectedType = "bank_statement" | "receipt" | "invoice";
type DetectedSource = "nubank" | "itau" | "unknown";

type IngestionItem = {
  index: number;
  fileName: string | null;
  detectedType: DetectedType;
  source: DetectedSource;
  normalized: NormalizedIngestedTransaction | null;
  status: "new" | "duplicate" | "review" | "error";
// ... (N linhas omitidas)
```

#### lib/inbox/pipeline.ts:18
```ts

type IngestionItem = {
  index: number;
  fileName: string | null;
  detectedType: DetectedType;
  source: DetectedSource;
  normalized: NormalizedIngestedTransaction | null;
  status: "new" | "duplicate" | "review" | "error";
  existingId: string | null;
  message: string;
// ... (N linhas omitidas)
```

#### lib/inbox/pipeline.ts:31
```ts

export type CaptureBatchResult = {
  batchId: string;
  processed: number;
  possibleDuplicates: number;
  readyToSave: number;
  conflicts: number;
  detectedType: DetectedType;
  source: DetectedSource;
  items: IngestionItem[];
// ... (N linhas omitidas)
```

#### lib/policy/engine.ts:4
```ts

type JsonObject = Record<string, unknown>;

const DEFAULT_POLICIES: Record<string, JsonObject> = {
  review_thresholds: { riskScoreThreshold: 0.45, highSeverityRequiresReview: true },
  dedup_heuristics: { similarityThreshold: 0.4, dateWindowDays: 1 },
  outlier_sensitivity: { zScoreMedium: 3, zScoreHigh: 4 },
  provider_routing: { complexTextLength: 1200, preferredComplexMediaProvider: "openai", preferredDenseReasoningProvider: "nvidia" },
  recommendation_gating: { minimumScore: 0.2, dismissWeight: 0.8 },
  alert_gating: { minImpact: 0.05 },
// ... (N linhas omitidas)
```

#### lib/quality/metrics.ts:5
```ts

type MetricRow = { metricCode: string; metricValue: number; dimensions?: Record<string, unknown> };

export async function computeQualityMetricsForHousehold(householdId: string, periodStart: Date, periodEnd: Date): Promise<MetricRow[]> {
  const [feedback, evals, logs, flags, events] = await Promise.all([
    prisma.decisionFeedback.findMany({ where: { householdId, createdAt: { gte: periodStart, lte: periodEnd } } }),
    prisma.decisionEvaluation.findMany({ where: { householdId, evaluatedAt: { gte: periodStart, lte: periodEnd } } }),
    prisma.ingestionLog.findMany({ where: { householdId, createdAt: { gte: periodStart, lte: periodEnd } } }),
    prisma.transactionQualityFlag.findMany({ where: { householdId, createdAt: { gte: periodStart, lte: periodEnd } } }),
    prisma.aiCaptureEvent.findMany({ where: { householdId, createdAt: { gte: periodStart, lte: periodEnd } } }),
// ... (N linhas omitidas)
```

#### lib/security/crypto.ts:30
```ts

export type EncryptedSecret = {
  ciphertext: string;
  keyVersion: string;
};

export function encryptTotpSecret(secret: string): EncryptedSecret {
  const keys = parseKeys();
  const key = keys[CURRENT_VERSION];
  const iv = randomBytes(12);
// ... (N linhas omitidas)
```

#### lib/security/keyring.ts:1
```ts
export type SigningKey = {
  id: string;
  algorithm: "hmac-sha256";
  status: "ACTIVE" | "RETIRED" | "REVOKED";
  secret: string;
  activatedAt?: string;
  retiredAt?: string;
  revokedAt?: string;
};
// ... (N linhas omitidas)
```

#### lib/security/rate-limit.ts:3
```ts

type Options = {
  key: string;
  limit: number;
  windowSeconds: number;
};

export async function enforceRateLimit(options: Options) {
  const now = new Date();
  const windowStart = new Date(Math.floor(now.getTime() / (options.windowSeconds * 1000)) * (options.windowSeconds * 1000));
// ... (N linhas omitidas)
```

#### lib/security/scope.ts:1
```ts
export type ScopeContext = { userId: string; householdId: string | null };

export function scopeWhere(ctx: ScopeContext) {
  return ctx.householdId
    ? { householdId: ctx.householdId }
    : { userId: ctx.userId, householdId: null };
}

export function scopedAccessWhere<T extends object>(ctx: ScopeContext, extra?: T) {
// ... (N linhas omitidas)
```

#### lib/security/verification.ts:4
```ts

export type VerificationStatus = "VALID" | "INVALID" | "REVOKED_KEY" | "ARTIFACT_NOT_FOUND" | "MALFORMED" | "UNSUPPORTED";

export function verifySignature({
  payload,
  signature,
  signatureKeyId,
  signatureAlgorithm,
}: {
  payload: Buffer;
// ... (N linhas omitidas)
```

#### lib/utils.ts:1
```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// ... (N linhas omitidas)
```

#### prisma/schema.prisma:207
```prisma
  isRead    Boolean  @default(false)
  type      String   @default("INFO") // INFO, WARNING, SUCCESS, ERROR
  link      String? // Opcional: link para redirecionar ao clicar
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Household {
  id         String   @id @default(cuid())
// ... (N linhas omitidas)
```

#### prisma/schema.prisma:400
```prisma
  summary            String             @db.Text
  type               String
  area               String
  impact             String
  priorityScore      Float              @default(0)
  reproductionSteps  Json?
  suggestedSolution  String?            @db.Text
  acceptanceCriteria Json?
  status             String             @default("new")
  relatedToId        String?
// ... (N linhas omitidas)
```

#### prisma/schema.prisma:445
```prisma
  name        String
  type        BankAccountType @default(CHECKING)
  balance     Decimal         @default(0) @db.Decimal(15, 2)
  color       String?
  icon        String?
  isDefault   Boolean         @default(false)

  // Cartão de crédito
  creditLimit       Decimal? @db.Decimal(15, 2)
  invoiceClosingDay Int?
// ... (N linhas omitidas)
```

#### prisma/schema.prisma:474
```prisma
  name              String
  type              TransactionType
  icon              String?
  color             String?
  taxClassification TaxClassification? // Fase 8: classificação tributária
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt

  household             Household?             @relation(fields: [householdId], references: [id], onDelete: Cascade)
  user                  User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
// ... (N linhas omitidas)
```

#### prisma/schema.prisma:498
```prisma
  categoryId       String?
  type             TransactionType
  status           TransactionStatus @default(COMPLETED)
  amount           Decimal           @db.Decimal(15, 2)
  description      String?
  date             DateTime          @default(now())
  notes            String? // Fase 7: notas adicionais
  aiCaptureEventId String?           @unique

  // Parcelamento
// ... (N linhas omitidas)
```

#### prisma/schema.prisma:982
```prisma
  key             String
  type            String
  status          ExperimentStatus @default(DRAFT)
  allocationStrategy String
  targetScope     String
  config          Json
  policyVersionId String?
  startAt         DateTime?
  endAt           DateTime?
  createdAt       DateTime         @default(now())
// ... (N linhas omitidas)
```

#### prisma/schema.prisma:1029
```prisma
  categoryId    String?
  type          TransactionType
  amount        Decimal            @db.Decimal(15, 2)
  description   String?
  frequency     RecurringFrequency
  nextDate      DateTime
  endDate       DateTime? // null = sem fim
  active        Boolean            @default(true)
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt
// ... (N linhas omitidas)
```

#### prisma/schema.prisma:1151
```prisma
  relatedPlanId String?
  type          String // 'budget_warning', 'plan_progress', 'general_saving'
  message       String
  actionLabel   String?
  actionTarget  String? // Ex: '/orcamentos'
  score         Float           @default(0) // order by priority
  isDismissed   Boolean         @default(false)
  createdAt     DateTime        @default(now())

  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
// ... (N linhas omitidas)
```

#### scripts/build.mjs:172
```mjs
      "status",
      "--schema",
      "prisma/schema.prisma",
    ]);
  } catch (error) {
    console.warn("[build] Unable to check Prisma migration status. Skipping migrations.", error?.message ?? error);
    return false;
  }
  const output = `${result.stdout}\n${result.stderr}`;

// ... (N linhas omitidas)
```

#### scripts/build.mjs:173
```mjs
      "--schema",
      "prisma/schema.prisma",
    ]);
  } catch (error) {
    console.warn("[build] Unable to check Prisma migration status. Skipping migrations.", error?.message ?? error);
    return false;
  }
  const output = `${result.stdout}\n${result.stderr}`;

  if (output.includes("Database schema is up to date!")) {
// ... (N linhas omitidas)
```

#### scripts/build.mjs:181
```mjs

  if (output.includes("Database schema is up to date!")) {
    return false;
  }

  if (
    output.includes("Following migration(s) have not yet been applied") ||
    output.includes("Following migrations have not yet been applied")
  ) {
    return true;
// ... (N linhas omitidas)
```

### Pasta prisma/supabase
```text
prisma/migrations/20260414190009_add_household_and_credit_fields/migration.sql
prisma/migrations/20260414221323_add_2fa_totp_fields/migration.sql
prisma/migrations/20260415161700_sync_schema_with_current_app/migration.sql
prisma/migrations/20260416055106_add_product_feedback/migration.sql
prisma/migrations/20260417044000_add_whatsapp_link_fields/migration.sql
prisma/migrations/20260418090000_add_category_learning_rules/migration.sql
prisma/migrations/20260419093000_wave1_blindagem/migration.sql
prisma/migrations/20260419130000_wave2_financial_data_system/migration.sql
prisma/migrations/20260419170000_wave4_operational_scale/migration.sql
prisma/migrations/20260419193000_wave5_continuous_optimization/migration.sql
prisma/migrations/migration_lock.toml
```

### Último schema
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────

enum BankAccountType {
  CHECKING
  CREDIT
  SAVINGS
  INVESTMENT
}

enum TransactionType {
  INCOME
  EXPENSE
  TRANSFER
}

enum TransactionStatus {
  PENDING
  COMPLETED
}

enum UserRole {
  ADMIN
  MEMBER
  VIEWER
}

/// Classificação tributária para o módulo contador
enum TaxClassification {
  DEDUCTIBLE_IR // Dedutível IR
  NON_DEDUCTIBLE // Não dedutível
  TAXABLE_INCOME // Receita tributável
  OTHER
}

/// Frequência de transações recorrentes
enum RecurringFrequency {
  DAILY
  WEEKLY
  BIWEEKLY
  MONTHLY
  QUARTERLY
  YEARLY
}

enum VisibilityScope {
  PERSONAL
  HOUSEHOLD
}

enum SourceChannel {
  MANUAL
  EMAIL
  WHATSAPP
  IMPORT
  COMPOSER
  API
}

enum SourceType {
  TEXT
  IMAGE
  PDF
  CSV
  OFX
  AUDIO
  RAW_TEXT
}

enum IngestionStage {
  RECEIVED
  EXTRACTING
  EXTRACTED
  PARSING
  PARSED
  NORMALIZING
  NORMALIZED
  REVIEW_REQUIRED
  COMMITTING
  COMMITTED
  FAILED
  DUPLICATE_SKIPPED
}

enum IngestionStatus {
  STARTED
  SUCCESS
  ERROR
  SKIPPED
}

enum QualityFlagCode {
  DUPLICATE_SUSPECTED
  DUPLICATE_CONFIRMED
  OUTLIER_AMOUNT
  CATEGORY_CONFLICT
  ACCOUNT_MISSING
  OCR_LOW_CONFIDENCE
  REVIEW_REQUIRED
}

enum QualityFlagSeverity {
  LOW
  MEDIUM
  HIGH
}

enum QualityFlagStatus {
  OPEN
  RESOLVED
  DISMISSED
}

enum ReviewState {
  NOT_REQUIRED
  REQUIRED
  APPROVED
  REJECTED
}

enum TaintLevel {
  LOW
  MEDIUM
  HIGH
}

enum SigningKeyStatus {
  ACTIVE
  RETIRED
  REVOKED
}

enum SignedArtifactType {
  MONTHLY_DOSSIER
  EXPORT_PDF
  EXPORT_CSV
  FINANCIAL_PLAN_SNAPSHOT
  RECOMMENDATION_EVIDENCE
  PROCESSING_EVIDENCE
}

enum QuotaPeriodType {
  MONTHLY
}

enum AutomationJobStatus {
  SUCCESS
  FAILED
}

enum PolicyStatus {
  DRAFT
  ACTIVE
  RETIRED
  ROLLED_BACK
  EXPERIMENTAL
}

enum CalibrationMode {
  RECOMMEND_ONLY
  APPLY_WITH_GUARDRAILS
}

enum EvaluationResult {
  CORRECT
  INCORRECT
  ACCEPTED
  REJECTED
  OVERRIDDEN
  NO_SIGNAL
}

enum MetricPeriodType {
  DAILY
  WEEKLY
  MONTHLY
}

enum ExperimentStatus {
  DRAFT
  RUNNING
  PAUSED
  COMPLETED
  KILLED
}

// ─────────────────────────────────────────────
// Core Models
// ─────────────────────────────────────────────

model Notification {
  id        String   @id @default(cuid())
  userId    String
  title     String
  message   String
  isRead    Boolean  @default(false)
  type      String   @default("INFO") // INFO, WARNING, SUCCESS, ERROR
  link      String? // Opcional: link para redirecionar ao clicar
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Household {
  id         String   @id @default(cuid())
  name       String
  inviteCode String?  @unique @default(cuid()) // Fase 6: código de convite
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  users                   User[]
  bankAccounts            BankAccount[]
  categories              Category[]
  transactions            Transaction[]
  budgets                 Budget[]
  tags                    Tag[]
  goals                   Goal[]
  recurringTransactions   RecurringTransaction[]
  bankConnections         BankConnection[]
  counterSessions         CounterSession[]
  AiCaptureEvent          AiCaptureEvent[]
  merchantMemories        MerchantMemory[]
  categoryLearningRules   CategoryLearningRule[]
  sourceDocuments         SourceDocument[]
  ingestionLogs           IngestionLog[]
  transactionQualityFlags TransactionQualityFlag[]

  aiConversations   AiConversation[]
  financialPlans    FinancialPlan[]
  aiRecommendations AiRecommendation[]
  householdInvites  HouseholdInvite[]
  monthlyCheckViews MonthlyCheckView[]
  signedArtifacts   SignedArtifact[]
  householdQuotas   HouseholdQuota[]
  automationJobRuns AutomationJobRun[]
  policyVersions    PolicyVersion[]
  decisionEvaluations DecisionEvaluation[]
  qualitySnapshots  ProductQualityMetricSnapshot[]
  decisionFeedbacks DecisionFeedback[]
  calibrationRuns   CalibrationRun[]
  experiments       Experiment[]
}

/// Convite com token único e validade de 48h
model HouseholdInvite {
  id          String    @id @default(cuid())
  householdId String
  token       String    @unique
  createdById String
  expiresAt   DateTime
  usedAt      DateTime?
  usedById    String?
  createdAt   DateTime  @default(now())

  household Household @relation(fields: [householdId], references: [id], onDelete: Cascade)
  createdBy User      @relation("InviteCreatedBy", fields: [createdById], references: [id])
  usedBy    User?     @relation("InviteUsedBy", fields: [usedById], references: [id])

  @@index([householdId])
  @@index([token])
}

/// Registro de visualização do check mensal
model MonthlyCheckView {
  id          String   @id @default(cuid())
  householdId String
  month       String // formato YYYY-MM
  userId      String
  viewedAt    DateTime @default(now())

  household Household @relation(fields: [householdId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id])

  @@unique([householdId, month, userId])
  @@index([householdId])
}

model User {
  id                         String    @id @default(cuid())
  email                      String    @unique
  password_hash              String
  name                       String?
  phone                      String?
  whatsappNumber             String?   @unique
  whatsappLinkToken          String?
  whatsappLinkTokenExpiresAt DateTime?
  householdId                String?
  role                       UserRole  @default(ADMIN) // Fase 6: admin ou viewer (contador)
  // Fase 10: 2FA TOTP
  totpSecret                 String?
  totpSecretEnc              String?
  totpSecretKeyVersion       String?
  totpEnabled                Boolean   @default(false)
  createdAt                  DateTime  @default(now())
  updatedAt                  DateTime  @updatedAt

  household                       Household?               @relation(fields: [householdId], references: [id], onDelete: SetNull)
  sessions                        Session[]
  bankAccounts                    BankAccount[]
  transactions                    Transaction[]
  categories                      Category[]
  notifications                   Notification[]
  AiCaptureEvent                  AiCaptureEvent[]
  merchantMemories                MerchantMemory[]
  productFeedbacks                ProductFeedback[]
  sourceDocuments                 SourceDocument[]
  ingestionLogs                   IngestionLog[]           @relation("IngestionLogUser")
  actedIngestionLogs              IngestionLog[]           @relation("IngestionLogActor")
  transactionQualityFlagsResolved TransactionQualityFlag[] @relation("TransactionQualityFlagResolvedBy")

  aiConversations       AiConversation[]
  aiMessages            AiMessage[]
  financialPlans        FinancialPlan[]
  aiRecommendations     AiRecommendation[]
  categoryLearningRules CategoryLearningRule[]
  invitesCreated        HouseholdInvite[]      @relation("InviteCreatedBy")
  invitesUsed           HouseholdInvite[]      @relation("InviteUsedBy")
  monthlyCheckViews     MonthlyCheckView[]
  authChallenges        AuthChallenge[]
  signedArtifacts       SignedArtifact[]
  createdArtifacts      SignedArtifact[] @relation("SignedArtifactCreatedByUser")
  policyVersionsCreated PolicyVersion[]  @relation("PolicyVersionCreatedByUser")
  decisionEvaluations   DecisionEvaluation[] @relation("DecisionEvaluationUser")
  decisionFeedbacks     DecisionFeedback[]   @relation("DecisionFeedbackUser")

  @@index([householdId])
  @@index([phone])
  @@index([whatsappLinkToken])
}

model AuthChallenge {
  id         String    @id @default(cuid())
  userId     String
  tokenHash  String    @unique
  purpose    String
  expiresAt  DateTime
  consumedAt DateTime?
  attempts   Int       @default(0)
  ip         String?
  userAgent  String?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, purpose])
  @@index([expiresAt])
}

model RateLimitBucket {
  id          String   @id @default(cuid())
  bucketKey   String   @unique
  scopeKey    String
  windowStart DateTime
  count       Int      @default(0)
  expiresAt   DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([scopeKey, windowStart])
  @@index([expiresAt])
}

model CategoryLearningRule {
  id                 String   @id @default(cuid())
  userId             String
  householdId        String?
  descriptionPattern String
  categoryName       String
  usageCount         Int      @default(0)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  household Household? @relation(fields: [householdId], references: [id], onDelete: Cascade)

  @@unique([userId, descriptionPattern, categoryName])
  @@index([userId])
  @@index([householdId])
}

model ProductFeedback {
  id                 String             @id @default(cuid())
  userId             String
  householdId        String?
  source             String             @default("composer")
  rawInput           String             @db.Text
  normalizedTitle    String
  summary            String             @db.Text
  type               String
  area               String
  impact             String
  priorityScore      Float              @default(0)
  reproductionSteps  Json?
  suggestedSolution  String?            @db.Text
  acceptanceCriteria Json?
  status             String             @default("new")
  relatedToId        String?
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt
  user               User               @relation(fields: [userId], references: [id])
  artifacts          FeedbackArtifact[]
  relatedTo          ProductFeedback?   @relation("FeedbackRelation", fields: [relatedToId], references: [id])
  relatedFeedbacks   ProductFeedback[]  @relation("FeedbackRelation")
}

model FeedbackArtifact {
  id         String          @id @default(cuid())
  feedbackId String
  kind       String
  url        String?
  content    Json?
  createdAt  DateTime        @default(now())
  feedback   ProductFeedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
}

model Session {
  id        String   @id
  userId    String
  expiresAt DateTime
  user      User     @relation(references: [id], fields: [userId], onDelete: Cascade)

  @@index([userId])
}

// ─────────────────────────────────────────────
// Financial Models
// ─────────────────────────────────────────────

model BankAccount {
  id          String          @id @default(cuid())
  householdId String?
  userId      String
  name        String
  type        BankAccountType @default(CHECKING)
  balance     Decimal         @default(0) @db.Decimal(15, 2)
  color       String?
  icon        String?
  isDefault   Boolean         @default(false)

  // Cartão de crédito
  creditLimit       Decimal? @db.Decimal(15, 2)
  invoiceClosingDay Int?
  invoiceDueDay     Int?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  household             Household?             @relation(fields: [householdId], references: [id], onDelete: Cascade)
  user                  User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions          Transaction[]
  recurringTransactions RecurringTransaction[]
  merchantMemories      MerchantMemory[]

  @@index([userId])
  @@index([householdId])
}

model Category {
  id                String             @id @default(cuid())
  householdId       String?
  userId            String
  name              String
  type              TransactionType
  icon              String?
  color             String?
  taxClassification TaxClassification? // Fase 8: classificação tributária
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt

  household             Household?             @relation(fields: [householdId], references: [id], onDelete: Cascade)
  user                  User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions          Transaction[]
  budgets               Budget[]
  recurringTransactions RecurringTransaction[]
  merchantMemories      MerchantMemory[]

  @@index([userId])
  @@index([householdId])
}

model Transaction {
  id               String            @id @default(cuid())
  householdId      String?
  userId           String
  bankAccountId    String
  categoryId       String?
  type             TransactionType
  status           TransactionStatus @default(COMPLETED)
  amount           Decimal           @db.Decimal(15, 2)
  description      String?
  date             DateTime          @default(now())
  notes            String? // Fase 7: notas adicionais
  aiCaptureEventId String?           @unique

  // Parcelamento
  installmentNumber Int?
  totalInstallments Int?

  // Controle
  ignoreInTotals Boolean @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  household      Household?               @relation(fields: [householdId], references: [id], onDelete: Cascade)
  user           User                     @relation(fields: [userId], references: [id], onDelete: Cascade)
  bankAccount    BankAccount              @relation(fields: [bankAccountId], references: [id], onDelete: Cascade)
  category       Category?                @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  aiCaptureEvent AiCaptureEvent?          @relation(fields: [aiCaptureEventId], references: [id], onDelete: SetNull)
  qualityFlags   TransactionQualityFlag[]
  ingestionLogs  IngestionLog[]
  tags           TransactionTag[]

  @@index([userId])
  @@index([householdId])
  @@index([bankAccountId])
  @@index([categoryId])
  @@index([date])
}

// ─────────────────────────────────────────────
// IA Operational Log
// ─────────────────────────────────────────────

model AiCaptureEvent {
  id                   String          @id @default(cuid())
  userId               String
  householdId          String?
  sourceDocumentId     String?
  correlationId        String?
  captureGroupId       String?
  source               String // "text", "image", "text+image"
  inputType            String
  rawText              String?
  normalizedDraft      Json?
  confidenceOverall    Float
  decision             String
  processingStage      IngestionStage?
  reviewState          ReviewState?    @default(NOT_REQUIRED)
  decisionReason       String?
  provider             String?
  model                String?
  tokensIn             Int?
  tokensOut            Int?
  latencyMs            Int?
  taintLevel           TaintLevel?
  sealedPayload        String?         @db.Text
  signature            String?
  signatureKeyId       String?
  prevHash             String?
  parserVersion        String?
  normalizerVersion    String?
  createdTransactionId String?
  wasUndone            Boolean         @default(false)
  createdAt            DateTime        @default(now())

  user           User                     @relation(fields: [userId], references: [id], onDelete: Cascade)
  household      Household?               @relation(fields: [householdId], references: [id], onDelete: Cascade)
  sourceDocument SourceDocument?          @relation(fields: [sourceDocumentId], references: [id], onDelete: SetNull)
  ingestionLogs  IngestionLog[]
  qualityFlags   TransactionQualityFlag[]
  transaction    Transaction?
  feedbacks      DecisionFeedback[]

  @@index([captureGroupId])
  @@index([correlationId])
}

model SourceDocument {
  id               String        @id @default(cuid())
  userId           String?
  householdId      String?
  correlationId    String?
  sourceChannel    SourceChannel
  sourceType       SourceType
  mimeType         String?
  originalName     String?
  sizeBytes        Int?
  sha256           String
  contentHash      String?
  storageRef       String?
  extractionMethod String?
  parserVersion    String?
  taintLevel       TaintLevel?
  firstSeenAt      DateTime      @default(now())
  lastSeenAt       DateTime      @default(now())
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  user            User?                    @relation(fields: [userId], references: [id], onDelete: SetNull)
  household       Household?               @relation(fields: [householdId], references: [id], onDelete: Cascade)
  aiCaptureEvents AiCaptureEvent[]
  ingestionLogs   IngestionLog[]
  qualityFlags    TransactionQualityFlag[]

  @@index([householdId, sha256])
  @@index([userId, sha256])
  @@index([correlationId])
}

model IngestionLog {
  id               String          @id @default(cuid())
  correlationId    String
  sourceDocumentId String?
  aiCaptureEventId String?
  transactionId    String?
  householdId      String?
  userId           String?
  stage            IngestionStage
  status           IngestionStatus
  channel          String?
  actorType        String?
  actorId          String?
  errorCode        String?
  errorMessage     String?
  metadata         Json?
  retryCount       Int             @default(0)
  startedAt        DateTime?
  finishedAt       DateTime?
  createdAt        DateTime        @default(now())

  sourceDocument SourceDocument? @relation(fields: [sourceDocumentId], references: [id], onDelete: SetNull)
  aiCaptureEvent AiCaptureEvent? @relation(fields: [aiCaptureEventId], references: [id], onDelete: SetNull)
  transaction    Transaction?    @relation(fields: [transactionId], references: [id], onDelete: SetNull)
  household      Household?      @relation(fields: [householdId], references: [id], onDelete: Cascade)
  user           User?           @relation("IngestionLogUser", fields: [userId], references: [id], onDelete: Cascade)
  actor          User?           @relation("IngestionLogActor", fields: [actorId], references: [id], onDelete: SetNull)

  @@index([correlationId, createdAt])
  @@index([sourceDocumentId])
  @@index([aiCaptureEventId])
}

model TransactionQualityFlag {
  id               String              @id @default(cuid())
  transactionId    String?
  aiCaptureEventId String?
  sourceDocumentId String?
  householdId      String?
  code             QualityFlagCode
  severity         QualityFlagSeverity
  status           QualityFlagStatus   @default(OPEN)
  metadata         Json?
  resolvedAt       DateTime?
  resolvedByUserId String?
  createdAt        DateTime            @default(now())
  updatedAt        DateTime            @updatedAt

  transaction    Transaction?    @relation(fields: [transactionId], references: [id], onDelete: SetNull)
  aiCaptureEvent AiCaptureEvent? @relation(fields: [aiCaptureEventId], references: [id], onDelete: SetNull)
  sourceDocument SourceDocument? @relation(fields: [sourceDocumentId], references: [id], onDelete: SetNull)
  household      Household?      @relation(fields: [householdId], references: [id], onDelete: Cascade)
  resolvedByUser User?           @relation("TransactionQualityFlagResolvedBy", fields: [resolvedByUserId], references: [id], onDelete: SetNull)
  feedbacks      DecisionFeedback[]

  @@index([transactionId])
  @@index([aiCaptureEventId])
  @@index([sourceDocumentId])
  @@index([householdId, status])
}

// ─────────────────────────────────────────────
// IA Operational Memory
// ─────────────────────────────────────────────

model MerchantMemory {
  id             String   @id @default(cuid())
  householdId    String?
  userId         String
  merchantName   String
  categoryId     String?
  bankAccountId  String?
  correctedCount Int      @default(0)
  lastUsedAt     DateTime @default(now())

  household   Household?   @relation(fields: [householdId], references: [id], onDelete: Cascade)
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  category    Category?    @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  bankAccount BankAccount? @relation(fields: [bankAccountId], references: [id], onDelete: SetNull)

  @@index([householdId])
  @@index([userId])
}

// ─────────────────────────────────────────────
// Fase 7: Orçamentos & Tags
// ─────────────────────────────────────────────

/// Orçamento mensal por categoria
model Budget {
  id          String   @id @default(cuid())
  householdId String
  categoryId  String
  amount      Decimal  @db.Decimal(15, 2) // limite orçado
  month       Int // 1-12
  year        Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  household Household @relation(fields: [householdId], references: [id], onDelete: Cascade)
  category  Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@unique([householdId, categoryId, month, year])
  @@index([householdId])
}

model Tag {
  id          String   @id @default(cuid())
  householdId String
  name        String
  color       String?
  createdAt   DateTime @default(now())

  household    Household        @relation(fields: [householdId], references: [id], onDelete: Cascade)
  transactions TransactionTag[]

  @@unique([householdId, name])
  @@index([householdId])
}

model TransactionTag {
  transactionId String
  tagId         String

  transaction Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  tag         Tag         @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([transactionId, tagId])
}

// ─────────────────────────────────────────────
// Fase 8: Módulo Contador
// ─────────────────────────────────────────────

/// Sessão temporária de acesso do contador (somente leitura)
model CounterSession {
  id          String   @id @default(cuid())
  householdId String
  tokenHash   String   @unique // SHA-256 do token temporário
  label       String? // ex: "Contador João – Abril 2026"
  permissions Json? // Fase 8: escopos de acesso
  expiresAt   DateTime
  createdAt   DateTime @default(now())

  household Household @relation(fields: [householdId], references: [id], onDelete: Cascade)
  signedArtifacts SignedArtifact[]

  @@index([householdId])
}

model SignedArtifact {
  id                     String            @id @default(cuid())
  artifactType           SignedArtifactType
  scopeType              String
  scopeId                String
  householdId            String?
  userId                 String?
  counterSessionId       String?
  sourceEntityType       String?
  sourceEntityId         String?
  payloadHash            String
  payloadDigestAlgorithm String            @default("sha256")
  signature              String
  signatureAlgorithm     String            @default("hmac-sha256")
  signatureKeyId         String
  verificationToken      String            @unique
  fileName               String?
  mimeType               String?
  sizeBytes              Int?
  metadata               Json?
  createdByUserId        String?
  createdAt              DateTime          @default(now())
  updatedAt              DateTime          @updatedAt

  household      Household?     @relation(fields: [householdId], references: [id], onDelete: Cascade)
  user           User?          @relation(fields: [userId], references: [id], onDelete: SetNull)
  counterSession CounterSession? @relation(fields: [counterSessionId], references: [id], onDelete: SetNull)
  createdByUser  User?          @relation("SignedArtifactCreatedByUser", fields: [createdByUserId], references: [id], onDelete: SetNull)

  @@index([artifactType, createdAt])
  @@index([scopeType, scopeId, createdAt])
  @@index([householdId, createdAt])
  @@index([sourceEntityType, sourceEntityId])
}

model HouseholdQuota {
  id                  String          @id @default(cuid())
  householdId         String
  capability          String
  provider            String?
  periodType          QuotaPeriodType @default(MONTHLY)
  maxRequests         Int?
  maxInputTokens      Int?
  maxOutputTokens     Int?
  hardBlock           Boolean         @default(true)
  warningThresholdPct Int?            @default(80)
  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt

  household Household @relation(fields: [householdId], references: [id], onDelete: Cascade)

  @@unique([householdId, capability, provider, periodType])
  @@index([householdId, periodType])
}

model AutomationJobRun {
  id           String              @id @default(cuid())
  jobName      String
  scopeType    String?
  scopeId      String?
  householdId  String?
  status       AutomationJobStatus
  itemCount    Int                 @default(0)
  errorSummary String?
  metadata     Json?
  startedAt    DateTime            @default(now())
  finishedAt   DateTime
  createdAt    DateTime            @default(now())

  household Household? @relation(fields: [householdId], references: [id], onDelete: Cascade)

  @@index([jobName, createdAt])
  @@index([householdId, createdAt])
}

model PolicyVersion {
  id                    String       @id @default(cuid())
  householdId           String?
  policyType            String
  version               Int
  status                PolicyStatus @default(DRAFT)
  config                Json
  description           String?
  createdByUserId       String?
  activatedAt           DateTime?
  retiredAt             DateTime?
  parentPolicyVersionId String?
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt

  household             Household?        @relation(fields: [householdId], references: [id], onDelete: Cascade)
  createdByUser         User?             @relation("PolicyVersionCreatedByUser", fields: [createdByUserId], references: [id], onDelete: SetNull)
  parentPolicyVersion   PolicyVersion?    @relation("PolicyVersionLineage", fields: [parentPolicyVersionId], references: [id], onDelete: SetNull)
  childPolicyVersions   PolicyVersion[]   @relation("PolicyVersionLineage")
  decisionEvaluations   DecisionEvaluation[]
  calibrationRuns       CalibrationRun[]
  experiments           Experiment[]
  decisionFeedbacks     DecisionFeedback[]

  @@unique([householdId, policyType, version])
  @@index([policyType, status, householdId])
}

model DecisionEvaluation {
  id              String            @id @default(cuid())
  scopeType       String
  scopeId         String?
  householdId     String?
  userId          String?
  subjectType     String
  subjectId       String?
  sourceEventId   String?
  policyVersionId String?
  provider        String?
  model           String?
  evaluationType  String
  expectedOutcome String?
  observedOutcome String?
  result          EvaluationResult
  score           Float?
  metadata        Json?
  evaluatedAt     DateTime
  createdAt       DateTime          @default(now())

  household     Household?    @relation(fields: [householdId], references: [id], onDelete: Cascade)
  user          User?         @relation("DecisionEvaluationUser", fields: [userId], references: [id], onDelete: SetNull)
  policyVersion PolicyVersion? @relation(fields: [policyVersionId], references: [id], onDelete: SetNull)

  @@index([householdId, evaluatedAt])
  @@index([policyVersionId, evaluatedAt])
  @@index([subjectType, result, evaluatedAt])
}

model ProductQualityMetricSnapshot {
  id         String           @id @default(cuid())
  periodType MetricPeriodType
  periodStart DateTime
  periodEnd  DateTime
  scopeType  String
  scopeId    String?
  householdId String?
  metricCode String
  metricValue Float
  dimensions Json?
  computedAt DateTime
  createdAt  DateTime         @default(now())

  household Household? @relation(fields: [householdId], references: [id], onDelete: Cascade)

  @@index([householdId, metricCode, periodStart])
  @@index([scopeType, scopeId, periodStart])
}

model DecisionFeedback {
  id               String   @id @default(cuid())
  householdId      String?
  userId           String?
  feedbackType     String
  subjectType      String
  subjectId        String?
  aiCaptureEventId String?
  qualityFlagId    String?
  recommendationId String?
  policyVersionId  String?
  provider         String?
  model            String?
  isInferred       Boolean  @default(false)
  signalStrength   Float?
  metadata         Json?
  createdAt        DateTime @default(now())

  household     Household?        @relation(fields: [householdId], references: [id], onDelete: Cascade)
  user          User?             @relation("DecisionFeedbackUser", fields: [userId], references: [id], onDelete: SetNull)
  aiCaptureEvent AiCaptureEvent?   @relation(fields: [aiCaptureEventId], references: [id], onDelete: SetNull)
  qualityFlag   TransactionQualityFlag? @relation(fields: [qualityFlagId], references: [id], onDelete: SetNull)
  recommendation AiRecommendation? @relation(fields: [recommendationId], references: [id], onDelete: SetNull)
  policyVersion PolicyVersion?    @relation(fields: [policyVersionId], references: [id], onDelete: SetNull)

  @@index([householdId, feedbackType, createdAt])
  @@index([subjectType, subjectId, createdAt])
}

model CalibrationRun {
  id              String          @id @default(cuid())
  householdId     String?
  policyType      String
  mode            CalibrationMode
  baselineMetrics Json?
  candidateConfig Json?
  applied         Boolean         @default(false)
  reason          String?
  guardrailStatus String?
  policyVersionId String?
  createdAt       DateTime        @default(now())

  household     Household?    @relation(fields: [householdId], references: [id], onDelete: Cascade)
  policyVersion PolicyVersion? @relation(fields: [policyVersionId], references: [id], onDelete: SetNull)
  changes       CalibrationChange[]

  @@index([householdId, policyType, createdAt])
}

model CalibrationChange {
  id               String   @id @default(cuid())
  calibrationRunId String
  metricCode       String
  baselineValue    Float
  candidateValue   Float
  observedValue    Float?
  createdAt        DateTime @default(now())

  run CalibrationRun @relation(fields: [calibrationRunId], references: [id], onDelete: Cascade)

  @@index([calibrationRunId])
}

model Experiment {
  id              String           @id @default(cuid())
  householdId     String?
  key             String
  type            String
  status          ExperimentStatus @default(DRAFT)
  allocationStrategy String
  targetScope     String
  config          Json
  policyVersionId String?
  startAt         DateTime?
  endAt           DateTime?
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  household     Household?    @relation(fields: [householdId], references: [id], onDelete: Cascade)
  policyVersion PolicyVersion? @relation(fields: [policyVersionId], references: [id], onDelete: SetNull)

  @@unique([householdId, key])
  @@index([status, startAt, endAt])
}

// ─────────────────────────────────────────────
// Fase 9: Metas & Integrações
// ─────────────────────────────────────────────

/// Meta financeira da família
model Goal {
  id            String    @id @default(cuid())
  householdId   String
  name          String
  targetAmount  Decimal   @db.Decimal(15, 2)
  currentAmount Decimal   @default(0) @db.Decimal(15, 2)
  deadline      DateTime?
  icon          String?
  color         String?
  completed     Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  household Household @relation(fields: [householdId], references: [id], onDelete: Cascade)

  @@index([householdId])
}

/// Transação recorrente (assinatura, salário, etc.)
model RecurringTransaction {
  id            String             @id @default(cuid())
  householdId   String
  bankAccountId String
  categoryId    String?
  type          TransactionType
  amount        Decimal            @db.Decimal(15, 2)
  description   String?
  frequency     RecurringFrequency
  nextDate      DateTime
  endDate       DateTime? // null = sem fim
  active        Boolean            @default(true)
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt

  household   Household   @relation(fields: [householdId], references: [id], onDelete: Cascade)
  bankAccount BankAccount @relation(fields: [bankAccountId], references: [id], onDelete: Cascade)
  category    Category?   @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@index([householdId])
  @@index([nextDate])
}

/// Conexão bancária automática – preparado para Pluggy/Open Finance
model BankConnection {
  id          String    @id @default(cuid())
  householdId String
  provider    String // "pluggy", "open_finance"
  externalId  String // ID da conta na API externa
  status      String    @default("pending") // "active" | "error" | "pending"
  lastSyncAt  DateTime?
  metadata    Json? // dados extras do provider
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  household Household @relation(fields: [householdId], references: [id], onDelete: Cascade)

  @@unique([householdId, provider, externalId])
  @@index([householdId])
}

// ─────────────────────────────────────────────
// Fase 11 a 14: Conversations, Plans & Recommendations
// ─────────────────────────────────────────────

model AiConversation {
  id          String   @id @default(cuid())
  userId      String
  householdId String?
  title       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  household Household?  @relation(fields: [householdId], references: [id], onDelete: Cascade)
  messages  AiMessage[]

  @@index([userId])
  @@index([householdId])
}

model AiMessage {
  id             String @id @default(cuid())
  conversationId String
  userId         String
  role           String // 'user', 'assistant', 'system'
  mode           String // 'Registrar', 'Revisar', 'Perguntar', 'Planejar'
  inputType      String @default("text") // text, image, audio, etc.
  content        String

  audioDurationMs Int?

  metadata  Json? // To store generic payloads like drafts, saved_plan reference, operational_result
  createdAt DateTime @default(now())

  conversation AiConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  user         User           @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([conversationId])
}

model FinancialPlan {
  id                    String          @id @default(cuid())
  userId                String
  householdId           String?
  visibility            VisibilityScope @default(PERSONAL)
  title                 String
  objectiveType         String
  targetAmount          Decimal?        @db.Decimal(15, 2)
  targetDate            DateTime?
  targetMonths          Int?
  monthlyRequiredAmount Decimal?        @db.Decimal(15, 2)
  summary               String
  recommendedCuts       Json?
  scenarioData          Json?
  isActive              Boolean         @default(true)
  createdAt             DateTime        @default(now())
  updatedAt             DateTime        @updatedAt

  user       User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  household  Household?             @relation(fields: [householdId], references: [id], onDelete: Cascade)
  progresses PlanProgressSnapshot[]

  @@index([userId])
  @@index([householdId])
}

model PlanProgressSnapshot {
  id                  String    @id @default(cuid())
  planId              String
  currentAmount       Decimal   @db.Decimal(15, 2)
  progressPercentage  Float
  projectedCompletion DateTime?
  isOnTrack           Boolean
  createdAt           DateTime  @default(now())

  plan FinancialPlan @relation(fields: [planId], references: [id], onDelete: Cascade)

  @@index([planId])
}

model AiRecommendation {
  id            String          @id @default(cuid())
  userId        String
  householdId   String?
  visibility    VisibilityScope @default(PERSONAL)
  relatedPlanId String?
  type          String // 'budget_warning', 'plan_progress', 'general_saving'
  message       String
  actionLabel   String?
  actionTarget  String? // Ex: '/orcamentos'
  score         Float           @default(0) // order by priority
  isDismissed   Boolean         @default(false)
  createdAt     DateTime        @default(now())

  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  household Household? @relation(fields: [householdId], references: [id], onDelete: Cascade)
  feedbacks DecisionFeedback[]

  @@index([userId])
  @@index([householdId])
}
```

### Arquivos .sql
```text
prisma/migrations/20260414190009_add_household_and_credit_fields/migration.sql
prisma/migrations/20260414221323_add_2fa_totp_fields/migration.sql
prisma/migrations/20260415161700_sync_schema_with_current_app/migration.sql
prisma/migrations/20260416055106_add_product_feedback/migration.sql
prisma/migrations/20260417044000_add_whatsapp_link_fields/migration.sql
prisma/migrations/20260418090000_add_category_learning_rules/migration.sql
prisma/migrations/20260419093000_wave1_blindagem/migration.sql
prisma/migrations/20260419130000_wave2_financial_data_system/migration.sql
prisma/migrations/20260419170000_wave4_operational_scale/migration.sql
prisma/migrations/20260419193000_wave5_continuous_optimization/migration.sql
```

#### prisma/migrations/20260414190009_add_household_and_credit_fields/migration.sql
```sql
-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('CHECKING', 'CREDIT', 'SAVINGS', 'INVESTMENT');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateTable
CREATE TABLE "Household" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Household_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "householdId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "householdId" TEXT,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "BankAccountType" NOT NULL DEFAULT 'CHECKING',
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "color" TEXT,
    "icon" TEXT,
    "creditLimit" DECIMAL(65,30),
    "invoiceClosingDay" INTEGER,
    "invoiceDueDay" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "householdId" TEXT,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "householdId" TEXT,
    "userId" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "categoryId" TEXT,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'COMPLETED',
    "amount" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "installmentNumber" INTEGER,
    "totalInstallments" INTEGER,
    "ignoreInTotals" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_householdId_idx" ON "User"("householdId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "BankAccount_userId_idx" ON "BankAccount"("userId");

-- CreateIndex
CREATE INDEX "BankAccount_householdId_idx" ON "BankAccount"("householdId");

-- CreateIndex
CREATE INDEX "Category_userId_idx" ON "Category"("userId");

-- CreateIndex
CREATE INDEX "Category_householdId_idx" ON "Category"("householdId");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_householdId_idx" ON "Transaction"("householdId");

-- CreateIndex
CREATE INDEX "Transaction_bankAccountId_idx" ON "Transaction"("bankAccountId");

-- CreateIndex
CREATE INDEX "Transaction_categoryId_idx" ON "Transaction"("categoryId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

#### prisma/migrations/20260414221323_add_2fa_totp_fields/migration.sql
```sql
-- Fase 10: Add 2FA TOTP fields to User model
ALTER TABLE "User" ADD COLUMN "totpSecret" TEXT;
ALTER TABLE "User" ADD COLUMN "totpEnabled" BOOLEAN NOT NULL DEFAULT false;
```

#### prisma/migrations/20260415161700_sync_schema_with_current_app/migration.sql
```sql
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'VIEWER');

-- CreateEnum
CREATE TYPE "TaxClassification" AS ENUM ('DEDUCTIBLE_IR', 'NON_DEDUCTIBLE', 'TAXABLE_INCOME', 'OTHER');

-- CreateEnum
CREATE TYPE "RecurringFrequency" AS ENUM ('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');

-- AlterTable
ALTER TABLE "BankAccount"
ALTER COLUMN "balance" SET DATA TYPE DECIMAL(15,2),
ALTER COLUMN "creditLimit" SET DATA TYPE DECIMAL(15,2);

-- AlterTable
ALTER TABLE "Category" ADD COLUMN "taxClassification" "TaxClassification";

-- AlterTable
ALTER TABLE "Household" ADD COLUMN "inviteCode" TEXT;

-- AlterTable
ALTER TABLE "Transaction"
ADD COLUMN "notes" TEXT,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(15,2);

-- AlterTable
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionTag" (
    "transactionId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "TransactionTag_pkey" PRIMARY KEY ("transactionId","tagId")
);

-- CreateTable
CREATE TABLE "CounterSession" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "label" TEXT,
    "permissions" JSONB,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CounterSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetAmount" DECIMAL(15,2) NOT NULL,
    "currentAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3),
    "icon" TEXT,
    "color" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringTransaction" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "categoryId" TEXT,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT,
    "frequency" "RecurringFrequency" NOT NULL,
    "nextDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankConnection" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "lastSyncAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Budget_householdId_idx" ON "Budget"("householdId");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_householdId_categoryId_month_year_key" ON "Budget"("householdId", "categoryId", "month", "year");

-- CreateIndex
CREATE INDEX "Tag_householdId_idx" ON "Tag"("householdId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_householdId_name_key" ON "Tag"("householdId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CounterSession_tokenHash_key" ON "CounterSession"("tokenHash");

-- CreateIndex
CREATE INDEX "CounterSession_householdId_idx" ON "CounterSession"("householdId");

-- CreateIndex
CREATE INDEX "Goal_householdId_idx" ON "Goal"("householdId");

-- CreateIndex
CREATE INDEX "RecurringTransaction_householdId_idx" ON "RecurringTransaction"("householdId");

-- CreateIndex
CREATE INDEX "RecurringTransaction_nextDate_idx" ON "RecurringTransaction"("nextDate");

-- CreateIndex
CREATE INDEX "BankConnection_householdId_idx" ON "BankConnection"("householdId");

-- CreateIndex
CREATE UNIQUE INDEX "BankConnection_householdId_provider_externalId_key" ON "BankConnection"("householdId", "provider", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Household_inviteCode_key" ON "Household"("inviteCode");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionTag" ADD CONSTRAINT "TransactionTag_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionTag" ADD CONSTRAINT "TransactionTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounterSession" ADD CONSTRAINT "CounterSession_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTransaction" ADD CONSTRAINT "RecurringTransaction_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTransaction" ADD CONSTRAINT "RecurringTransaction_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTransaction" ADD CONSTRAINT "RecurringTransaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankConnection" ADD CONSTRAINT "BankConnection_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

#### prisma/migrations/20260416055106_add_product_feedback/migration.sql
```sql
/*
  Warnings:

  - A unique constraint covering the columns `[aiCaptureEventId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "VisibilityScope" AS ENUM ('PERSONAL', 'HOUSEHOLD');

-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "aiCaptureEventId" TEXT;

-- CreateTable
CREATE TABLE "ProductFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "householdId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'composer',
    "rawInput" TEXT NOT NULL,
    "normalizedTitle" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "priorityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reproductionSteps" JSONB,
    "suggestedSolution" TEXT,
    "acceptanceCriteria" JSONB,
    "status" TEXT NOT NULL DEFAULT 'new',
    "relatedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackArtifact" (
    "id" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "url" TEXT,
    "content" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiCaptureEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "householdId" TEXT,
    "captureGroupId" TEXT,
    "source" TEXT NOT NULL,
    "inputType" TEXT NOT NULL,
    "rawText" TEXT,
    "normalizedDraft" JSONB,
    "confidenceOverall" DOUBLE PRECISION NOT NULL,
    "decision" TEXT NOT NULL,
    "createdTransactionId" TEXT,
    "wasUndone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiCaptureEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantMemory" (
    "id" TEXT NOT NULL,
    "householdId" TEXT,
    "userId" TEXT NOT NULL,
    "merchantName" TEXT NOT NULL,
    "categoryId" TEXT,
    "bankAccountId" TEXT,
    "correctedCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerchantMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiConversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "householdId" TEXT,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "inputType" TEXT NOT NULL DEFAULT 'text',
    "content" TEXT NOT NULL,
    "audioDurationMs" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "householdId" TEXT,
    "visibility" "VisibilityScope" NOT NULL DEFAULT 'PERSONAL',
    "title" TEXT NOT NULL,
    "objectiveType" TEXT NOT NULL,
    "targetAmount" DECIMAL(15,2),
    "targetDate" TIMESTAMP(3),
    "targetMonths" INTEGER,
    "monthlyRequiredAmount" DECIMAL(15,2),
    "summary" TEXT NOT NULL,
    "recommendedCuts" JSONB,
    "scenarioData" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanProgressSnapshot" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "currentAmount" DECIMAL(15,2) NOT NULL,
    "progressPercentage" DOUBLE PRECISION NOT NULL,
    "projectedCompletion" TIMESTAMP(3),
    "isOnTrack" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanProgressSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiRecommendation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "householdId" TEXT,
    "visibility" "VisibilityScope" NOT NULL DEFAULT 'PERSONAL',
    "relatedPlanId" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionLabel" TEXT,
    "actionTarget" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isDismissed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiCaptureEvent_captureGroupId_idx" ON "AiCaptureEvent"("captureGroupId");

-- CreateIndex
CREATE INDEX "MerchantMemory_householdId_idx" ON "MerchantMemory"("householdId");

-- CreateIndex
CREATE INDEX "MerchantMemory_userId_idx" ON "MerchantMemory"("userId");

-- CreateIndex
CREATE INDEX "AiConversation_userId_idx" ON "AiConversation"("userId");

-- CreateIndex
CREATE INDEX "AiConversation_householdId_idx" ON "AiConversation"("householdId");

-- CreateIndex
CREATE INDEX "AiMessage_conversationId_idx" ON "AiMessage"("conversationId");

-- CreateIndex
CREATE INDEX "FinancialPlan_userId_idx" ON "FinancialPlan"("userId");

-- CreateIndex
CREATE INDEX "FinancialPlan_householdId_idx" ON "FinancialPlan"("householdId");

-- CreateIndex
CREATE INDEX "PlanProgressSnapshot_planId_idx" ON "PlanProgressSnapshot"("planId");

-- CreateIndex
CREATE INDEX "AiRecommendation_userId_idx" ON "AiRecommendation"("userId");

-- CreateIndex
CREATE INDEX "AiRecommendation_householdId_idx" ON "AiRecommendation"("householdId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_aiCaptureEventId_key" ON "Transaction"("aiCaptureEventId");

-- AddForeignKey
ALTER TABLE "ProductFeedback" ADD CONSTRAINT "ProductFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFeedback" ADD CONSTRAINT "ProductFeedback_relatedToId_fkey" FOREIGN KEY ("relatedToId") REFERENCES "ProductFeedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackArtifact" ADD CONSTRAINT "FeedbackArtifact_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "ProductFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_aiCaptureEventId_fkey" FOREIGN KEY ("aiCaptureEventId") REFERENCES "AiCaptureEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiCaptureEvent" ADD CONSTRAINT "AiCaptureEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiCaptureEvent" ADD CONSTRAINT "AiCaptureEvent_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantMemory" ADD CONSTRAINT "MerchantMemory_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantMemory" ADD CONSTRAINT "MerchantMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantMemory" ADD CONSTRAINT "MerchantMemory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantMemory" ADD CONSTRAINT "MerchantMemory_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialPlan" ADD CONSTRAINT "FinancialPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialPlan" ADD CONSTRAINT "FinancialPlan_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanProgressSnapshot" ADD CONSTRAINT "PlanProgressSnapshot_planId_fkey" FOREIGN KEY ("planId") REFERENCES "FinancialPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiRecommendation" ADD CONSTRAINT "AiRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiRecommendation" ADD CONSTRAINT "AiRecommendation_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

#### prisma/migrations/20260417044000_add_whatsapp_link_fields/migration.sql
```sql
ALTER TABLE "User"
ADD COLUMN "phone" TEXT,
ADD COLUMN "whatsappNumber" TEXT,
ADD COLUMN "whatsappLinkToken" TEXT,
ADD COLUMN "whatsappLinkTokenExpiresAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "User_whatsappNumber_key" ON "User"("whatsappNumber");
CREATE INDEX "User_phone_idx" ON "User"("phone");
CREATE INDEX "User_whatsappLinkToken_idx" ON "User"("whatsappLinkToken");
```

#### prisma/migrations/20260418090000_add_category_learning_rules/migration.sql
```sql
-- CreateTable
CREATE TABLE "CategoryLearningRule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "householdId" TEXT,
    "descriptionPattern" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoryLearningRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CategoryLearningRule_userId_idx" ON "CategoryLearningRule"("userId");

-- CreateIndex
CREATE INDEX "CategoryLearningRule_householdId_idx" ON "CategoryLearningRule"("householdId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryLearningRule_userId_descriptionPattern_categoryName_key" ON "CategoryLearningRule"("userId", "descriptionPattern", "categoryName");

-- AddForeignKey
ALTER TABLE "CategoryLearningRule" ADD CONSTRAINT "CategoryLearningRule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryLearningRule" ADD CONSTRAINT "CategoryLearningRule_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

#### prisma/migrations/20260419093000_wave1_blindagem/migration.sql
```sql
-- Wave 1 hardening: encrypted TOTP, auth challenge, rate limit buckets
ALTER TABLE "User"
ADD COLUMN "totpSecretEnc" TEXT,
ADD COLUMN "totpSecretKeyVersion" TEXT;

CREATE TABLE "AuthChallenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AuthChallenge_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RateLimitBucket" (
    "id" TEXT NOT NULL,
    "bucketKey" TEXT NOT NULL,
    "scopeKey" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AuthChallenge_tokenHash_key" ON "AuthChallenge"("tokenHash");
CREATE INDEX "AuthChallenge_userId_purpose_idx" ON "AuthChallenge"("userId", "purpose");
CREATE INDEX "AuthChallenge_expiresAt_idx" ON "AuthChallenge"("expiresAt");

CREATE UNIQUE INDEX "RateLimitBucket_bucketKey_key" ON "RateLimitBucket"("bucketKey");
CREATE INDEX "RateLimitBucket_scopeKey_windowStart_idx" ON "RateLimitBucket"("scopeKey", "windowStart");
CREATE INDEX "RateLimitBucket_expiresAt_idx" ON "RateLimitBucket"("expiresAt");

ALTER TABLE "AuthChallenge" ADD CONSTRAINT "AuthChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

#### prisma/migrations/20260419130000_wave2_financial_data_system/migration.sql
```sql
-- Wave 2: Stabilization / Financial Data System
CREATE TYPE "SourceChannel" AS ENUM ('MANUAL', 'EMAIL', 'WHATSAPP', 'IMPORT', 'COMPOSER', 'API');
CREATE TYPE "SourceType" AS ENUM ('TEXT', 'IMAGE', 'PDF', 'CSV', 'OFX', 'AUDIO', 'RAW_TEXT');
CREATE TYPE "IngestionStage" AS ENUM ('RECEIVED', 'EXTRACTING', 'EXTRACTED', 'PARSING', 'PARSED', 'NORMALIZING', 'NORMALIZED', 'REVIEW_REQUIRED', 'COMMITTING', 'COMMITTED', 'FAILED', 'DUPLICATE_SKIPPED');
CREATE TYPE "IngestionStatus" AS ENUM ('STARTED', 'SUCCESS', 'ERROR', 'SKIPPED');
CREATE TYPE "QualityFlagCode" AS ENUM ('DUPLICATE_SUSPECTED', 'DUPLICATE_CONFIRMED', 'OUTLIER_AMOUNT', 'CATEGORY_CONFLICT', 'ACCOUNT_MISSING', 'OCR_LOW_CONFIDENCE', 'REVIEW_REQUIRED');
CREATE TYPE "QualityFlagSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "QualityFlagStatus" AS ENUM ('OPEN', 'RESOLVED', 'DISMISSED');
CREATE TYPE "ReviewState" AS ENUM ('NOT_REQUIRED', 'REQUIRED', 'APPROVED', 'REJECTED');
CREATE TYPE "TaintLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

CREATE TABLE "SourceDocument" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "householdId" TEXT,
  "correlationId" TEXT,
  "sourceChannel" "SourceChannel" NOT NULL,
  "sourceType" "SourceType" NOT NULL,
  "mimeType" TEXT,
  "originalName" TEXT,
  "sizeBytes" INTEGER,
  "sha256" TEXT NOT NULL,
  "contentHash" TEXT,
  "storageRef" TEXT,
  "extractionMethod" TEXT,
  "parserVersion" TEXT,
  "taintLevel" "TaintLevel",
  "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SourceDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "IngestionLog" (
  "id" TEXT NOT NULL,
  "correlationId" TEXT NOT NULL,
  "sourceDocumentId" TEXT,
  "aiCaptureEventId" TEXT,
  "transactionId" TEXT,
  "householdId" TEXT,
  "userId" TEXT,
  "stage" "IngestionStage" NOT NULL,
  "status" "IngestionStatus" NOT NULL,
  "channel" TEXT,
  "actorType" TEXT,
  "actorId" TEXT,
  "errorCode" TEXT,
  "errorMessage" TEXT,
  "metadata" JSONB,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "startedAt" TIMESTAMP(3),
  "finishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "IngestionLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TransactionQualityFlag" (
  "id" TEXT NOT NULL,
  "transactionId" TEXT,
  "aiCaptureEventId" TEXT,
  "sourceDocumentId" TEXT,
  "householdId" TEXT,
  "code" "QualityFlagCode" NOT NULL,
  "severity" "QualityFlagSeverity" NOT NULL,
  "status" "QualityFlagStatus" NOT NULL DEFAULT 'OPEN',
  "metadata" JSONB,
  "resolvedAt" TIMESTAMP(3),
  "resolvedByUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TransactionQualityFlag_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "AiCaptureEvent"
  ADD COLUMN "sourceDocumentId" TEXT,
  ADD COLUMN "correlationId" TEXT,
  ADD COLUMN "processingStage" "IngestionStage",
  ADD COLUMN "reviewState" "ReviewState" DEFAULT 'NOT_REQUIRED',
  ADD COLUMN "decisionReason" TEXT,
  ADD COLUMN "provider" TEXT,
  ADD COLUMN "model" TEXT,
  ADD COLUMN "tokensIn" INTEGER,
  ADD COLUMN "tokensOut" INTEGER,
  ADD COLUMN "latencyMs" INTEGER,
  ADD COLUMN "taintLevel" "TaintLevel",
  ADD COLUMN "sealedPayload" TEXT,
  ADD COLUMN "signature" TEXT,
  ADD COLUMN "signatureKeyId" TEXT,
  ADD COLUMN "prevHash" TEXT,
  ADD COLUMN "parserVersion" TEXT,
  ADD COLUMN "normalizerVersion" TEXT;

CREATE INDEX "SourceDocument_householdId_sha256_idx" ON "SourceDocument"("householdId", "sha256");
CREATE INDEX "SourceDocument_userId_sha256_idx" ON "SourceDocument"("userId", "sha256");
CREATE INDEX "SourceDocument_correlationId_idx" ON "SourceDocument"("correlationId");
CREATE INDEX "IngestionLog_correlationId_createdAt_idx" ON "IngestionLog"("correlationId", "createdAt");
CREATE INDEX "IngestionLog_sourceDocumentId_idx" ON "IngestionLog"("sourceDocumentId");
CREATE INDEX "IngestionLog_aiCaptureEventId_idx" ON "IngestionLog"("aiCaptureEventId");
CREATE INDEX "TransactionQualityFlag_transactionId_idx" ON "TransactionQualityFlag"("transactionId");
CREATE INDEX "TransactionQualityFlag_aiCaptureEventId_idx" ON "TransactionQualityFlag"("aiCaptureEventId");
CREATE INDEX "TransactionQualityFlag_sourceDocumentId_idx" ON "TransactionQualityFlag"("sourceDocumentId");
CREATE INDEX "TransactionQualityFlag_householdId_status_idx" ON "TransactionQualityFlag"("householdId", "status");
CREATE INDEX "AiCaptureEvent_correlationId_idx" ON "AiCaptureEvent"("correlationId");

ALTER TABLE "SourceDocument" ADD CONSTRAINT "SourceDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SourceDocument" ADD CONSTRAINT "SourceDocument_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IngestionLog" ADD CONSTRAINT "IngestionLog_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "IngestionLog" ADD CONSTRAINT "IngestionLog_aiCaptureEventId_fkey" FOREIGN KEY ("aiCaptureEventId") REFERENCES "AiCaptureEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "IngestionLog" ADD CONSTRAINT "IngestionLog_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "IngestionLog" ADD CONSTRAINT "IngestionLog_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IngestionLog" ADD CONSTRAINT "IngestionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IngestionLog" ADD CONSTRAINT "IngestionLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TransactionQualityFlag" ADD CONSTRAINT "TransactionQualityFlag_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TransactionQualityFlag" ADD CONSTRAINT "TransactionQualityFlag_aiCaptureEventId_fkey" FOREIGN KEY ("aiCaptureEventId") REFERENCES "AiCaptureEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TransactionQualityFlag" ADD CONSTRAINT "TransactionQualityFlag_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TransactionQualityFlag" ADD CONSTRAINT "TransactionQualityFlag_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TransactionQualityFlag" ADD CONSTRAINT "TransactionQualityFlag_resolvedByUserId_fkey" FOREIGN KEY ("resolvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AiCaptureEvent" ADD CONSTRAINT "AiCaptureEvent_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

#### prisma/migrations/20260419170000_wave4_operational_scale/migration.sql
```sql
-- Wave 4: Operational Scale / Institutional Evidence / Governance

CREATE TYPE "SigningKeyStatus" AS ENUM ('ACTIVE', 'RETIRED', 'REVOKED');
CREATE TYPE "SignedArtifactType" AS ENUM ('MONTHLY_DOSSIER', 'EXPORT_PDF', 'EXPORT_CSV', 'FINANCIAL_PLAN_SNAPSHOT', 'RECOMMENDATION_EVIDENCE', 'PROCESSING_EVIDENCE');
CREATE TYPE "QuotaPeriodType" AS ENUM ('MONTHLY');
CREATE TYPE "AutomationJobStatus" AS ENUM ('SUCCESS', 'FAILED');

CREATE TABLE "SignedArtifact" (
  "id" TEXT NOT NULL,
  "artifactType" "SignedArtifactType" NOT NULL,
  "scopeType" TEXT NOT NULL,
  "scopeId" TEXT NOT NULL,
  "householdId" TEXT,
  "userId" TEXT,
  "counterSessionId" TEXT,
  "sourceEntityType" TEXT,
  "sourceEntityId" TEXT,
  "payloadHash" TEXT NOT NULL,
  "payloadDigestAlgorithm" TEXT NOT NULL DEFAULT 'sha256',
  "signature" TEXT NOT NULL,
  "signatureAlgorithm" TEXT NOT NULL DEFAULT 'hmac-sha256',
  "signatureKeyId" TEXT NOT NULL,
  "verificationToken" TEXT NOT NULL,
  "fileName" TEXT,
  "mimeType" TEXT,
  "sizeBytes" INTEGER,
  "metadata" JSONB,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SignedArtifact_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HouseholdQuota" (
  "id" TEXT NOT NULL,
  "householdId" TEXT NOT NULL,
  "capability" TEXT NOT NULL,
  "provider" TEXT,
  "periodType" "QuotaPeriodType" NOT NULL DEFAULT 'MONTHLY',
  "maxRequests" INTEGER,
  "maxInputTokens" INTEGER,
  "maxOutputTokens" INTEGER,
  "hardBlock" BOOLEAN NOT NULL DEFAULT true,
  "warningThresholdPct" INTEGER DEFAULT 80,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HouseholdQuota_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AutomationJobRun" (
  "id" TEXT NOT NULL,
  "jobName" TEXT NOT NULL,
  "scopeType" TEXT,
  "scopeId" TEXT,
  "householdId" TEXT,
  "status" "AutomationJobStatus" NOT NULL,
  "itemCount" INTEGER NOT NULL DEFAULT 0,
  "errorSummary" TEXT,
  "metadata" JSONB,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AutomationJobRun_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SignedArtifact_verificationToken_key" ON "SignedArtifact"("verificationToken");
CREATE INDEX "SignedArtifact_artifactType_createdAt_idx" ON "SignedArtifact"("artifactType", "createdAt");
CREATE INDEX "SignedArtifact_scopeType_scopeId_createdAt_idx" ON "SignedArtifact"("scopeType", "scopeId", "createdAt");
CREATE INDEX "SignedArtifact_householdId_createdAt_idx" ON "SignedArtifact"("householdId", "createdAt");
CREATE INDEX "SignedArtifact_sourceEntityType_sourceEntityId_idx" ON "SignedArtifact"("sourceEntityType", "sourceEntityId");

CREATE UNIQUE INDEX "HouseholdQuota_householdId_capability_provider_periodType_key" ON "HouseholdQuota"("householdId", "capability", "provider", "periodType");
CREATE INDEX "HouseholdQuota_householdId_periodType_idx" ON "HouseholdQuota"("householdId", "periodType");

CREATE INDEX "AutomationJobRun_jobName_createdAt_idx" ON "AutomationJobRun"("jobName", "createdAt");
CREATE INDEX "AutomationJobRun_householdId_createdAt_idx" ON "AutomationJobRun"("householdId", "createdAt");

ALTER TABLE "SignedArtifact" ADD CONSTRAINT "SignedArtifact_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SignedArtifact" ADD CONSTRAINT "SignedArtifact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SignedArtifact" ADD CONSTRAINT "SignedArtifact_counterSessionId_fkey" FOREIGN KEY ("counterSessionId") REFERENCES "CounterSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SignedArtifact" ADD CONSTRAINT "SignedArtifact_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "HouseholdQuota" ADD CONSTRAINT "HouseholdQuota_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AutomationJobRun" ADD CONSTRAINT "AutomationJobRun_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

#### prisma/migrations/20260419193000_wave5_continuous_optimization/migration.sql
```sql
-- Wave 5 continuous optimization / adaptive operations
CREATE TYPE "PolicyStatus" AS ENUM ('DRAFT', 'ACTIVE', 'RETIRED', 'ROLLED_BACK', 'EXPERIMENTAL');
CREATE TYPE "CalibrationMode" AS ENUM ('RECOMMEND_ONLY', 'APPLY_WITH_GUARDRAILS');
CREATE TYPE "EvaluationResult" AS ENUM ('CORRECT', 'INCORRECT', 'ACCEPTED', 'REJECTED', 'OVERRIDDEN', 'NO_SIGNAL');
CREATE TYPE "MetricPeriodType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');
CREATE TYPE "ExperimentStatus" AS ENUM ('DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED', 'KILLED');

CREATE TABLE "PolicyVersion" (
    "id" TEXT NOT NULL,
    "householdId" TEXT,
    "policyType" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "PolicyStatus" NOT NULL DEFAULT 'DRAFT',
    "config" JSONB NOT NULL,
    "description" TEXT,
    "createdByUserId" TEXT,
    "activatedAt" TIMESTAMP(3),
    "retiredAt" TIMESTAMP(3),
    "parentPolicyVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PolicyVersion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DecisionEvaluation" (
    "id" TEXT NOT NULL,
    "scopeType" TEXT NOT NULL,
    "scopeId" TEXT,
    "householdId" TEXT,
    "userId" TEXT,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT,
    "sourceEventId" TEXT,
    "policyVersionId" TEXT,
    "provider" TEXT,
    "model" TEXT,
    "evaluationType" TEXT NOT NULL,
    "expectedOutcome" TEXT,
    "observedOutcome" TEXT,
    "result" "EvaluationResult" NOT NULL,
    "score" DOUBLE PRECISION,
    "metadata" JSONB,
    "evaluatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DecisionEvaluation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductQualityMetricSnapshot" (
    "id" TEXT NOT NULL,
    "periodType" "MetricPeriodType" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "scopeType" TEXT NOT NULL,
    "scopeId" TEXT,
    "householdId" TEXT,
    "metricCode" TEXT NOT NULL,
    "metricValue" DOUBLE PRECISION NOT NULL,
    "dimensions" JSONB,
    "computedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductQualityMetricSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DecisionFeedback" (
    "id" TEXT NOT NULL,
    "householdId" TEXT,
    "userId" TEXT,
    "feedbackType" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT,
    "aiCaptureEventId" TEXT,
    "qualityFlagId" TEXT,
    "recommendationId" TEXT,
    "policyVersionId" TEXT,
    "provider" TEXT,
    "model" TEXT,
    "isInferred" BOOLEAN NOT NULL DEFAULT false,
    "signalStrength" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DecisionFeedback_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CalibrationRun" (
    "id" TEXT NOT NULL,
    "householdId" TEXT,
    "policyType" TEXT NOT NULL,
    "mode" "CalibrationMode" NOT NULL,
    "baselineMetrics" JSONB,
    "candidateConfig" JSONB,
    "applied" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "guardrailStatus" TEXT,
    "policyVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CalibrationRun_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CalibrationChange" (
    "id" TEXT NOT NULL,
    "calibrationRunId" TEXT NOT NULL,
    "metricCode" TEXT NOT NULL,
    "baselineValue" DOUBLE PRECISION NOT NULL,
    "candidateValue" DOUBLE PRECISION NOT NULL,
    "observedValue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CalibrationChange_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Experiment" (
    "id" TEXT NOT NULL,
    "householdId" TEXT,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "ExperimentStatus" NOT NULL DEFAULT 'DRAFT',
    "allocationStrategy" TEXT NOT NULL,
    "targetScope" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "policyVersionId" TEXT,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PolicyVersion_householdId_policyType_version_key" ON "PolicyVersion"("householdId", "policyType", "version");
CREATE INDEX "PolicyVersion_policyType_status_householdId_idx" ON "PolicyVersion"("policyType", "status", "householdId");
CREATE INDEX "DecisionEvaluation_householdId_evaluatedAt_idx" ON "DecisionEvaluation"("householdId", "evaluatedAt");
CREATE INDEX "DecisionEvaluation_policyVersionId_evaluatedAt_idx" ON "DecisionEvaluation"("policyVersionId", "evaluatedAt");
CREATE INDEX "DecisionEvaluation_subjectType_result_evaluatedAt_idx" ON "DecisionEvaluation"("subjectType", "result", "evaluatedAt");
CREATE INDEX "ProductQualityMetricSnapshot_householdId_metricCode_periodStart_idx" ON "ProductQualityMetricSnapshot"("householdId", "metricCode", "periodStart");
CREATE INDEX "ProductQualityMetricSnapshot_scopeType_scopeId_periodStart_idx" ON "ProductQualityMetricSnapshot"("scopeType", "scopeId", "periodStart");
CREATE INDEX "DecisionFeedback_householdId_feedbackType_createdAt_idx" ON "DecisionFeedback"("householdId", "feedbackType", "createdAt");
CREATE INDEX "DecisionFeedback_subjectType_subjectId_createdAt_idx" ON "DecisionFeedback"("subjectType", "subjectId", "createdAt");
CREATE INDEX "CalibrationRun_householdId_policyType_createdAt_idx" ON "CalibrationRun"("householdId", "policyType", "createdAt");
CREATE INDEX "CalibrationChange_calibrationRunId_idx" ON "CalibrationChange"("calibrationRunId");
CREATE UNIQUE INDEX "Experiment_householdId_key_key" ON "Experiment"("householdId", "key");
CREATE INDEX "Experiment_status_startAt_endAt_idx" ON "Experiment"("status", "startAt", "endAt");

ALTER TABLE "PolicyVersion" ADD CONSTRAINT "PolicyVersion_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PolicyVersion" ADD CONSTRAINT "PolicyVersion_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PolicyVersion" ADD CONSTRAINT "PolicyVersion_parentPolicyVersionId_fkey" FOREIGN KEY ("parentPolicyVersionId") REFERENCES "PolicyVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionEvaluation" ADD CONSTRAINT "DecisionEvaluation_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionEvaluation" ADD CONSTRAINT "DecisionEvaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionEvaluation" ADD CONSTRAINT "DecisionEvaluation_policyVersionId_fkey" FOREIGN KEY ("policyVersionId") REFERENCES "PolicyVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProductQualityMetricSnapshot" ADD CONSTRAINT "ProductQualityMetricSnapshot_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionFeedback" ADD CONSTRAINT "DecisionFeedback_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionFeedback" ADD CONSTRAINT "DecisionFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionFeedback" ADD CONSTRAINT "DecisionFeedback_aiCaptureEventId_fkey" FOREIGN KEY ("aiCaptureEventId") REFERENCES "AiCaptureEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionFeedback" ADD CONSTRAINT "DecisionFeedback_qualityFlagId_fkey" FOREIGN KEY ("qualityFlagId") REFERENCES "TransactionQualityFlag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionFeedback" ADD CONSTRAINT "DecisionFeedback_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "AiRecommendation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionFeedback" ADD CONSTRAINT "DecisionFeedback_policyVersionId_fkey" FOREIGN KEY ("policyVersionId") REFERENCES "PolicyVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CalibrationRun" ADD CONSTRAINT "CalibrationRun_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CalibrationRun" ADD CONSTRAINT "CalibrationRun_policyVersionId_fkey" FOREIGN KEY ("policyVersionId") REFERENCES "PolicyVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CalibrationChange" ADD CONSTRAINT "CalibrationChange_calibrationRunId_fkey" FOREIGN KEY ("calibrationRunId") REFERENCES "CalibrationRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_policyVersionId_fkey" FOREIGN KEY ("policyVersionId") REFERENCES "PolicyVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

## 8. CAMADA DE DADOS E BACKEND

### src/lib/supabase.ts
```ts
não encontrado
```

### src/lib/api.ts
```ts
não encontrado
```

### src/lib/client.ts
```ts
não encontrado
```

### lib/prisma.ts
```ts
import { PrismaClient } from "@prisma/client";
import { getDatabaseDebugInfo, resolveRuntimeDatabaseUrl } from "./database-url";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const { key: runtimeDatabaseUrlKey, url: runtimeDatabaseUrl } =
  resolveRuntimeDatabaseUrl();
const runtimeDatabaseDebugInfo = getDatabaseDebugInfo({
  key: runtimeDatabaseUrlKey,
  url: runtimeDatabaseUrl,
});

process.env.DATABASE_URL = runtimeDatabaseUrl;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: runtimeDatabaseUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

console.info(
  `[prisma] Using ${runtimeDatabaseDebugInfo.key} (${runtimeDatabaseDebugInfo.host}) for database access.`
);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function getRuntimeDatabaseDebugInfo() {
  return runtimeDatabaseDebugInfo;
}
```

### Hooks em src/hooks/ ou hooks/

```text
não encontrado
```

### Variáveis de ambiente referenciadas
```text
não encontrado
```

### .env.example
```bash
# =============================================================================
# CtrlBank - Environment Variables Example
# =============================================================================

# -----------------------------------------------------------------------------
# App / Runtime
# -----------------------------------------------------------------------------
NODE_ENV="development"

# URL pública do app.
# Produção: use a URL do deploy na Vercel (ex: https://ctrlbank.vercel.app)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
APP_BASE_URL="http://localhost:3000"

# -----------------------------------------------------------------------------
# Database / Prisma
# -----------------------------------------------------------------------------
# Produção (Neon via Vercel): use a URL do pooler como DATABASE_URL
# e a URL direta como DATABASE_URL_UNPOOLED / DIRECT_URL.
# Local: postgresql://postgres:password@localhost:5432/ctrlbank?schema=public
DATABASE_URL="postgresql://postgres:password@localhost:5432/ctrlbank?schema=public"

# Conexão direta usada por build/migrations quando necessário.
# Em desenvolvimento local, pode ser igual à DATABASE_URL.
DATABASE_URL_UNPOOLED="postgresql://postgres:password@localhost:5432/ctrlbank?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/ctrlbank?schema=public"

# -----------------------------------------------------------------------------
# Auth / Session
# -----------------------------------------------------------------------------
# Obrigatória: mínimo de 32 caracteres.
# Usada para assinar cookies de sessão com HMAC.
# Gere com:
# node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
SESSION_SECRET="replace_with_at_least_32_random_characters_here"

# Chaves de criptografia do segredo TOTP em repouso.
# Formato: version:base64key[,version2:base64key2]
# Cada chave deve decodificar para 32 bytes (AES-256-GCM).
# Gere com:
# node -e "console.log('v1:'+require('crypto').randomBytes(32).toString('base64'))"
TOTP_ENCRYPTION_KEYS="v1:replace_with_32_bytes_base64_key"

# -----------------------------------------------------------------------------
# Cron Jobs
# -----------------------------------------------------------------------------
# Segredo usado nas rotas protegidas por Bearer token, como:
# - /api/cron/recurring
# - /api/cron/plan-sync
# - /api/cron/export-backlog
CRON_SECRET="replace_with_a_random_secret_string_here"
WAVE5_CALIBRATION_MODE="RECOMMEND_ONLY"
WAVE5_CALIBRATION_MIN_SAMPLE_SIZE="25"
WAVE5_CALIBRATION_MAX_STEP_PCT="0.2"

# Chaves de assinatura de artefatos institucionais (Wave 4).
# Exige exatamente uma key ACTIVE por vez.
# Exemplo:
# [{\"id\":\"k1\",\"algorithm\":\"hmac-sha256\",\"status\":\"ACTIVE\",\"secret\":\"super-secret\"}]
ARTIFACT_SIGNING_KEYRING_JSON="[{\"id\":\"k1\",\"algorithm\":\"hmac-sha256\",\"status\":\"ACTIVE\",\"secret\":\"replace_me\"}]"

# -----------------------------------------------------------------------------
# AI Providers
# -----------------------------------------------------------------------------
# Gemini é o provider principal do AI Composer.
# Obtenha em: https://aistudio.google.com/app/apikey
GEMINI_API_KEY="AIza_your_key_here"

# Opcional: sobrescreve o modelo padrão do Composer.
# Atual padrão no código: gemini-2.5-flash
GEMINI_MODEL="gemini-2.5-flash"

# NVIDIA NIM é opcional e hoje funciona como provider secundário/fallback
# na camada nova de providers.
# Obtenha em: https://build.nvidia.com/
NIM_API_KEY="nvapi-your-key-here"

# Groq permanece opcional para rotas legadas / experimentais.
# Não controla a exibição do AI Composer atual.
GROQ_API_KEY="gsk_your_key_here"
GROQ_MODEL="gemma2-9b-it"

# -----------------------------------------------------------------------------
# Variáveis úteis na Vercel
# -----------------------------------------------------------------------------
# Obrigatórias para o app funcionar em produção:
# - DATABASE_URL
# - DATABASE_URL_UNPOOLED ou DIRECT_URL
# - SESSION_SECRET
# - NEXT_PUBLIC_APP_URL
# - GEMINI_API_KEY
# - CRON_SECRET
#
# Opcionais, mas suportadas pelo código atual:
# - GEMINI_MODEL
# - NIM_API_KEY
# - GROQ_API_KEY
# - GROQ_MODEL

# -----------------------------------------------------------------------------
# Inbox automations (OCR, E-mail, WhatsApp)
# -----------------------------------------------------------------------------
OPENAI_API_KEY="sk-your-openai-key-here"
OPENAI_VISION_MODEL="gpt-4o"
INBOX_CAPTURE_DOMAIN="seudominio.com"
POSTMARK_WEBHOOK_SECRET="replace_with_postmark_webhook_secret"
TWILIO_AUTH_TOKEN="replace_with_twilio_auth_token"
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"
```

## 9. ESTADO DAS SUPERFÍCIES
| Superfície | Existe? | Arquivo principal | Status aparente | Linhas do arquivo principal | Dependências de dados |
|---|---|---|---|---|---|

| Autenticação | sim | `app/login/page.tsx` | integrado ao backend | 289 | `import React, { useState, Suspense } from "react";; import { useRouter, useSearchParams } from "next/navigation";` |

| Home/Início | sim | `app/(dashboard)/page.tsx` | parcial | 13 | `import { validateRequest } from "@/lib/auth";` |

| Saúde Financeira | sim | `app/(dashboard)/saude/page.tsx` | integrado ao backend | 41 | `import { validateRequest } from "@/lib/auth";; import { getHealthScore, getProjection, getConsolidatedBalance, getBurnRate } from "@/app/actions/health";; import { getActiveRecommendations } from "@/app/actions/ai/recommendations";; import { getMemberContributions } from "@/app/actions/household";; import { getFinanceInsights } from "@/app/actions/finance-insights";; import { prisma } from "@/lib/prisma";` |

| Caixa/Fluxo | sim | `app/(dashboard)/caixa/page.tsx` | parcial | 35 | `import { validateRequest } from "@/lib/auth";; import { getCashboxOverview, getCashboxTimeline } from "@/app/actions/cashbox";` |

| Inbox | sim | `app/(dashboard)/inbox/page.tsx` | integrado ao backend | 70 | `import { validateRequest } from "@/lib/auth";; import { prisma } from "@/lib/prisma";` |

| IA/Adviser | sim | `components/chat/AIChatWidget.tsx` | integrado ao backend | 672 | `import React, { useState, useRef, useEffect, useTransition } from "react";; import { getAccounts } from "@/app/actions/accounts";; import { getCategories } from "@/app/actions/categories";; import { getAiCaptureGroup } from "@/app/actions/ai/review";; import { getConversationHistory } from "@/app/actions/ai/conversation";; import { AIComposerBatchDraftItem, AIComposerResponse, AIComposerTransactionDraft, AIComposerMode } from "@/lib/ai/contracts";` |

| Extrato/Transações | sim | `app/(dashboard)/page.tsx` | parcial | 13 | `import { validateRequest } from "@/lib/auth";` |

| Categorização | sim | `app/actions/categories.ts` | integrado ao backend | 130 | `import { prisma } from "@/lib/prisma";; import { validateRequest } from "@/lib/auth";` |

| Faturas de Cartão | sim | `app/actions/accounts.ts` | integrado ao backend | 245 | `import { prisma } from "@/lib/prisma";; import { requireWriteContext, ServiceUnavailableError } from "@/lib/security/auth-context";; import { scopeWhere } from "@/lib/security/scope";` |

| Metas | sim | `app/(dashboard)/metas/page.tsx` | integrado ao backend | 33 | `import { validateRequest } from "@/lib/auth";; import { prisma } from "@/lib/prisma";; import { getGoals } from "@/app/actions/goals";` |

| Relatórios | sim | `app/(dashboard)/relatorios/page.tsx` | parcial | 59 | `import { validateRequest } from "@/lib/auth";; import { getMonthlyEvolution, getTransactions } from "@/app/actions/transactions";; import { getCategories } from "@/app/actions/categories";; import { getAccounts } from "@/app/actions/accounts";; import { getHouseholdMembers } from "@/app/actions/household";; import { getMonthBoundsUtc } from "@/lib/finance/period";` |

| Onboarding | sim | `app/register/page.tsx` | integrado ao backend | 271 | `import React, { useState } from "react";; import { useRouter } from "next/navigation";` |

| Perfil/Configurações | sim | `app/(dashboard)/configuracoes/page.tsx` | parcial | 113 | `} from "@/app/actions/inbox";` |

## 10. QUALIDADE E CONFIGURAÇÃO
### ESLint

#### eslint.config.mjs
```mjs
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
```

### Prettier

```text
não encontrado
```

### Husky / lint-staged
```text
husky:
não encontrado

lint-staged (arquivos de config):
package.json
```

### Vitest / Jest / Playwright - testes existentes

#### __tests__/artifact-signing.test.ts
```text
"uses the active key for new signatures", () => {
"retired key still verifies historical signature", () => {
"revoked key produces explicit revoked status", () => {
"canonical payload is deterministic", () => {
"requires exactly one active key", () => {
```

#### __tests__/calibration-service.test.ts
```text
"does not apply when sample size is insufficient", async () => {
"recommend-only mode does not create policy version", async () => {
"apply mode enforces bounded step and persists change", async () => {
```

#### __tests__/checksum-signing.test.ts
```text
"creates deterministic sha256 from canonical text", () => {
"detects tampering in sealed payload", () => {
```

#### __tests__/database-url.test.ts
```text
"prefers the Vercel Prisma URL when available", () => {
"prefers DATABASE_URL over direct connections for runtime", () => {
"falls back to the unpooled URL when pooled envs are absent", () => {
"throws a helpful error when no database URL exists", () => {
"prefers DIRECT_URL for migrations", () => {
"falls back to POSTGRES_URL_NON_POOLING before DATABASE_URL", () => {
```

#### __tests__/experiments-service.test.ts
```text
"honors allocation strategy", async () => {
"kill switch disables experiment", async () => {
```

#### __tests__/finance-kernel-invariants.test.ts
```text
"keeps accounting balance and net position explicit for credit accounts", () => {
"computes net as income - expense and ignores transfer/pending/ignored entries", () => {
"builds UTC month bounds deterministically", () => {
```

#### __tests__/finance-utils.test.ts
```text
"formats zero correctly", () => {
"formats positive value", () => {
"formats negative value", () => {
"returns 0 when target is 0", () => {
"returns 50 when halfway", () => {
"caps at 100 when exceeded", () => {
"returns 100 when exactly at target", () => {
"adds 1 day for DAILY", () => {
"adds 7 days for WEEKLY", () => {
"adds 14 days for BIWEEKLY", () => {
"advances 1 month for MONTHLY", () => {
"advances 3 months for QUARTERLY", () => {
"advances 1 year for YEARLY", () => {
"does not mutate the original date", () => {
"accepts 6-digit code", () => {
"123456")).toBe(true);
"rejects fewer than 6 digits", () => {
"12345")).toBe(false);
"rejects more than 6 digits", () => {
"1234567")).toBe(false);
```

#### __tests__/inbox-parser.test.ts
```text
"extracts expense rows from statement text", () => {
"infers income with transfer keywords", () => {
"ignores lines without BRL currency pattern", () => {
"maps parsed items into persisted transaction shape", () => {
```

#### __tests__/inbox-processing-state.test.ts
```text
"requires review when parse produced no candidates", () => {
"requires review when duplicate already committed", () => {
"supports idempotent confirm", () => {
```

#### __tests__/policy-engine.test.ts
```text
"resolves defaults when no active policy exists", async () => {
"activates a policy version and retires prior one", async () => {
"rolls back to previous retired version", async () => {
```

#### __tests__/quality-feedback-evaluation.test.ts
```text
"persists explicit and inferred feedback", async () => {
"creates deterministic evaluation records", async () => {
```

#### __tests__/quality-metrics.test.ts
```text
"computes and persists key metrics", async () => {
"handles legacy null/empty data without crashing", async () => {
```

#### __tests__/quota-service.test.ts
```text
"passes when usage is below limit", async () => {
"blocks when hard limit exceeded", async () => {
"handles legacy null telemetry without crash", async () => {
```

#### __tests__/scope-kernel.test.ts
```text
"uses user scope when no household", () => {
"uses household scope when household exists", () => {
```

#### __tests__/security-crypto.test.ts
```text
"encrypts and decrypts a TOTP secret", () => {
"hashes opaque tokens deterministically", () => {
```

#### __tests__/session-utils.test.ts
```text
"produces a 64-char hex SHA-256 digest", () => {
"is deterministic — same input yields same hash", () => {
"two different tokens produce different hashes", () => {
"returns a string containing the original token followed by a signature", async () => {
"throws when SESSION_SECRET is absent", async () => {
"throws when SESSION_SECRET is shorter than 32 characters", async () => {
"produces a different signature for each unique token", async () => {
"returns the original token for a correctly signed value", async () => {
"round-trips correctly: sign → verify === token", async () => {
"returns null for a tampered signature", async () => {
"returns null for a tampered token body (signature mismatch)", async () => {
"returns null when SESSION_SECRET is absent", async () => {
"returns null when SESSION_SECRET is too short", async () => {
"returns null when verified with a different secret", async () => {
"returns null for a cookie value with no dot separator", async () => {
"returns null for an empty string", async () => {
"returns null for a value with only a signature (empty token part)", async () => {
```

#### __tests__/totp-helper.test.ts
```text
"passes when 2FA is disabled", async () => {
"validates encrypted secret", async () => {
```

#### __tests__/transaction-schema.test.ts
```text
"parses a valid row", () => {
"rejects negative amount", () => {
"rejects description longer than 200 chars", () => {
"rejects invalid type", () => {
"coerces date string to Date object", () => {
"defaults status to COMPLETED when omitted", () => {
"accepts explicit PENDING status", () => {
"accepts valid values", () => {
"rejects invalid values", () => {
```

#### __tests__/wave5-automation.test.ts
```text
"runs idempotent metric/calibration generation and logs success", async () => {
"detects representative regression", async () => {
```

### .github/workflows
```text
.github/workflows/ci.yml
```

#### .github/workflows/ci.yml
```yaml
name: ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
        env:
          DATABASE_URL: postgresql://placeholder:placeholder@127.0.0.1:5432/ctrlbank
          SESSION_SECRET: test_test_test_test_test_test_test_test
          TOTP_ENCRYPTION_KEYS: v1:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
```

### README.md
```md
CtrlBank: sistema de governança da saúde financeira familiar.

O CtrlBank não registra gastos. Ele governa a saúde financeira da família.
```

### Warnings/erros: tsc --noEmit (até 100 linhas)
```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
__tests__/quota-service.test.ts(45,14): error TS18048: 'result.report' is possibly 'undefined'.
__tests__/quota-service.test.ts(46,14): error TS18048: 'result.report' is possibly 'undefined'.
app/(dashboard)/processamentos/page.tsx(44,12): error TS2339: Property 'signedArtifact' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/(dashboard)/processamentos/page.tsx(49,12): error TS2339: Property 'householdQuota' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/(dashboard)/processamentos/page.tsx(52,12): error TS2339: Property 'automationJobRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/(dashboard)/processamentos/page.tsx(57,12): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/(dashboard)/processamentos/page.tsx(62,12): error TS2339: Property 'calibrationRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/(dashboard)/processamentos/page.tsx(67,12): error TS2339: Property 'experiment' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/(dashboard)/processamentos/page.tsx(72,12): error TS2339: Property 'productQualityMetricSnapshot' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/(dashboard)/processamentos/page.tsx(80,23): error TS7006: Parameter 'quota' implicitly has an 'any' type.
app/(dashboard)/processamentos/page.tsx(158,29): error TS7006: Parameter 'artifact' implicitly has an 'any' type.
app/(dashboard)/processamentos/page.tsx(174,30): error TS7006: Parameter 'row' implicitly has an 'any' type.
app/(dashboard)/processamentos/page.tsx(190,22): error TS7006: Parameter 'job' implicitly has an 'any' type.
app/(dashboard)/processamentos/page.tsx(205,34): error TS7006: Parameter 'metric' implicitly has an 'any' type.
app/(dashboard)/processamentos/page.tsx(218,32): error TS7006: Parameter 'policy' implicitly has an 'any' type.
app/(dashboard)/processamentos/page.tsx(237,30): error TS7006: Parameter 'run' implicitly has an 'any' type.
app/(dashboard)/processamentos/page.tsx(246,29): error TS7006: Parameter 'experiment' implicitly has an 'any' type.
app/api/governance/summary/route.ts(14,12): error TS2339: Property 'signedArtifact' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/api/governance/summary/route.ts(15,12): error TS2339: Property 'householdQuota' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/api/governance/summary/route.ts(16,12): error TS2339: Property 'automationJobRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/api/governance/summary/route.ts(17,12): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/api/governance/summary/route.ts(18,12): error TS2339: Property 'calibrationRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/api/governance/summary/route.ts(19,12): error TS2339: Property 'experiment' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/api/governance/summary/route.ts(20,12): error TS2339: Property 'productQualityMetricSnapshot' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/api/governance/summary/route.ts(24,30): error TS7006: Parameter 'policy' implicitly has an 'any' type.
lib/artifacts/service.ts(2,10): error TS2305: Module '"@prisma/client"' has no exported member 'SignedArtifactType'.
lib/artifacts/service.ts(31,35): error TS2339: Property 'signedArtifact' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/artifacts/service.ts(49,17): error TS2339: Property 'signedArtifact' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/artifacts/service.ts(83,33): error TS2339: Property 'signedArtifact' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/automation/wave4.ts(1,10): error TS2305: Module '"@prisma/client"' has no exported member 'AutomationJobStatus'.
lib/automation/wave4.ts(15,17): error TS2339: Property 'automationJobRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/automation/wave4.ts(56,42): error TS2339: Property 'householdQuota' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/automation/wave5.ts(1,10): error TS2305: Module '"@prisma/client"' has no exported member 'AutomationJobStatus'.
lib/automation/wave5.ts(1,31): error TS2305: Module '"@prisma/client"' has no exported member 'CalibrationMode'.
lib/automation/wave5.ts(11,17): error TS2339: Property 'automationJobRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/automation/wave5.ts(56,22): error TS2339: Property 'decisionEvaluation' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(1,10): error TS2305: Module '"@prisma/client"' has no exported member 'CalibrationMode'.
lib/calibration/service.ts(1,27): error TS2305: Module '"@prisma/client"' has no exported member 'PolicyStatus'.
lib/calibration/service.ts(20,31): error TS2339: Property 'calibrationRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(26,19): error TS2339: Property 'calibrationRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(38,32): error TS2339: Property 'decisionEvaluation' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(48,19): error TS2339: Property 'calibrationRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(61,41): error TS7006: Parameter 's' implicitly has an 'any' type.
lib/calibration/service.ts(62,40): error TS7006: Parameter 's' implicitly has an 'any' type.
lib/calibration/service.ts(76,40): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(81,31): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(98,28): error TS2339: Property 'calibrationRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(112,16): error TS2339: Property 'calibrationChange' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/experiments/service.ts(1,10): error TS2305: Module '"@prisma/client"' has no exported member 'ExperimentStatus'.
lib/experiments/service.ts(6,35): error TS2339: Property 'experiment' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/experiments/service.ts(28,17): error TS2339: Property 'experiment' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/policy/engine.ts(1,10): error TS2305: Module '"@prisma/client"' has no exported member 'PolicyStatus'.
lib/policy/engine.ts(16,23): error TS2724: '"/workspace/ctrlbank/node_modules/.prisma/client/index".Prisma' has no exported member named 'PolicyVersionWhereInput'. Did you mean 'AiConversationWhereInput'?
lib/policy/engine.ts(22,31): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/policy/engine.ts(40,31): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/policy/engine.ts(44,14): error TS2339: Property 'policyVersion' does not exist on type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">'.
lib/policy/engine.ts(54,15): error TS2339: Property 'policyVersion' does not exist on type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">'.
lib/policy/engine.ts(66,32): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/policy/engine.ts(71,33): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/policy/engine.ts(85,16): error TS2339: Property 'policyVersion' does not exist on type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">'.
lib/policy/engine.ts(87,15): error TS2339: Property 'policyVersion' does not exist on type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">'.
lib/quality/evaluation.ts(1,10): error TS2305: Module '"@prisma/client"' has no exported member 'EvaluationResult'.
lib/quality/evaluation.ts(22,17): error TS2339: Property 'decisionEvaluation' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/quality/feedback.ts(19,17): error TS2339: Property 'decisionFeedback' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/quality/metrics.ts(1,10): error TS2305: Module '"@prisma/client"' has no exported member 'MetricPeriodType'.
lib/quality/metrics.ts(9,12): error TS2339: Property 'decisionFeedback' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/quality/metrics.ts(10,12): error TS2339: Property 'decisionEvaluation' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/quality/metrics.ts(16,37): error TS7006: Parameter 'f' implicitly has an 'any' type.
lib/quality/metrics.ts(17,37): error TS7006: Parameter 'f' implicitly has an 'any' type.
lib/quality/metrics.ts(18,39): error TS7006: Parameter 'f' implicitly has an 'any' type.
lib/quality/metrics.ts(20,41): error TS7006: Parameter 'e' implicitly has an 'any' type.
lib/quality/metrics.ts(21,48): error TS7006: Parameter 'f' implicitly has an 'any' type.
lib/quality/metrics.ts(22,36): error TS7006: Parameter 'f' implicitly has an 'any' type.
lib/quality/metrics.ts(23,51): error TS7006: Parameter 'f' implicitly has an 'any' type.
lib/quality/metrics.ts(24,42): error TS7006: Parameter 'l' implicitly has an 'any' type.
lib/quality/metrics.ts(25,40): error TS7006: Parameter 'l' implicitly has an 'any' type.
lib/quality/metrics.ts(26,40): error TS7006: Parameter 'e' implicitly has an 'any' type.
lib/quality/metrics.ts(27,38): error TS7006: Parameter 'e' implicitly has an 'any' type.
lib/quality/metrics.ts(55,16): error TS2339: Property 'productQualityMetricSnapshot' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/quotas/service.ts(1,10): error TS2305: Module '"@prisma/client"' has no exported member 'QuotaPeriodType'.
lib/quotas/service.ts(22,30): error TS2339: Property 'householdQuota' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
```

### Warnings/erros: eslint . (até 100 linhas)
```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

/workspace/ctrlbank/app/(dashboard)/DashboardPageClient.tsx
    7:11  warning  'TrendingUp' is defined but never used           @typescript-eslint/no-unused-vars
   12:18  warning  'Line' is defined but never used                 @typescript-eslint/no-unused-vars
  100:9   warning  'isPositive' is assigned a value but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/app/(dashboard)/contas/ContasPageClient.tsx
    7:3   warning  'MoreVertical' is defined but never used        @typescript-eslint/no-unused-vars
  217:10  warning  'menuOpen' is assigned a value but never used   @typescript-eslint/no-unused-vars
  218:10  warning  'isPending' is assigned a value but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/app/(dashboard)/familia/FamiliaPageClient.tsx
    8:13  warning  'Share2' is defined but never used             @typescript-eslint/no-unused-vars
  157:9   warning  'canWrite' is assigned a value but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/app/(dashboard)/metas/MetasPageClient.tsx
  248:10  warning  'isPending' is assigned a value but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/app/(dashboard)/relatorios/RelatoriosPageClient.tsx
  221:5   warning  Expected an assignment or function call and instead saw an expression  @typescript-eslint/no-unused-expressions
  236:73  warning  'categories' is defined but never used                                 @typescript-eslint/no-unused-vars

/workspace/ctrlbank/app/(dashboard)/saude/SaudePageClient.tsx
  5:79  warning  'ArrowRight' is defined but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/app/actions/counter.ts
   3:10  warning  'z' is defined but never used    @typescript-eslint/no-unused-vars
  45:12  warning  'err' is defined but never used  @typescript-eslint/no-unused-vars
  66:12  warning  'err' is defined but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/app/actions/recurring.ts
  103:12  warning  'err' is defined but never used            @typescript-eslint/no-unused-vars
  153:15  warning  'desc' is assigned a value but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/app/api/ai/composer/route.ts
  43:74  warning  'createProductFeedback' is assigned a value but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/app/api/health/projection/route.ts
  7:27  warning  'request' is defined but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/app/api/health/recommendations/generate/route.ts
  8:28  warning  'request' is defined but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/app/api/health/score/route.ts
  2:10  warning  'prisma' is defined but never used   @typescript-eslint/no-unused-vars
  8:27  warning  'request' is defined but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/app/contador/[token]/ContadorPublicClient.tsx
   4:26  warning  'formatDate' is defined but never used                                 @typescript-eslint/no-unused-vars
  91:7   warning  Expected an assignment or function call and instead saw an expression  @typescript-eslint/no-unused-expressions

/workspace/ctrlbank/components/chat/AICards.tsx
  218:33  warning  'planId' is defined but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/components/chat/AIChatWidget.tsx
   58:10  warning  'isPending' is assigned a value but never used                                                                                           @typescript-eslint/no-unused-vars
  150:6   warning  React Hook useEffect has missing dependencies: 'accounts.length' and 'fetchHistory'. Either include them or remove the dependency array  react-hooks/exhaustive-deps
  239:14  warning  'err' is defined but never used                                                                                                          @typescript-eslint/no-unused-vars

/workspace/ctrlbank/components/ui/CurrencyInput.tsx
  4:10  warning  'formatCurrency' is defined but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/components/ui/ReceiptScanButton.tsx
  126:13  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

/workspace/ctrlbank/lib/ai/csv-pdf-parser.ts
  18:17  warning  '_' is defined but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/lib/ai/providers/gemini.ts
  15:12  warning  'capability' is defined but never used  @typescript-eslint/no-unused-vars
  15:38  warning  'hasMedia' is defined but never used    @typescript-eslint/no-unused-vars

/workspace/ctrlbank/lib/ai/providers/nvidia.ts
  75:28  warning  'prompt' is defined but never used  @typescript-eslint/no-unused-vars
  75:44  warning  'media' is defined but never used   @typescript-eslint/no-unused-vars
  75:64  warning  'opts' is defined but never used    @typescript-eslint/no-unused-vars

/workspace/ctrlbank/lib/ai/providers/utils.ts
  20:12  warning  'e' is defined but never used           @typescript-eslint/no-unused-vars
  35:14  warning  'finalError' is defined but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/lib/finance/core.ts
  1:10  warning  'TransactionType' is defined but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/lib/inbox/deterministic.ts
  1:10  warning  'AIComposerBatchDraftItem' is defined but never used  @typescript-eslint/no-unused-vars

/workspace/ctrlbank/postcss.config.mjs
  2:1  warning  Assign object to a variable before exporting as module default  import/no-anonymous-default-export

/workspace/ctrlbank/scripts/build.mjs
  69:10  warning  'resolveDatabaseUrl' is defined but never used  @typescript-eslint/no-unused-vars

✖ 42 problems (0 errors, 42 warnings)
```

## 11. DÍVIDA TÉCNICA VISÍVEL
### TODO/FIXME/HACK/XXX
```text
não encontrado
```

### `any` explícito em .ts/.tsx (top 10)
```text
não encontrado
```

### `console.log`/`console.error` (top 10)
```text
não encontrado
```

### Imports não utilizados (eslint)
```text
    7:11  warning  'TrendingUp' is defined but never used           @typescript-eslint/no-unused-vars
   12:18  warning  'Line' is defined but never used                 @typescript-eslint/no-unused-vars
  100:9   warning  'isPositive' is assigned a value but never used  @typescript-eslint/no-unused-vars
    7:3   warning  'MoreVertical' is defined but never used        @typescript-eslint/no-unused-vars
  217:10  warning  'menuOpen' is assigned a value but never used   @typescript-eslint/no-unused-vars
  218:10  warning  'isPending' is assigned a value but never used  @typescript-eslint/no-unused-vars
    8:13  warning  'Share2' is defined but never used             @typescript-eslint/no-unused-vars
  157:9   warning  'canWrite' is assigned a value but never used  @typescript-eslint/no-unused-vars
  248:10  warning  'isPending' is assigned a value but never used  @typescript-eslint/no-unused-vars
  236:73  warning  'categories' is defined but never used                                 @typescript-eslint/no-unused-vars
  5:79  warning  'ArrowRight' is defined but never used  @typescript-eslint/no-unused-vars
   3:10  warning  'z' is defined but never used    @typescript-eslint/no-unused-vars
  45:12  warning  'err' is defined but never used  @typescript-eslint/no-unused-vars
  66:12  warning  'err' is defined but never used  @typescript-eslint/no-unused-vars
  103:12  warning  'err' is defined but never used            @typescript-eslint/no-unused-vars
  153:15  warning  'desc' is assigned a value but never used  @typescript-eslint/no-unused-vars
  43:74  warning  'createProductFeedback' is assigned a value but never used  @typescript-eslint/no-unused-vars
  7:27  warning  'request' is defined but never used  @typescript-eslint/no-unused-vars
  8:28  warning  'request' is defined but never used  @typescript-eslint/no-unused-vars
  2:10  warning  'prisma' is defined but never used   @typescript-eslint/no-unused-vars
  8:27  warning  'request' is defined but never used  @typescript-eslint/no-unused-vars
   4:26  warning  'formatDate' is defined but never used                                 @typescript-eslint/no-unused-vars
  218:33  warning  'planId' is defined but never used  @typescript-eslint/no-unused-vars
   58:10  warning  'isPending' is assigned a value but never used                                                                                           @typescript-eslint/no-unused-vars
  239:14  warning  'err' is defined but never used                                                                                                          @typescript-eslint/no-unused-vars
  4:10  warning  'formatCurrency' is defined but never used  @typescript-eslint/no-unused-vars
  18:17  warning  '_' is defined but never used  @typescript-eslint/no-unused-vars
  15:12  warning  'capability' is defined but never used  @typescript-eslint/no-unused-vars
  15:38  warning  'hasMedia' is defined but never used    @typescript-eslint/no-unused-vars
  75:28  warning  'prompt' is defined but never used  @typescript-eslint/no-unused-vars
  75:44  warning  'media' is defined but never used   @typescript-eslint/no-unused-vars
  75:64  warning  'opts' is defined but never used    @typescript-eslint/no-unused-vars
  20:12  warning  'e' is defined but never used           @typescript-eslint/no-unused-vars
  35:14  warning  'finalError' is defined but never used  @typescript-eslint/no-unused-vars
  1:10  warning  'TransactionType' is defined but never used  @typescript-eslint/no-unused-vars
  1:10  warning  'AIComposerBatchDraftItem' is defined but never used  @typescript-eslint/no-unused-vars
  69:10  warning  'resolveDatabaseUrl' is defined but never used  @typescript-eslint/no-unused-vars
```

### Componentes com mais de 300 linhas
```text
components/chat/AIChatWidget.tsx (672 linhas)
components/layout/DashboardLayoutClient.tsx (354 linhas)
```

## 12. MÉTRICAS GERAIS

- Total de arquivos `.ts`: `142`
- Total de arquivos `.tsx`: `50`

### Total de linhas de código (excluindo node_modules/dist/coverage)
```text
   37909 total
```

### Tamanho do bundle (dist/.next)
```bash
43M	.next
```

### Saída `npm run build`
```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> ctrlbank@0.1.0 build
> node scripts/build.mjs

[build] Missing database URL for migration. Skipping Prisma migrate deploy. Set one of: DIRECT_URL, DATABASE_URL_UNPOOLED, POSTGRES_URL_NON_POOLING, POSTGRES_PRISMA_URL, DATABASE_URL, POSTGRES_URL.
[build] Missing database URL for runtime. Continuing Next.js build without DATABASE_URL. Set one of: POSTGRES_PRISMA_URL, DATABASE_URL, POSTGRES_URL, DATABASE_URL_UNPOOLED, DIRECT_URL, POSTGRES_URL_NON_POOLING.
[build] Injected placeholder DATABASE_URL for static build-time imports.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
Attention: Next.js now collects completely anonymous telemetry regarding usage.
This information is used to shape Next.js' roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://nextjs.org/telemetry

▲ Next.js 16.2.3 (Turbopack)
- Experiments (use with caution):
  · optimizePackageImports

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...
✓ Compiled successfully in 17.8s
  Running TypeScript ...
Failed to type check.

./app/(dashboard)/processamentos/page.tsx:44:12
Type error: Property 'signedArtifact' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.

  [90m42 |[0m
  [90m43 |[0m   [36mconst[0m [artifacts, quotas, jobs, activePolicies, calibrations, experiments, qualityMetric...
[31m[1m>[0m [90m44 |[0m     prisma.signedArtifact.findMany({
  [90m   |[0m            [31m[1m^[0m
  [90m45 |[0m       where: { householdId: dbUser?.householdId ?? [36mundefined[0m },
  [90m46 |[0m       orderBy: { createdAt: [32m"desc"[0m },
  [90m47 |[0m       take: [35m10[0m,
Next.js build worker exited with code: 1 and signal: null
[build] Failed to prepare Prisma database URL. Error: npx next build exited with code 1.
    at ChildProcess.<anonymous> (file:///workspace/ctrlbank/scripts/build.mjs:129:21)
    at ChildProcess.emit (node:events:519:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12) {
  stdout: 'Attention: Next.js now collects completely anonymous telemetry regarding usage.\n' +
    "This information is used to shape Next.js' roadmap and prioritize features.\n" +
    "You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:\n" +
    'https://nextjs.org/telemetry\n' +
    '\n' +
    '▲ Next.js 16.2.3 (Turbopack)\n' +
    '- Experiments (use with caution):\n' +
    '  · optimizePackageImports\n' +
    '\n' +
    '  Creating an optimized production build ...\n' +
    '✓ Compiled successfully in 17.8s\n' +
    '  Running TypeScript ...\n',
  stderr: 'npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.\n' +
    '⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy\n' +
    'Failed to type check.\n' +
    '\n' +
    './app/(dashboard)/processamentos/page.tsx:44:12\n' +
    "Type error: Property 'signedArtifact' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.\n" +
    '\n' +
    '  \x1B[90m42 |\x1B[0m\n' +
    '  \x1B[90m43 |\x1B[0m   \x1B[36mconst\x1B[0m [artifacts, quotas, jobs, activePolicies, calibrations, experiments, qualityMetric...\n' +
    '\x1B[31m\x1B[1m>\x1B[0m \x1B[90m44 |\x1B[0m     prisma.signedArtifact.findMany({\n' +
    '  \x1B[90m   |\x1B[0m            \x1B[31m\x1B[1m^\x1B[0m\n' +
    '  \x1B[90m45 |\x1B[0m       where: { householdId: dbUser?.householdId ?? \x1B[36mundefined\x1B[0m },\n' +
    '  \x1B[90m46 |\x1B[0m       orderBy: { createdAt: \x1B[32m"desc"\x1B[0m },\n' +
    '  \x1B[90m47 |\x1B[0m       take: \x1B[35m10\x1B[0m,\n' +
    'Next.js build worker exited with code: 1 and signal: null\n'
}
```

- Tamanho do repositório: `1163 MB`
