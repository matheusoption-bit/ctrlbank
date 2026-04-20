# AUDIT_CTRLBANK

## 1. IDENTIDADE DO PROJETO

### package.json
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

### Última data de commit no main/master
```bash
fatal: ambiguous argument 'main': unknown revision or path not in the working tree.
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'
fatal: ambiguous argument 'master': unknown revision or path not in the working tree.
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'
```

### Total de commits
```bash
177
```

### Branches existentes
```bash
* work
```

### Autores nos commits
```bash
Claude
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

### Package manager detectado (lockfile)
```text
package-lock.json encontrado
```

### Node version (.nvmrc / engines / .tool-versions)
```text
.nvmrc: não encontrado
package.json engines: não encontrado
.tool-versions: não encontrado
```

### tsconfig.json (completo)
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

### tailwind.config.ts (completo)
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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--bg-elevated))",
        "surface-2": "hsl(var(--bg-elevated-2))",
        "surface-3": "hsl(var(--bg-elevated-3))",
        secondary: "hsl(var(--fg-muted))",
        border: "hsl(var(--border))",
        "border-strong": "hsl(var(--border-strong))",

        "accent-primary": "hsl(var(--accent))",
        "accent-warning": "hsl(var(--warning))",
        "accent-danger": "hsl(var(--negative))",

        primary: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        positive: "hsl(var(--positive))",
        negative: "hsl(var(--negative))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",
        success: "hsl(var(--positive))",
        danger: "hsl(var(--negative))",

        card: { DEFAULT: "hsl(var(--bg-elevated))", foreground: "hsl(var(--foreground))" },
        popover: { DEFAULT: "hsl(var(--bg-elevated-2))", foreground: "hsl(var(--foreground))" },
        muted: { DEFAULT: "hsl(var(--bg-elevated-3))", foreground: "hsl(var(--fg-muted))" },
        destructive: { DEFAULT: "hsl(var(--negative))", foreground: "hsl(var(--foreground))" },
        input: "hsl(var(--bg-elevated-2))",
        ring: "hsl(var(--accent))",
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
        "glow-primary":  "0 0 20px hsl(var(--accent) / 0.3)",
        "glow-positive": "0 0 20px hsl(var(--positive) / 0.3)",
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
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--accent) / 0)" },
          "50%":      { boxShadow: "0 0 0 8px hsl(var(--accent) / 0.15)" },
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

### vite.config.ts ou next.config.js (literal, se existir)
```text
vite.config.ts: não encontrado
next.config.js: não encontrado
next.config.mjs: encontrado
```
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

### postcss.config.js (completo)
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### components.json (completo)
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

### Comando solicitado
```bash
tree -L 4 -I 'node_modules|.git|dist|build|.next|coverage'
/bin/bash: line 1: tree: command not found
```

### Equivalente manual (até 2 níveis na raiz e até 4 níveis em app/components/lib/prisma/scripts/.github)
```text
# root depth2
.
.env.example
.github
.github/workflows
.gitignore
AUDIT_CTRLBANK.md
Dockerfile
README.md
__tests__
__tests__/artifact-signing.test.ts
__tests__/calibration-service.test.ts
__tests__/checksum-signing.test.ts
__tests__/database-url.test.ts
__tests__/experiments-service.test.ts
__tests__/finance-kernel-invariants.test.ts
__tests__/finance-utils.test.ts
__tests__/inbox-parser.test.ts
__tests__/inbox-processing-state.test.ts
__tests__/policy-engine.test.ts
__tests__/quality-feedback-evaluation.test.ts
__tests__/quality-metrics.test.ts
__tests__/quota-service.test.ts
__tests__/scope-kernel.test.ts
__tests__/security-crypto.test.ts
__tests__/session-utils.test.ts
__tests__/totp-helper.test.ts
__tests__/transaction-schema.test.ts
__tests__/wave5-automation.test.ts
app
app/(dashboard)
app/actions
app/api
app/contador
app/globals.css
app/layout.tsx
app/login
app/manifest.ts
app/register
app/share
app/verify
build-output.log
components
components.json
components/charts
components/chat
components/finance
components/layout
components/ui
docker-compose.yml
docs
docs/auditoria-tecnica-2026-04-17.md
docs/estrategia_operacional_ctrlbank.md
docs/financial-policy.md
docs/full-red-team-audit-2026-04-19.md
docs/invariant-tests.md
docs/scope-kernel-policy.md
docs/wave2-financial-data-system.md
docs/wave4-operational-scale.md
docs/wave5-continuous-optimization.md
eslint.config.mjs
fresh-build.log
lib
lib/actions
lib/ai
lib/artifacts
lib/auth.ts
lib/authorization.ts
lib/automation
lib/calibration
lib/constants.ts
lib/copy
lib/database-url.ts
lib/experiments
lib/finance
lib/format.ts
lib/inbox
lib/policy
lib/prisma.ts
lib/quality
lib/quotas
lib/security
lib/session-utils.ts
lib/utils.ts
middleware.ts
next-env.d.ts
next.config.mjs
package-lock.json
package.json
postcss.config.js
postcss.config.mjs
prisma
prisma/migrations
prisma/schema.prisma
public
public/sw.js
scripts
scripts/backfill-totp-secrets.ts
scripts/build.mjs
scripts/cli
scripts/generate-backlog.ts
tailwind.config.ts
tsconfig.json
vercel.json
vitest.config.ts

# app/components depth4
.github
.github/workflows
.github/workflows/ci.yml
app
app/(dashboard)
app/(dashboard)/InicioPageClient.tsx
app/(dashboard)/buscar
app/(dashboard)/buscar/page.tsx
app/(dashboard)/caixa
app/(dashboard)/caixa/CaixaPageClient.tsx
app/(dashboard)/caixa/page.tsx
app/(dashboard)/categorias
app/(dashboard)/categorias/CategoriasPageClient.tsx
app/(dashboard)/categorias/page.tsx
app/(dashboard)/categorias/revisar
app/(dashboard)/categorias/revisar/RevisarPageClient.tsx
app/(dashboard)/categorias/revisar/page.tsx
app/(dashboard)/configuracoes
app/(dashboard)/configuracoes/page.tsx
app/(dashboard)/contas
app/(dashboard)/contas/ContasPageClient.tsx
app/(dashboard)/contas/page.tsx
app/(dashboard)/familia
app/(dashboard)/familia/FamiliaPageClient.tsx
app/(dashboard)/familia/page.tsx
app/(dashboard)/fluxo
app/(dashboard)/fluxo/FluxoPageClient.tsx
app/(dashboard)/fluxo/page.tsx
app/(dashboard)/inbox
app/(dashboard)/inbox/InboxPageClient.tsx
app/(dashboard)/inbox/history
app/(dashboard)/inbox/history/page.tsx
app/(dashboard)/inbox/page.tsx
app/(dashboard)/layout.tsx
app/(dashboard)/loading.tsx
app/(dashboard)/metas
app/(dashboard)/metas/MetasPageClient.tsx
app/(dashboard)/metas/page.tsx
app/(dashboard)/page.tsx
app/(dashboard)/processamentos
app/(dashboard)/processamentos/page.tsx
app/(dashboard)/relatorios
app/(dashboard)/relatorios/RelatoriosPageClient.tsx
app/(dashboard)/relatorios/page.tsx
app/(dashboard)/saude
app/(dashboard)/saude/SaudePageClient.tsx
app/(dashboard)/saude/page.tsx
app/actions
app/actions/2fa.ts
app/actions/accounts.ts
app/actions/ai
app/actions/ai/conversation.ts
app/actions/ai/recommendations.ts
app/actions/ai/review.ts
app/actions/budgets.ts
app/actions/cashbox.ts
app/actions/categories.ts
app/actions/counter.ts
app/actions/finance-insights.ts
app/actions/fluxo.ts
app/actions/goals.ts
app/actions/governance.ts
app/actions/health.ts
app/actions/household.ts
app/actions/inbox.ts
app/actions/recurring.ts
app/actions/transactions.ts
app/api
app/api/ai
app/api/ai/chat
app/api/ai/chat/route.ts
app/api/ai/composer
app/api/ai/composer/route.ts
app/api/artifacts
app/api/artifacts/monthly-dossier
app/api/artifacts/monthly-dossier/route.ts
app/api/artifacts/verify
app/api/artifacts/verify/[token]
app/api/auth
app/api/auth/login
app/api/auth/login/route.ts
app/api/auth/logout
app/api/auth/logout/route.ts
app/api/auth/register
app/api/auth/register/route.ts
app/api/auth/verify-2fa
app/api/auth/verify-2fa/route.ts
app/api/cron
app/api/cron/export-backlog
app/api/cron/export-backlog/route.ts
app/api/cron/plan-sync
app/api/cron/plan-sync/route.ts
app/api/cron/recurring
app/api/cron/recurring/route.ts
app/api/cron/wave4
app/api/cron/wave4/route.ts
app/api/cron/wave5
app/api/cron/wave5/route.ts
app/api/familia
app/api/familia/monthly-summary
app/api/familia/monthly-summary/route.ts
app/api/governance
app/api/governance/summary
app/api/governance/summary/route.ts
app/api/health
app/api/health/projection
app/api/health/projection/route.ts
app/api/health/recommendations
app/api/health/recommendations/generate
app/api/health/score
app/api/health/score/route.ts
app/api/inbox
app/api/inbox/confirm
app/api/inbox/confirm/route.ts
app/api/inbox/email-webhook
app/api/inbox/email-webhook/route.ts
app/api/inbox/parse
app/api/inbox/parse/route.ts
app/api/inbox/whatsapp-link
app/api/inbox/whatsapp-link/route.ts
app/api/inbox/whatsapp-webhook
app/api/inbox/whatsapp-webhook/route.ts
app/api/invite
app/api/invite/[inviteCode]
app/api/invite/[inviteCode]/route.ts
app/api/receipt-scan
app/api/receipt-scan/route.ts
app/contador
app/contador/[token]
app/contador/[token]/ContadorPublicClient.tsx
app/contador/[token]/page.tsx
app/globals.css
app/layout.tsx
app/login
app/login/page.tsx
app/manifest.ts
app/register
app/register/page.tsx
app/share
app/share/route.ts
app/verify
app/verify/[token]
app/verify/[token]/page.tsx
components
components/charts
components/charts/ChartCard.tsx
components/chat
components/chat/AICards.tsx
components/chat/AIChatWidget.tsx
components/finance
components/finance/CategoryPill.tsx
components/layout
components/layout/DashboardLayoutClient.tsx
components/ui
components/ui/CopyButton.tsx
components/ui/CurrencyInput.tsx
components/ui/EmptyState.tsx
components/ui/MoneyDisplay.tsx
components/ui/ReceiptScanButton.tsx
components/ui/button.tsx
components/ui/card.tsx
components/ui/dialog.tsx
components/ui/dropdown-menu.tsx
components/ui/empty-state.tsx
components/ui/fab.tsx
components/ui/form.tsx
components/ui/input.tsx
components/ui/label.tsx
components/ui/premium-card.tsx
components/ui/select.tsx
components/ui/skeleton.tsx
lib
lib/actions
lib/actions/auth.actions.ts
lib/ai
lib/ai/composer.ts
lib/ai/contracts.ts
lib/ai/csv-pdf-parser.ts
lib/ai/ingest.ts
lib/ai/planner.ts
lib/ai/prompt-guard.ts
lib/ai/providers
lib/ai/providers/gemini.ts
lib/ai/providers/nvidia.ts
lib/ai/providers/openai.ts
lib/ai/providers/registry.ts
lib/ai/providers/types.ts
lib/ai/providers/utils.ts
lib/ai/review-protocol
lib/ai/review-protocol/committer.ts
lib/ai/review-protocol/extractor.ts
lib/ai/review-protocol/resolver.ts
lib/ai/review-protocol/reviewer.ts
lib/ai/review-protocol/types.ts
lib/ai/router.ts
lib/artifacts
lib/artifacts/service.ts
lib/auth.ts
lib/authorization.ts
lib/automation
lib/automation/wave4.ts
lib/automation/wave5.ts
lib/calibration
lib/calibration/service.ts
lib/constants.ts
lib/copy
lib/copy/ctrlbank.ts
lib/database-url.ts
lib/experiments
lib/experiments/service.ts
lib/finance
lib/finance/alerts.ts
lib/finance/analysis.ts
lib/finance/categorize.ts
lib/finance/contracts.ts
lib/finance/core.ts
lib/finance/deduplication.ts
lib/finance/default-categories.ts
lib/finance/health.ts
lib/finance/intelligence.ts
lib/finance/kernel.ts
lib/finance/learning.ts
lib/finance/merchant-dictionary.ts
lib/finance/normalize.ts
lib/finance/period.ts
lib/finance/quality.ts
lib/finance/recommendations.ts
lib/format.ts
lib/inbox
lib/inbox/deterministic.ts
lib/inbox/ocr.ts
lib/inbox/operational.ts
lib/inbox/parse.ts
lib/inbox/parser.ts
lib/inbox/pipeline.ts
lib/inbox/processing-state.ts
lib/inbox/security.ts
lib/policy
lib/policy/engine.ts
lib/prisma.ts
lib/quality
lib/quality/evaluation.ts
lib/quality/feedback.ts
lib/quality/metrics.ts
lib/quotas
lib/quotas/service.ts
lib/security
lib/security/auth-challenge.ts
lib/security/auth-context.ts
lib/security/checksum.ts
lib/security/crypto.ts
lib/security/keyring.ts
lib/security/rate-limit.ts
lib/security/scope.ts
lib/security/signature.ts
lib/security/totp.ts
lib/security/verification.ts
lib/session-utils.ts
lib/utils.ts
prisma
prisma/migrations
prisma/migrations/20260414190009_add_household_and_credit_fields
prisma/migrations/20260414190009_add_household_and_credit_fields/migration.sql
prisma/migrations/20260414221323_add_2fa_totp_fields
prisma/migrations/20260414221323_add_2fa_totp_fields/migration.sql
prisma/migrations/20260415161700_sync_schema_with_current_app
prisma/migrations/20260415161700_sync_schema_with_current_app/migration.sql
prisma/migrations/20260416055106_add_product_feedback
prisma/migrations/20260416055106_add_product_feedback/migration.sql
prisma/migrations/20260417044000_add_whatsapp_link_fields
prisma/migrations/20260417044000_add_whatsapp_link_fields/migration.sql
prisma/migrations/20260418090000_add_category_learning_rules
prisma/migrations/20260418090000_add_category_learning_rules/migration.sql
prisma/migrations/20260419093000_wave1_blindagem
prisma/migrations/20260419093000_wave1_blindagem/migration.sql
prisma/migrations/20260419130000_wave2_financial_data_system
prisma/migrations/20260419130000_wave2_financial_data_system/migration.sql
prisma/migrations/20260419170000_wave4_operational_scale
prisma/migrations/20260419170000_wave4_operational_scale/migration.sql
prisma/migrations/20260419193000_wave5_continuous_optimization
prisma/migrations/20260419193000_wave5_continuous_optimization/migration.sql
prisma/migrations/migration_lock.toml
prisma/schema.prisma
scripts
scripts/backfill-totp-secrets.ts
scripts/build.mjs
scripts/cli
scripts/cli/ctrlbank.ts
scripts/generate-backlog.ts
```

## 4. ROTEAMENTO E NAVEGAÇÃO

### src/App.tsx / src/main.tsx / src/index.tsx
```text
src/App.tsx: não encontrado
src/main.tsx: não encontrado
src/index.tsx: não encontrado
```

### app/layout.tsx (completo)
```tsx
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CtrlBank — Seu dinheiro, sob comando.",
    template: "%s | CtrlBank",
  },
  description: "Centralizador financeiro inteligente. Transforme caos em clareza, organização e decisão.",
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
    description: "Centralizador financeiro inteligente. Transforme caos em clareza, organização e decisão.",
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

### app/(dashboard)/layout.tsx (completo)
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
  let hasHouseholdTeam = false;
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { householdId: true, role: true },
    });

    if (dbUser?.householdId) {
      const householdMembersCount = await prisma.user.count({
        where: { householdId: dbUser.householdId },
      });
      hasHouseholdTeam = householdMembersCount > 1;
    }

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
    <DashboardLayoutClient
      userName={user.name}
      familyBadge={familyBadge}
      hasHouseholdTeam={hasHouseholdTeam}
    >
      {children}
      {aiEnabled && <AIChatWidget />}
    </DashboardLayoutClient>
  );
}
```

### Arquivos com `<Routes>`, `<Route>`, `createBrowserRouter`
```text
nenhuma ocorrência encontrada
```

### Arquivos em app/ com page.tsx (lista)
```text
app/(dashboard)/buscar/page.tsx
app/(dashboard)/caixa/page.tsx
app/(dashboard)/categorias/page.tsx
app/(dashboard)/categorias/revisar/page.tsx
app/(dashboard)/configuracoes/page.tsx
app/(dashboard)/contas/page.tsx
app/(dashboard)/familia/page.tsx
app/(dashboard)/fluxo/page.tsx
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

### Conteúdo de pages com menos de 80 linhas

#### app/(dashboard)/buscar/page.tsx (27 linhas)

```tsx
import { COPY } from "@/lib/copy/ctrlbank";

export const metadata = { title: COPY.search.title };

export default function BuscarPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">{COPY.search.title}</h1>
        <p className="text-secondary mt-1">{COPY.search.subtitle}</p>
      </header>

      <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
        <label htmlFor="global-search" className="text-sm font-semibold text-foreground">
          Busca global
        </label>
        <input
          id="global-search"
          type="search"
          placeholder={COPY.search.placeholder}
          className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <p className="text-sm text-secondary">{COPY.search.hint}</p>
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

#### app/(dashboard)/categorias/page.tsx (35 linhas)

```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCategories, getUncategorizedTransactions } from "@/app/actions/categories";
import { scopeWhere } from "@/lib/security/scope";
import CategoriasPageClient from "./CategoriasPageClient";

export default async function CategoriasPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { householdId: true } });
  const ctx = { userId: user.id, householdId: dbUser?.householdId ?? null };

  const [categories, uncategorized, categoryCount, monthlyCounts] = await Promise.all([
    getCategories(),
    getUncategorizedTransactions(),
    prisma.category.count({ where: scopeWhere(ctx) }),
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { ...scopeWhere(ctx), date: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
      _count: { _all: true },
    }),
  ]);

  return (
    <CategoriasPageClient
      categories={categories}
      categoryCount={categoryCount}
      uncategorizedCount={uncategorized.length}
      uncategorized={uncategorized.map((t) => ({ id: t.id, description: t.description, amount: Number(t.amount), date: t.date.toISOString() }))}
      monthlyCategoryCounts={Object.fromEntries(monthlyCounts.map((item) => [item.categoryId ?? "", item._count._all]))}
    />
  );
}

```

#### app/(dashboard)/categorias/revisar/page.tsx (26 linhas)

```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getCategories, getUncategorizedTransactions, suggestCategoryForTransactions } from "@/app/actions/categories";
import RevisarPageClient from "./RevisarPageClient";

export default async function RevisarCategoriasPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const uncategorized = await getUncategorizedTransactions();
  const suggestions = await suggestCategoryForTransactions(uncategorized.map((item) => item.id));
  const categories = await getCategories();

  return (
    <RevisarPageClient
      categories={categories.map((c) => ({ id: c.id, name: c.name, icon: c.icon, color: c.color }))}
      rows={uncategorized.map((tx) => ({
        id: tx.id,
        merchant: tx.description ?? "Sem descrição",
        amount: Number(tx.amount),
        date: tx.date.toISOString(),
        suggestion: suggestions.find((s) => s.transactionId === tx.id) ?? null,
      }))}
    />
  );
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

#### app/(dashboard)/fluxo/page.tsx (27 linhas)

```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getFluxoEvolucao, getFluxoMensal } from "@/app/actions/fluxo";
import FluxoPageClient from "./FluxoPageClient";

export const metadata = { title: "Fluxo" };

export default async function FluxoPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; range?: string }>;
}) {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const params = await searchParams;
  const now = new Date();
  const month = Number(params.month ?? now.getMonth() + 1);
  const year = Number(params.year ?? now.getFullYear());

  const [mensal, evolucao] = await Promise.all([
    getFluxoMensal(month, year),
    getFluxoEvolucao(Number(params.range ?? 6)),
  ]);

  return <FluxoPageClient month={month} year={year} mensal={mensal} evolucao={evolucao} />;
}

```

#### app/(dashboard)/inbox/page.tsx (71 linhas)

```tsx
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { COPY } from "@/lib/copy/ctrlbank";
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
        <h1 className="text-3xl font-black tracking-tight">{COPY.inbox.title}</h1>
        <p className="text-secondary mt-1">{COPY.inbox.subtitle}</p>
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

#### app/(dashboard)/relatorios/page.tsx (60 linhas)

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
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const params = await searchParams;
  const now = new Date();
  const month = Number(params.month ?? now.getMonth() + 1);
  const year  = Number(params.year  ?? now.getFullYear());
  const bankAccountId = params.bankAccountId;

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

### Navegação persistente (sidebar/bottom nav): components/layout/DashboardLayoutClient.tsx (completo)
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
  GitBranch,
  Tags,
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
```

## 5. DESIGN SYSTEM ATUAL

### app/globals.css (completo)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─────────────────────────────────────────────
   CSS Custom Properties – Design System Editorial Neon
   ───────────────────────────────────────────── */
:root {
  --background: 0 0% 2%;
  --bg-elevated: 0 0% 5%;
  --bg-elevated-2: 0 0% 8%;
  --bg-elevated-3: 0 0% 12%;
  --border: 0 0% 100% / 0.10;
  --border-strong: 0 0% 100% / 0.16;
  --foreground: 60 20% 95%;
  --fg-muted: 0 0% 54%;
  --fg-subtle: 0 0% 40%;

  --accent: 136 100% 55%;
  --accent-foreground: 0 0% 2%;
  --accent-glow: 136 100% 55% / 0.35;

  --positive: 136 100% 55%;
  --negative: 0 84% 60%;
  --warning: 38 92% 50%;
  --info: 188 100% 50%;

  --shadow-glow: 0 0 24px hsl(var(--accent-glow));
  --bottom-nav-height: 5rem;
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
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
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
           hover:bg-primary/90 hover:shadow-glow-primary
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
           hover:scale-110 hover:bg-primary/90
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
::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: hsl(var(--fg-muted)); }

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
components/ui/CurrencyInput.tsx: 71
components/ui/EmptyState.tsx: 78
components/ui/MoneyDisplay.tsx: 120
components/ui/ReceiptScanButton.tsx: 162
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

### components/ui/button.tsx (completo)
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

### components/ui/card.tsx (completo)
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

### components/ui/input.tsx (completo)
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

### theme.ts / tokens.ts ou similar
```text
theme.ts: não encontrado
tokens.ts: não encontrado
```

### Fontes importadas
```text
app/layout.tsx: import { GeistSans } from "geist/font/sans";
index.html: não encontrado
app/_document.tsx: não encontrado
```

## 6. COMPONENTES DE NEGÓCIO EXISTENTES

### Tabela (components/ excluindo components/ui)

| Caminho | Linhas | Export default | Props (assinatura do tipo) |
|---|---:|---|---|
| components/charts/ChartCard.tsx | 13 | sim | 3:export default function ChartCard({ title, children, description }: { title: string; description?: string; children: React.ReactNode }) { |
| components/chat/AICards.tsx | 299 | não | 11:export function SuccessCard({  |
| components/chat/AIChatWidget.tsx | 670 | sim | 26:export default function AIChatWidget() { |
| components/finance/CategoryPill.tsx | 29 | sim | 3:type Props = { |
| components/layout/DashboardLayoutClient.tsx | 372 | sim | 37:interface DashboardLayoutClientProps { |

### 10 componentes com mais linhas (conteúdo completo)

#### components/chat/AIChatWidget.tsx

```tsx
"use client";

import React, { useState, useRef, useEffect, useTransition, useCallback } from "react";
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

  const [, startTransition] = useTransition();
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

  const fetchHistory = useCallback(async (cursor?: string) => {
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
          metadata: m.metadata,
        }));

        if (cursor) setMessages((prev) => [...formatted, ...prev]);
        else {
          setMessages(formatted);
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);


  useEffect(() => {
    if (open && accounts.length === 0) {
      startTransition(async () => {
        const [accs, cats] = await Promise.all([getAccounts(), getCategories()]);
        setAccounts(accs);
        setCategories(cats);
        await fetchHistory(); // Fetch initial history
      });
    }
  }, [open, accounts.length, fetchHistory]);

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
  }, [open, accounts.length, fetchHistory]);

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
    } catch {
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
                               <SavedPlanCard planData={message.metadata.planData} />
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
                    {mode === "Registrar" && "Diga, digite, cole um print ou anexe um PDF."}
                    {mode === "Revisar" && "Rascunhos e lotes aguardando sua aprovação."}
                    {mode === "Perguntar" && "Pergunte sobre seus dados. Respondo com evidência."}
                    {mode === "Planejar" && "Vamos traçar uma rota para a meta."}
                    {mode === "Sugerir" && "Relate um bug ou proponha uma melhoria do produto."}
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
  GitBranch,
  Tags,
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

```

#### components/chat/AICards.tsx

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

export function SavedPlanCard({ planData }: { planData: any }) {
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

#### components/finance/CategoryPill.tsx

```tsx
import React from "react";

type Props = {
  name: string;
  color: string;
  icon?: string;
  size?: "sm" | "md";
};

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function CategoryPill({ name, color, icon, size = "md" }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"}`}
      style={{ borderColor: hexToRgba(color, 0.5), backgroundColor: hexToRgba(color, 0.12), color }}
      aria-label={`Categoria ${name}`}
    >
      {icon ? <span className="mr-1" aria-hidden>{icon}</span> : null}
      {name}
    </span>
  );
}

```

#### components/charts/ChartCard.tsx

```tsx
import React from "react";

export default function ChartCard({ title, children, description }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-4 space-y-3">
      <header>
        <h2 className="font-bold">{title}</h2>
        {description ? <p className="text-xs text-secondary">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}

```

## 7. MODELO DE DADOS

### Busca global por type/interface/z.object/Database/schema
```text
components/finance/CategoryPill.tsx:3:type Props = {
app/(dashboard)/categorias/CategoriasPageClient.tsx:16:const schema = z.object({
app/(dashboard)/categorias/CategoriasPageClient.tsx:24:type Category = { id: string; name: string; type: TransactionType; icon: string | null; color: string | null; taxClassification: string | null };
app/(dashboard)/categorias/CategoriasPageClient.tsx:37:  const form = useForm<z.infer<typeof schema>>({
app/(dashboard)/categorias/CategoriasPageClient.tsx:38:    resolver: zodResolver(schema),
lib/calibration/service.ts:14:type CalibrationInput = {
app/(dashboard)/caixa/CaixaPageClient.tsx:19:interface Account {
app/(dashboard)/caixa/CaixaPageClient.tsx:29:interface Transaction {
app/(dashboard)/caixa/CaixaPageClient.tsx:40:interface CaixaPageClientProps {
lib/finance/normalize.ts:3:export type NormalizedInboxTransaction = {
components/chat/AIChatWidget.tsx:17:type ComposerMessage = {
app/(dashboard)/inbox/InboxPageClient.tsx:8:type DraftLike = {
app/(dashboard)/inbox/InboxPageClient.tsx:14:type InboxEvent = {
app/(dashboard)/inbox/InboxPageClient.tsx:25:type ParsedItem = {
app/(dashboard)/inbox/InboxPageClient.tsx:32:type ParseResponse = {
app/(dashboard)/inbox/InboxPageClient.tsx:40:type Props = {
lib/finance/contracts.ts:1:export type FinanceSignalLevel = "attention" | "risk" | "direction";
lib/finance/contracts.ts:3:export type FinanceSignal = {
components/layout/DashboardLayoutClient.tsx:37:interface DashboardLayoutClientProps {
lib/finance/analysis.ts:3:export type CategoryTotals = Record<string, number>;
lib/finance/recommendations.ts:4:export type FinanceRecommendation = {
lib/finance/period.ts:1:export type MonthBounds = {
lib/finance/quality.ts:6:type Severity = "LOW" | "MEDIUM" | "HIGH";
lib/finance/quality.ts:8:export type QualitySignal = {
lib/finance/quality.ts:14:export type QualityEvaluation = {
components/ui/form.tsx:20:type FormFieldContextValue<
components/ui/form.tsx:69:type FormItemContextValue = {
lib/finance/core.ts:3:export interface AuthContext {
lib/finance/core.ts:33:export interface AnalyticFilterParams {
lib/finance/health.ts:4:interface ScoreBreakdown {
lib/finance/health.ts:11:export interface HealthScoreData {
lib/finance/health.ts:167:export interface ProjectionData {
lib/finance/kernel.ts:3:export type CanonicalAccountLike = {
lib/finance/kernel.ts:8:export type CanonicalTransactionLike = {
lib/finance/kernel.ts:15:export type CanonicalTotals = {
lib/finance/kernel.ts:35:export type CanonicalFlow = {
components/ui/skeleton.tsx:7:interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
lib/finance/deduplication.ts:5:export type NormalizedIngestedTransaction = {
lib/finance/deduplication.ts:13:export type DeduplicationResult =
lib/finance/deduplication.ts:22:type DedupInput = {
components/ui/button.tsx:36:export interface ButtonProps
lib/finance/alerts.ts:4:export type FinanceAlert = {
components/ui/EmptyState.tsx:6:interface EmptyStateAction {
components/ui/EmptyState.tsx:12:interface EmptyStateProps {
components/ui/empty-state.tsx:7:interface EmptyStateProps {
app/(dashboard)/relatorios/RelatoriosPageClient.tsx:15:interface Transaction {
app/(dashboard)/relatorios/RelatoriosPageClient.tsx:24:interface Category { id: string; name: string; icon: string | null; color: string | null; type: string }
app/(dashboard)/relatorios/RelatoriosPageClient.tsx:25:interface Account   { id: string; name: string; color: string | null }
app/(dashboard)/relatorios/RelatoriosPageClient.tsx:26:interface HouseholdMember { id: string; name: string | null; email: string }
app/(dashboard)/relatorios/RelatoriosPageClient.tsx:27:interface Evolution { month: string; income: number; expense: number; balance: number }
app/(dashboard)/relatorios/RelatoriosPageClient.tsx:29:interface Props {
components/ui/fab.tsx:12:interface FABProps {
lib/inbox/parse.ts:7:export type InboxChannel = "manual" | "email" | "whatsapp" | "import";
lib/inbox/parse.ts:8:export type InboxInputType = "text" | "image" | "pdf" | "csv" | "ofx" | "audio";
lib/inbox/parse.ts:9:export type InboxDocumentKind = "statement" | "invoice" | "receipt" | "unknown";
app/(dashboard)/metas/MetasPageClient.tsx:16:interface Goal {
components/ui/ReceiptScanButton.tsx:7:interface ScannedData {
components/ui/ReceiptScanButton.tsx:16:interface ReceiptScanButtonProps {
app/(dashboard)/InicioPageClient.tsx:17:interface RecentTransaction {
app/(dashboard)/InicioPageClient.tsx:27:interface UpcomingCharge {
app/(dashboard)/InicioPageClient.tsx:36:interface Recommendation {
app/(dashboard)/InicioPageClient.tsx:43:interface HealthSummary {
app/(dashboard)/InicioPageClient.tsx:48:interface BalanceSummary {
app/(dashboard)/InicioPageClient.tsx:53:interface InicioPageClientProps {
components/ui/CurrencyInput.tsx:5:interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
lib/inbox/pipeline.ts:7:type CaptureInput = {
lib/inbox/pipeline.ts:15:type DetectedType = "bank_statement" | "receipt" | "invoice";
lib/inbox/pipeline.ts:16:type DetectedSource = "nubank" | "itau" | "unknown";
lib/inbox/pipeline.ts:18:type IngestionItem = {
lib/inbox/pipeline.ts:31:export type CaptureBatchResult = {
components/ui/premium-card.tsx:13:interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
lib/inbox/parser.ts:4:export type ParsedInboxItem = {
components/ui/MoneyDisplay.tsx:6:type MoneySize = "sm" | "md" | "lg" | "hero";
components/ui/MoneyDisplay.tsx:8:interface MoneyDisplayProps {
app/(dashboard)/saude/SaudePageClient.tsx:10:interface HealthScoreData {
app/(dashboard)/saude/SaudePageClient.tsx:15:interface ProjectionData {
app/(dashboard)/saude/SaudePageClient.tsx:22:interface BalanceData { current: number; lastMonth: number; change: number }
app/(dashboard)/saude/SaudePageClient.tsx:23:interface BurnRateData { last30Days: number; previous30Days: number; changePercent: number }
app/(dashboard)/saude/SaudePageClient.tsx:24:interface Recommendation { id: string; type: string; message: string; score: number; createdAt: Date }
app/(dashboard)/saude/SaudePageClient.tsx:25:interface MemberContribution { id: string; name: string; amount: number; percent: number }
app/(dashboard)/saude/SaudePageClient.tsx:26:interface FinanceInsights {
app/(dashboard)/saude/SaudePageClient.tsx:33:interface SaudePageClientProps {
lib/auth.ts:11:export interface SessionUser {
lib/auth.ts:17:export interface Session {
lib/security/rate-limit.ts:3:type Options = {
app/(dashboard)/contas/ContasPageClient.tsx:16:type BankAccountType = "CHECKING" | "SAVINGS" | "CREDIT" | "INVESTMENT";
app/(dashboard)/contas/ContasPageClient.tsx:18:interface BankAccount {
app/(dashboard)/contas/ContasPageClient.tsx:44:interface AccountFormData {
lib/quality/metrics.ts:9:type MetricRow = { metricCode: string; metricValue: number; dimensions?: Record<string, unknown> };
lib/security/verification.ts:4:export type VerificationStatus = "VALID" | "INVALID" | "REVOKED_KEY" | "ARTIFACT_NOT_FOUND" | "MALFORMED" | "UNSUPPORTED";
lib/security/crypto.ts:30:export type EncryptedSecret = {
lib/database-url.ts:19:type DatabaseUrlKey =
lib/database-url.ts:23:export interface ResolvedDatabaseUrl {
lib/database-url.ts:28:export interface DatabaseDebugInfo {
lib/security/keyring.ts:1:export type SigningKey = {
lib/security/scope.ts:1:export type ScopeContext = { userId: string; householdId: string | null };
lib/ai/router.ts:4:export type RouterInput = {
lib/ai/router.ts:11:export type RouterDecision = {
lib/authorization.ts:5:export interface AuthorizedUser {
app/(dashboard)/familia/FamiliaPageClient.tsx:19:interface Member {
app/(dashboard)/familia/FamiliaPageClient.tsx:24:interface CurrentUser {
app/(dashboard)/familia/FamiliaPageClient.tsx:29:interface MonthlySummary {
app/(dashboard)/familia/FamiliaPageClient.tsx:39:type Props = {
lib/ai/contracts.ts:5:export type AIComposerIntent =
lib/ai/contracts.ts:14:export type AIComposerMode = "Registrar" | "Revisar" | "Perguntar" | "Planejar" | "Sugerir";
lib/ai/contracts.ts:16:export type AIComposerTransactionDraft = {
lib/ai/contracts.ts:37:export type AIComposerBatchDraftItem = {
lib/ai/contracts.ts:42:export type AIComposerResponse = {
lib/ai/composer.ts:81:export type CreateAiCaptureEventInput = {
app/(dashboard)/fluxo/FluxoPageClient.tsx:31:interface Props {
lib/ai/review-protocol/types.ts:3:export type MissingField = "amount" | "date" | "description" | "category" | "account" | "transactionType";
lib/ai/review-protocol/types.ts:5:export type ReviewDecision = {
lib/ai/review-protocol/types.ts:12:export type ResolvedDraft = {
app/contador/[token]/ContadorPublicClient.tsx:8:interface Transaction {
lib/policy/engine.ts:10:type JsonObject = Record<string, unknown>;
lib/ai/providers/openai.ts:33:  async generateStructured(prompt: string, _schema?: any, opts?: AIGenerationOptions): Promise<any> {
lib/ai/providers/gemini.ts:36:  async generateStructured(prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any> {
lib/ai/providers/gemini.ts:37:    const isJsonFormat = opts?.responseFormat === "json_object" || !!schema;
lib/ai/providers/gemini.ts:48:        responseSchema: schema ? schema : undefined, 
lib/ai/providers/registry.ts:97:  async generateStructured(capability: AICapability, prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any> {
lib/ai/providers/registry.ts:98:    return this.executeWithFallback(capability, false, provider => provider.generateStructured(prompt, schema, opts), opts);
lib/ai/providers/nvidia.ts:48:  async generateStructured(prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any> {
app/actions/budgets.ts:10:const BudgetSchema = z.object({
lib/ai/providers/types.ts:1:export type AICapability =
lib/ai/providers/types.ts:8:export interface AIProviderConfig {
lib/ai/providers/types.ts:13:export interface AIGenerationOptions {
lib/ai/providers/types.ts:21:export interface AIMediaFile {
lib/ai/providers/types.ts:26:export interface AIProvider {
lib/ai/providers/types.ts:34:  // Can either take a JSON schema or a text prompt formatted as JSON request
lib/ai/providers/types.ts:35:  generateStructured(prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any>;
lib/ai/prompt-guard.ts:1:export type PromptGuardResult = {
app/actions/recurring.ts:39:const RecurringSchema = z.object({
lib/ai/ingest.ts:58:export type ProcessIngestInput = {
app/actions/household.ts:335:  const schema = z.object({
app/actions/household.ts:340:  const parsed = schema.safeParse({ email, password });
app/actions/goals.ts:10:const GoalSchema = z.object({
app/actions/transactions.ts:17:const CreateTransactionSchema = z.object({
app/actions/transactions.ts:35:const ListTransactionsSchema = z.object({
app/actions/transactions.ts:116:export type ManagedTransactionParams = {
app/actions/transactions.ts:255:export type CreateTransactionBatchInput = {
app/actions/transactions.ts:392:      // Remover (noop sem tags no schema)
scripts/build.mjs:158:      "--schema",
scripts/build.mjs:159:      "prisma/schema.prisma",
scripts/build.mjs:167:  if (output.includes("Database schema is up to date!")) {
app/actions/accounts.ts:12:const CreateAccountSchema = z.object({
app/actions/fluxo.ts:18:export type FluxoMensal = {
app/actions/fluxo.ts:29:export type FluxoEvolucaoPoint = { month: string; entrada: number; saida: number; saldo: number };
app/actions/categories.ts:12:const CategorySchema = z.object({
app/api/ai/chat/route.ts:11:const BodySchema = z.object({
app/api/auth/login/route.ts:107:      console.error("Database error during login:", {
app/api/ai/composer/route.ts:10:const BodySchema = z.object({
__tests__/transaction-schema.test.ts:2: * Unit tests for transaction validation schemas (Fase 13)
__tests__/transaction-schema.test.ts:8:// ─── Inline schemas (mirror of lib/validations/transaction.schema.ts) ────────
__tests__/transaction-schema.test.ts:13:const csvTransactionRowSchema = z.object({
app/api/inbox/email-webhook/route.ts:10:type PostmarkAttachment = {
app/api/inbox/email-webhook/route.ts:16:type PostmarkInboundPayload = {
app/api/auth/register/route.ts:95:      console.error("Database error during registration:", {
```

### Definições literais encontradas (arquivos com type/interface/z.object)

#### __tests__/transaction-schema.test.ts

```ts
/**
 * Unit tests for transaction validation schemas (Fase 13)
 */

import { describe, it, expect } from "vitest";
import { z } from "zod";

// ─── Inline schemas (mirror of lib/validations/transaction.schema.ts) ────────

const TransactionType    = z.enum(["INCOME", "EXPENSE", "TRANSFER"]);
const TransactionStatus  = z.enum(["COMPLETED", "PENDING"]);

const csvTransactionRowSchema = z.object({
  date:        z.coerce.date(),
  description: z.string().min(1).max(200),
  amount:      z.coerce.number().positive(),
  type:        TransactionType,
  status:      TransactionStatus.default("COMPLETED"),
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("csvTransactionRowSchema", () => {
  const valid = {
    date: "2026-04-01",
    description: "Salário",
    amount: "5000.00",
    type: "INCOME",
  };

  it("parses a valid row", () => {
    const result = csvTransactionRowSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(5000);
      expect(result.data.type).toBe("INCOME");
      expect(result.data.status).toBe("COMPLETED");
    }
  });

  it("rejects negative amount", () => {
    const result = csvTransactionRowSchema.safeParse({ ...valid, amount: "-100" });
    expect(result.success).toBe(false);
  });

  it("rejects description longer than 200 chars", () => {
    const result = csvTransactionRowSchema.safeParse({
      ...valid,
      description: "x".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid type", () => {
    const result = csvTransactionRowSchema.safeParse({ ...valid, type: "UNKNOWN" });
    expect(result.success).toBe(false);
  });

  it("coerces date string to Date object", () => {
    const result = csvTransactionRowSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.date).toBeInstanceOf(Date);
    }
  });

  it("defaults status to COMPLETED when omitted", () => {
    const result = csvTransactionRowSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe("COMPLETED");
  });

  it("accepts explicit PENDING status", () => {
    const result = csvTransactionRowSchema.safeParse({ ...valid, status: "PENDING" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe("PENDING");
  });
});

describe("TransactionType enum", () => {
  it("accepts valid values", () => {
    expect(TransactionType.safeParse("INCOME").success).toBe(true);
    expect(TransactionType.safeParse("EXPENSE").success).toBe(true);
    expect(TransactionType.safeParse("TRANSFER").success).toBe(true);
  });

  it("rejects invalid values", () => {
    expect(TransactionType.safeParse("DEPOSIT").success).toBe(false);
    expect(TransactionType.safeParse("").success).toBe(false);
  });
});

```

#### app/(dashboard)/InicioPageClient.tsx

```ts
"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CalendarClock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { COPY, greetingForHour } from "@/lib/copy/ctrlbank";
import { MoneyDisplay } from "@/components/ui/MoneyDisplay";

interface RecentTransaction {
  id: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  description: string | null;
  date: string;
  category: { name: string; color: string | null; icon: string | null } | null;
  bankAccount: { name: string; color: string | null; icon: string | null };
}

interface UpcomingCharge {
  id: string;
  description: string;
  amount: number;
  nextDate: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  category: { name: string; color: string | null; icon: string | null } | null;
}

interface Recommendation {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

interface HealthSummary {
  score: number;
  classification: "Saudável" | "Atenção" | "Risco";
}

interface BalanceSummary {
  current: number;
  change: number;
}

interface InicioPageClientProps {
  userName: string | null;
  balance: BalanceSummary;
  health: HealthSummary | null;
  recommendations: Recommendation[];
  upcoming: UpcomingCharge[];
  recent: RecentTransaction[];
  monthIncome: number;
  monthExpense: number;
}

function classificationStyles(classification: HealthSummary["classification"]) {
  switch (classification) {
    case "Saudável":
      return { bar: "bg-positive", text: "text-positive", chip: "bg-positive/10 text-positive" };
    case "Atenção":
      return { bar: "bg-warning", text: "text-warning", chip: "bg-warning/10 text-warning" };
    case "Risco":
      return { bar: "bg-negative", text: "text-negative", chip: "bg-negative/10 text-negative" };
  }
}

function TransactionIcon({ type }: { type: RecentTransaction["type"] }) {
  if (type === "INCOME")
    return (
      <div className="w-9 h-9 rounded-full bg-positive/10 flex items-center justify-center flex-shrink-0">
        <ArrowDownLeft size={15} className="text-positive" />
      </div>
    );
  if (type === "EXPENSE")
    return (
      <div className="w-9 h-9 rounded-full bg-negative/10 flex items-center justify-center flex-shrink-0">
        <ArrowUpRight size={15} className="text-negative" />
      </div>
    );
  return (
    <div className="w-9 h-9 rounded-full bg-white/[0.04] flex items-center justify-center flex-shrink-0">
      <ArrowLeftRight size={15} className="text-secondary" />
    </div>
  );
}

export default function InicioPageClient({
  userName,
  balance,
  health,
  recommendations,
  upcoming,
  recent,
  monthIncome,
  monthExpense,
}: InicioPageClientProps) {
  const greeting = greetingForHour(new Date().getHours());
  const firstName = userName?.split(" ")[0] ?? null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Greeting ─────────────────────────────────────── */}
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black tracking-[-0.03em] text-foreground">
          {greeting}{firstName ? `, ${firstName}` : ""}.
        </h1>
        <p className="text-[13px] text-secondary">{COPY.home.subtitle}</p>
      </header>

      {/* ── Hero: Saldo + Saúde ──────────────────────────── */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-border bg-surface px-6 py-6 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">
            {COPY.home.balanceLabel}
          </p>
          <MoneyDisplay amount={balance.current} size="hero" />
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <ArrowDownLeft size={12} className="text-positive" />
              Entradas do mês
              <span className="tabular-nums text-foreground font-semibold">
                {formatCurrency(monthIncome)}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ArrowUpRight size={12} className="text-negative" />
              Saídas do mês
              <span className="tabular-nums text-foreground font-semibold">
                {formatCurrency(monthExpense)}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              Variação
              <span
                className={`tabular-nums font-semibold ${balance.change >= 0 ? "text-positive" : "text-negative"}`}
              >
                {balance.change >= 0 ? "+" : ""}
                {formatCurrency(balance.change)}
              </span>
            </span>
          </div>
        </div>

        {/* Saúde em foco */}
        <Link
          href="/saude"
          className="rounded-2xl border border-border bg-surface px-6 py-6 space-y-4 transition-colors hover:border-border-strong"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">
              {COPY.home.healthLabel}
            </p>
            <ChevronRight size={14} className="text-secondary" />
          </div>
          {health ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-black tabular-nums leading-none ${classificationStyles(health.classification).text}`}>
                  {health.score}
                </span>
                <span className="text-xs text-secondary">/ 100</span>
              </div>
              <div className="space-y-2">
                <div className="h-[5px] rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${classificationStyles(health.classification).bar}`}
                    style={{ width: `${Math.min(100, Math.max(0, health.score))}%` }}
                  />
                </div>
                <span
                  className={`inline-flex items-center text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full ${classificationStyles(health.classification).chip}`}
                >
                  {health.classification}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-secondary">
              Saúde disponível após a primeira sincronização do seu grupo familiar.
            </p>
          )}
        </Link>
      </section>

      {/* ── Atenções / Recomendações ─────────────────────── */}
      {recommendations.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">
              {COPY.home.attentionsLabel}
            </p>
            <Link href="/saude" className="text-xs font-semibold text-primary hover:underline">
              {COPY.home.seeAll}
            </Link>
          </div>
          <div className="grid gap-2">
            {recommendations.slice(0, 2).map((rec) => (
              <article
                key={rec.id}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3"
              >
                <div className="mt-0.5 w-7 h-7 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={13} className="text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">{rec.message}</p>
                  <p className="text-[10px] text-secondary mt-1">
                    {formatDate(rec.createdAt, { short: true })}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-border bg-surface px-4 py-3 flex items-start gap-3">
          <div className="mt-0.5 w-7 h-7 rounded-full bg-positive/10 flex items-center justify-center flex-shrink-0">
            <Sparkles size={13} className="text-positive" />
          </div>
          <p className="text-sm text-secondary">{COPY.empty.recommendations}</p>
        </section>
      )}

      {/* ── Próximas cobranças + Movimentos recentes ─────── */}
      <section className="grid gap-4 md:grid-cols-2">
        {/* Próximas cobranças */}
        <div className="rounded-2xl border border-border bg-surface px-5 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary inline-flex items-center gap-1.5">
              <CalendarClock size={12} />
              {COPY.home.upcomingLabel}
            </p>
            <Link href="/caixa" className="text-xs font-semibold text-primary hover:underline">
              {COPY.home.seeAll}
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-secondary">{COPY.home.upcomingEmpty}</p>
          ) : (
            <ul className="space-y-2">
              {upcoming.slice(0, 4).map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] px-3 py-2.5"
                >
                  <TransactionIcon type={item.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.description}</p>
                    <p className="text-[11px] text-secondary">
                      {formatDate(item.nextDate, { short: true })}
                      {item.category ? ` · ${item.category.name}` : ""}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      item.type === "INCOME" ? "text-positive" : "text-foreground"
                    }`}
                  >
                    {formatCurrency(item.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Movimentos recentes */}
        <div className="rounded-2xl border border-border bg-surface px-5 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">
              {COPY.home.recentLabel}
            </p>
            <Link href="/caixa" className="text-xs font-semibold text-primary hover:underline">
              {COPY.home.seeAll}
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-secondary">{COPY.home.recentEmpty}</p>
          ) : (
            <ul className="space-y-2">
              {recent.slice(0, 5).map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] px-3 py-2.5"
                >
                  <TransactionIcon type={tx.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {tx.description ?? tx.category?.name ?? "Movimento"}
                    </p>
                    <p className="text-[11px] text-secondary">
                      {formatDate(tx.date, { short: true, relative: true })} · {tx.bankAccount.name}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      tx.type === "INCOME"
                        ? "text-positive"
                        : tx.type === "EXPENSE"
                        ? "text-negative"
                        : "text-foreground"
                    }`}
                  >
                    {tx.type === "EXPENSE" ? "-" : tx.type === "INCOME" ? "+" : ""}
                    {formatCurrency(Math.abs(tx.amount))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

```

#### app/(dashboard)/caixa/CaixaPageClient.tsx

```ts
"use client";

import { useState } from "react";
import { MoneyDisplay } from "@/components/ui/MoneyDisplay";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  CreditCard,
  Landmark,
  PiggyBank,
  Eye,
  EyeOff,
} from "lucide-react";

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

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  date: Date;
  status: string;
  user?: { name: string } | null;
  bankAccount?: { name: string; color?: string | null; icon?: string | null } | null;
}

interface CaixaPageClientProps {
  overview: {
    accounts: Account[];
    totalBalance: number;
  };
  timeline: Transaction[];
}

/* ── Helpers ──────────────────────────────────────────── */
function accountIcon(type: string) {
  if (type === "CREDIT") return CreditCard;
  if (type === "SAVINGS") return PiggyBank;
  return Landmark;
}

function accountLabel(type: string) {
  if (type === "CHECKING") return "Corrente";
  if (type === "SAVINGS") return "Poupança";
  if (type === "CREDIT") return "Crédito";
  return type;
}

/* ── Group transactions by date ──────────────────────── */
function groupByDate(txs: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  txs.forEach(tx => {
    const key = format(new Date(tx.date), "yyyy-MM-dd");
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  });
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
}

/* ── Main Component ───────────────────────────────────── */
export default function CaixaPageClient({ overview, timeline }: CaixaPageClientProps) {
  const [hideBalances, setHideBalances] = useState(false);
  const grouped = groupByDate(timeline);

  // Compute totals for the timeline period
  const income = timeline.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const expense = timeline.filter(t => t.type !== "INCOME").reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Header ───────────────────────────────────────── */}
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-[-0.03em] text-foreground">Caixa</h1>
          <p className="text-[13px] text-[#555]">
            Gestão consolidada das contas da família.
          </p>
        </div>
        <button
          onClick={() => setHideBalances(!hideBalances)}
          className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#555] hover:text-white hover:border-white/[0.12] transition-all"
          title={hideBalances ? "Mostrar saldos" : "Ocultar saldos"}
        >
          {hideBalances ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </header>

      {/* ── Hero Balance ─────────────────────────────────── */}
      <section className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl px-6 py-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#555] mb-2">
          Saldo Consolidado
        </p>
        <MoneyDisplay amount={overview.totalBalance} size="hero" semantic hidden={hideBalances} />

        {/* Quick stats */}
        <div className="flex items-center gap-6 mt-5 pt-5 border-t border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-positive/10 flex items-center justify-center">
              <ArrowDownLeft size={12} className="text-positive" />
            </div>
            <div>
              <p className="text-[9px] text-[#444] uppercase tracking-wider font-semibold">Entradas</p>
              <MoneyDisplay amount={income} size="sm" hidden={hideBalances} className="text-positive" />
            </div>
          </div>
          <div className="w-px h-8 bg-white/[0.04]" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-negative/10 flex items-center justify-center">
              <ArrowUpRight size={12} className="text-negative" />
            </div>
            <div>
              <p className="text-[9px] text-[#444] uppercase tracking-wider font-semibold">Saídas</p>
              <MoneyDisplay amount={expense} size="sm" hidden={hideBalances} className="text-negative" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Accounts Carousel ────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#555] mb-3">
          Contas · {overview.accounts.length}
        </p>
        {overview.accounts.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-8 text-center">
            <Wallet size={24} className="mx-auto mb-2 text-[#333]" />
            <p className="text-[13px] text-[#555]">Nenhuma conta cadastrada.</p>
          </div>
        ) : (
          <div className="scroll-horizontal flex gap-3 pb-1 -mx-1 px-1">
            {overview.accounts.map((acc) => {
              const AccIcon = accountIcon(acc.type);
              return (
                <div
                  key={acc.id}
                  className="scroll-snap-start relative flex-shrink-0 w-[260px] bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all group"
                >
                  {/* Color accent bar */}
                  {acc.color && (
                    <div
                      className="absolute top-0 left-5 right-5 h-[2px] rounded-b-full"
                      style={{ backgroundColor: acc.color }}
                    />
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#555]">
                        <AccIcon size={16} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-foreground truncate max-w-[140px]">{acc.name}</p>
                        <p className="text-[10px] text-[#444] truncate">{acc.user.name}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#444] bg-white/[0.03] px-2 py-0.5 rounded-md">
                      {accountLabel(acc.type)}
                    </span>
                  </div>

                  <MoneyDisplay amount={acc.balance} size="md" hidden={hideBalances} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Timeline ─────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#555] mb-3">
          Extrato Familiar
        </p>
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl overflow-hidden">
          {timeline.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-[13px] text-[#444]">Nenhuma transação encontrada.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {grouped.map(([dateKey, txs]) => (
                <div key={dateKey}>
                  {/* Date header */}
                  <div className="px-5 py-2.5 bg-white/[0.015] sticky top-0 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#444]">
                      {format(new Date(dateKey), "EEEE, dd 'de' MMM", { locale: ptBR })}
                    </span>
                  </div>
                  {/* Transactions */}
                  <div className="divide-y divide-white/[0.03]">
                    {txs.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.015] transition-colors">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                            tx.type === "INCOME"
                              ? "bg-positive/[0.06] border-positive/[0.10] text-positive"
                              : "bg-negative/[0.06] border-negative/[0.10] text-negative"
                          }`}>
                            {tx.type === "INCOME" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-foreground line-clamp-1">{tx.description}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {tx.user && (
                                <span className="text-[10px] text-[#444]">{tx.user.name.split(" ")[0]}</span>
                              )}
                              {tx.user && tx.bankAccount && <span className="text-white/10">·</span>}
                              {tx.bankAccount && (
                                <span className="text-[10px] text-[#444] truncate max-w-[100px]">{tx.bankAccount.name}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <span className={`text-[13px] font-semibold tabular-nums ${
                            tx.type === "INCOME" ? "text-positive" : "text-foreground"
                          }`}>
                            {tx.type === "INCOME" ? "+" : "−"}{" "}
                            <MoneyDisplay amount={Math.abs(tx.amount)} size="sm" hidden={hideBalances} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

```

#### app/(dashboard)/categorias/CategoriasPageClient.tsx

```ts
"use client";

import { useMemo, useState, useTransition } from "react";
import { TransactionType } from "@prisma/client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { seedDefaultCategoriesForUser, createCategory, updateCategory, deleteCategory } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import CategoryPill from "@/components/finance/CategoryPill";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { COPY } from "@/lib/copy/ctrlbank";

const schema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(TransactionType),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  taxClassification: z.string().optional(),
});

type Category = { id: string; name: string; type: TransactionType; icon: string | null; color: string | null; taxClassification: string | null };

export default function CategoriasPageClient({ categories, categoryCount, uncategorizedCount, monthlyCategoryCounts }: {
  categories: Category[];
  categoryCount: number;
  uncategorizedCount: number;
  uncategorized: Array<{ id: string; description: string | null; amount: number; date: string }>;
  monthlyCategoryCounts: Record<string, number>;
}) {
  const [tab, setTab] = useState<TransactionType>("EXPENSE");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", type: "EXPENSE", icon: "🏷️", color: "#4AC3FF", taxClassification: "" },
  });

  const filtered = useMemo(() => categories.filter((item) => item.type === tab), [categories, tab]);

  function openCreate() {
    setEditing(null);
    form.reset({ name: "", type: tab, icon: "🏷️", color: "#4AC3FF", taxClassification: "" });
    setOpen(true);
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Categorias</h1>
          <p className="text-secondary">{categoryCount} categorias no seu escopo.</p>
        </div>
        <Button onClick={openCreate}>+ Nova categoria</Button>
      </header>

      {categoryCount === 0 && (
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
          <p>{COPY.empty.categories}</p>
          <Button onClick={() => startTransition(async () => { const result = await seedDefaultCategoriesForUser(); toast.success(`${result.created} categorias criadas.`); })}>Aplicar taxonomia padrão</Button>
        </div>
      )}

      {uncategorizedCount > 0 && (
        <div className="sticky top-20 z-20 rounded-xl border border-accent-warning/30 bg-accent-warning/10 px-4 py-3 flex items-center justify-between">
          <p>{uncategorizedCount} transações aguardando categoria.</p>
          <Link href="/categorias/revisar" className="text-accent-warning underline">Revisar agora</Link>
        </div>
      )}

      <div className="flex gap-2">
        {(["EXPENSE", "INCOME", "TRANSFER"] as TransactionType[]).map((type) => (
          <button key={type} className={`rounded-lg px-3 py-1.5 text-sm ${tab === type ? "bg-primary text-black" : "bg-surface-2 text-foreground"}`} onClick={() => setTab(type)}>{type === "EXPENSE" ? "Despesas" : type === "INCOME" ? "Receitas" : "Transferências"}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((category) => (
          <div key={category.id} className="rounded-xl border border-border bg-surface p-4 flex items-center justify-between">
            <div className="space-y-1">
              <CategoryPill name={category.name} color={category.color ?? "#6B7280"} icon={category.icon ?? undefined} />
              <p className="text-xs text-secondary">{monthlyCategoryCounts[category.id] ?? 0} transações no mês</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setEditing(category); form.reset({ name: category.name, type: category.type, icon: category.icon ?? "", color: category.color ?? "#6B7280", taxClassification: category.taxClassification ?? "" }); setOpen(true); }}>Editar</Button>
              <Button variant="outline" onClick={() => startTransition(async () => { const res = await deleteCategory(category.id); if (res.error) toast.error(res.error); else toast.success("Categoria excluída."); })}>Excluir</Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Editar categoria" : "Nova categoria"}</DialogTitle></DialogHeader>
          <form className="space-y-3" onSubmit={form.handleSubmit((values) => startTransition(async () => {
            const res = editing ? await updateCategory(editing.id, values) : await createCategory(values);
            if (res.error) toast.error(res.error); else { toast.success(editing ? "Categoria atualizada." : "Categoria criada."); setOpen(false); }
          }))}>
            <input className="input-c6" placeholder="Nome" {...form.register("name")} />
            <select className="input-c6" {...form.register("type")}>
              <option value="EXPENSE">Despesa</option><option value="INCOME">Receita</option><option value="TRANSFER">Transferência</option>
            </select>
            <input className="input-c6" placeholder="Ícone" {...form.register("icon")} />
            <input className="input-c6" placeholder="#4AC3FF" {...form.register("color")} />
            <input className="input-c6" placeholder="Classificação tributária (opcional)" {...form.register("taxClassification")} />
            <Button type="submit" disabled={isPending}>{isPending ? "Salvando..." : "Salvar"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

#### app/(dashboard)/contas/ContasPageClient.tsx

```ts
"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Wallet, CreditCard, PiggyBank, TrendingUp,
  Pencil, Trash2, X, Check,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { createAccount, updateAccount, deleteAccount } from "@/app/actions/accounts";

// ─── Types ────────────────────────────────────────────────────────────────────

type BankAccountType = "CHECKING" | "SAVINGS" | "CREDIT" | "INVESTMENT";

interface BankAccount {
  id: string; name: string; type: BankAccountType;
  balance: number | string; color: string | null; icon: string | null;
  creditLimit?: number | string | null;
  invoiceClosingDay?: number | null;
  invoiceDueDay?: number | null;
  isDefault?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ACCOUNT_TYPES = [
  { value: "CHECKING"   as BankAccountType, label: "Conta Corrente", icon: Wallet,     color: "#FF2D55" },
  { value: "SAVINGS"    as BankAccountType, label: "Poupança",       icon: PiggyBank,  color: "#34C759" },
  { value: "CREDIT"     as BankAccountType, label: "Cartão Crédito", icon: CreditCard, color: "#FF9500" },
  { value: "INVESTMENT" as BankAccountType, label: "Investimento",   icon: TrendingUp, color: "#0A84FF" },
];

const ACCOUNT_COLORS = ["#FF2D55","#34C759","#FF9500","#0A84FF","#BF5AF2","#FFD60A","#30D158","#64D2FF"];

function getTypeInfo(type: BankAccountType) {
  return ACCOUNT_TYPES.find((t) => t.value === type) ?? ACCOUNT_TYPES[0];
}

// ─── Account Form ─────────────────────────────────────────────────────────────

interface AccountFormData {
  name: string; type: BankAccountType; balance: string; color: string;
  icon: string; creditLimit: string; invoiceClosingDay: string; invoiceDueDay: string;
  createSetupBalance: boolean; isDefault: boolean;
}

const EMPTY_FORM: AccountFormData = {
  name: "", type: "CHECKING", balance: "0",
  color: "#FF2D55", icon: "💳", creditLimit: "", invoiceClosingDay: "", invoiceDueDay: "",
  createSetupBalance: false, isDefault: false,
};

function AccountFormModal({ editing, onClose }: { editing?: BankAccount; onClose: () => void }) {
  const [form, setForm] = useState<AccountFormData>({
    ...EMPTY_FORM,
    ...(editing ? {
      name: editing.name, type: editing.type,
      balance: String(Number(editing.balance)),
      color: editing.color ?? "#FF2D55", icon: editing.icon ?? "💳",
      creditLimit: editing.creditLimit ? String(Number(editing.creditLimit)) : "",
      invoiceClosingDay: editing.invoiceClosingDay ? String(editing.invoiceClosingDay) : "",
      invoiceDueDay: editing.invoiceDueDay ? String(editing.invoiceDueDay) : "",
      createSetupBalance: false,
      isDefault: editing.isDefault ?? false,
    } : {}),
  });
  const [isPending, startTransition] = useTransition();

  function set(field: keyof AccountFormData, val: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        name: form.name, type: form.type, balance: Number(form.balance),
        color: form.color, icon: form.icon,
        creditLimit: form.creditLimit ? Number(form.creditLimit) : undefined,
        invoiceClosingDay: form.invoiceClosingDay ? Number(form.invoiceClosingDay) : undefined,
        invoiceDueDay: form.invoiceDueDay ? Number(form.invoiceDueDay) : undefined,
        createSetupBalance: form.createSetupBalance,
        isDefault: form.isDefault,
      };
      const result = editing
        ? await updateAccount({ ...payload, id: editing.id })
        : await createAccount(payload);

      if (result.error) toast.error(result.error);
      else { toast.success(editing ? "Conta atualizada!" : "Conta criada!"); onClose(); }
    });
  }

  const isCredit = form.type === "CREDIT";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="w-full max-w-md bg-surface border border-border rounded-3xl shadow-soft-xl overflow-hidden"
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-lg">{editing ? "Editar Conta" : "Nova Conta"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl">
            <X size={18} className="text-secondary" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Tipo */}
          <div className="space-y-2">
            <p className="section-label">Tipo de Conta</p>
            <div className="grid grid-cols-2 gap-2">
              {ACCOUNT_TYPES.map(({ value, label, icon: Icon, color }) => (
                <button key={value} type="button" onClick={() => set("type", value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    form.type === value ? "border-primary/50 bg-primary/10 text-white" : "border-border bg-surface-2 text-secondary hover:border-white/20"
                  }`}>
                  <Icon size={16} style={{ color: form.type === value ? color : undefined }} />{label}
                </button>
              ))}
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-1.5">
            <label className="section-label">Nome</label>
            <input type="text" value={form.name} required maxLength={50}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Ex: Nubank Conta" className="input-c6 w-full" />
          </div>

          {/* Saldo */}
          <div className="space-y-1.5">
            <label className="section-label">Saldo Atual (R$)</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-secondary text-sm font-semibold pointer-events-none">R$</span>
              <CurrencyInput value={form.balance} onValueChange={(v) => set("balance", v)} className="input-c6 w-full pl-9" placeholder="0,00" />
            </div>
            <label className="flex items-center gap-2 mt-2 pt-2 text-sm text-secondary cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" checked={form.createSetupBalance} onChange={(e) => set("createSetupBalance", e.target.checked)} className="rounded border-white/20 bg-surface text-primary" />
              <span>Gerar transação de {editing ? 'Ajuste' : 'Saldo Inicial'}</span>
            </label>
            <label className="flex items-center gap-2 mt-2 pt-2 text-sm text-secondary cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => set("isDefault", e.target.checked)} className="rounded border-white/20 bg-surface text-primary" />
              <span>Marcar como conta padrão do AI Composer</span>
            </label>
          </div>

          {/* Crédito */}
          {isCredit && (
            <>
              <div className="space-y-1.5">
                <label className="section-label">Limite de Crédito (R$)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-secondary text-sm font-semibold pointer-events-none">R$</span>
                  <CurrencyInput value={form.creditLimit} onValueChange={(v) => set("creditLimit", v)} className="input-c6 w-full pl-9" placeholder="0,00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="section-label">Fechamento</label>
                  <input type="number" min={1} max={31} placeholder="Dia"
                    value={form.invoiceClosingDay}
                    onChange={(e) => set("invoiceClosingDay", e.target.value)} className="input-c6 w-full" />
                </div>
                <div className="space-y-1.5">
                  <label className="section-label">Vencimento</label>
                  <input type="number" min={1} max={31} placeholder="Dia"
                    value={form.invoiceDueDay}
                    onChange={(e) => set("invoiceDueDay", e.target.value)} className="input-c6 w-full" />
                </div>
              </div>
            </>
          )}

          {/* Cor */}
          <div className="space-y-2">
            <label className="section-label">Cor</label>
            <div className="flex gap-2 flex-wrap">
              {ACCOUNT_COLORS.map((c) => (
                <button key={c} type="button" onClick={() => set("color", c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === c ? "border-white scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <button type="submit" disabled={isPending} className="btn-primary w-full mt-2">
            {isPending
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><Check size={16} /> {editing ? "Salvar alterações" : "Criar conta"}</>}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

export default function ContasPageClient({ accounts }: { accounts: BankAccount[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BankAccount | undefined>();
  const [, setMenuOpen] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);

  function handleDelete(id: string) {
    if (!confirm("Excluir esta conta?")) return;
    startTransition(async () => {
      const result = await deleteAccount(id);
      if (result.error) toast.error(result.error);
      else toast.success("Conta excluída");
      setMenuOpen(null);
    });
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.header variants={item} className="flex items-center justify-between pt-2">
        <div>
          <p className="section-label mb-1">Patrimônio</p>
          <h1 className="text-3xl font-black tracking-tight">Contas</h1>
        </div>
        <motion.button
          onClick={() => { setEditing(undefined); setShowForm(true); }}
          className="btn-primary px-4 py-2 text-sm"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        >
          <Plus size={16} /> Nova Conta
        </motion.button>
      </motion.header>

      {/* Saldo Total */}
      <motion.div variants={item} className="card-c6 relative overflow-hidden bg-black">
        <p className="section-label mb-2">Saldo Total</p>
        <p className={`text-5xl font-black tabular-nums ${totalBalance >= 0 ? "text-foreground" : "text-negative"}`}>
          {formatCurrency(totalBalance)}
        </p>
        <p className="text-xs text-secondary mt-2">{accounts.length} conta{accounts.length !== 1 ? "s" : ""}</p>
      </motion.div>

      {/* Lista */}
      {accounts.length === 0 ? (
        <motion.div variants={item} className="card-c6 text-center py-16 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto">
            <Wallet size={24} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Nenhuma conta</h3>
            <p className="text-secondary text-sm mt-1">Crie sua primeira conta para começar.</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary px-6 mx-auto w-fit text-sm">
            <Plus size={16} /> Criar conta
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {accounts.map((acc) => {
            const info = getTypeInfo(acc.type);
            const color = acc.color ?? info.color;
            const balance = Number(acc.balance);
            const isCredit = acc.type === "CREDIT";

            return (
              <motion.div
                key={acc.id}
                variants={item}
                className="account-card flex flex-col justify-between min-h-[200px] group relative border-l-4"
                style={{ borderLeftColor: color }}
              >
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-1">
                    <p className="text-[10px] text-secondary font-black uppercase tracking-widest flex items-center gap-2">
                      {info.label}
                      {acc.isDefault && <span className="text-primary bg-primary/20 px-1 py-0.5 rounded text-[8px]">PADRÃO AI</span>}
                    </p>
                    <h3 className="text-xl font-black text-white/90">{acc.name}</h3>
                  </div>
                  <div className="flex gap-2 relative">
                    <button
                      onClick={() => { setEditing(acc); setShowForm(true); }}
                      className="p-2 rounded-xl bg-white/5 border border-white/5 text-secondary hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="p-2 rounded-xl bg-white/5 border border-white/5 text-negative hover:bg-negative/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 relative z-10 mt-6">
                  <div>
                    <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-1">
                      {isCredit ? "Fatura Atual" : "Saldo disponível"}
                    </p>
                    <p className="text-4xl font-black tabular-nums tracking-tight">
                      {formatCurrency(Math.abs(balance))}
                    </p>
                  </div>

                  {isCredit && acc.creditLimit && (
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-secondary">
                        <span>Limite usado</span>
                        <span>{formatCurrency(Number(acc.creditLimit))} de limite</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((Math.abs(balance) / Number(acc.creditLimit)) * 100, 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <AccountFormModal editing={editing} onClose={() => { setShowForm(false); setEditing(undefined); }} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

```

#### app/(dashboard)/familia/FamiliaPageClient.tsx

```ts
"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Copy, RefreshCw, Link2, UserPlus, Shield,
  Eye, Crown, UserMinus, X, Check, Plus, Building2,
  Calendar, TrendingUp, TrendingDown, Target,
  AlertTriangle, ChevronDown, Clipboard,
} from "lucide-react";
import { toast } from "sonner";
import {
  generateInviteCode, joinHousehold, createHousehold,
  updateMemberRole, removeMember, createCounterAccount,
  generateInviteLink, getMonthlySummary, markMonthlyCheckViewed,
} from "@/app/actions/household";
import { UserRole } from "@prisma/client";

interface Member {
  id: string; name: string | null; email: string;
  role: UserRole; createdAt: Date | string;
}

interface CurrentUser {
  id: string; name: string | null; email: string;
  role: UserRole; householdId: string | null;
}

interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  netResult: number;
  topCategories: { category: string; amount: number; percentOfTotal: number }[];
  goalsProgress: { name: string; progress: number; deadline: string | null }[];
  biggestExpense: { description: string; amount: number; member: string } | null;
  recommendations: { id: string; type: string; message: string }[];
}

type Props = {
  currentUser: CurrentUser;
  members: Member[];
  household: { id: string; name: string } | null;
  inviteCode: string | null;
  monthlyCheckViewed: boolean;
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "ADMIN")
    return <span className="badge-positive flex items-center gap-1"><Crown size={10} />Admin</span>;
  if (role === "MEMBER")
    return <span className="badge-info flex items-center gap-1"><Shield size={10} />Membro</span>;
  return <span className="badge-info flex items-center gap-1"><Eye size={10} />Visualizador</span>;
}

function RoleDropdown({ currentRole, onSelect, disabled }: {
  currentRole: UserRole;
  onSelect: (role: UserRole) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const roles: { value: UserRole; label: string; icon: React.ReactNode }[] = [
    { value: "ADMIN", label: "Admin", icon: <Crown size={12} /> },
    { value: "MEMBER", label: "Membro", icon: <Shield size={12} /> },
    { value: "VIEWER", label: "Visualizador", icon: <Eye size={12} /> },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-surface-2 border border-border rounded-lg hover:bg-white/5 transition-colors"
      >
        <Shield size={12} className="text-secondary" />
        <ChevronDown size={10} className="text-secondary" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-8 z-50 bg-surface-2 border border-border rounded-xl shadow-lg overflow-hidden min-w-[140px]"
          >
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => { onSelect(r.value); setOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-white/5 transition-colors ${
                  currentRole === r.value ? "text-primary font-semibold" : "text-secondary"
                }`}
              >
                {r.icon}
                {r.label}
                {currentRole === r.value && <Check size={10} className="ml-auto" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel }: {
  title: string; message: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-2 border border-border rounded-2xl p-6 max-w-sm w-full space-y-4"
      >
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-secondary">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-white/5 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn-primary px-4 py-2 text-sm">
            Confirmar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FamiliaPageClient({ currentUser, members, household, inviteCode, monthlyCheckViewed }: Props) {
  const [code, setCode] = useState(inviteCode ?? "");
  const [joinCode, setJoinCode] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterEmail, setCounterEmail] = useState("");
  const [counterPass, setCounterPass] = useState("");
  const [isPending, startTransition] = useTransition();
  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null);
  const [showMonthlyCheck, setShowMonthlyCheck] = useState(false);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [checkViewed, setCheckViewed] = useState(monthlyCheckViewed);

  const isAdmin = currentUser.role === UserRole.ADMIN;

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentMonthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(now);

  function copyCode() {
    navigator.clipboard.writeText(code);
    toast.success("Código copiado!");
  }

  function handleGenerate() {
    startTransition(async () => {
      const res = await generateInviteCode();
      if (res.error) toast.error(res.error);
      else { setCode(res.code!); toast.success("Novo código gerado!"); }
    });
  }

  function handleGenerateInviteLink() {
    startTransition(async () => {
      const res = await generateInviteLink();
      if (res.error) toast.error(res.error);
      else {
        const link = `${window.location.origin}/api/invite/${res.token}`;
        navigator.clipboard.writeText(link);
        toast.success("Link de convite copiado! Válido por 48h.");
      }
    });
  }

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await joinHousehold(joinCode);
      if (res.error) toast.error(res.error);
      else { toast.success(`Entrou no grupo: ${res.householdName}`); setJoinCode(""); }
    });
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await createHousehold(householdName);
      if (res.error) toast.error(res.error);
      else { toast.success("Grupo familiar criado!"); setHouseholdName(""); }
    });
  }

  function handleRoleChange(memberId: string, role: UserRole) {
    startTransition(async () => {
      const res = await updateMemberRole(memberId, role);
      if (res.error) toast.error(res.error);
      else toast.success("Permissão atualizada!");
    });
  }

  function handleRemoveConfirm() {
    if (!removeTarget) return;
    startTransition(async () => {
      const res = await removeMember(removeTarget.id);
      if (res.error) toast.error(res.error);
      else toast.success("Membro removido");
      setRemoveTarget(null);
    });
  }

  function handleCreateCounter(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await createCounterAccount(counterEmail, counterPass);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Conta do contador criada!");
        setShowCounterForm(false);
        setCounterEmail(""); setCounterPass("");
      }
    });
  }

  async function handleOpenMonthlyCheck() {
    setShowMonthlyCheck(true);
    if (!monthlySummary) {
      setLoadingSummary(true);
      try {
        const data = await getMonthlySummary(currentMonthStr);
        setMonthlySummary(data);

        // Mark as viewed
        await markMonthlyCheckViewed(currentMonthStr);
        setCheckViewed(true);
      } catch {
        toast.error("Erro ao carregar resumo mensal");
      }
      setLoadingSummary(false);
    }
  }

  const fmtCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  function generateShareText(): string {
    if (!monthlySummary || !household) return "";
    const s = monthlySummary;

    let text = `📊 Check do Mês — ${household.name}\n`;
    text += `📅 ${currentMonthLabel}\n\n`;
    text += `💰 Receitas: ${fmtCurrency(s.totalIncome)}\n`;
    text += `💸 Despesas: ${fmtCurrency(s.totalExpenses)}\n`;
    text += `📈 Resultado: ${s.netResult >= 0 ? "+" : ""}${fmtCurrency(s.netResult)}\n\n`;

    if (s.topCategories.length > 0) {
      text += `🏷️ Top 5 Categorias:\n`;
      s.topCategories.forEach((c, i) => {
        text += `  ${i + 1}. ${c.category}: ${fmtCurrency(c.amount)} (${c.percentOfTotal}%)\n`;
      });
      text += "\n";
    }

    if (s.goalsProgress.length > 0) {
      text += `🎯 Metas:\n`;
      s.goalsProgress.forEach((g) => {
        text += `  • ${g.name}: ${g.progress}%\n`;
      });
      text += "\n";
    }

    if (s.biggestExpense) {
      text += `💥 Maior gasto: ${s.biggestExpense.description} — ${fmtCurrency(s.biggestExpense.amount)} (${s.biggestExpense.member})\n\n`;
    }

    if (s.recommendations.length > 0) {
      text += `💡 Recomendações:\n`;
      s.recommendations.forEach((r) => {
        text += `  • ${r.message}\n`;
      });
    }

    return text;
  }

  function handleShareSummary() {
    const text = generateShareText();
    navigator.clipboard.writeText(text);
    toast.success("Resumo copiado para a área de transferência!");
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.header variants={item} className="pt-2">
        <p className="section-label mb-1">Gerenciamento</p>
        <h1 className="text-3xl font-black tracking-tight">Família</h1>
      </motion.header>

      {/* Sem household */}
      {!household && (
        <motion.div variants={item} className="space-y-3">
          {/* Criar */}
          <div className="card-c6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl"><Building2 size={18} className="text-primary" /></div>
              <h2 className="font-bold">Criar Grupo Familiar</h2>
            </div>
            <form onSubmit={handleCreate} className="flex gap-2">
              <input
                value={householdName} onChange={(e) => setHouseholdName(e.target.value)}
                placeholder="Nome do grupo (ex: Família Silva)"
                className="input-c6 flex-1 text-sm"
                required minLength={2} maxLength={60}
              />
              <button type="submit" disabled={isPending} className="btn-primary px-4 py-2 text-sm whitespace-nowrap">
                {isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={15} />Criar</>}
              </button>
            </form>
          </div>

          {/* Entrar */}
          <div className="card-c6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-info/10 rounded-xl"><Link2 size={18} className="text-info" /></div>
              <h2 className="font-bold">Entrar com Código</h2>
            </div>
            <form onSubmit={handleJoin} className="flex gap-2">
              <input
                value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Código de 8 letras"
                className="input-c6 flex-1 text-sm font-mono tracking-widest uppercase"
                maxLength={8}
              />
              <button type="submit" disabled={isPending} className="btn-secondary px-4 py-2 text-sm whitespace-nowrap">
                {isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Entrar"}
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Com household */}
      {household && (
        <>
          {/* Info grupo */}
          <motion.div variants={item} className="card-c6 space-y-1">
            <p className="section-label">Grupo Familiar</p>
            <p className="text-2xl font-black">{household.name}</p>
            <p className="text-sm text-secondary">{members.length} membro{members.length !== 1 ? "s" : ""}</p>
          </motion.div>

          {/* Código de convite */}
          {isAdmin && (
            <motion.div variants={item} className="card-c6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl"><Link2 size={18} className="text-primary" /></div>
                <div>
                  <h2 className="font-bold">Convite</h2>
                  <p className="text-xs text-secondary">Compartilhe para convidar membros</p>
                </div>
              </div>

              {code ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-3 font-mono font-bold tracking-[0.3em] text-xl text-center text-primary">
                    {code}
                  </div>
                  <button onClick={copyCode} className="p-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl transition-colors" title="Copiar código">
                    <Copy size={18} className="text-primary" />
                  </button>
                  <button onClick={handleGenerate} disabled={isPending} className="p-3 bg-surface-2 hover:bg-white/5 border border-border rounded-xl transition-colors" title="Gerar novo">
                    <RefreshCw size={18} className={`text-secondary ${isPending ? "animate-spin" : ""}`} />
                  </button>
                </div>
              ) : (
                <button onClick={handleGenerate} disabled={isPending} className="btn-primary w-full text-sm">
                  <RefreshCw size={15} /> Gerar Código de Convite
                </button>
              )}

              <button
                onClick={handleGenerateInviteLink}
                disabled={isPending}
                className="btn-secondary w-full text-sm flex items-center justify-center gap-2"
              >
                <UserPlus size={15} />
                Gerar Link de Convite (48h)
              </button>
            </motion.div>
          )}

          {/* Entrar com código (não-admin) */}
          {!isAdmin && (
            <motion.div variants={item} className="card-c6 space-y-4">
              <h2 className="font-bold flex items-center gap-2"><UserPlus size={18} />Entrar em outro grupo</h2>
              <form onSubmit={handleJoin} className="flex gap-2">
                <input
                  value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Código de convite"
                  className="input-c6 flex-1 text-sm font-mono uppercase"
                  maxLength={8}
                />
                <button type="submit" disabled={isPending} className="btn-secondary px-4 py-2 text-sm">
                  Entrar
                </button>
              </form>
            </motion.div>
          )}

          {/* Membros */}
          <motion.div variants={item} className="space-y-3">
            <h2 className="font-bold flex items-center gap-2"><Users size={16} />Membros</h2>
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id} className="card-c6-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary flex-shrink-0">
                    {(member.name ?? member.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {member.name ?? member.email}
                      {member.id === currentUser.id && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-primary/20 text-primary rounded-md">
                          Você
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <RoleBadge role={member.role} />
                      <span className="text-xs text-secondary">
                        desde {new Date(member.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  {isAdmin && member.id !== currentUser.id && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <RoleDropdown
                        currentRole={member.role}
                        onSelect={(role) => handleRoleChange(member.id, role)}
                        disabled={isPending}
                      />
                      <button
                        onClick={() => setRemoveTarget({ id: member.id, name: member.name ?? member.email })}
                        className="p-2 hover:bg-negative/5 rounded-lg transition-colors"
                        title="Remover membro"
                      >
                        <UserMinus size={14} className="text-negative" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Check do Mês */}
          <motion.div variants={item} className="card-c6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-info/10 rounded-xl"><Calendar size={18} className="text-info" /></div>
              <div className="flex-1">
                <h2 className="font-bold flex items-center gap-2">
                  Check do Mês
                  {!checkViewed && (
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  )}
                </h2>
                <p className="text-xs text-secondary">Resumo financeiro mensal da família</p>
              </div>
            </div>
            <button
              onClick={handleOpenMonthlyCheck}
              disabled={loadingSummary}
              className="btn-primary w-full text-sm flex items-center justify-center gap-2"
            >
              {loadingSummary ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Calendar size={15} />
                  Ver resumo de {currentMonthLabel}
                </>
              )}
            </button>
          </motion.div>

          {/* Conta Contador */}
          {isAdmin && (
            <motion.div variants={item} className="card-c6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-warning/10 rounded-xl"><Shield size={18} className="text-warning" /></div>
                  <div>
                    <h2 className="font-bold">Acesso do Contador</h2>
                    <p className="text-xs text-secondary">Cria uma conta com acesso somente leitura</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCounterForm(!showCounterForm)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  {showCounterForm ? <X size={16} className="text-secondary" /> : <Plus size={16} className="text-secondary" />}
                </button>
              </div>

              <AnimatePresence>
                {showCounterForm && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleCreateCounter}
                    className="space-y-3 overflow-hidden"
                  >
                    <input
                      type="email" value={counterEmail} onChange={(e) => setCounterEmail(e.target.value)}
                      placeholder="Email do contador"
                      className="input-c6 w-full text-sm" required
                    />
                    <input
                      type="password" value={counterPass} onChange={(e) => setCounterPass(e.target.value)}
                      placeholder="Senha (min. 8 caracteres)"
                      className="input-c6 w-full text-sm" required minLength={8}
                    />
                    <button type="submit" disabled={isPending} className="btn-primary w-full text-sm">
                      {isPending
                        ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <><Check size={15} />Criar conta do contador</>}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}

      {/* Remove Confirmation Modal */}
      <AnimatePresence>
        {removeTarget && (
          <ConfirmModal
            title="Remover membro"
            message={`Tem certeza que deseja remover ${removeTarget.name} do grupo familiar?`}
            onConfirm={handleRemoveConfirm}
            onCancel={() => setRemoveTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* Monthly Check Modal */}
      <AnimatePresence>
        {showMonthlyCheck && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setShowMonthlyCheck(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-2 border border-border rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-surface-2 border-b border-border p-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  Check do Mês — {currentMonthLabel}
                </h2>
                <button onClick={() => setShowMonthlyCheck(false)} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                  <X size={18} className="text-secondary" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {loadingSummary ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : monthlySummary ? (
                  <>
                    {/* Result */}
                    <div className={`p-4 rounded-xl border ${
                      monthlySummary.netResult >= 0
                        ? "bg-green-500/5 border-green-500/20"
                        : "bg-red-500/5 border-red-500/20"
                    }`}>
                      <p className="text-xs text-secondary mb-1">Resultado do mês</p>
                      <p className={`text-2xl font-black flex items-center gap-2 ${
                        monthlySummary.netResult >= 0 ? "text-green-500" : "text-red-500"
                      }`}>
                        {monthlySummary.netResult >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        {monthlySummary.netResult >= 0 ? "+" : ""}{fmtCurrency(monthlySummary.netResult)}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-secondary">
                        <span>Receitas: {fmtCurrency(monthlySummary.totalIncome)}</span>
                        <span>Despesas: {fmtCurrency(monthlySummary.totalExpenses)}</span>
                      </div>
                    </div>

                    {/* Top 5 Categories */}
                    {monthlySummary.topCategories.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold">🏷️ Top 5 Categorias</h3>
                        {monthlySummary.topCategories.map((c, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-secondary">{c.category}</span>
                              <span className="font-semibold">{fmtCurrency(c.amount)} ({c.percentOfTotal}%)</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${c.percentOfTotal}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Goals Progress */}
                    {monthlySummary.goalsProgress.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold flex items-center gap-2"><Target size={14} />Progresso das Metas</h3>
                        {monthlySummary.goalsProgress.map((g, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-secondary">{g.name}</span>
                              <span className="font-semibold">{g.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full transition-all"
                                style={{ width: `${Math.min(g.progress, 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Biggest Expense */}
                    {monthlySummary.biggestExpense && (
                      <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                        <p className="text-xs text-secondary mb-1">💥 Maior gasto do período</p>
                        <p className="font-bold text-sm">{monthlySummary.biggestExpense.description}</p>
                        <p className="text-sm text-red-400 font-semibold">{fmtCurrency(monthlySummary.biggestExpense.amount)}</p>
                        <p className="text-xs text-secondary mt-1">por {monthlySummary.biggestExpense.member}</p>
                      </div>
                    )}

                    {/* Recommendations */}
                    {monthlySummary.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold flex items-center gap-2"><AlertTriangle size={14} />Recomendações</h3>
                        {monthlySummary.recommendations.map((r) => (
                          <div key={r.id} className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-xs">
                            {r.message}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Share button */}
                    <button
                      onClick={handleShareSummary}
                      className="btn-secondary w-full text-sm flex items-center justify-center gap-2"
                    >
                      <Clipboard size={15} />
                      Compartilhar resumo
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-secondary text-center py-8">Nenhum dado disponível para este mês.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

```

#### app/(dashboard)/fluxo/FluxoPageClient.tsx

```ts
"use client";

import Link from "next/link";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sankey,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "@/components/charts/ChartCard";
import { formatCurrency, formatMonthYear } from "@/lib/format";
import type { FluxoEvolucaoPoint, FluxoMensal } from "@/app/actions/fluxo";

const CATEGORY_COLORS = [
  "#4AC3FF",
  "#8E7CFF",
  "#FF6B4A",
  "#FFD84A",
  "#2ECC71",
  "#FF4AA5",
  "#D9BFFF",
  "#6B7280",
];

interface Props {
  month: number;
  year: number;
  mensal: FluxoMensal;
  evolucao: FluxoEvolucaoPoint[];
}

export default function FluxoPageClient({ month, year, mensal, evolucao }: Props) {
  const totalCategorias = mensal.donutCategorias.reduce((acc, item) => acc + item.value, 0);
  const hasSankeyData = mensal.sankey.links.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black tracking-[-0.03em] text-foreground">Fluxo</h1>
        <p className="text-[13px] text-secondary">
          Para onde o seu reino flui — {formatMonthYear(month, year)}.
        </p>
      </header>

      <ChartCard
        title="Fluxo Soberano"
        description="Entradas, categorias e saldo remanescente em um só painel."
      >
        {hasSankeyData ? (
          <div className="h-[320px]" role="img" aria-label="Sankey do fluxo mensal">
            <ResponsiveContainer width="100%" height="100%">
              <Sankey
                data={mensal.sankey}
                nodePadding={24}
                nodeWidth={14}
                margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
                link={{ stroke: "hsl(var(--accent))", strokeOpacity: 0.25 }}
                node={{ stroke: "transparent", fill: "hsl(var(--accent))" }}
              />
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-secondary">
            Sem entradas ou categorias suficientes no período selecionado.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <Metric label="Entradas" value={mensal.totalEntrada} tone="positive" />
          <Metric label="Saídas" value={mensal.totalSaida} tone="negative" />
          <Metric label="Saldo do mês" value={mensal.saldoMes} tone={mensal.saldoMes >= 0 ? "positive" : "negative"} />
        </div>
      </ChartCard>

      <div className="grid md:grid-cols-2 gap-4">
        <ChartCard title="Gastos por categoria" description={totalCategorias ? formatCurrency(totalCategorias) : undefined}>
          {mensal.donutCategorias.length > 0 ? (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mensal.donutCategorias}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={88}
                    strokeWidth={0}
                  >
                    {mensal.donutCategorias.map((_, index) => (
                      <Cell key={String(index)} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      background: "hsl(var(--bg-elevated-2))",
                      border: "1px solid hsl(var(--border-strong))",
                      borderRadius: 8,
                      color: "hsl(var(--foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-secondary">Sem despesas categorizadas no período.</p>
          )}
        </ChartCard>

        <ChartCard title="Evolução" description={`Últimos ${evolucao.length} meses`}>
          {evolucao.length > 0 ? (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucao}>
                  <XAxis dataKey="month" stroke="hsl(var(--fg-muted))" fontSize={11} />
                  <YAxis stroke="hsl(var(--fg-muted))" fontSize={11} width={60} tickFormatter={(v: number) => formatCurrency(v, { compact: true })} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      background: "hsl(var(--bg-elevated-2))",
                      border: "1px solid hsl(var(--border-strong))",
                      borderRadius: 8,
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Line type="monotone" dataKey="saldo" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-secondary">Sem histórico suficiente para evolução.</p>
          )}
        </ChartCard>
      </div>

      <footer className="text-sm">
        <Link className="text-primary font-semibold hover:underline" href={`/caixa?month=${month}&year=${year}`}>
          Abrir Caixa no mesmo período →
        </Link>
      </footer>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "positive" | "negative" }) {
  const toneClass = tone === "positive" ? "text-positive" : "text-negative";
  return (
    <div className="rounded-xl border border-border bg-surface-2 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.12em] text-secondary font-bold">{label}</p>
      <p className={`text-lg font-bold tabular-nums ${toneClass}`}>{formatCurrency(value)}</p>
    </div>
  );
}

```

#### app/(dashboard)/inbox/InboxPageClient.tsx

```ts
"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { COPY } from "@/lib/copy/ctrlbank";

type DraftLike = {
  description?: string;
  amount?: number;
  categoryName?: string;
};

type InboxEvent = {
  id: string;
  source: string;
  inputType: string;
  createdAt: string;
  decision: string;
  captureGroupId: string | null;
  createdTransactionId: string | null;
  normalizedDraft: DraftLike | null;
};

type ParsedItem = {
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
};

type ParseResponse = {
  items: ParsedItem[];
  captureEventId?: string;
  correlationId?: string;
  reviewRequired?: boolean;
  qualityFlags?: Array<{ code: string; severity: string }>;
};

type Props = {
  events: InboxEvent[];
  eventsLoadError?: string | null;
};

function sourceBadge(channel: string, inputType: string) {
  if (inputType === "ofx") return "via OFX";
  if (inputType === "csv") return "via CSV";
  if (inputType === "pdf") return "via PDF";
  if (inputType === "image") return "via OCR";
  if (inputType === "audio") return "via Áudio";
  if (channel === "whatsapp") return "via WhatsApp";
  if (channel === "email") return "via Email";
  if (channel === "import") return "via Importação";
  return "Inclusão Manual";
}

export default function InboxPageClient({ events, eventsLoadError }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawInput, setRawInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [captureEventId, setCaptureEventId] = useState<string | null>(null);

  const hasEvents = useMemo(() => events.length > 0, [events]);

  async function sendForProcessing() {
    if (!selectedFile && !rawInput.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      if (selectedFile) formData.append("file", selectedFile);
      if (rawInput.trim()) formData.append("rawInput", rawInput.trim());

      const response = await fetch("/api/inbox/parse", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as ParseResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data?.error || COPY.inbox.errorGeneric);
      }

      const items = Array.isArray(data.items) ? data.items : [];
      setParsedItems(items);
      setCaptureEventId(data.captureEventId ?? null);
      const hasFlags = Array.isArray(data.qualityFlags) && data.qualityFlags.length > 0;
      setMessage(hasFlags ? `Processado com ${data.qualityFlags?.length} flag(s) de qualidade.` : items.length > 0 ? null : COPY.inbox.errorGeneric);
    } catch (error: any) {
      setMessage(error?.message || COPY.inbox.errorGeneric);
      setParsedItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function confirmBatch() {
    if (parsedItems.length === 0 || !captureEventId) return;
    setConfirming(true);
    setMessage(null);

    try {
      const response = await fetch("/api/inbox/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captureEventId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || COPY.inbox.errorConfirm);
      }

      setMessage(data?.message || "Transações confirmadas com sucesso.");
      setParsedItems([]);
      setRawInput("");
      setSelectedFile(null);
      setCaptureEventId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } catch (error: any) {
      setMessage(error?.message || COPY.inbox.errorConfirm);
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Inbox funcional</h2>
            <p className="text-sm text-secondary">Envie um arquivo ou cole texto. Nós sugerimos as transações e você só confirma.</p>
          </div>
          <Link href="/inbox/history" className="text-sm font-semibold text-primary hover:underline">
            Histórico
          </Link>
        </div>

        <div className="rounded-2xl border border-dashed border-border bg-surface-2 p-5">
          <p className="text-sm font-semibold">Enviar arquivo (1 por vez)</p>
          <p className="text-xs text-secondary mt-1">Suporta imagem, PDF ou texto.</p>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold"
            >
              Escolher arquivo
            </button>
            <button
              type="button"
              disabled={loading || (!selectedFile && !rawInput.trim())}
              onClick={sendForProcessing}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? "Processando..." : "Interpretar"}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,application/pdf,text/plain,.txt"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />

          {selectedFile && (
            <p className="mt-3 text-xs text-secondary">Arquivo selecionado: {selectedFile.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Ou cole o texto do extrato/fatura</label>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm"
            placeholder="Ex: 12/04/2026 Mercado R$ 89,90"
          />
        </div>

        {message && <p className="text-sm text-secondary">{message}</p>}

        {parsedItems.length > 0 && (
          <div className="rounded-2xl border border-border bg-surface-2 p-4 space-y-3">
            <p className="text-sm font-semibold">Reconheci {parsedItems.length} transações</p>
            <ul className="space-y-2 text-sm">
              {parsedItems.map((item, index) => (
                <li key={`${item.description}-${index}`} className="rounded-xl border border-border bg-surface p-3">
                  <p className="font-semibold">{item.description}</p>
                  <p className="text-xs text-secondary">
                    {new Date(item.date).toLocaleDateString("pt-BR")} · R$ {item.amount.toFixed(2).replace(".", ",")} · {item.type}
                  </p>
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={confirming || !captureEventId}
              onClick={confirmBatch}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {confirming ? "Confirmando..." : "Confirmar"}
            </button>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 space-y-3">
        <h3 className="font-bold">Fila operacional recente</h3>

        {eventsLoadError && (
          <p className="rounded-xl border border-amber-300 bg-amber-100/60 px-3 py-2 text-xs text-amber-900">{eventsLoadError}</p>
        )}

        {hasEvents ? (
          <div className="space-y-3">
            {events.map((event) => {
              const badge = sourceBadge(event.source, event.inputType);
              const draft = event.normalizedDraft && typeof event.normalizedDraft === "object" ? event.normalizedDraft : null;
              const title = draft?.description || "Evidência processada";

              return (
                <article key={event.id} className="rounded-2xl border border-border bg-surface-2 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold truncate">{title}</p>
                    <span className="rounded-full bg-primary/15 text-primary text-xs font-bold px-2 py-1">{badge}</span>
                  </div>

                  <p className="text-sm text-secondary">
                    {draft?.amount ? `R$ ${Number(draft.amount).toFixed(2).replace(".", ",")}` : "Valor pendente"}
                    {draft?.categoryName ? ` · ${draft.categoryName}` : ""}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-secondary">{new Date(event.createdAt).toLocaleString("pt-BR")}</p>
                    <span className="text-[10px] uppercase tracking-wide text-secondary">{event.decision}</span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-secondary">Nenhum evento recente.</p>
        )}
      </section>
    </div>
  );
}

```

#### app/(dashboard)/metas/MetasPageClient.tsx

```ts
"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Target, Plus, Check, X, Edit2, Trash2, Calendar, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, calcPercent, formatDate } from "@/lib/format";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { createGoal, updateGoal, deleteGoal, contributeToGoal } from "@/app/actions/goals";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Goal {
  id: string; name: string; targetAmount: number; currentAmount: number;
  deadline: string | null; icon: string | null; color: string | null;
  completed: boolean;
}

// ─── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({
  goal, onEdit, onDelete, onContribute
}: {
  goal: Goal; onEdit: () => void; onDelete: () => void; onContribute: (val: number) => void;
}) {
  const percent = calcPercent(goal.currentAmount, goal.targetAmount);
  const remaining = goal.targetAmount - goal.currentAmount;
  const color = goal.color ?? "#FF2D55";
  const [showAdd, setShowAdd] = useState(false);
  const [addVal, setAddVal] = useState("");

  return (
    <motion.div className="card-c6-sm space-y-4 relative overflow-hidden group" whileHover={{ y: -2 }}>
      {goal.completed && (
        <div className="absolute top-3 right-3 bg-positive/20 text-positive text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider backdrop-blur-md z-10 border border-positive/30">
          Alcançada 🎯
        </div>
      )}

      {/* Info Header */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-soft" style={{ background: `${color}22`, border: `1px solid ${color}40` }}>
            {goal.icon ?? "🎯"}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{goal.name}</h3>
            {goal.deadline && (
              <p className="text-[11px] text-secondary flex items-center gap-1 mt-0.5">
                <Calendar size={10} /> até {formatDate(goal.deadline, { short: true })}
              </p>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 hover:bg-white/10 rounded-lg text-secondary hover:text-white transition-colors" title="Editar">
             <Edit2 size={13} />
          </button>
          <button onClick={onDelete} className="p-1.5 hover:bg-negative/10 rounded-lg text-secondary hover:text-negative transition-colors" title="Excluir">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Progress & Values */}
      <div className="space-y-2 relative z-10">
         <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-secondary mb-0.5">Acumulado</p>
              <p className={`text-2xl font-black tabular-nums leading-none ${goal.completed ? "text-positive" : "text-foreground"}`}>
                {formatCurrency(goal.currentAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold tracking-wider text-secondary mb-0.5">Faltam</p>
               <p className="text-sm font-semibold tabular-nums text-secondary">
                 {goal.completed ? "R$ 0,00" : formatCurrency(remaining)}
               </p>
            </div>
         </div>

        {/* Bar */}
        <div className="h-2.5 rounded-full overflow-hidden bg-surface-2 relative shadow-inner">
           <motion.div
             className="h-full rounded-full transition-all duration-1000 ease-out"
             initial={{ width: 0 }} animate={{ width: `${Math.min(percent, 100)}%` }}
             style={{ backgroundColor: goal.completed ? "#34C759" : color, boxShadow: `0 0 10px ${goal.completed ? "#34C759" : color}` }}
           />
        </div>
        <div className="flex justify-between items-center text-[11px] font-bold text-secondary">
           <span>{percent}% concluído</span>
           <span>Meta: {formatCurrency(goal.targetAmount)}</span>
        </div>
      </div>

      {/* Quick Add Area */}
      {!goal.completed && (
        <div className="pt-2 border-t border-border/50 relative z-10">
          <AnimatePresence mode="wait">
            {!showAdd ? (
              <motion.button
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={() => setShowAdd(true)}
                 className="w-full flex justify-center items-center gap-1.5 py-1.5 hover:bg-white/5 rounded-lg text-xs font-semibold text-primary transition-colors"
              >
                <Plus size={12} /> Guardar dinheiro
              </motion.button>
            ) : (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex gap-2">
                 <div className="relative flex-1">
                   <CurrencyInput
                     value={addVal} onValueChange={setAddVal}
                     placeholder="Valor (R$)" autoFocus className="input-c6 py-1.5 px-3 pl-8 text-xs w-full"
                     onKeyDown={(e: any) => {
                       if (e.key === "Enter" && addVal) {
                          onContribute(Number(addVal)); setShowAdd(false); setAddVal("");
                       } else if (e.key === "Escape") {
                          setShowAdd(false); setAddVal("");
                       }
                     }}
                   />
                   <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-secondary pointer-events-none">R$</span>
                 </div>
                 <button onClick={() => { if(addVal) onContribute(Number(addVal)); setShowAdd(false); setAddVal(""); }} className="bg-primary text-white p-2 rounded-lg hover:bg-primary-600 transition-colors">
                    <Check size={14} />
                 </button>
                 <button onClick={() => { setShowAdd(false); setAddVal(""); }} className="bg-surface-2 border border-border p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <X size={14} />
                 </button>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

// ─── Goal Modal ───────────────────────────────────────────────────────────────

const ICONS = ["🎯", "🚗", "🏠", "✈️", "💻", "🎓", "📱", "💍", "🏥", "🎮", "🎸", "👶"];
const COLORS = ["#FF2D55", "#FF9500", "#FFCC00", "#34C759", "#30D158", "#5AC8FA", "#0A84FF", "#5856D6", "#AF52DE", "#FF2D55", "#A2845E"];

function GoalModal({ editing, onClose }: { editing?: Goal; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [targetAmount, setTargetAmount] = useState<string | number>(editing?.targetAmount ?? "");
  const [currentAmount, setCurrentAmount] = useState<string | number>(editing?.currentAmount ?? "");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
       name: fd.get("name"), targetAmount: fd.get("targetAmount"), currentAmount: fd.get("currentAmount"),
       deadline: fd.get("deadline") ? new Date(fd.get("deadline") as string) : undefined,
       icon: fd.get("icon"), color: fd.get("color")
    };

    startTransition(async () => {
      const res = editing ? await updateGoal(editing.id, payload) : await createGoal(payload);
      if (res.error) toast.error(res.error);
      else { toast.success(editing ? "Meta atualizada!" : "Meta criada!"); onClose(); }
    });
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div className="w-full max-w-md bg-surface border border-border rounded-3xl shadow-soft-xl overflow-hidden" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", damping: 30, stiffness: 400 }}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-lg">{editing ? "Editar Meta" : "Nova Meta"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl"><X size={18} className="text-secondary" /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Nome */}
          <div className="space-y-1.5">
            <label className="section-label">Nome da Meta</label>
            <input name="name" defaultValue={editing?.name} placeholder="Ex: Viagem Japão" required className="input-c6 w-full" />
          </div>
          {/* Valores */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
               <label className="section-label">Valor Alvo (R$)</label>
               <div className="relative flex items-center">
                 <span className="absolute left-3 text-secondary text-sm font-semibold pointer-events-none">R$</span>
                 <CurrencyInput name="targetAmount" value={targetAmount} onValueChange={(v) => setTargetAmount(v)} required placeholder="0,00" className="input-c6 w-full font-bold pl-9" />
               </div>
            </div>
            <div className="space-y-1.5">
               <label className="section-label">Já Guardado (R$)</label>
               <div className="relative flex items-center">
                 <span className="absolute left-3 text-secondary text-sm font-semibold pointer-events-none">R$</span>
                 <CurrencyInput name="currentAmount" value={currentAmount} onValueChange={(v) => setCurrentAmount(v)} placeholder="0,00" className="input-c6 w-full pl-9" />
               </div>
            </div>
          </div>
          {/* Data */}
          <div className="space-y-1.5">
            <label className="section-label">Prazo (opcional)</label>
            <input name="deadline" type="date" defaultValue={editing?.deadline ? editing.deadline.split("T")[0] : ""} className="input-c6 w-full" />
          </div>
           {/* Ícone */}
           <div className="space-y-1.5">
             <label className="section-label">Ícone</label>
             <div className="flex flex-wrap gap-2">
               {ICONS.map(i => (
                 <label key={i} className="cursor-pointer">
                   <input type="radio" name="icon" value={i} className="peer sr-only" defaultChecked={editing?.icon === i || (!editing && i==="🎯")} />
                   <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-surface-2 peer-checked:bg-primary/20 peer-checked:ring-2 ring-primary transition-all">{i}</div>
                 </label>
               ))}
             </div>
           </div>
           {/* Cor */}
           <div className="space-y-1.5">
             <label className="section-label">Cor</label>
             <div className="flex flex-wrap gap-2">
               {COLORS.map(c => (
                 <label key={c} className="cursor-pointer">
                   <input type="radio" name="color" value={c} className="peer sr-only" defaultChecked={editing?.color === c || (!editing && c===COLORS[0])} />
                   <div className="w-8 h-8 rounded-full border-2 border-transparent peer-checked:border-white peer-checked:scale-110 transition-all" style={{ backgroundColor: c }} />
                 </label>
               ))}
             </div>
           </div>

          <button type="submit" disabled={isPending} className="btn-primary w-full mt-2">
             {isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={16} /> Salvar</>}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

export default function MetasPageClient({ goals, hasHouseholdId }: { goals: Goal[], hasHouseholdId: boolean }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Goal | undefined>();
  const [, startTransition] = useTransition();

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved  = goals.reduce((s, g) => s + g.currentAmount, 0);
  const completedCount = goals.filter(g => g.completed).length;

  function handleDelete(id: string) {
    if (!confirm("Excluir esta meta?")) return;
    startTransition(async () => {
      const res = await deleteGoal(id);
      if (res.error) toast.error(res.error); else toast.success("Meta excluída");
    });
  }

  function handleContribute(id: string, amount: number) {
    startTransition(async () => {
      const res = await contributeToGoal(id, amount);
      if (res.error) toast.error(res.error);
      else if (res.completed) toast.success("Parabéns! Meta alcançada! 🎉", { duration: 5000 });
      else toast.success(`R$ ${amount} guardados!`);
    });
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.header variants={item} className="flex items-center justify-between pt-2">
        <div>
          <p className="section-label mb-1">Objetivos</p>
          <h1 className="text-3xl font-black tracking-tight">Metas</h1>
        </div>
        <button onClick={() => { setEditing(undefined); setShowModal(true); }} disabled={!hasHouseholdId} className="btn-primary px-4 py-2 text-sm disabled:opacity-50">
          <Plus size={16} /> Nova
        </button>
      </motion.header>

      {/* UX Bloqueio Guiado para Household */}
      {!hasHouseholdId && (
        <motion.div variants={item} className="card-c6 text-center py-10 space-y-4 border-warning/50 border relative overflow-hidden">
          <div className="absolute inset-0 bg-warning/5 pointer-events-none" />
          <div className="relative z-10 w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto text-warning">
            <AlertTriangle size={24} />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-lg text-white">Grupo Familiar Necessário</h3>
            <p className="text-secondary text-sm mt-1 max-w-[300px] mx-auto">
              Metas são objetivos colaborativos do módulo Household. Crie ou entre num grupo familiar para planejar o futuro.
            </p>
          </div>
          <button onClick={() => router.push("/familia")} className="relative z-10 btn-primary bg-warning hover:bg-warning-500 text-white px-6 mx-auto w-fit text-sm">
            Ir para Meu Grupo Familiar
          </button>
        </motion.div>
      )}

      {/* Dashboard Resumo */}
      {goals.length > 0 && (
         <motion.div variants={item} className="card-c6 grid grid-cols-2 gap-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)" }}>
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
             <div className="col-span-2 md:col-span-1">
                <p className="section-label mb-1">Total Guardado</p>
                <p className="text-3xl font-black tabular-nums text-primary">{formatCurrency(totalSaved)}</p>
                <p className="text-xs text-secondary mt-1">de {formatCurrency(totalTarget)} planejados</p>
             </div>
             <div className="col-span-2 md:col-span-1 flex flex-col justify-end">
                <div className="flex justify-between items-end mb-2">
                   <span className="text-xs font-bold text-secondary uppercase tracking-widest">Progresso Geral</span>
                   <span className="text-sm font-black tabular-nums">{calcPercent(totalSaved, totalTarget)}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-background shadow-inner">
                   <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(calcPercent(totalSaved, totalTarget), 100)}%` }} />
                </div>
             </div>
             {completedCount > 0 && (
                <div className="col-span-2 pt-3 border-t border-border/50 text-xs font-medium text-positive">
                  🏆 {completedCount} meta{completedCount>1?"s":""} alcançada{completedCount>1?"s":""}!
                </div>
             )}
         </motion.div>
      )}

      {/* Lista de Metas */}
      {goals.length === 0 ? (
        <motion.div variants={item} className="flex flex-col items-center justify-center py-20 px-6 text-center bg-[#242424] border border-white/[0.08] rounded-[12px]">
          <div className="w-14 h-14 rounded-[12px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5">
            <Target size={24} style={{ color: "#71717a" }} />
          </div>
          <h2 className="text-base font-bold text-[#fafafa] mb-2">Nenhuma meta ainda</h2>
          <p className="text-sm text-[#71717a] max-w-xs leading-relaxed mb-6">
            Defina objetivos financeiros para a família e acompanhe o progresso em tempo real.
          </p>
          <button
            onClick={() => setShowModal(true)}
            disabled={!hasHouseholdId}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#22c55e] text-black text-sm font-semibold hover:bg-[#16a34a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Target size={15} />
            Criar primeira meta
          </button>
        </motion.div>
      ) : (
        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {goals.map(g => (
             <motion.div key={g.id} variants={item}>
                <GoalCard goal={g}
                   onDelete={() => handleDelete(g.id)}
                   onEdit={() => { setEditing(g); setShowModal(true); }}
                   onContribute={(val) => handleContribute(g.id, val)}
                />
             </motion.div>
           ))}
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && <GoalModal editing={editing} onClose={() => { setShowModal(false); setEditing(undefined); }} />}
      </AnimatePresence>
    </motion.div>
  );
}

```

#### app/(dashboard)/relatorios/RelatoriosPageClient.tsx

```ts
"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Download, FileText, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight, ChevronDown, Table } from "lucide-react";
import { formatCurrency, formatMonthYear } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Transaction {
  id: string; type: string; amount: number;
  description: string | null; date: string;
  bankAccount: { name: string; color: string | null };
  category: { name: string; icon: string | null; color: string | null } | null;
  user?: { id: string; name: string | null } | null;
  status: string;
  ignoreInTotals: boolean;
}
interface Category { id: string; name: string; icon: string | null; color: string | null; type: string }
interface Account   { id: string; name: string; color: string | null }
interface HouseholdMember { id: string; name: string | null; email: string }
interface Evolution { month: string; income: number; expense: number; balance: number }

interface Props {
  evolution: Evolution[];
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  members: HouseholdMember[];
  currentMonth: number;
  currentYear: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

const CHART_COLORS = ["#FF2D55", "#0A84FF", "#34C759", "#FF9500", "#BF5AF2", "#FFD60A", "#30D158", "#64D2FF"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function DRETable({ transactions }: {
  transactions: Transaction[];
}) {
  // Filtrar apenas o que entra nos totais contábeis e que já foi efetivado
  const monthTx = transactions.filter(tx => tx.status === "COMPLETED" && !tx.ignoreInTotals);

  // Agrupar por categoria
  const incomeByCategory = useMemo(() => {
    const map = new Map<string, { name: string; icon: string | null; color: string | null; amount: number }>();
    monthTx.filter(tx => tx.type === "INCOME").forEach(tx => {
      const key = tx.category?.name ?? "Sem categoria";
      const existing = map.get(key);
      if (existing) existing.amount += tx.amount;
      else map.set(key, { name: key, icon: tx.category?.icon ?? null, color: tx.category?.color ?? null, amount: tx.amount });
    });
    return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
  }, [monthTx]);

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, { name: string; icon: string | null; color: string | null; amount: number }>();
    monthTx.filter(tx => tx.type === "EXPENSE").forEach(tx => {
      const key = tx.category?.name ?? "Sem categoria";
      const existing = map.get(key);
      if (existing) existing.amount += tx.amount;
      else map.set(key, { name: key, icon: tx.category?.icon ?? null, color: tx.category?.color ?? null, amount: tx.amount });
    });
    return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
  }, [monthTx]);

  const totalIncome  = incomeByCategory .reduce((s, c) => s + c.amount, 0);
  const totalExpense = expenseByCategory.reduce((s, c) => s + c.amount, 0);
  const result       = totalIncome - totalExpense;

  return (
    <div className="space-y-4">
      {/* Receitas */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-positive flex items-center gap-2">
            <TrendingUp size={15} /> Receitas
          </h3>
          <span className="font-black tabular-nums text-positive">{formatCurrency(totalIncome)}</span>
        </div>
        {incomeByCategory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-white/[0.02] rounded-[8px] border border-white/[0.06]">
            <p className="text-xs text-[#71717a]">Nenhuma receita registrada no mês</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {incomeByCategory.map((c) => (
              <div key={c.name} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                <span className="text-sm flex items-center gap-2">
                  <span>{c.icon}</span>{c.name}
                </span>
                <span className="text-sm font-semibold tabular-nums text-positive">{formatCurrency(c.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border" />

      {/* Despesas */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-negative flex items-center gap-2">
            <TrendingDown size={15} /> Despesas
          </h3>
          <span className="font-black tabular-nums text-negative">{formatCurrency(totalExpense)}</span>
        </div>
        {expenseByCategory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-white/[0.02] rounded-[8px] border border-white/[0.06]">
            <p className="text-xs text-[#71717a]">Nenhuma despesa registrada no mês</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {expenseByCategory.map((c) => (
              <div key={c.name} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                <span className="text-sm flex items-center gap-2">
                  <span>{c.icon}</span>{c.name}
                </span>
                <span className="text-sm font-semibold tabular-nums text-negative">{formatCurrency(c.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t-2 border-border pt-3">
        <div className="flex items-center justify-between">
          <span className="font-bold flex items-center gap-2">
            <Minus size={15} className="text-secondary" /> Resultado do Mês
          </span>
          <span className={`text-xl font-black tabular-nums ${result >= 0 ? "text-positive" : "text-negative"}`}>
            {result >= 0 ? "+" : ""}{formatCurrency(result)}
          </span>
        </div>
      </div>
    </div>
  );
}

function exportCSV(transactions: Transaction[], year: number) {
  const rows = [
    ["Data", "Tipo", "Conta", "Categoria", "Descrição", "Valor"].join(";"),
    ...transactions.map(tx => [
      new Date(tx.date).toLocaleDateString("pt-BR"),
      tx.type === "INCOME" ? "Receita" : tx.type === "EXPENSE" ? "Despesa" : "Transferência",
      tx.bankAccount.name,
      tx.category?.name ?? "Sem categoria",
      tx.description ?? "",
      formatCurrency(tx.amount).replace("R$", "").trim().replace(".", ""),
    ].join(";"))
  ].join("\n");

  const blob = new Blob(["\uFEFF" + rows], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `ctrlbank-${year}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportPDF(transactions: Transaction[], month: number, year: number) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("CtrlBank — Saúde Financeira Familiar", 20, 20);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Relatório – ${formatMonthYear(month, year)}`, 20, 30);

  const income  = transactions.filter(tx => tx.type === "INCOME" ).reduce((s, tx) => s + tx.amount, 0);
  const expense = transactions.filter(tx => tx.type === "EXPENSE").reduce((s, tx) => s + tx.amount, 0);

  doc.setFillColor(34, 197, 94);
  doc.rect(20, 40, 80, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("RECEITAS", 25, 49);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(income), 25, 56);

  doc.setFillColor(239, 68, 68);
  doc.rect(110, 40, 80, 18, "F");
  doc.text("DESPESAS", 115, 49);
  doc.text(formatCurrency(expense), 115, 56);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  let y = 70;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Data", 20, y); doc.text("Tipo", 50, y); doc.text("Categoria", 80, y); doc.text("Valor", 160, y);
  y += 7;
  doc.setFont("helvetica", "normal");

  for (const tx of transactions) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const d = new Date(tx.date).toLocaleDateString("pt-BR");
    const t = tx.type === "INCOME" ? "Receita" : tx.type === "EXPENSE" ? "Despesa" : "Transf.";
    const c = tx.category?.name ?? "Sem categoria";
    const v = formatCurrency(tx.amount);

    if (tx.type === "INCOME") doc.setTextColor(34, 197, 94);
    else doc.setTextColor(239, 68, 68);

    doc.text(d, 20, y);
    doc.setTextColor(0, 0, 0);
    doc.text(t, 50, y); doc.text(c.slice(0, 20), 80, y); doc.text(v, 155, y, { align: "right" });
    y += 6;
  }

  doc.save(`ctrlbank-${year}-${String(month).padStart(2, "0")}.pdf`);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RelatoriosPageClient({ evolution, transactions, accounts, members, currentMonth, currentYear }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"dre" | "graficos" | "exportar">("graficos");
  const [isExporting, setIsExporting] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");

  const totalIncome  = evolution.reduce((s, e) => s + e.income,  0);
  const totalExpense = evolution.reduce((s, e) => s + e.expense, 0);

  // Filter transactions by member if selected
  const filteredTransactions = selectedMemberId
    ? transactions.filter(tx => tx.user?.id === selectedMemberId)
    : transactions;

  // ─── Navegação de mês ──────────────────────────────────────────────────────
  function navigate(deltaMonth: number) {
    let m = currentMonth + deltaMonth;
    let y = currentYear;
    if (m < 1)  { m = 12; y -= 1; }
    if (m > 12) { m = 1;  y += 1; }
    const p = new URLSearchParams(searchParams.toString());
    p.set("month", String(m));
    p.set("year",  String(y));
    router.push(`${pathname}?${p.toString()}`);
  }

  function setAccount(id: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (id) p.set("bankAccountId", id);
    else    p.delete("bankAccountId");
    router.push(`${pathname}?${p.toString()}`);
  }

  // Pie chart – categorias de despesa (mês selecionado – filtra pendentes e ignorados)
  const monthTx = filteredTransactions.filter(tx => tx.status === "COMPLETED" && !tx.ignoreInTotals);

  const pieData = useMemo(() => {
    const map = new Map<string, { name: string; color: string | null; value: number }>();
    monthTx.filter(tx => tx.type === "EXPENSE").forEach(tx => {
      const key   = tx.category?.name ?? "Outros";
      const color = tx.category?.color ?? null;
      const e     = map.get(key);
      if (e) e.value += tx.amount;
      else   map.set(key, { name: key, color, value: tx.amount });
    });
    return Array.from(map.values()).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [monthTx]);

  async function handleExportPDF() {
    setIsExporting(true);
    try { await exportPDF(monthTx, currentMonth, currentYear); }
    finally { setIsExporting(false); }
  }

  function handleExportCSV() {
    exportCSV(transactions, currentYear);
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.header variants={item} className="pt-2 space-y-4">
        <div>
          <p className="section-label mb-1">Período selecionado</p>
          <h1 className="text-3xl font-black tracking-tight">Relatórios</h1>
        </div>

        {/* Controles de período + filtro de conta */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Navegação Mês */}
          <div className="flex items-center gap-1 bg-surface-2 border border-border rounded-xl p-1">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-secondary hover:text-white">
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1.5 text-sm font-bold tabular-nums min-w-[130px] text-center">
              {formatMonthYear(currentMonth, currentYear)}
            </span>
            <button onClick={() => navigate(+1)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-secondary hover:text-white">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Filtro de Conta */}
          <div className="relative flex-1 min-w-[160px]">
            <select
              value={searchParams.get("bankAccountId") ?? ""}
              onChange={(e) => setAccount(e.target.value)}
              className="input-c6-sm w-full appearance-none pr-8"
            >
              <option value="">Todas as contas</option>
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          </div>

          {/* Filtro de Membro */}
          {members.length > 0 && (
            <div className="relative flex-1 min-w-[160px]">
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="input-c6-sm w-full appearance-none pr-8"
              >
                <option value="">Todos os membros</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name ?? m.email}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
            </div>
          )}
        </div>
      </motion.header>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        <div className="card-c6-sm space-y-1 col-span-1">
          <p className="section-label">Receitas 6m</p>
          <p className="text-base font-black tabular-nums text-positive">{formatCurrency(totalIncome, { compact: true })}</p>
        </div>
        <div className="card-c6-sm space-y-1 col-span-1">
          <p className="section-label">Despesas 6m</p>
          <p className="text-base font-black tabular-nums text-negative">{formatCurrency(totalExpense, { compact: true })}</p>
        </div>
        <div className="card-c6-sm space-y-1 col-span-1">
          <p className="section-label">Saldo 6m</p>
          <p className={`text-base font-black tabular-nums ${(totalIncome - totalExpense) >= 0 ? "text-positive" : "text-negative"}`}>
            {formatCurrency(totalIncome - totalExpense, { compact: true })}
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="flex gap-1 bg-surface-2 border border-border p-1 rounded-2xl">
        {([
          { key: "graficos", label: "Gráficos", icon: TrendingUp },
          { key: "dre",      label: "DRE",      icon: FileText },
          { key: "exportar", label: "Exportar",  icon: Download },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === key
                ? "bg-surface border border-border text-white shadow-soft"
                : "text-secondary hover:text-white"
            }`}
          >
            <Icon size={14} />{label}
          </button>
        ))}
      </motion.div>

      {/* Tab: Gráficos */}
      {tab === "graficos" && (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
          {/* Bar Chart – 6 Meses */}
          <motion.div variants={item} className="card-c6 space-y-3">
            <div>
              <h2 className="font-bold">Evolução 6 Meses</h2>
              <p className="text-xs text-secondary">Receitas vs. Despesas</p>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolution} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="month" stroke="transparent" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                  <YAxis stroke="transparent" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12, color: "#fafafa" }}
                    formatter={(v: number, name: string) => [formatCurrency(v), name === "income" ? "Receita" : "Despesa"]}
                    labelStyle={{ color: "#fff", fontWeight: 700 }}
                  />
                  <Bar dataKey="income" isAnimationActive={false} fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" isAnimationActive={false} fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart – categorias do mês */}
          {pieData.length > 0 && (
            <motion.div variants={item} className="card-c6 space-y-3">
              <div>
                <h2 className="font-bold">Despesas por Categoria</h2>
                <p className="text-xs text-secondary">Mês atual</p>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {pieData.map((entry, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={entry.color ?? CHART_COLORS[i % CHART_COLORS.length]}
                          opacity={0.85}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12, color: "#fafafa" }}
                      formatter={(v: number) => [formatCurrency(v), "Gasto"]}
                    />
                    <Legend
                      formatter={(value) => <span className="text-xs text-secondary">{value}</span>}
                      iconType="circle"
                      iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Tab: DRE */}
      {tab === "dre" && (
        <motion.div variants={item} initial="hidden" animate="show">
          <div className="card-c6 space-y-4">
            <div>
              <h2 className="font-bold">DRE – Demonstrativo</h2>
              <p className="text-xs text-secondary">{formatMonthYear(currentMonth, currentYear)}</p>
            </div>
            <DRETable transactions={filteredTransactions} />
          </div>
        </motion.div>
      )}

      {/* Tab: Exportar */}
      {tab === "exportar" && (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          <motion.div variants={item} className="card-c6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl"><FileText size={18} className="text-primary" /></div>
              <div>
                <h3 className="font-bold">Exportar PDF</h3>
                <p className="text-xs text-secondary">Relatório mensal formatado (DRE + transações)</p>
              </div>
            </div>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="btn-primary w-full text-sm"
            >
              {isExporting
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Download size={15} /> Baixar PDF – {formatMonthYear(currentMonth, currentYear)}</>
              }
            </button>
          </motion.div>

          <motion.div variants={item} className="card-c6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-positive/10 rounded-xl"><Table size={18} className="text-positive" /></div>
              <div>
                <h3 className="font-bold">Exportar CSV</h3>
                <p className="text-xs text-secondary">Planilha com todas as transações do período</p>
              </div>
            </div>
            <button
              onClick={handleExportCSV}
              className="btn-outline w-full text-sm"
            >
              <Download size={15} /> Baixar CSV – {currentYear}
            </button>
          </motion.div>

          <motion.div variants={item} className="card-c6-sm text-xs text-secondary space-y-1">
            <p className="font-semibold text-white">📋 Período disponível</p>
            <p>CSV: todas as transações dos últimos 3 meses</p>
            <p>PDF: mês atual com DRE completo</p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

```

#### app/(dashboard)/saude/SaudePageClient.tsx

```ts
"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, AlertTriangle, Target, X, Activity, Flame } from "lucide-react";
import { dismissRecommendation } from "@/app/actions/health";
import { MoneyDisplay } from "@/components/ui/MoneyDisplay";

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
  message: string;
  projectionPoints: Array<{ day: number; balance: number }>;
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
  average: number;
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
}

/* ── Helpers ──────────────────────────────────────────── */
function getScoreAccent(c: string) {
  if (c === "Saudável") return { color: "var(--positive)", bg: "bg-positive/10", text: "text-positive", label: "Saudável" };
  if (c === "Atenção")  return { color: "var(--warning)",  bg: "bg-warning/10",  text: "text-warning",  label: "Atenção" };
  if (c === "Risco")    return { color: "var(--negative)", bg: "bg-negative/10", text: "text-negative", label: "Risco" };
  return { color: "var(--secondary)", bg: "bg-secondary/10", text: "text-secondary", label: "—" };
}

/* ── Score Ring (SVG) ─────────────────────────────────── */
function ScoreRing({ score, classification }: { score: number; classification: string }) {
  const accent = getScoreAccent(classification);
  const R = 72, W = 6;
  const r = R - W / 2;
  const circ = 2 * Math.PI * r;
  const target = circ - (score / 100) * circ;
  const [offset, setOffset] = useState(circ);
  const raf = useRef<number | null>(null);
  const t0 = useRef<number | null>(null);

  useEffect(() => {
    t0.current = null;
    const step = (ts: number) => {
      if (!t0.current) t0.current = ts;
      const p = Math.min((ts - t0.current) / 900, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setOffset(circ - e * (circ - target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: R * 2, height: R * 2 }}>
      <svg width={R * 2} height={R * 2} className="rotate-[-90deg]">
        <circle cx={R} cy={R} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={W} />
        <circle cx={R} cy={R} r={r} fill="none" stroke={accent.color} strokeWidth={W}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${accent.color}40)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black tabular-nums leading-none"
          style={{ fontSize: "56px", color: accent.color, fontFamily: "var(--font-geist-sans), var(--font-inter), sans-serif" }}>
          {score}
        </span>
        <span className={`mt-2 text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-0.5 rounded-full ${accent.bg} ${accent.text}`}>
          {accent.label}
        </span>
      </div>
    </div>
  );
}

/* ── Breakdown Bar ────────────────────────────────────── */
function BreakdownBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-[11px] text-[#666]">{label}</span>
        <span className="text-[11px] font-semibold tabular-nums text-foreground">
          {value.toFixed(value % 1 === 0 ? 0 : 1)}<span className="text-[#444]">/{max}</span>
        </span>
      </div>
      <div className="h-[5px] rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* ── Spark Chart ──────────────────────────────────────── */
function SparkChart({ points }: { points: Array<{ day: number; balance: number }> }) {
  if (!points.length) return null;
  const max = Math.max(...points.map(p => p.balance));
  const min = Math.min(...points.map(p => p.balance));
  const range = max - min || 1;
  return (
    <div className="flex items-end gap-[2px] h-10 mt-4">
      {points.map((p, i) => {
        const h = Math.max(((p.balance - min) / range) * 100, 6);
        return (
          <div key={i} className="flex-1 rounded-sm transition-all duration-300"
            style={{
              height: `${h}%`,
              backgroundColor: p.balance >= 0 ? "var(--positive)" : "var(--negative)",
              opacity: 0.5 + (i / points.length) * 0.5,
            }} />
        );
      })}
    </div>
  );
}

/* ── Generic Card ─────────────────────────────────────── */
function Card({ children, className = "", span }: {
  children: React.ReactNode; className?: string; span?: string;
}) {
  return (
    <div className={[
      "bg-[#0a0a0a] border border-white/[0.06] rounded-2xl px-6 py-5",
      "transition-all duration-300 hover:border-white/[0.10]",
      span ?? "", className,
    ].join(" ")}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#555] mb-3">
      {children}
    </p>
  );
}

/* ── Main Component ───────────────────────────────────── */
export default function SaudePageClient({
  healthScore, projection, balance, burnRate,
  recommendations: initialRecommendations, memberContributions, userRole, financeInsights,
}: SaudePageClientProps) {
  const [recommendations, setRecommendations] = useState(initialRecommendations);

  const handleDismiss = async (id: string) => {
    try {
      await dismissRecommendation(id);
      setRecommendations(recommendations.filter(r => r.id !== id));
      toast.success("Alerta dispensado");
    } catch { toast.error("Erro ao dispensar alerta"); }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Page Header ─────────────────────────────────── */}
      <header className="space-y-1">
        <h1 className="text-2xl font-black tracking-[-0.03em] text-foreground">
          Saúde Financeira
        </h1>
        <p className="text-[13px] text-[#555]">
          Diagnóstico completo da saúde financeira familiar.
        </p>
      </header>

      <Card span="w-full">
        <Label>Resumo Inteligente do Mês</Label>
        <div className="space-y-2 text-sm">
          <p>
            Total gasto no mês: <span className="font-bold"><MoneyDisplay amount={financeInsights.totalMonth} size="sm" /></span>
          </p>
          <p className="text-[11px] text-[#666]">
            Média recente: <MoneyDisplay amount={financeInsights.average} size="sm" />
          </p>
          <div>
            <p className="text-xs font-semibold mb-1">Top 3 categorias</p>
            <ul className="space-y-1 text-xs text-[#b3b3b3]">
              {financeInsights.topCategories.map((item) => (
                <li key={item.category} className="flex justify-between">
                  <span>{item.category}</span>
                  <span className="tabular-nums">R$ {item.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          {financeInsights.alert && (
            <p className="text-warning text-xs inline-flex items-center gap-1">
              <AlertTriangle size={12} /> {financeInsights.alert.message}
            </p>
          )}
          {financeInsights.recommendation && (
            <p className="text-info text-xs">
              Recomendação: {financeInsights.recommendation.message}
            </p>
          )}
        </div>
      </Card>

      {/* ── Hero: Score ──────────────────────────────────── */}
      {healthScore && (
        <Card span="w-full" className="!py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            <ScoreRing score={healthScore.score} classification={healthScore.classification} />
            <div className="flex-1 w-full space-y-4">
              <div>
                <Label>Composição do Score</Label>
              </div>
              <BreakdownBar label="Controle de gastos" value={healthScore.breakdown.spending} max={40} color="var(--positive)" />
              <BreakdownBar label="Crescimento de saldo" value={healthScore.breakdown.growth} max={30} color="var(--positive)" />
              <BreakdownBar label="Compromissos fixos" value={healthScore.breakdown.commitments} max={20} color="var(--warning)" />
              <BreakdownBar label="Progresso em metas" value={healthScore.breakdown.goals} max={10} color="var(--warning)" />
            </div>
          </div>
        </Card>
      )}

      {/* ── Metrics Grid ─────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Saldo Consolidado */}
        <Card>
          <Label>Saldo Consolidado</Label>
          <MoneyDisplay amount={balance.current} size="lg" />
          <div className="flex items-center gap-1.5 mt-3">
            {balance.change >= 0 ? (
              <>
                <div className="w-5 h-5 rounded-full bg-positive/10 flex items-center justify-center">
                  <TrendingUp size={11} className="text-positive" />
                </div>
                <MoneyDisplay amount={balance.change} size="sm" delta className="text-positive" />
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full bg-negative/10 flex items-center justify-center">
                  <TrendingDown size={11} className="text-negative" />
                </div>
                <MoneyDisplay amount={balance.change} size="sm" delta className="text-negative" />
              </>
            )}
            <span className="text-[11px] text-[#555]">vs. mês anterior</span>
          </div>
        </Card>

        {/* Burn Rate */}
        <Card>
          <Label>
            <span className="inline-flex items-center gap-1.5">
              <Flame size={11} className="text-[#555]" />
              Burn Rate
            </span>
          </Label>
          <MoneyDisplay amount={burnRate.last30Days} size="lg" />
          <p className="text-[11px] text-[#444] mt-1 mb-3">Últimos 30 dias</p>
          <div className="flex items-center gap-1.5">
            {burnRate.changePercent > 0 ? (
              <>
                <div className="w-5 h-5 rounded-full bg-negative/10 flex items-center justify-center">
                  <TrendingUp size={11} className="text-negative" />
                </div>
                <span className="text-xs font-semibold text-negative tabular-nums">+{burnRate.changePercent.toFixed(1)}%</span>
              </>
            ) : burnRate.changePercent < 0 ? (
              <>
                <div className="w-5 h-5 rounded-full bg-positive/10 flex items-center justify-center">
                  <TrendingDown size={11} className="text-positive" />
                </div>
                <span className="text-xs font-semibold text-positive tabular-nums">{burnRate.changePercent.toFixed(1)}%</span>
              </>
            ) : (
              <span className="text-[11px] text-[#555]">Sem variação</span>
            )}
          </div>
        </Card>

        {/* Projeção de Caixa */}
        {projection && (
          <Card>
            <Label>
              <span className="inline-flex items-center gap-1.5">
                <Activity size={11} className="text-[#555]" />
                Projeção 30d
              </span>
            </Label>
            <MoneyDisplay amount={projection.projectedBalance30d} size="lg" semantic />
            <p className="text-[11px] text-[#444] mt-1 leading-relaxed line-clamp-2">{projection.message}</p>
            <SparkChart points={projection.projectionPoints} />
          </Card>
        )}
      </div>

      {/* ── Alerts ────────────────────────────────────────── */}
      {recommendations.length > 0 && (
        <Card>
          <Label>
            Alertas Ativos · {recommendations.length}
          </Label>
          <div className="space-y-1.5">
            {recommendations.map((rec) => (
              <div key={rec.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors group">
                <div className="mt-0.5 flex-shrink-0">
                  {rec.type === "ALERT" && (
                    <div className="w-6 h-6 rounded-full bg-negative/10 flex items-center justify-center">
                      <AlertTriangle size={12} className="text-negative" />
                    </div>
                  )}
                  {rec.type === "WARNING" && (
                    <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center">
                      <AlertTriangle size={12} className="text-warning" />
                    </div>
                  )}
                  {rec.type === "SUGGESTION" && (
                    <div className="w-6 h-6 rounded-full bg-white/[0.04] flex items-center justify-center">
                      <Target size={12} className="text-[#666]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-foreground leading-relaxed">{rec.message}</p>
                  <p className="text-[10px] text-[#444] mt-1">{new Date(rec.createdAt).toLocaleDateString("pt-BR")}</p>
                </div>
                <button
                  onClick={() => handleDismiss(rec.id)}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/5 transition-all flex-shrink-0"
                  title="Dispensar"
                >
                  <X size={12} className="text-[#555]" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Member Contributions ──────────────────────────── */}
      {userRole !== "VIEWER" && memberContributions.length > 0 && (
        <Card>
          <Label>Contribuição por Membro</Label>
          <div className="space-y-5">
            {memberContributions.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[11px] font-bold text-[#666] flex-shrink-0">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[13px] font-medium text-foreground">{member.name}</span>
                    <span className="text-[11px] text-[#555] tabular-nums">
                      <MoneyDisplay amount={member.amount} size="sm" />
                      <span className="text-[#444] ml-1">({member.percent}%)</span>
                    </span>
                  </div>
                  <div className="h-[4px] bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${member.percent}%`, backgroundColor: "var(--positive)" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

```

#### app/actions/accounts.ts

```ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { BankAccountType } from "@prisma/client";
import { requireWriteContext, ServiceUnavailableError } from "@/lib/security/auth-context";
import { scopeWhere } from "@/lib/security/scope";

// ─── Schemas ────────────────────────────────────────────────────────────────

const CreateAccountSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(50),
  type: z.nativeEnum(BankAccountType),
  balance: z.coerce.number().default(0),
  color: z.string().optional(),
  icon: z.string().optional(),
  creditLimit: z.coerce.number().optional(),
  invoiceClosingDay: z.coerce.number().min(1).max(31).optional(),
  invoiceDueDay: z.coerce.number().min(1).max(31).optional(),
  createSetupBalance: z.coerce.boolean().optional(),
  isDefault: z.coerce.boolean().optional().default(false),
});

const UpdateAccountSchema = CreateAccountSchema.extend({
  id: z.string().cuid(),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthContext() {
  return requireWriteContext();
}

function requireWriteRole(role: string) {
  if (role === "VIEWER") throw new Error("Permissão negada: somente leitura");
}

// ─── Actions ─────────────────────────────────────────────────────────────────

/**
 * Buscar todas as contas do household do usuário.
 * Server Action segura: householdId vem SEMPRE da sessão.
 */
export async function getAccounts() {
  const ctx = await getAuthContext();

  const accounts = await prisma.bankAccount.findMany({
    where: scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
    orderBy: { createdAt: "asc" },
  });

  return accounts;
}

/**
 * Criar nova conta bancária.
 */
export async function createAccount(formData: unknown) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const parsed = CreateAccountSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { name, type, balance, color, icon, creditLimit, invoiceClosingDay, invoiceDueDay, createSetupBalance, isDefault } =
    parsed.data;

  try {
    const account = await prisma.$transaction(async (tx) => {
      const acc = await tx.bankAccount.create({
        data: {
          userId: ctx.id,
          householdId: ctx.householdId,
          name,
          type,
          balance,
          color,
          icon,
          creditLimit:       type === BankAccountType.CREDIT ? creditLimit : undefined,
          invoiceClosingDay: type === BankAccountType.CREDIT ? invoiceClosingDay : undefined,
          invoiceDueDay:     type === BankAccountType.CREDIT ? invoiceDueDay : undefined,
          isDefault,
        },
      });

      // Maintain uniqueness of isDefault
      if (isDefault) {
        await tx.bankAccount.updateMany({
          where: {
            id: { not: acc.id },
            ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
          },
          data: { isDefault: false },
        });
      }

      if (createSetupBalance && balance !== 0) {
        await tx.transaction.create({
          data: {
            userId: ctx.id,
            householdId: ctx.householdId,
            bankAccountId: acc.id,
            type: balance >= 0 ? "INCOME" : "EXPENSE",
            amount: Math.abs(balance),
            date: new Date(),
            description: "Saldo Inicial / Ajuste",
            status: "COMPLETED",
          }
        });
      }

      return acc;
    });

    revalidatePath("/contas");
    revalidatePath("/");
    return { success: true, data: account };
  } catch (err) {
    if (err instanceof ServiceUnavailableError) return { error: "Serviço temporariamente indisponível", status: 503 };
    console.error("createAccount error:", err);
    return { error: "Erro ao criar conta. Tente novamente." };
  }
}

/**
 * Atualizar conta bancária existente.
 * Valida que a conta pertence ao household do usuário.
 */
export async function updateAccount(formData: unknown) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const parsed = UpdateAccountSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { id, name, type, balance, color, icon, creditLimit, invoiceClosingDay, invoiceDueDay, createSetupBalance, isDefault } =
    parsed.data;

  if (Number(balance) !== 0 && !createSetupBalance) {
    return { error: "Saldo não é editável diretamente. Marque 'registrar ajuste' para lançar evidência contábil." };
  }

  // Verificar ownership
  const existing = await prisma.bankAccount.findFirst({
    where: {
      id,
      ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
    },
  });

  if (!existing) {
    return { error: "Conta não encontrada" };
  }

  try {
    const account = await prisma.$transaction(async (tx) => {
      const acc = await tx.bankAccount.update({
        where: { id },
        data: {
          name,
          type,
          color,
          icon,
          creditLimit:       type === BankAccountType.CREDIT ? creditLimit : null,
          invoiceClosingDay: type === BankAccountType.CREDIT ? invoiceClosingDay : null,
          invoiceDueDay:     type === BankAccountType.CREDIT ? invoiceDueDay : null,
          isDefault,
        },
      });

      if (isDefault) {
        await tx.bankAccount.updateMany({
          where: {
            id: { not: acc.id },
            ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
          },
          data: { isDefault: false },
        });
      }

      const diff = Number(balance) - Number(existing.balance);
      if (createSetupBalance && diff !== 0) {
        await tx.transaction.create({
          data: {
            userId: ctx.id,
            householdId: ctx.householdId,
            bankAccountId: acc.id,
            type: diff > 0 ? "INCOME" : "EXPENSE",
            amount: Math.abs(diff),
            date: new Date(),
            description: "Ajuste de Saldo",
            status: "COMPLETED",
          }
        });
        await tx.bankAccount.update({ where: { id: acc.id }, data: { balance: { increment: diff } } });
      }

      return acc;
    });

    revalidatePath("/contas");
    revalidatePath("/");
    return { success: true, data: account };
  } catch (err) {
    if (err instanceof ServiceUnavailableError) return { error: "Serviço temporariamente indisponível", status: 503 };
    console.error("updateAccount error:", err);
    return { error: "Erro ao atualizar conta." };
  }
}

/**
 * Excluir conta bancária.
 * Valida ownership antes de deletar.
 */
export async function deleteAccount(id: string) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);

  const existing = await prisma.bankAccount.findFirst({
    where: {
      id,
      ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
    },
  });

  if (!existing) {
    return { error: "Conta não encontrada" };
  }

  try {
    await prisma.bankAccount.delete({ where: { id } });
    revalidatePath("/contas");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    if (err instanceof ServiceUnavailableError) return { error: "Serviço temporariamente indisponível", status: 503 };
    console.error("deleteAccount error:", err);
    return { error: "Erro ao excluir conta." };
  }
}

```

#### app/actions/budgets.ts

```ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const BudgetSchema = z.object({
  categoryId: z.string().cuid("Categoria inválida"),
  amount:     z.coerce.number().positive("Valor deve ser positivo"),
  month:      z.coerce.number().int().min(1).max(12),
  year:       z.coerce.number().int().min(2020).max(2099),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthContext() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, householdId: true, role: true },
  });
  if (!fullUser) throw new Error("Usuário não encontrado");
  return fullUser;
}

function requireWriteRole(role: string) {
  if (role === "VIEWER") throw new Error("Permissão negada: somente leitura");
}

// ─── Actions ─────────────────────────────────────────────────────────────────

/**
 * Buscar orçamentos do mês com gasto atual calculado.
 */
export async function getBudgetsWithSpending(month: number, year: number) {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return [];

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth   = new Date(year, month, 0, 23, 59, 59);

  const budgets = await prisma.budget.findMany({
    where: { householdId: ctx.householdId },
    include: {
      category: { select: { id: true, name: true, icon: true, color: true } },
    },
  });

  // Calcular gasto real por categoria no mês
  const categoryIds = budgets.map((b) => b.categoryId);
  const spending = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      householdId:    ctx.householdId,
      type:           "EXPENSE",
      status:         "COMPLETED",
      ignoreInTotals: false,
      categoryId:     { in: categoryIds },
      date:           { gte: startOfMonth, lte: endOfMonth },
    },
    _sum: { amount: true },
  });

  const spendingMap = new Map(
    spending.map((s) => [s.categoryId, Number(s._sum.amount ?? 0)])
  );

  return budgets.map((b) => ({
    ...b,
    amount: Number(b.amount),
    spent:  spendingMap.get(b.categoryId) ?? 0,
  }));
}

/**
 * Criar ou atualizar orçamento (upsert).
 */
export async function upsertBudget(formData: unknown) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  if (!ctx.householdId) return { error: "Você não pertence a um grupo familiar" };

  const parsed = BudgetSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { categoryId, amount, month, year } = parsed.data;

  try {
    await prisma.budget.upsert({
      where: {
        householdId_categoryId_month_year: {
          householdId: ctx.householdId,
          categoryId,
          month,
          year,
        },
      },
      create: { householdId: ctx.householdId, categoryId, amount, month, year },
      update: { amount },
    });

    revalidatePath("/metas");
    return { success: true };
  } catch {
    return { error: "Erro ao salvar orçamento." };
  }
}

/**
 * Excluir orçamento.
 */
export async function deleteBudget(id: string) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);

  const budget = await prisma.budget.findFirst({
    where: { id, householdId: ctx.householdId ?? "" },
  });

  if (!budget) return { error: "Orçamento não encontrado" };

  await prisma.budget.delete({ where: { id } });
  revalidatePath("/metas");
  return { success: true };
}

/**
 * Sugestões inteligentes de economia.
 * Compara gasto médio dos 3 meses anteriores com o mês atual.
 */
export async function getSmartInsights(month: number, year: number) {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return [];

  const currentMonth = month;
  const currentYear  = year;

  const currentStart = new Date(currentYear, currentMonth - 1, 1);
  const currentEnd   = new Date(currentYear, currentMonth, 0, 23, 59, 59);
  const threeMonthsAgo = new Date(currentYear, currentMonth - 4, 1);

  // Gasto atual por categoria
  const currentSpending = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      householdId: ctx.householdId,
      type: "EXPENSE",
      status: "COMPLETED",
      ignoreInTotals: false,
      date: { gte: currentStart, lte: currentEnd },
    },
    _sum: { amount: true },
  });

  // Gasto médio dos 3 meses anteriores por categoria
  const prevSpending = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      householdId: ctx.householdId,
      type: "EXPENSE",
      status: "COMPLETED",
      ignoreInTotals: false,
      date: { gte: threeMonthsAgo, lt: currentStart },
    },
    _sum: { amount: true },
    _count: true,
  });

  // Mapear e calcular insights
  const categoryIds = [
    ...new Set([
      ...currentSpending.map((c) => c.categoryId),
      ...prevSpending.map((c) => c.categoryId),
    ]),
  ].filter(Boolean) as string[];

  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true, icon: true },
  });

  const catMap = new Map(categories.map((c) => [c.id, c]));
  const insights: {
    categoryId: string; categoryName: string; icon: string | null;
    currentSpent: number; avgPrev: number; changePercent: number; excess: number;
  }[] = [];

  for (const curr of currentSpending) {
    if (!curr.categoryId) continue;
    const prev = prevSpending.find((p) => p.categoryId === curr.categoryId);
    const currentSpent = Number(curr._sum.amount ?? 0);
    const avgPrev = prev ? Number(prev._sum.amount ?? 0) / 3 : 0;

    if (avgPrev > 0 && currentSpent > avgPrev * 1.1) {
      const changePercent = Math.round(((currentSpent - avgPrev) / avgPrev) * 100);
      const cat = catMap.get(curr.categoryId);
      insights.push({
        categoryId:   curr.categoryId,
        categoryName: cat?.name ?? "Categoria",
        icon:         cat?.icon ?? "📊",
        currentSpent,
        avgPrev,
        changePercent,
        excess: currentSpent - avgPrev,
      });
    }
  }

  return insights.sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
}

```

#### app/actions/categories.ts

```ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { scopeWhere } from "@/lib/security/scope";
import { TransactionType } from "@prisma/client";
import { DEFAULT_CATEGORIES_PT_BR } from "@/lib/finance/default-categories";
import { normalizeMerchantKey, suggestCategoryFromMerchant } from "@/lib/finance/merchant-dictionary";

const CategorySchema = z.object({
  name: z.string().min(1).max(50),
  type: z.nativeEnum(TransactionType),
  icon: z.string().max(10).optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
  taxClassification: z.enum(["DEDUCTIBLE_IR", "NON_DEDUCTIBLE", "TAXABLE_INCOME", "OTHER"]).optional().nullable(),
});

async function getAuthContext() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");
  const fullUser = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true, householdId: true, role: true } });
  if (!fullUser) throw new Error("Usuário não encontrado");
  return fullUser;
}

function requireWriteRole(role: string) {
  if (role === "VIEWER") throw new Error("Permissão negada: somente leitura");
}

export async function getCategories(type?: TransactionType) {
  const ctx = await getAuthContext();
  return prisma.category.findMany({ where: { ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }), ...(type ? { type } : {}) }, orderBy: { name: "asc" } });
}

export async function seedDefaultCategoriesForUser() {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const existing = await prisma.category.findMany({ where: scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }), select: { name: true, type: true } });
  const keySet = new Set(existing.map((c) => `${c.name}|${c.type}`));
  const toCreate = DEFAULT_CATEGORIES_PT_BR.filter((c) => !keySet.has(`${c.name}|${c.type}`));
  if (toCreate.length) {
    await prisma.category.createMany({
      data: toCreate.map((category) => ({ ...category, userId: ctx.id, householdId: ctx.householdId })),
    });
  }
  revalidatePath("/categorias");
  return { created: toCreate.length };
}

export async function createCategory(formData: unknown) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const parsed = CategorySchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  try {
    const category = await prisma.category.create({ data: { userId: ctx.id, householdId: ctx.householdId, ...parsed.data } });
    revalidatePath("/categorias");
    return { success: true, data: category };
  } catch {
    return { error: "Erro ao criar categoria." };
  }
}

export async function updateCategory(id: string, formData: unknown) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const parsed = CategorySchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const existing = await prisma.category.findFirst({ where: { id, ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }) } });
  if (!existing) return { error: "Categoria não encontrada" };

  try {
    const category = await prisma.category.update({ where: { id }, data: parsed.data });
    revalidatePath("/categorias");
    return { success: true, data: category };
  } catch {
    return { error: "Erro ao atualizar categoria." };
  }
}

export async function deleteCategory(id: string) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const existing = await prisma.category.findFirst({ where: { id, ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }) } });
  if (!existing) return { error: "Categoria não encontrada" };

  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/categorias");
    return { success: true };
  } catch {
    return { error: "Erro ao excluir categoria. Verifique se não há transações vinculadas." };
  }
}

export async function getUncategorizedTransactions() {
  const ctx = await getAuthContext();
  return prisma.transaction.findMany({
    where: { ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }), categoryId: null },
    orderBy: { date: "desc" },
    take: 50,
    include: { category: true },
  });
}

export async function suggestCategoryForTransactions(transactionIds: string[]) {
  const ctx = await getAuthContext();
  const txs = await prisma.transaction.findMany({ where: { ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }), id: { in: transactionIds } } });
  const categories = await prisma.category.findMany({ where: scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }) });
  const rules = await prisma.categoryLearningRule.findMany({ where: scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }) });
  const memories = await prisma.merchantMemory.findMany({ where: scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }) });

  return txs.map((tx) => {
    const desc = tx.description ?? "";
    const normalized = normalizeMerchantKey(desc);

    const rule = rules.find((r) => normalized.includes(normalizeMerchantKey(r.descriptionPattern)));
    if (rule) {
      return { transactionId: tx.id, suggestedCategoryId: categories.find((c) => c.name === rule.categoryName)?.id ?? null, confidence: 0.97, source: "rule" };
    }

    const memory = memories.find((m) => normalizeMerchantKey(m.merchantName) === normalized);
    if (memory?.categoryId) {
      return { transactionId: tx.id, suggestedCategoryId: memory.categoryId, confidence: 0.91, source: "memory" };
    }

    const dictName = suggestCategoryFromMerchant(desc);
    const category = categories.find((c) => c.name === dictName);
    return { transactionId: tx.id, suggestedCategoryId: category?.id ?? null, confidence: category ? 0.82 : 0.3, source: category ? "dictionary" : "none" };
  });
}

export async function applyCategoryBulk(params: { transactionIds: string[]; categoryId: string; createRule?: boolean }) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const { transactionIds, categoryId, createRule = false } = params;
  const category = await prisma.category.findFirst({ where: { id: categoryId, ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }) } });
  if (!category) throw new Error("Categoria inválida");

  const txs = await prisma.transaction.findMany({ where: { ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }), id: { in: transactionIds } } });
  const updateResult = await prisma.transaction.updateMany({ where: { ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId ?? null }), id: { in: transactionIds } }, data: { categoryId } });

  let ruleCreated = 0;
  if (createRule) {
    for (const tx of txs) {
      const merchantName = (tx.description ?? "").trim();
      if (!merchantName) continue;
      const descriptionPattern = normalizeMerchantKey(merchantName);
      await prisma.categoryLearningRule.upsert({
        where: { userId_descriptionPattern_categoryName: { userId: ctx.id, descriptionPattern, categoryName: category.name } },
        create: { userId: ctx.id, householdId: ctx.householdId, descriptionPattern, categoryName: category.name, usageCount: 1 },
        update: { usageCount: { increment: 1 } },
      });
      await prisma.merchantMemory.upsert({
        where: { id: `${ctx.id}-${descriptionPattern}` },
        create: { id: `${ctx.id}-${descriptionPattern}`, userId: ctx.id, householdId: ctx.householdId, merchantName: descriptionPattern, categoryId, correctedCount: 1 },
        update: { categoryId, correctedCount: { increment: 1 }, lastUsedAt: new Date() },
      });
      ruleCreated += 1;
    }
  }

  revalidatePath("/categorias");
  revalidatePath("/caixa");
  return { updated: updateResult.count, ruleCreated };
}

```

#### app/actions/fluxo.ts

```ts
"use server";

import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { scopeWhere } from "@/lib/security/scope";
import { getMonthBoundsUtc } from "@/lib/finance/period";

async function getCtx() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });
  return { userId: user.id, householdId: dbUser?.householdId ?? null };
}

export type FluxoMensal = {
  sankey: {
    nodes: Array<{ name: string }>;
    links: Array<{ source: number; target: number; value: number }>;
  };
  totalEntrada: number;
  totalSaida: number;
  saldoMes: number;
  donutCategorias: Array<{ name: string; value: number }>;
};

export type FluxoEvolucaoPoint = { month: string; entrada: number; saida: number; saldo: number };

export async function getFluxoMensal(month: number, year: number): Promise<FluxoMensal> {
  const ctx = await getCtx();
  const { start, endExclusive } = getMonthBoundsUtc(year, month);
  const txs = await prisma.transaction.findMany({
    where: {
      ...scopeWhere(ctx),
      status: "COMPLETED",
      ignoreInTotals: false,
      type: { not: "TRANSFER" },
      date: { gte: start, lt: endExclusive },
    },
    include: { category: true, bankAccount: true },
  });

  const totalEntrada = txs
    .filter((tx) => tx.type === "INCOME")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalSaida = txs
    .filter((tx) => tx.type === "EXPENSE")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const saldoMes = totalEntrada - totalSaida;

  const categoryTotals = new Map<string, number>();
  for (const tx of txs.filter((item) => item.type === "EXPENSE")) {
    const key = tx.category?.name ?? "Sem categoria";
    categoryTotals.set(key, (categoryTotals.get(key) ?? 0) + Number(tx.amount));
  }

  const categoryNames = Array.from(categoryTotals.keys());
  // Recharts Sankey trabalha com índices numéricos em nodes[].
  const nodes = [{ name: "Entradas" }, ...categoryNames.map((name) => ({ name })), { name: "Saldo" }];
  const saldoIndex = nodes.length - 1;
  const entradasIndex = 0;

  const links = [
    ...categoryNames.map((name, idx) => ({
      source: entradasIndex,
      target: idx + 1,
      value: categoryTotals.get(name) ?? 0,
    })),
    { source: entradasIndex, target: saldoIndex, value: Math.max(saldoMes, 0) },
  ].filter((link) => link.value > 0);

  return {
    sankey: { nodes, links },
    totalEntrada,
    totalSaida,
    saldoMes,
    donutCategorias: categoryNames.map((name) => ({ name, value: categoryTotals.get(name) ?? 0 })),
  };
}

export async function getFluxoEvolucao(meses = 6): Promise<FluxoEvolucaoPoint[]> {
  const now = new Date();
  const points: FluxoEvolucaoPoint[] = [];
  for (let i = meses - 1; i >= 0; i -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const data = await getFluxoMensal(date.getUTCMonth() + 1, date.getUTCFullYear());
    points.push({
      month: `${String(date.getUTCMonth() + 1).padStart(2, "0")}/${date.getUTCFullYear()}`,
      entrada: data.totalEntrada,
      saida: data.totalSaida,
      saldo: data.saldoMes,
    });
  }
  return points;
}

```

#### app/actions/goals.ts

```ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const GoalSchema = z.object({
  name:          z.string().min(1).max(80),
  targetAmount:  z.coerce.number().positive("Valor alvo deve ser positivo"),
  currentAmount: z.coerce.number().min(0).default(0),
  deadline:      z.coerce.date().optional().nullable(),
  icon:          z.string().max(10).optional().nullable(),
  color:         z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthContext() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, householdId: true, role: true },
  });
  if (!fullUser) throw new Error("Usuário não encontrado");
  return fullUser;
}

function requireWriteRole(role: string) {
  if (role === "VIEWER") throw new Error("Permissão negada: somente leitura");
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function getGoals() {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return [];

  return prisma.goal.findMany({
    where: { householdId: ctx.householdId },
    orderBy: [{ completed: "asc" }, { deadline: "asc" }, { createdAt: "desc" }],
  });
}

export async function createGoal(formData: unknown) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  if (!ctx.householdId) return { error: "Você não pertence a um grupo familiar" };

  const parsed = GoalSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  try {
    const goal = await prisma.goal.create({
      data: { householdId: ctx.householdId, ...parsed.data },
    });
    revalidatePath("/metas");
    return { success: true, data: goal };
  } catch {
    return { error: "Erro ao criar meta." };
  }
}

export async function updateGoal(id: string, formData: unknown) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);

  const goal = await prisma.goal.findFirst({
    where: { id, householdId: ctx.householdId ?? "" },
  });
  if (!goal) return { error: "Meta não encontrada" };

  const parsed = GoalSchema.partial().safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  try {
    await prisma.goal.update({ where: { id }, data: parsed.data });
    revalidatePath("/metas");
    return { success: true };
  } catch {
    return { error: "Erro ao atualizar meta." };
  }
}

export async function contributeToGoal(id: string, amount: number) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);

  const goal = await prisma.goal.findFirst({
    where: { id, householdId: ctx.householdId ?? "" },
  });
  if (!goal) return { error: "Meta não encontrada" };

  const newAmount = Math.min(Number(goal.currentAmount) + amount, Number(goal.targetAmount));
  const completed = newAmount >= Number(goal.targetAmount);

  await prisma.goal.update({
    where: { id },
    data: { currentAmount: newAmount, completed },
  });

  revalidatePath("/metas");
  return { success: true, completed };
}

export async function deleteGoal(id: string) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);

  const goal = await prisma.goal.findFirst({
    where: { id, householdId: ctx.householdId ?? "" },
  });
  if (!goal) return { error: "Meta não encontrada" };

  await prisma.goal.delete({ where: { id } });
  revalidatePath("/metas");
  return { success: true };
}

```

#### app/actions/household.ts

```ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { requireWriteContext } from "@/lib/security/auth-context";
import { enforceRateLimit } from "@/lib/security/rate-limit";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthContext() {
  return requireWriteContext();
}

// ─── Actions ─────────────────────────────────────────────────────────────────

/**
 * Buscar membros do household atual.
 */
export async function getHouseholdMembers() {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return { members: [], household: null, inviteCode: null };

  const household = await prisma.household.findUnique({
    where: { id: ctx.householdId },
    include: {
      users: {
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      },
    },
  });

  return {
    household,
    members: household?.users ?? [],
    inviteCode: household?.inviteCode ?? null,
  };
}

/**
 * Gerar novo código de convite (apenas ADMIN).
 */
export async function generateInviteCode() {
  const ctx = await getAuthContext();

  if (ctx.role !== UserRole.ADMIN) {
    return { error: "Apenas administradores podem gerar convites" };
  }
  if (!ctx.householdId) {
    return { error: "Você não pertence a um household" };
  }

  // Gera código de 8 chars legível
  const code = randomBytes(4).toString("hex").toUpperCase();

  await prisma.household.update({
    where: { id: ctx.householdId },
    data: { inviteCode: code },
  });

  revalidatePath("/familia");
  return { success: true, code };
}

/**
 * Gerar link de convite com token único e validade de 48h (apenas ADMIN).
 */
export async function generateInviteLink() {
  const ctx = await getAuthContext();
  const limit = await enforceRateLimit({
    key: `invite:create:${ctx.id}`,
    limit: 12,
    windowSeconds: 60 * 60,
  });
  if (!limit.allowed) return { error: "Muitas tentativas. Aguarde para gerar novo convite.", status: 429 };

  if (ctx.role !== UserRole.ADMIN) {
    return { error: "Apenas administradores podem gerar convites" };
  }
  if (!ctx.householdId) {
    return { error: "Você não pertence a um household" };
  }

  const token = randomBytes(16).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  await prisma.householdInvite.create({
    data: {
      householdId: ctx.householdId,
      token,
      createdById: ctx.id,
      expiresAt,
    },
  });

  revalidatePath("/familia");
  return { success: true, token };
}

/**
 * Entrar num household via código de convite.
 */
export async function joinHousehold(code: string) {
  const ctx = await getAuthContext();

  if (!code || code.trim().length < 4) {
    return { error: "Código inválido" };
  }

  const household = await prisma.household.findUnique({
    where: { inviteCode: code.trim().toUpperCase() },
  });

  if (!household) {
    return { error: "Código de convite não encontrado" };
  }

  if (ctx.householdId === household.id) {
    return { error: "Você já pertence a este grupo familiar" };
  }

  // Novos membros entram como MEMBER
  await prisma.$transaction([
    prisma.user.update({
      where: { id: ctx.id },
      data: {
        householdId: household.id,
        role: UserRole.MEMBER,
      },
    }),
    prisma.bankAccount.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    }),
    prisma.category.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    }),
    prisma.transaction.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    })
  ]);

  revalidatePath("/familia");
  revalidatePath("/");
  return { success: true, householdName: household.name };
}

/**
 * Entrar num household via link de convite com token.
 */
export async function joinHouseholdByToken(token: string) {
  const ctx = await getAuthContext();
  const limit = await enforceRateLimit({
    key: `invite:accept:${ctx.id}:${token.slice(0, 8)}`,
    limit: 15,
    windowSeconds: 60 * 60,
  });
  if (!limit.allowed) return { error: "Muitas tentativas de convite. Aguarde e tente novamente.", status: 429 };

  if (!token || token.trim().length < 8) {
    return { error: "Token inválido" };
  }

  const invite = await prisma.householdInvite.findUnique({
    where: { token: token.trim() },
    include: { household: true },
  });

  if (!invite) {
    return { error: "Convite não encontrado" };
  }

  if (invite.usedAt) {
    return { error: "Este convite já foi utilizado" };
  }

  if (invite.expiresAt < new Date()) {
    return { error: "Este convite expirou" };
  }

  if (ctx.householdId === invite.householdId) {
    return { error: "Você já pertence a este grupo familiar" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: ctx.id },
      data: {
        householdId: invite.householdId,
        role: UserRole.MEMBER,
      },
    }),
    prisma.householdInvite.update({
      where: { id: invite.id },
      data: { usedAt: new Date(), usedById: ctx.id },
    }),
    prisma.bankAccount.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: invite.householdId },
    }),
    prisma.category.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: invite.householdId },
    }),
    prisma.transaction.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: invite.householdId },
    }),
  ]);

  revalidatePath("/familia");
  revalidatePath("/");
  return { success: true, householdName: invite.household.name };
}

/**
 * Criar household (se o usuário não tiver um).
 */
export async function createHousehold(name: string) {
  const ctx = await getAuthContext();

  if (ctx.householdId) {
    return { error: "Você já pertence a um grupo familiar" };
  }

  const parsed = z.string().min(2).max(60).safeParse(name);
  if (!parsed.success) {
    return { error: "Nome deve ter entre 2 e 60 caracteres" };
  }

  const code = randomBytes(4).toString("hex").toUpperCase();

  const household = await prisma.household.create({
    data: {
      name: parsed.data,
      inviteCode: code,
      users: { connect: { id: ctx.id } },
    },
  });

  await prisma.$transaction([
    prisma.user.update({
      where: { id: ctx.id },
      data: { householdId: household.id, role: UserRole.ADMIN },
    }),
    prisma.bankAccount.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    }),
    prisma.category.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    }),
    prisma.transaction.updateMany({
      where: { userId: ctx.id, householdId: null },
      data: { householdId: household.id },
    })
  ]);

  revalidatePath("/familia");
  return { success: true, data: household };
}

/**
 * Alterar role de um membro (apenas ADMIN).
 * Suporta ADMIN, MEMBER e VIEWER.
 */
export async function updateMemberRole(memberId: string, role: UserRole) {
  const ctx = await getAuthContext();

  if (ctx.role !== UserRole.ADMIN) {
    return { error: "Apenas administradores podem alterar roles" };
  }

  const validRoles: UserRole[] = [UserRole.ADMIN, UserRole.MEMBER, UserRole.VIEWER];
  if (!validRoles.includes(role)) {
    return { error: "Role inválido" };
  }

  const member = await prisma.user.findFirst({
    where: { id: memberId, householdId: ctx.householdId ?? "" },
  });

  if (!member) return { error: "Membro não encontrado" };
  if (member.id === ctx.id) return { error: "Você não pode alterar seu próprio role" };

  await prisma.user.update({ where: { id: memberId }, data: { role } });
  revalidatePath("/familia");
  return { success: true };
}

/**
 * Remover membro do household (apenas ADMIN).
 */
export async function removeMember(memberId: string) {
  const ctx = await getAuthContext();

  if (ctx.role !== UserRole.ADMIN) {
    return { error: "Apenas administradores podem remover membros" };
  }
  if (memberId === ctx.id) {
    return { error: "Você não pode remover a si mesmo" };
  }

  const member = await prisma.user.findFirst({
    where: { id: memberId, householdId: ctx.householdId ?? "" },
  });

  if (!member) return { error: "Membro não encontrado" };

  await prisma.user.update({
    where: { id: memberId },
    data: { householdId: null },
  });

  revalidatePath("/familia");
  return { success: true };
}

/**
 * Criar conta de acesso para o contador (role VIEWER, sem household).
 */
export async function createCounterAccount(email: string, password: string) {
  const ctx = await getAuthContext();

  if (ctx.role !== UserRole.ADMIN) {
    return { error: "Apenas administradores podem criar contas de contador" };
  }

  const schema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
  });

  const parsed = schema.safeParse({ email, password });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "Email já cadastrado" };

  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      password_hash: passwordHash,
      name: "Contador",
      householdId: ctx.householdId,
      role: UserRole.VIEWER,
    },
  });

  return { success: true, data: { id: user.id, email: user.email } };
}

/**
 * Obter resumo mensal para check do mês.
 */
export async function getMonthlySummary(monthStr?: string) {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return null;

  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;

  if (monthStr && /^\d{4}-\d{2}$/.test(monthStr)) {
    const [y, m] = monthStr.split("-").map(Number);
    year = y;
    month = m;
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const dateFilter = {
    householdId: ctx.householdId,
    status: "COMPLETED" as const,
    ignoreInTotals: false,
    date: { gte: startDate, lte: endDate },
  };

  const [
    incomeAgg, expenseAgg, expensesByCategory,
    goals, biggestExpenseTx, recommendations,
  ] = await Promise.all([
    prisma.transaction.aggregate({
      where: { ...dateFilter, type: "INCOME" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { ...dateFilter, type: "EXPENSE" },
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { ...dateFilter, type: "EXPENSE" },
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 5,
    }),
    prisma.goal.findMany({
      where: { householdId: ctx.householdId, completed: false },
      select: { name: true, targetAmount: true, currentAmount: true, deadline: true },
    }),
    prisma.transaction.findFirst({
      where: { ...dateFilter, type: "EXPENSE" },
      orderBy: { amount: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.aiRecommendation.findMany({
      where: {
        householdId: ctx.householdId,
        isDismissed: false,
        createdAt: { gte: startDate, lte: endDate },
      },
      select: { id: true, type: true, message: true },
      orderBy: { score: "desc" },
      take: 5,
    }),
  ]);

  const totalIncome = Number(incomeAgg._sum.amount ?? 0);
  const totalExpenses = Number(expenseAgg._sum.amount ?? 0);
  const netResult = totalIncome - totalExpenses;

  const categoryIds = expensesByCategory
    .map((c) => c.categoryId)
    .filter(Boolean) as string[];
  const categories = categoryIds.length
    ? await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, name: true },
      })
    : [];
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const topCategories = expensesByCategory.map((c) => {
    const amount = Number(c._sum.amount ?? 0);
    return {
      category: categoryMap.get(c.categoryId ?? "") ?? "Sem categoria",
      amount,
      percentOfTotal: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
    };
  });

  const goalsProgress = goals.map((g) => {
    const target = Number(g.targetAmount);
    const current = Number(g.currentAmount);
    return {
      name: g.name,
      progress: target > 0 ? Math.round((current / target) * 100) : 0,
      deadline: g.deadline?.toISOString() ?? null,
    };
  });

  const biggestExpense = biggestExpenseTx
    ? {
        description: biggestExpenseTx.description ?? "Sem descrição",
        amount: Number(biggestExpenseTx.amount),
        member: biggestExpenseTx.user?.name ?? "Desconhecido",
      }
    : null;

  return {
    totalIncome, totalExpenses, netResult,
    topCategories, goalsProgress, biggestExpense,
    recommendations: recommendations.map((r) => ({
      id: r.id, type: r.type, message: r.message,
    })),
  };
}

/**
 * Marcar o check mensal como visualizado.
 */
export async function markMonthlyCheckViewed(monthStr: string) {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return { error: "Sem household" };

  await prisma.monthlyCheckView.upsert({
    where: {
      householdId_month_userId: {
        householdId: ctx.householdId,
        month: monthStr,
        userId: ctx.id,
      },
    },
    create: {
      householdId: ctx.householdId,
      month: monthStr,
      userId: ctx.id,
    },
    update: { viewedAt: new Date() },
  });

  revalidatePath("/familia");
  return { success: true };
}

/**
 * Verificar se o check mensal já foi visualizado por todos os ADMINs do household.
 * Retorna true when all ADMIN users have viewed the check (ou se não há household).
 */
export async function hasMonthlyCheckBeenViewed(monthStr: string) {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return true;

  const adminViews = await prisma.monthlyCheckView.findMany({
    where: { householdId: ctx.householdId, month: monthStr },
  });

  const admins = await prisma.user.findMany({
    where: { householdId: ctx.householdId, role: UserRole.ADMIN },
    select: { id: true },
  });

  const viewedUserIds = new Set(adminViews.map((v) => v.userId));
  return admins.every((a) => viewedUserIds.has(a.id));
}

/**
 * Obter contribuição por membro do mês (VIEWER não vê dados individuais).
 */
export async function getMemberContributions(monthParam?: number, yearParam?: number) {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return [];
  if (ctx.role === UserRole.VIEWER) return [];

  const now = new Date();
  const month = monthParam ?? now.getMonth() + 1;
  const year = yearParam ?? now.getFullYear();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const members = await prisma.user.findMany({
    where: { householdId: ctx.householdId },
    select: { id: true, name: true, email: true },
  });

  const expenses = await prisma.transaction.groupBy({
    by: ["userId"],
    where: {
      householdId: ctx.householdId,
      type: "EXPENSE",
      status: "COMPLETED",
      ignoreInTotals: false,
      date: { gte: startDate, lte: endDate },
    },
    _sum: { amount: true },
  });

  const expenseMap = new Map(
    expenses.map((e) => [e.userId, Number(e._sum.amount ?? 0)])
  );
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e._sum.amount ?? 0), 0
  );

  return members.map((m) => {
    const amount = expenseMap.get(m.id) ?? 0;
    return {
      id: m.id,
      name: m.name ?? m.email,
      amount,
      percent: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
    };
  });
}

```

#### app/actions/recurring.ts

```ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { TransactionType, RecurringFrequency } from "@prisma/client";

async function getAuthContext() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, householdId: true, role: true },
  });
  if (!fullUser) throw new Error("Usuário não encontrado");
  return fullUser;
}

function requireWriteRole(role: string) {
  if (role === "VIEWER") throw new Error("Permissão negada: somente leitura");
}

export async function getRecurringTransactions() {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return [];

  return prisma.recurringTransaction.findMany({
    where: { householdId: ctx.householdId },
    include: {
      bankAccount: { select: { name: true, color: true } },
      category: { select: { name: true, color: true, icon: true } },
    },
    orderBy: { nextDate: "asc" },
  });
}

const RecurringSchema = z.object({
  id: z.string().optional(),
  bankAccountId: z.string().min(1),
  categoryId: z.string().nullable().optional(),
  type: z.nativeEnum(TransactionType),
  amount: z.coerce.number().positive(),
  description: z.string().min(1),
  frequency: z.nativeEnum(RecurringFrequency),
  nextDate: z.string().min(1),
  endDate: z.string().nullable().optional(),
});

export async function upsertRecurringTransaction(formData: FormData) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  if (!ctx.householdId) return { error: "Sem grupo familiar" };

  const parsed = RecurringSchema.safeParse({
    id: formData.get("id"),
    bankAccountId: formData.get("bankAccountId"),
    categoryId: formData.get("categoryId") || null,
    type: formData.get("type"),
    amount: formData.get("amount"),
    description: formData.get("description"),
    frequency: formData.get("frequency"),
    nextDate: formData.get("nextDate"),
    endDate: formData.get("endDate") || null,
  });

  if (!parsed.success) return { error: "Dados inválidos" };
  const d = parsed.data;

  try {
    if (d.id) {
      await prisma.recurringTransaction.update({
        where: { id: d.id, householdId: ctx.householdId },
        data: {
          bankAccountId: d.bankAccountId,
          categoryId: d.categoryId,
          type: d.type,
          amount: d.amount,
          description: d.description,
          frequency: d.frequency,
          nextDate: new Date(d.nextDate),
          endDate: d.endDate ? new Date(d.endDate) : null,
        },
      });
    } else {
      await prisma.recurringTransaction.create({
        data: {
          householdId: ctx.householdId,
          bankAccountId: d.bankAccountId,
          categoryId: d.categoryId,
          type: d.type,
          amount: d.amount,
          description: d.description,
          frequency: d.frequency,
          nextDate: new Date(d.nextDate),
          endDate: d.endDate ? new Date(d.endDate) : null,
        },
      });
    }
    revalidatePath("/configuracoes");
    return { success: true };
  } catch {
    return { error: "Erro ao salvar transação recorrente" };
  }
}

export async function toggleRecurringState(id: string, active: boolean) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  if (!ctx.householdId) return { error: "Sem grupo familiar" };

  await prisma.recurringTransaction.update({
    where: { id, householdId: ctx.householdId },
    data: { active },
  });
  revalidatePath("/configuracoes");
  return { success: true };
}

export async function deleteRecurringTransaction(id: string) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  if (!ctx.householdId) return { error: "Sem grupo familiar" };

  await prisma.recurringTransaction.delete({
    where: { id, householdId: ctx.householdId },
  });
  revalidatePath("/configuracoes");
  return { success: true };
}

export async function autoDetectRecurring() {
  const ctx = await getAuthContext();
  if (!ctx.householdId) return { error: "Sem grupo familiar" };

  // Busca transações recentes para encontrar padrões
  const recent = await prisma.transaction.findMany({
    where: { householdId: ctx.householdId, type: "EXPENSE" },
    orderBy: { date: "desc" },
    take: 100,
  });

  const map = new Map<string, typeof recent>();
  for (const t of recent) {
    if (!t.description) continue;
    const norm = t.description.toLowerCase().trim();
    if (!map.has(norm)) map.set(norm, []);
    map.get(norm)!.push(t);
  }

  const suggestions: { description: string, amount: number, occurrences: number }[] = [];
  for (const [, txs] of map.entries()) {
    if (txs.length >= 3) {
      suggestions.push({
        description: txs[0].description!,
        amount: Number(txs[0].amount),
        occurrences: txs.length
      });
    }
  }

  return { success: true, suggestions };
}

```

#### app/actions/transactions.ts

```ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TransactionType, TransactionStatus } from "@prisma/client";
import { resolveTransactionCategoryId } from "@/lib/finance/categorize";
import { saveUserLearningRule } from "@/lib/finance/learning";
import { runFinanceIntelligence } from "@/lib/finance/intelligence";
import { requireWriteContext, ServiceUnavailableError } from "@/lib/security/auth-context";
import { scopeWhere } from "@/lib/security/scope";
import { getCurrentMonthBoundsUtc, getMonthBoundsUtc } from "@/lib/finance/period";
import { computeCanonicalTotals, computeCanonicalFlow } from "@/lib/finance/kernel";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const CreateTransactionSchema = z.object({
  bankAccountId:    z.string().cuid("Conta inválida"),
  categoryId:       z.string().cuid().optional().nullable(),
  type:             z.nativeEnum(TransactionType),
  status:           z.nativeEnum(TransactionStatus).default("COMPLETED"),
  amount:           z.coerce.number().positive("Valor deve ser positivo"),
  description:      z.string().max(200).optional().nullable(),
  date:             z.coerce.date(),
  installmentNumber: z.coerce.number().int().positive().optional().nullable(),
  totalInstallments: z.coerce.number().int().positive().optional().nullable(),
  ignoreInTotals:   z.boolean().default(false),
  aiEventId:        z.string().optional().nullable(),
});

const UpdateTransactionSchema = CreateTransactionSchema.extend({
  id: z.string().cuid(),
});

const ListTransactionsSchema = z.object({
  page:         z.coerce.number().int().positive().default(1),
  limit:        z.coerce.number().int().positive().max(100).default(20),
  type:         z.nativeEnum(TransactionType).optional(),
  categoryId:   z.string().cuid().optional(),
  bankAccountId: z.string().cuid().optional(),
  userId:       z.string().cuid().optional(),
  dateFrom:     z.coerce.date().optional(),
  dateTo:       z.coerce.date().optional(),
  search:       z.string().max(100).optional(),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthContext() {
  return requireWriteContext();
}

function requireWriteRole(role: string) {
  if (role === "VIEWER") throw new Error("Permissão negada: somente leitura");
}

function buildWhereClause(
  ctx: { id: string; householdId: string | null },
  filters: z.infer<typeof ListTransactionsSchema>
) {
  return {
    ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
    ...(filters.type && { type: filters.type }),
    ...(filters.categoryId && { categoryId: filters.categoryId }),
    ...(filters.bankAccountId && { bankAccountId: filters.bankAccountId }),
    ...(filters.userId && { userId: filters.userId }),
    ...(filters.dateFrom || filters.dateTo
      ? {
          date: {
            ...(filters.dateFrom && { gte: filters.dateFrom }),
            ...(filters.dateTo   && { lte: filters.dateTo   }),
          },
        }
      : {}),
    ...(filters.search && {
      description: { contains: filters.search, mode: "insensitive" as const },
    }),
  };
}

// ─── Actions ─────────────────────────────────────────────────────────────────

/**
 * Listar transações com filtros e paginação.
 */
export async function getTransactions(filters?: unknown) {
  const ctx = await getAuthContext();
  const parsed = ListTransactionsSchema.safeParse(filters ?? {});

  if (!parsed.success) {
    return { error: "Filtros inválidos", data: [], total: 0 };
  }

  const { page, limit, ...rest } = parsed.data;
  const where = buildWhereClause(ctx, { page, limit, ...rest });
  const skip = (page - 1) * limit;

  const [transactions, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where,
      include: {
        bankAccount: { select: { id: true, name: true, color: true, icon: true } },
        category:    { select: { id: true, name: true, icon: true, color: true } },
        user:        { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { data: transactions, total, page, limit };
}

export type ManagedTransactionParams = {
  userId: string;
  householdId: string | null;
  bankAccountId: string;
  categoryId?: string | null;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description?: string | null;
  date: Date;
  installmentNumber?: number | null;
  totalInstallments?: number | null;
  ignoreInTotals?: boolean;
  aiEventId?: string | null;
  runIntelligence?: boolean;
};

/**
 * Helper interno para transações via código (inclui Auto-Save do IA).
 * Cria a transação e ajusta o saldo da conta numa transaction do Prisma.
 */
export async function createManagedTransaction(params: ManagedTransactionParams) {
  // Verificar que a conta pertence ao household
  const account = await prisma.bankAccount.findFirst({
    where: {
      id: params.bankAccountId,
      ...scopeWhere({ userId: params.userId, householdId: params.householdId }),
    },
  });

  if (!account) {
    throw new Error("Conta não encontrada ou sem permissão");
  }

  if (params.type === "TRANSFER") {
    throw new Error("TRANSFER desabilitado temporariamente: utilize transações de débito/crédito explícitas até o modelo de transferência dupla ser concluído.");
  }

  // Calcular delta do saldo
  const balanceDelta =
    !params.ignoreInTotals && params.status === "COMPLETED"
      ? params.type === "INCOME"
        ? params.amount
        : params.type === "EXPENSE"
        ? -params.amount
        : 0
      : 0;

  const inferredCategoryId = params.categoryId
    ?? await resolveTransactionCategoryId({
      userId: params.userId,
      householdId: params.householdId,
      description: params.description ?? "",
      type: params.type,
    });

  const [transaction] = await prisma.$transaction([
    prisma.transaction.create({
      data: {
        userId:       params.userId,
        householdId:  params.householdId,
        bankAccountId: params.bankAccountId,
        categoryId:   inferredCategoryId ?? null,
        type: params.type,
        status: params.status,
        amount: params.amount,
        description:  params.description ?? null,
        date: params.date,
        installmentNumber:  params.installmentNumber ?? null,
        totalInstallments:  params.totalInstallments ?? null,
        ignoreInTotals: params.ignoreInTotals ?? false,
      },
    }),
    // Atualizar saldo da conta
    ...(balanceDelta !== 0
      ? [
          prisma.bankAccount.update({
            where: { id: params.bankAccountId },
            data: { balance: { increment: balanceDelta } },
          }),
        ]
      : []),
    
  ]);

  // Backfill trace de IA
  if (params.aiEventId) {
    await prisma.aiCaptureEvent.updateMany({
      where: { 
        id: params.aiEventId,
        ...scopeWhere({ userId: params.userId, householdId: params.householdId }),
      },
      data: { createdTransactionId: transaction.id },
    }).catch(console.error);
  }

  if (params.runIntelligence !== false) {
    await runFinanceIntelligence(params.userId, params.householdId).catch((error) => {
      console.error("[finance/intelligence] failed after createManagedTransaction", error);
    });
  }

  return transaction;
}

/**
 * Criar nova transação (fluxo manual).
 * Atualiza o saldo da conta automaticamente.
 */
export async function createTransaction(formData: unknown) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const parsed = CreateTransactionSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  try {
    const transaction = await createManagedTransaction({
      userId: ctx.id,
      householdId: ctx.householdId,
      ...parsed.data
    });

    revalidatePath("/");
    revalidatePath("/caixa");
    revalidatePath("/caixa");
    return { success: true, data: transaction };
  } catch (err: any) {
    if (err instanceof ServiceUnavailableError) {
      return { error: "Serviço temporariamente indisponível", status: 503 };
    }
    console.error("createTransaction error:", err);
    return { error: err.message || "Erro ao registrar transação." };
  }
}


export type CreateTransactionBatchInput = {
  date: Date;
  amount: number;
  description: string;
  type: "expense" | "income";
};

export async function createTransactionBatch(items: CreateTransactionBatchInput[]) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);

  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Nenhuma transação para salvar." };
  }

  const accounts = await prisma.bankAccount.findMany({
    where: {
      ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
    },
    select: { id: true, isDefault: true },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  const bankAccountId = accounts.find((account) => account.isDefault)?.id ?? accounts[0]?.id;
  if (!bankAccountId) {
    return { error: "Nenhuma conta encontrada para salvar as transações." };
  }

  let saved = 0;

  for (const item of items) {
    if (!item?.description || !item?.date || !item?.amount) continue;

    try {
      await createManagedTransaction({
        userId: ctx.id,
        householdId: ctx.householdId,
        bankAccountId,
        type: item.type === "income" ? "INCOME" : "EXPENSE",
        status: "COMPLETED",
        amount: Math.abs(Number(item.amount)),
        description: item.description,
        date: item.date,
        runIntelligence: false,
      });
      saved += 1;
    } catch (error) {
      console.error("createTransactionBatch item error", error);
    }
  }

  revalidatePath("/inbox");
  revalidatePath("/caixa");
  await runFinanceIntelligence(ctx.id, ctx.householdId).catch((error) => {
    console.error("[finance/intelligence] failed after createTransactionBatch", error);
  });

  return { success: true, saved };
}

/**
 * Atualizar transação existente.
 * Reverte o saldo anterior e aplica o novo.
 */
export async function updateTransaction(formData: unknown) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);
  const parsed = UpdateTransactionSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { id, bankAccountId, categoryId, type, status, amount,
          description, date, installmentNumber,
          totalInstallments, ignoreInTotals } = parsed.data;

  // Verificar ownership
  const existing = await prisma.transaction.findFirst({
    where: {
      id,
      ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
    },
  });

  if (!existing) return { error: "Transação não encontrada" };

  const oldDelta =
    !existing.ignoreInTotals && existing.status === "COMPLETED"
      ? existing.type === "INCOME"
        ? -Number(existing.amount)
        : existing.type === "EXPENSE"
        ? Number(existing.amount)
        : 0
      : 0;

  const newDelta =
    !ignoreInTotals && status === "COMPLETED"
      ? type === "INCOME"
        ? amount
        : type === "EXPENSE"
        ? -amount
        : 0
      : 0;

  try {
    if (description && categoryId && existing.categoryId !== categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { name: true },
      });

      if (category?.name) {
        await saveUserLearningRule({
          userId: ctx.id,
          householdId: ctx.householdId,
          description,
          categoryName: category.name.toLowerCase(),
        });
      }
    }

    await prisma.$transaction([
      // Reverter saldo antigo
      ...(oldDelta !== 0
        ? [prisma.bankAccount.update({
            where: { id: existing.bankAccountId },
            data: { balance: { increment: oldDelta } },
          })]
        : []),
      // Aplicar novo saldo
      ...(newDelta !== 0
        ? [prisma.bankAccount.update({
            where: { id: bankAccountId },
            data: { balance: { increment: newDelta } },
          })]
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
          amount,
          description:       description ?? null,
          date,
          installmentNumber: installmentNumber ?? null,
          totalInstallments: totalInstallments ?? null,
          ignoreInTotals,
        },
      }),
    ]);

    revalidatePath("/");
    revalidatePath("/caixa");
    revalidatePath("/caixa");
    await runFinanceIntelligence(ctx.id, ctx.householdId).catch((error) => {
      console.error("[finance/intelligence] failed after updateTransaction", error);
    });
    return { success: true };
  } catch (err) {
    console.error("updateTransaction error:", err);
    return { error: "Erro ao atualizar transação." };
  }
}

/**
 * Excluir transação.
 * Reverte o impacto no saldo.
 */
export async function deleteTransaction(id: string) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);

  const existing = await prisma.transaction.findFirst({
    where: {
      id,
      ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
    },
  });

  if (!existing) return { error: "Transação não encontrada" };

  const revertDelta =
    !existing.ignoreInTotals && existing.status === "COMPLETED"
      ? existing.type === "INCOME"
        ? -Number(existing.amount)
        : existing.type === "EXPENSE"
        ? Number(existing.amount)
        : 0
      : 0;

  try {
    await prisma.$transaction([
      prisma.transaction.delete({ where: { id } }),
      ...(revertDelta !== 0
        ? [prisma.bankAccount.update({
            where: { id: existing.bankAccountId },
            data: { balance: { increment: revertDelta } },
          })]
        : []),
    ]);

    revalidatePath("/");
    revalidatePath("/caixa");
    revalidatePath("/caixa");
    return { success: true };
  } catch (err) {
    console.error("deleteTransaction error:", err);
    return { error: "Erro ao excluir transação." };
  }
}

/**
 * Dashboard: agregações do mês atual.
 */
export async function getDashboardSummary() {
  const ctx = await getAuthContext();

  const { start, endExclusive } = getCurrentMonthBoundsUtc();

  const where = {
    ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
    status: "COMPLETED" as const,
    ignoreInTotals: false,
    date: { gte: start, lt: endExclusive },
  };

  const [income, expense, accounts, recentTransactions, categoryBreakdown] =
    await prisma.$transaction([
      prisma.transaction.aggregate({
        where: { ...where, type: "INCOME" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      }),
      prisma.bankAccount.findMany({
        where: {
          ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
        },
        orderBy: { balance: "desc" },
      }),
      prisma.transaction.findMany({
        where: { ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }) },
        take: 5,
        orderBy: { date: "desc" },
        include: {
          bankAccount: { select: { name: true, color: true, icon: true } },
          category:    { select: { name: true, icon: true, color: true } },
          user:        { select: { id: true, name: true } },
        },
      }),
      // Top categorias de despesa do mês
      prisma.transaction.groupBy({
        by: ["categoryId"],
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
        take: 5,
      }),
    ]);

  // Buscar nomes das categorias para o breakdown
  const categoryIds = categoryBreakdown
    .map((c) => c.categoryId)
    .filter(Boolean) as string[];

  const categories = categoryIds.length
    ? await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, name: true, icon: true, color: true },
      })
    : [];

  const totals = computeCanonicalTotals(accounts.map((a) => ({ balance: Number(a.balance), type: a.type })));
  const flow = computeCanonicalFlow([
    { amount: Number(income._sum.amount ?? 0), type: "INCOME", status: "COMPLETED", ignoreInTotals: false },
    { amount: Number(expense._sum.amount ?? 0), type: "EXPENSE", status: "COMPLETED", ignoreInTotals: false },
  ]);

  return {
    totalBalance: totals.accountingBalance,
    netPosition: totals.netPosition,
    monthIncome: flow.income,
    monthExpense: flow.expense,
    accounts: accounts.map((a) => ({
      id: a.id, name: a.name, type: a.type,
      balance: Number(a.balance),
      color: a.color, icon: a.icon,
    })),
    recentTransactions: recentTransactions.map((tx) => ({
      id: tx.id, type: tx.type, amount: Number(tx.amount),
      description: tx.description,
      date: tx.date.toISOString(),
      bankAccount: tx.bankAccount,
      category: tx.category,
      user: tx.user,
    })),
    categoryBreakdown: categoryBreakdown.map((c) => ({
      categoryId: c.categoryId,
      amount:     Number(c._sum?.amount ?? 0),
      category:   categories.find((cat) => cat.id === c.categoryId) ?? null,
    })),
  };
}

/**
 * Evolução mensal dos últimos 6 meses (para gráfico).
 */
export async function getMonthlyEvolution() {
  const ctx = await getAuthContext();

  const months: { month: string; income: number; expense: number; balance: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    const base = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1));
    const year = base.getUTCFullYear();
    const month = base.getUTCMonth() + 1;
    const { start, endExclusive } = getMonthBoundsUtc(year, month);

    const [inc, exp] = await prisma.$transaction([
      prisma.transaction.aggregate({
        where: {
          ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
          type: "INCOME",
          status: "COMPLETED",
          ignoreInTotals: false,
          date: { gte: start, lt: endExclusive },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
          type: "EXPENSE",
          status: "COMPLETED",
          ignoreInTotals: false,
          date: { gte: start, lt: endExclusive },
        },
        _sum: { amount: true },
      }),
    ]);

    const income  = Number(inc._sum.amount ?? 0);
    const expense = Number(exp._sum.amount ?? 0);

    months.push({
      month: new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" }).format(start),
      income,
      expense,
      balance: income - expense,
    });
  }

  return months;
}

/**
 * Previsão de saldo mensal por dia (Dashboard).
 */
export async function getMonthForecast() {
  const ctx = await getAuthContext();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  // 1. Current total balance
  const accounts = await prisma.bankAccount.findMany({
    where: { ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }) },
    select: { balance: true }
  });
  const currentTotal = accounts.reduce((acc, a) => acc + Number(a.balance), 0);

  // 2. All transactions of the current month
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

  const transactions = await prisma.transaction.findMany({
    where: {
      ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
      ignoreInTotals: false,
      date: { gte: startOfMonth, lte: endOfMonth }
    },
    select: { amount: true, type: true, status: true, date: true }
  });

  const dailyDeltas = Array(daysInMonth).fill(0);
  const dailyPendingDeltas = Array(daysInMonth).fill(0);

  transactions.forEach(tx => {
    const day = tx.date.getDate() - 1; // 0-indexed
    const val = tx.type === "INCOME" ? Number(tx.amount) : tx.type === "EXPENSE" ? -Number(tx.amount) : 0;
    if (tx.status === "COMPLETED") {
      dailyDeltas[day] += val;
    } else {
      dailyPendingDeltas[day] += val;
    }
  });

  const totalCompletedMonth = dailyDeltas.reduce((a, b) => a + b, 0);
  let balance = currentTotal - totalCompletedMonth;

  let actualBalance = balance;
  let forecastBalance = balance;

  const data = [];
  for (let i = 0; i < daysInMonth; i++) {
    const day = i + 1;
    actualBalance += dailyDeltas[i];
    forecastBalance += dailyDeltas[i] + dailyPendingDeltas[i];

    data.push({
      day: String(day).padStart(2, "0"),
      actual: day <= today ? actualBalance : null,
      forecast: forecastBalance,
    });
  }

  return data;
}

/**
 * Desfazer transação criada pelo AI Composer.
 */
export async function undoTransaction(id: string) {
  const ctx = await getAuthContext();
  requireWriteRole(ctx.role);

  const existing = await prisma.transaction.findFirst({
    where: {
      id,
      ...scopeWhere({ userId: ctx.id, householdId: ctx.householdId }),
    },
  });

  if (!existing) return { error: "Transação não encontrada" };

  const revertDelta =
    !existing.ignoreInTotals && existing.status === "COMPLETED"
      ? existing.type === "INCOME"
        ? -Number(existing.amount)
        : existing.type === "EXPENSE"
        ? Number(existing.amount)
        : 0
      : 0;

  try {
    await prisma.$transaction([
      prisma.transaction.delete({ where: { id } }),
      ...(revertDelta !== 0
        ? [prisma.bankAccount.update({
            where: { id: existing.bankAccountId },
            data: { balance: { increment: revertDelta } },
          })]
        : []),
    ]);

    // Async auditoria para não quebrar a transação de banco em caso de falha
    prisma.aiCaptureEvent.updateMany({
      where: { createdTransactionId: id },
      data: { wasUndone: true }
    }).catch(console.error);

    revalidatePath("/");
    revalidatePath("/caixa");
    revalidatePath("/caixa");
    return { success: true };
  } catch (err) {
    console.error("undoTransaction error:", err);
    return { error: "Erro ao desfazer transação." };
  }
}

```

#### app/api/ai/chat/route.ts

```ts
import { NextRequest } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { formatCurrency } from "@/lib/format";
import { enforceHouseholdQuota, QuotaExceededError } from "@/lib/quotas/service";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL        = process.env.GROQ_MODEL ?? "gemma2-9b-it";

const BodySchema = z.object({
  message: z.string().min(1).max(1000),
});

export async function POST(req: NextRequest) {
  // Auth
  const { user } = await validateRequest();
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Validate body
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "Mensagem inválida" }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return Response.json({ error: "IA não configurada" }, { status: 503 });
  }

  // Build financial context from last 30 days
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });

  const context = await buildFinancialContext(dbUser?.householdId ?? null);
  try {
    await enforceHouseholdQuota({
      householdId: dbUser?.householdId ?? null,
      capability: "ai_chat",
      provider: "groq",
    });
  } catch (error) {
    if (error instanceof QuotaExceededError) {
      return Response.json({ error: error.message, code: error.code, details: error.details }, { status: 429 });
    }
    throw error;
  }

  const systemPrompt = `Você é um assistente de saúde financeira familiar chamado CtrlBot, integrado ao CtrlBank.
Responda sempre em português do Brasil, de forma objetiva e útil.
Limite respostas a 3 parágrafos curtos no máximo.
Não sugira produtos financeiros específicos ou faça recomendações de investimento. Seu foco é a governança da saúde financeira da família.

Diagnóstico de saúde financeira atual (últimos 30 dias):
${context}`;

  // Groq SSE streaming
  try {
    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model:       MODEL,
        stream:      true,
        max_tokens:  512,
        temperature: 0.7,
        messages: [
          { role: "system",  content: systemPrompt },
          { role: "user",    content: body.message },
        ],
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error("Groq error:", err);
      return Response.json({ error: "IA indisponível. Tente novamente mais tarde." }, { status: 502 });
    }

    // Pass SSE stream through to the client
    return new Response(groqRes.body, {
      headers: {
        "Content-Type":      "text/event-stream",
        "Cache-Control":     "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Groq fetch error:", error);
    return Response.json({ error: "Falha na comunicação com a IA." }, { status: 500 });
  }
}

// ─── Context Builder ──────────────────────────────────────────────────────────

async function buildFinancialContext(householdId: string | null): Promise<string> {
  if (!householdId) return "Nenhum dado financeiro disponível.";

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [transactions, budgets] = await Promise.all([
    prisma.transaction.findMany({
      where: { householdId, date: { gte: since }, status: "COMPLETED" },
      select: { type: true, amount: true, category: { select: { name: true } } },
      take: 200,
    }),
    prisma.budget.findMany({
      where: { householdId, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
      select: { amount: true, category: { select: { name: true } } },
    }),
  ]);

  const income  = transactions.filter(t => t.type === "INCOME" ).reduce((s, t) => s + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);

  const byCategory = new Map<string, number>();
  transactions.filter(t => t.type === "EXPENSE").forEach(t => {
    const k = t.category?.name ?? "Sem categoria";
    byCategory.set(k, (byCategory.get(k) ?? 0) + Number(t.amount));
  });

  const topCategories = Array.from(byCategory.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, val]) => `  - ${name}: ${formatCurrency(val)}`)
    .join("\n");

  const budgetLines = budgets
    .map(b => `  - ${b.category?.name ?? "?"}: limite ${formatCurrency(Number(b.amount))}`)
    .join("\n");

  return [
    `Receitas (30d): ${formatCurrency(income)}`,
    `Despesas (30d): ${formatCurrency(expense)}`,
    `Saldo líquido: ${formatCurrency(income - expense)}`,
    topCategories ? `\nTop despesas por categoria:\n${topCategories}` : "",
    budgetLines    ? `\nOrçamentos do mês:\n${budgetLines}` : "",
  ].filter(Boolean).join("\n");
}

```

#### app/api/ai/composer/route.ts

```ts
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { processAiIngest } from "@/lib/ai/ingest";
import { AIComposerMode, AIComposerResponse } from "@/lib/ai/contracts";
import { runFinanceIntelligence, buildFinanceContextReply } from "@/lib/finance/intelligence";
import { enforceHouseholdQuota, QuotaExceededError } from "@/lib/quotas/service";

const BodySchema = z.object({
  mode: z.enum(["Registrar", "Revisar", "Perguntar", "Planejar", "Sugerir"]).default("Registrar"),
  inputType: z.enum(["text", "image", "text+image", "audio", "pdf", "csv"]),
  content: z.string().optional(),
  imageBase64: z.string().optional(),
  mimeType: z.string().optional(),
  conversationId: z.string().optional(),
  audioDurationMs: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) return new Response("Não autorizado", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  try {
    await enforceHouseholdQuota({
      householdId: dbUser?.householdId ?? null,
      capability: "ai_composer",
      provider: "gemini",
    });

    const { getOrCreateConversation, saveAiMessage, createFinancialPlan } = await import("@/lib/ai/composer");

    const conversationId = await getOrCreateConversation(user.id, dbUser?.householdId ?? null, body.conversationId);

    // Save user message
    const userMessage = await saveAiMessage({
      conversationId,
      userId: user.id,
      role: "user",
      mode: body.mode,
      inputType: body.inputType,
      content: body.content ?? (body.inputType === "audio" ? "[Áudio Enviado]" : (body.imageBase64 ? "[Arquivo Anexado]" : "")),
      metadata: body.inputType === "audio"
        ? { inputType: "audio", audioDurationMs: body.audioDurationMs, transcriptionStatus: "pending" }
        : { inputType: body.inputType, audioDurationMs: body.audioDurationMs }
    });

    let response: AIComposerResponse;
    if (body.mode === "Perguntar") {
      const finance = await runFinanceIntelligence(user.id, dbUser?.householdId ?? null);
      const contextualReply = buildFinanceContextReply({
        question: body.content ?? "",
        monthlyTotal: finance.monthly.total,
        topCategories: finance.topCategories,
        average: finance.average,
        alerts: finance.alerts,
        recommendations: finance.recommendations,
        signals: finance.signals,
      });

      response = {
        intent: "chat_reply",
        message: contextualReply,
        requiresReview: false,
        autoSaved: false,
        transactionDraft: null,
        createdTransactionId: null,
        undoAvailable: false,
        undoToken: null,
        eventId: null,
        captureGroupId: null,
        conversationId,
        missingFields: [],
      };
    } else {
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: "IA não configurada" }, { status: 503 });
      }

      response = await processAiIngest({
        userId: user.id,
        householdId: dbUser?.householdId ?? null,
        mode: body.mode as AIComposerMode,
        inputType: body.inputType as any,
        content: body.content,
        imageBase64: body.imageBase64,
        mimeType: body.mimeType,
      });
    }

    response.conversationId = conversationId;

    if (body.inputType === "audio" && userMessage?.id) {
      await prisma.aiMessage.update({
        where: { id: userMessage.id },
        data: {
          content: response.userTranscript?.trim() || "[Áudio Enviado]",
          metadata: {
            inputType: "audio",
            audioDurationMs: body.audioDurationMs,
            transcriptionStatus: response.userTranscript?.trim() ? "completed" : "failed",
            transcript: response.userTranscript?.trim() || null,
          },
        }
      });
    }

    if (response.intent === "saved_plan" && response.transactionDraft) {
      const plan = await createFinancialPlan(user.id, dbUser?.householdId ?? null, response.transactionDraft);
      if (plan) {
        response.savedPlanId = plan.id;
        const { syncFinancialPlan } = await import("@/lib/ai/planner");
        await syncFinancialPlan(plan.id);
        // Also save assistant message for the plan
        await saveAiMessage({
          conversationId,
          userId: user.id,
          role: "assistant",
          mode: body.mode,
          content: "Plano financeiro criado com sucesso.",
          metadata: { intent: response.intent, savedPlanId: plan.id, planData: response.transactionDraft }
        });
        return NextResponse.json(response);
      }
    }

    if (response.intent === "product_feedback_logged" && response.feedbackId) {
      await saveAiMessage({
        conversationId,
        userId: user.id,
        role: "assistant",
        mode: body.mode,
        content: response.message,
        metadata: { intent: response.intent, feedbackId: response.feedbackId, normalizedFeedback: response.normalizedFeedback }
      });
      return NextResponse.json(response);
    }

    // Save common assistant reply
    await saveAiMessage({
      conversationId,
      userId: user.id,
      role: "assistant",
      mode: body.mode,
      content: response.message,
      metadata: {
        intent: response.intent,
        draft: response.transactionDraft,
        createdTxId: response.createdTransactionId,
        missingFields: response.missingFields
      }
    });

    return NextResponse.json(response);

  } catch (error: any) {
    if (error instanceof QuotaExceededError) {
      return NextResponse.json({ error: error.message, code: error.code, details: error.details }, { status: 429 });
    }
    const message = error?.message || "Falha ao extrair dados";
    console.error("[ai/composer] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

```

#### app/api/inbox/email-webhook/route.ts

```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractTextFromImageWithOcr, extractTextFromPdf, isImageMimeType, isPdfMimeType } from "@/lib/inbox/ocr";
import { InboxInputType, InboxDocumentKind } from "@/lib/inbox/parse";
import { processCaptureBatch } from "@/lib/inbox/pipeline";
import { verifyPostmarkWebhook } from "@/lib/inbox/security";

export const runtime = "nodejs";

type PostmarkAttachment = {
  Name?: string;
  ContentType?: string;
  Content?: string;
};

type PostmarkInboundPayload = {
  From?: string;
  Subject?: string;
  TextBody?: string;
  HtmlBody?: string;
  Attachments?: PostmarkAttachment[];
};

function extractEmail(from: string | undefined) {
  if (!from) return null;
  const start = from.indexOf("<");
  const end = from.lastIndexOf(">");
  const value = start >= 0 && end > start ? from.slice(start + 1, end) : from;
  return value.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  if (!verifyPostmarkWebhook(req.headers)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const payload = (await req.json()) as PostmarkInboundPayload;
    const senderEmail = extractEmail(payload.From);

    if (!senderEmail) {
      return NextResponse.json({ ok: true });
    }

    const user = await prisma.user.findUnique({
      where: { email: senderEmail },
      select: { id: true, householdId: true },
    });

    if (!user) {
      console.info("[email-webhook] remetente sem usuário:", senderEmail);
      return NextResponse.json({ ok: true });
    }

    let rawInput = "";
    let inputType: InboxInputType = "text";
    let documentKind: InboxDocumentKind = "unknown";

    const attachment = payload.Attachments?.find((item) => {
      const mimeType = item.ContentType ?? "";
      return isImageMimeType(mimeType) || isPdfMimeType(mimeType) || mimeType === "text/csv" || mimeType === "application/x-ofx" || item.Name?.toLowerCase().endsWith(".ofx") || item.Name?.toLowerCase().endsWith(".csv");
    });

    if (attachment?.Content && attachment.ContentType) {
      const buffer = Buffer.from(attachment.Content, "base64");
      const name = attachment.Name?.toLowerCase() || "";

      if (name.endsWith(".ofx") || attachment.ContentType === "application/x-ofx") {
        rawInput = buffer.toString("utf-8");
        inputType = "ofx";
        documentKind = "statement";
      } else if (name.endsWith(".csv") || attachment.ContentType === "text/csv") {
        rawInput = buffer.toString("utf-8");
        inputType = "csv";
        documentKind = "statement";
      } else if (isImageMimeType(attachment.ContentType)) {
        rawInput = await extractTextFromImageWithOcr(buffer.toString("base64"), attachment.ContentType);
        inputType = "image";
      } else if (isPdfMimeType(attachment.ContentType)) {
        rawInput = await extractTextFromPdf(buffer);
        inputType = "pdf";
      }
    }

    if (!rawInput) {
      rawInput = payload.TextBody?.trim() || (payload.HtmlBody ?? "").trim();
    }

    if (!rawInput) {
      return NextResponse.json({ ok: true });
    }

    await processCaptureBatch({
      userId: user.id,
      householdId: user.householdId,
      inputs: [{
        rawInput,
        channel: "email",
        inputType,
        documentKind,
        fileName: attachment?.Name ?? null,
      }],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[email-webhook] erro:", error);
    return NextResponse.json({ ok: true });
  }
}

```

#### app/contador/[token]/ContadorPublicClient.tsx

```ts
"use client";

import React, { useMemo } from "react";
import { formatCurrency } from "@/lib/format";
import * as XLSX from "xlsx";
import { Download, FileText, Table } from "lucide-react";

interface Transaction {
  id: string; amount: number | string; type: string; date: Date | string; description: string | null;
  category: { id: string; name: string; taxClassification: string | null; icon: string | null; color: string | null } | null;
  bankAccount: { id: string; name: string; color: string | null };
  user: { id: string; name: string | null };
}

export default function ContadorPublicClient({ transactions, year }: { transactions: Transaction[], year: number }) {
  
  const txs = useMemo(() => transactions.map(t => ({ ...t, amount: Number(t.amount) })), [transactions]);

  // Totais
  const totalIncome = txs.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpense = txs.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const result = totalIncome - totalExpense;

  // Dedutíveis IR
  const deductibles = txs.filter(t => t.type === "EXPENSE" && t.category?.taxClassification === "DEDUCTIBLE_IR");
  const totalDeductibles = deductibles.reduce((s, t) => s + t.amount, 0);

  // Group by category para as despesas
  const expenseByCategory = useMemo(() => {
    const map = new Map<string, { name: string; amount: number; isDeductible: boolean }>();
    txs.filter(t => t.type === "EXPENSE").forEach(t => {
      const key = t.category?.name ?? "Sem Categoria";
      const existing = map.get(key);
      if (existing) {
        existing.amount += t.amount;
      } else {
        map.set(key, { 
          name: key, 
          amount: t.amount, 
          isDeductible: t.category?.taxClassification === "DEDUCTIBLE_IR"
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
  }, [txs]);

  // Exportar PDF
  async function exportPDF() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Diagnóstico do período", 20, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Ano Calendário: ${year}`, 20, 30);

    doc.setFont("helvetica", "bold");
    doc.text(`DRE Simplificado - ${year}`, 20, 45);
    
    doc.setFont("helvetica", "normal");
    doc.text("Total Receitas:", 20, 55); doc.text(formatCurrency(totalIncome), 100, 55);
    doc.text("Total Despesas:", 20, 62); doc.text(formatCurrency(totalExpense), 100, 62);
    doc.setFont("helvetica", "bold");
    doc.text("Resultado Líquido:", 20, 72); doc.text(formatCurrency(result), 100, 72);

    doc.text("Despesas Dedutíveis (IR):", 20, 85); 
    doc.text(formatCurrency(totalDeductibles), 100, 85);

    let y = 100;
    doc.setFontSize(14);
    doc.text("Extrato - Todos os Movimentos", 20, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.text("Data", 20, y); doc.text("Tipo", 50, y); doc.text("Categoria", 80, y); doc.text("Valor", 160, y);
    y += 7;
    doc.setFont("helvetica", "normal");

    for (const tx of txs) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const d = new Date(tx.date).toLocaleDateString("pt-BR");
      const t = tx.type === "INCOME" ? "Receita" : tx.type === "EXPENSE" ? "Despesa" : "Transf.";
      const c = tx.category?.name ?? "Sem categoria";
      const v = formatCurrency(tx.amount);

      if (tx.type === "INCOME") doc.setTextColor(34, 197, 94);
      else doc.setTextColor(239, 68, 68);

      doc.text(d, 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(t, 50, y); doc.text(c.slice(0, 25), 80, y); doc.text(v, 155, y, { align: "right" });
      y += 6;
    }

    doc.save(`relatorio-contador-${year}.pdf`);
  }

  // Exportar Excel
  function exportExcel() {
    const rows = txs.map(tx => ({
      Data: new Date(tx.date).toLocaleDateString("pt-BR"),
      Tipo: tx.type === "INCOME" ? "Receita" : tx.type === "EXPENSE" ? "Despesa" : "Transf.",
      Categoria: tx.category?.name ?? "Sem Categoria",
      Classificação: tx.category?.taxClassification === "DEDUCTIBLE_IR" ? "Dedutível IR" : "-",
      Conta: tx.bankAccount.name,
      Descrição: tx.description ?? "",
      Valor: tx.amount
    }));

    const dreRows = [
      { Rubrica: "Total Receitas", Valor: totalIncome },
      { Rubrica: "Total Despesas", Valor: totalExpense },
      { Rubrica: "Resultado Líquido", Valor: result },
      { Rubrica: "", Valor: "" },
      { Rubrica: "Despesas Dedutíveis (IR)", Valor: totalDeductibles },
    ];

    const wb = XLSX.utils.book_new();
    const wsExtrato = XLSX.utils.json_to_sheet(rows);
    const wsDRE = XLSX.utils.json_to_sheet(dreRows);
    
    // Add sheets
    XLSX.utils.book_append_sheet(wb, wsDRE, "DRE Consolidadado");
    XLSX.utils.book_append_sheet(wb, wsExtrato, "Movimentos Anuais");

    XLSX.writeFile(wb, `relatorio-contador-${year}.xlsx`);
  }

  return (
    <div className="space-y-6">
      
      {/* Cards KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-c6-sm border-l-4 border-positive">
          <p className="text-secondary text-xs font-bold uppercase">Receitas {year}</p>
          <p className="text-xl font-black text-positive mt-1 tabular-nums">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="card-c6-sm border-l-4 border-negative">
          <p className="text-secondary text-xs font-bold uppercase">Despesas {year}</p>
          <p className="text-xl font-black text-negative mt-1 tabular-nums">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="card-c6-sm border-l-4 border-primary">
          <p className="text-secondary text-xs font-bold uppercase">Resultado Líquido</p>
          <p className={`text-xl font-black mt-1 tabular-nums ${result >= 0 ? "text-positive" : "text-negative"}`}>
            {result >= 0 ? "+" : ""}{formatCurrency(result)}
          </p>
        </div>
        <div className="card-c6-sm border-l-4 border-info">
          <p className="text-secondary text-xs font-bold uppercase">Total Dedutível (IR)</p>
          <p className="text-xl font-black text-white mt-1 tabular-nums">{formatCurrency(totalDeductibles)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DRE Simplificado */}
        <div className="card-c6">
          <h2 className="font-bold text-lg mb-4">DRE - {year}</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-border/30">
              <span className="text-sm font-medium text-secondary">Receitas</span>
              <span className="text-sm font-bold text-positive">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border/30">
              <span className="text-sm font-medium text-secondary">Despesas</span>
              <span className="text-sm font-bold text-negative">{formatCurrency(totalExpense)}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-surface-2 px-3 rounded-lg">
              <span className="text-sm font-bold">Resultado Lïquido</span>
              <span className={`text-sm font-black ${result >= 0 ? "text-positive" : "text-negative"}`}>
                {formatCurrency(result)}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-sm mb-3">Maiores Despesas</h3>
            <div className="space-y-2">
              {expenseByCategory.slice(0, 5).map(c => (
                <div key={c.name} className="flex justify-between items-center text-xs">
                  <span className="text-secondary flex items-center gap-1">
                    {c.isDeductible && <span className="bg-info text-white text-[8px] px-1 py-0.5 rounded font-bold uppercase">IR</span>}
                    {c.name}
                  </span>
                  <span className="font-semibold text-white">{formatCurrency(c.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exportações */}
        <div className="space-y-4">
          <div className="card-c6 text-center space-y-4">
            <div className="bg-surface-2 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-primary">
              <Table size={24} />
            </div>
            <div>
              <h3 className="font-bold">Exportar Excel (.xlsx)</h3>
              <p className="text-xs text-secondary mt-1">Planilha completa contendo abas para o DRE e Extrato detalhado com todas as classificações.</p>
            </div>
            <button onClick={exportExcel} className="btn-primary w-full text-sm">
              <Download size={16} /> Baixar Excel Completo
            </button>
          </div>

          <div className="card-c6 text-center space-y-4">
            <div className="bg-surface-2 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-negative">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-bold">Exportar PDF</h3>
              <p className="text-xs text-secondary mt-1">Relatório paginado e bem formatado, pronto para arquivamento ou envio por email.</p>
            </div>
            <button onClick={exportPDF} className="btn-outline w-full text-sm hover:border-negative/50 hover:bg-negative/10 hover:text-negative transition-colors">
              <Download size={16} /> Baixar PDF
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

```

#### components/chat/AIChatWidget.tsx

```ts
"use client";

import React, { useState, useRef, useEffect, useTransition, useCallback } from "react";
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

  const [, startTransition] = useTransition();
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

  const fetchHistory = useCallback(async (cursor?: string) => {
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
          metadata: m.metadata,
        }));

        if (cursor) setMessages((prev) => [...formatted, ...prev]);
        else {
          setMessages(formatted);
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);


  useEffect(() => {
    if (open && accounts.length === 0) {
      startTransition(async () => {
        const [accs, cats] = await Promise.all([getAccounts(), getCategories()]);
        setAccounts(accs);
        setCategories(cats);
        await fetchHistory(); // Fetch initial history
      });
    }
  }, [open, accounts.length, fetchHistory]);

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
  }, [open, accounts.length, fetchHistory]);

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
    } catch {
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
                               <SavedPlanCard planData={message.metadata.planData} />
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
                    {mode === "Registrar" && "Diga, digite, cole um print ou anexe um PDF."}
                    {mode === "Revisar" && "Rascunhos e lotes aguardando sua aprovação."}
                    {mode === "Perguntar" && "Pergunte sobre seus dados. Respondo com evidência."}
                    {mode === "Planejar" && "Vamos traçar uma rota para a meta."}
                    {mode === "Sugerir" && "Relate um bug ou proponha uma melhoria do produto."}
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

#### components/finance/CategoryPill.tsx

```ts
import React from "react";

type Props = {
  name: string;
  color: string;
  icon?: string;
  size?: "sm" | "md";
};

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function CategoryPill({ name, color, icon, size = "md" }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"}`}
      style={{ borderColor: hexToRgba(color, 0.5), backgroundColor: hexToRgba(color, 0.12), color }}
      aria-label={`Categoria ${name}`}
    >
      {icon ? <span className="mr-1" aria-hidden>{icon}</span> : null}
      {name}
    </span>
  );
}

```

#### components/layout/DashboardLayoutClient.tsx

```ts
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

```

#### components/ui/CurrencyInput.tsx

```ts
"use client";

import React, { useState, useEffect } from "react";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string | number;
  onValueChange: (val: string) => void;
}

export function CurrencyInput({ value, onValueChange, className, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  // Sync prop value -> display (initial mostly)
  useEffect(() => {
    if (value === "" || value === null || value === undefined) {
      setDisplayValue("");
      return;
    }
    
    // Converte o numérico/string recebido para o formato BRL mas sem 'R$ ' pra exibir apenas valor
    const num = Number(value);
    if (!isNaN(num)) {
      const parts = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      setDisplayValue(parts);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Remove all non-digits
    const justDigits = rawValue.replace(/\D/g, "");
    
    if (!justDigits) {
      setDisplayValue("");
      onValueChange("");
      return;
    }

    // Convert string of digits to actual number/string considering it as cents
    const floatValue = Number(justDigits) / 100;
    
    // Update local state and parent state
    const formattedDisplay = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(floatValue);
    
    setDisplayValue(formattedDisplay);
    // Envia o plain float string como "10.00" pra api lidar
    onValueChange(floatValue.toString());
  };

  return (
    <div className="relative w-full">
      <input
        type="hidden"
        name={props.name}
        value={value ?? ""}
      />
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className={className}
        {...{...props, name: undefined}} // Oclude o name do input textual
      />
    </div>
  );
}

```

#### components/ui/EmptyState.tsx

```ts
"use client";

import React from "react";
import { type LucideIcon } from "lucide-react";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: EmptyStateAction;
  badge?: string;
  badgeVariant?: "warning" | "info" | "neutral";
  className?: string;
}

const badgeStyles = {
  warning: "bg-[#f59e0b]/10 border-[#f59e0b]/20 text-[#f59e0b]",
  info:    "bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]",
  neutral: "bg-white/5 border-white/10 text-[#71717a]",
};

const dotStyles = {
  warning: "bg-[#f59e0b]",
  info:    "bg-[#22c55e]",
  neutral: "bg-[#71717a]",
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  badge,
  badgeVariant = "neutral",
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center py-20 px-6 text-center",
        "bg-[#242424] border border-white/[0.08] rounded-[12px]",
        className,
      ].join(" ")}
    >
      <div className="w-14 h-14 rounded-[12px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5">
        <Icon size={24} style={{ color: "#71717a" }} />
      </div>
      <h2 className="text-base font-bold text-[#fafafa] mb-2">{title}</h2>
      <p className="text-sm text-[#71717a] max-w-xs leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#22c55e] text-black text-sm font-semibold hover:bg-[#16a34a] transition-colors"
        >
          {action.icon && <action.icon size={15} />}
          {action.label}
        </button>
      )}
      {badge && (
        <div
          className={[
            "mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border",
            badgeStyles[badgeVariant],
          ].join(" ")}
        >
          <div className={["w-1.5 h-1.5 rounded-full animate-pulse", dotStyles[badgeVariant]].join(" ")} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{badge}</span>
        </div>
      )}
    </div>
  );
}

```

#### components/ui/MoneyDisplay.tsx

```ts
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type MoneySize = "sm" | "md" | "lg" | "hero";

interface MoneyDisplayProps {
  amount: number;
  currency?: string;
  size?: MoneySize;
  /** Se true, aplica cor semântica: positivo = accent-primary, negativo = accent-danger */
  semantic?: boolean;
  /** Força cor de delta positivo (ex: variação de saldo) */
  delta?: boolean;
  className?: string;
  /** Oculta o valor (modo privacidade) */
  hidden?: boolean;
}

const sizeStyles: Record<MoneySize, string> = {
  hero: "text-[3rem] font-bold leading-none tracking-tight",
  lg:   "text-[1.875rem] font-semibold leading-none tracking-tight",
  md:   "text-[1.25rem] font-medium leading-none",
  sm:   "text-[0.875rem] font-normal leading-none",
};

function formatBRL(value: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Componente global de exibição de valores monetários.
 * Anima de 0 ao valor real em 600ms com easing ease-out ao montar.
 */
export function MoneyDisplay({
  amount,
  currency = "BRL",
  size = "md",
  semantic = false,
  delta = false,
  className,
  hidden = false,
}: MoneyDisplayProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const duration = 600; // ms

  useEffect(() => {
    if (hidden) return;

    const startValue = 0;
    const endValue = amount;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startValue + (endValue - startValue) * eased);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    startTimeRef.current = null;
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [amount, hidden]);

  // Cor semântica
  let colorClass = "";
  if (semantic || delta) {
    if (amount < 0) colorClass = "text-accent-danger";
    else if (delta && amount > 0) colorClass = "text-accent-primary";
    else if (semantic && amount >= 0) colorClass = "text-foreground";
  }

  if (hidden) {
    return (
      <span
        className={cn(
          sizeStyles[size],
          "font-display tabular-nums select-none",
          colorClass,
          className
        )}
      >
        ••••
      </span>
    );
  }

  return (
    <span
      className={cn(
        sizeStyles[size],
        "font-display tabular-nums animate-count-up",
        colorClass,
        className
      )}
      style={{ fontVariantNumeric: "tabular-nums", fontFeatureSettings: '"tnum"' }}
    >
      {formatBRL(displayValue, currency)}
    </span>
  );
}

```

#### components/ui/ReceiptScanButton.tsx

```ts
"use client";

import React, { useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScannedData {
  valor: number | null;
  data: string;
  estabelecimento: string | null;
  categoria: string;
  descricao: string | null;
  tipo: "INCOME" | "EXPENSE";
}

interface ReceiptScanButtonProps {
  onScanComplete: (data: ScannedData) => void;
  className?: string;
}

export default function ReceiptScanButton({
  onScanComplete,
  className = "",
}: ReceiptScanButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setScanning(true);

    // Preview da imagem
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Converter para base64 sem o prefixo data:...
      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => {
          const result = r.result as string;
          // Remover "data:image/jpeg;base64," para enviar só o base64
          resolve(result.split(",")[1]);
        };
        r.onerror = reject;
        r.readAsDataURL(file);
      });

      const response = await fetch("/api/receipt-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: file.type,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Falha ao escanear");
      }

      if (result.success) {
        onScanComplete(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar imagem");
    } finally {
      setScanning(false);
      // Limpar input para permitir re-scan do mesmo arquivo
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Botão principal */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={scanning}
        className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-dashed border-white/20 text-secondary hover:border-primary/40 hover:text-white hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
      >
        {scanning ? (
          <>
            <Loader2 size={16} className="animate-spin text-primary" />
            Lendo comprovante com IA...
          </>
        ) : (
          <>
            <Camera size={16} />
            Ler comprovante / nota fiscal
          </>
        )}
      </button>

      {/* Input file oculto — capture="environment" abre câmera traseira no mobile */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Selecionar imagem do comprovante"
      />

      {/* Preview da imagem escaneada */}
      <AnimatePresence>
        {preview && !scanning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative rounded-xl overflow-hidden border border-white/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Comprovante escaneado"
              className="w-full max-h-48 object-cover"
            />
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              aria-label="Remover preview"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
              <p className="text-white text-xs font-semibold">✓ Comprovante lido</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Erro */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-negative flex items-center gap-1"
          >
            ⚠ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

```

#### components/ui/button.tsx

```ts
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

#### components/ui/empty-state.tsx

```ts
"use client";

import React from "react";
import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center bg-[#242424] border border-white/[0.08] rounded-[12px] w-full"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="w-14 h-14 rounded-[12px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5"
      >
        <Icon size={24} style={{ color: "#71717a" }} />
      </motion.div>
      <h3 className="text-base font-bold text-[#fafafa] mb-2">{title}</h3>
      <p className="text-sm text-[#71717a] max-w-xs leading-relaxed">{description}</p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#22c55e] text-black text-sm font-semibold hover:bg-[#16a34a] transition-colors"
        >
          {action.icon && <action.icon size={15} />}
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}

```

#### components/ui/fab.tsx

```ts
"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ========================================
   FAB — Floating Action Button (C6 Bank)
   Pink accent, shadow glow, mobile-first
   ======================================== */

interface FABProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function FAB({ onClick, label = "Registrar Movimento", className }: FABProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "fixed z-50 flex items-center justify-center",
        "bg-primary text-white rounded-full shadow-fab",
        // Mobile: circle bottom-right
        "bottom-24 right-5 w-14 h-14",
        // Desktop: pill with label
        "md:bottom-8 md:right-8 md:w-auto md:h-auto md:py-3.5 md:px-6 md:gap-2",
        "transition-shadow hover:shadow-[0_6px_20px_rgba(255,45,85,0.45)]",
        className
      )}
      whileTap={{ scale: 0.93 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
      aria-label={label}
    >
      <Plus className="w-6 h-6 md:w-5 md:h-5" strokeWidth={2.5} />
      <span className="hidden md:inline text-sm font-semibold">{label}</span>
    </motion.button>
  );
}

```

#### components/ui/form.tsx

```ts
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>")
  }

  const fieldState = getFieldState(fieldContext.name, formState)

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}

```

#### components/ui/premium-card.tsx

```ts
import * as React from "react";
import { cn } from "@/lib/utils";

/* ========================================
   PremiumCard — C6 Bank Design System
   
   Usage:
     <PremiumCard>content</PremiumCard>
     <PremiumCard variant="elevated">elevated content</PremiumCard>
     <PremiumCard variant="bank">bank card style</PremiumCard>
   ======================================== */

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bank";
  hover?: boolean;
}

const variantClasses = {
  default: "card-premium",
  elevated: "card-premium bg-surface-elevated",
  bank: "card-bank",
} as const;

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, variant = "default", hover = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          !hover && "hover:border-border",
          className
        )}
        {...props}
      />
    );
  }
);
PremiumCard.displayName = "PremiumCard";

const PremiumCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between mb-4", className)}
    {...props}
  />
));
PremiumCardHeader.displayName = "PremiumCardHeader";

const PremiumCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold tracking-tight", className)}
    {...props}
  />
));
PremiumCardTitle.displayName = "PremiumCardTitle";

const PremiumCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
PremiumCardContent.displayName = "PremiumCardContent";

export {
  PremiumCard,
  PremiumCardHeader,
  PremiumCardTitle,
  PremiumCardContent,
};

```

#### components/ui/skeleton.tsx

```ts
import { cn } from "@/lib/utils";

/* ========================================
   Skeleton — C6 Bank Loading States
   ======================================== */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "circle" | "chart";
}

export function Skeleton({ className, variant = "text", ...props }: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full rounded-lg",
    card: "h-40 w-full rounded-3xl",
    circle: "h-12 w-12 rounded-full",
    chart: "h-[280px] w-full rounded-3xl",
  };

  return (
    <div
      className={cn("skeleton", variantClasses[variant], className)}
      {...props}
    />
  );
}

/* Dashboard Skeleton */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Balance skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-64" />
      </div>
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Skeleton variant="card" className="h-28" />
        <Skeleton variant="card" className="h-28" />
        <Skeleton variant="card" className="h-28 hidden md:block" />
      </div>
      {/* Account scroll */}
      <div className="flex gap-4 overflow-hidden">
        <Skeleton className="h-[170px] w-[280px] min-w-[280px] rounded-3xl" />
        <Skeleton className="h-[170px] w-[280px] min-w-[280px] rounded-3xl" />
      </div>
      {/* Transactions */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton variant="circle" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* Transaction List Skeleton */
export function TransactionListSkeleton() {
  return (
    <div className="space-y-3 animate-fade-in">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card-premium-sm flex items-center gap-4">
          <Skeleton variant="circle" className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <Skeleton className="h-5 w-24" />
        </div>
      ))}
    </div>
  );
}

/* Account Cards Skeleton */
export function AccountCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} variant="card" className="h-[200px]" />
      ))}
    </div>
  );
}

```

#### lib/ai/composer.ts

```ts
import { prisma } from "@/lib/prisma";
import { AIComposerTransactionDraft } from "./contracts";

export async function resolveTargetAccount(userId: string, householdId: string | null, inferredAccountName: string | null, merchantName?: string) {
  let accounts = [];
  if (householdId) {
    accounts = await prisma.bankAccount.findMany({ where: { householdId } });
  } else {
    accounts = await prisma.bankAccount.findMany({ where: { userId } });
  }

  if (accounts.length === 0) return null;

  // 0. Use MerchantMemory if exists
  if (merchantName) {
    const memory = await prisma.merchantMemory.findFirst({
      where: {
        OR: [{ householdId: householdId ?? "" }, { userId }],
        merchantName: { equals: merchantName, mode: "insensitive" },
        bankAccountId: { not: null }
      },
      orderBy: { correctedCount: "desc" }
    });
    if (memory && memory.bankAccountId) {
      const matched = accounts.find(a => a.id === memory.bankAccountId);
      if (matched) return matched;
    }
  }

  // 1. Exact or partial match if AI provided a name
  if (inferredAccountName) {
    const matched = accounts.find(a => a.name.toLowerCase().includes(inferredAccountName.toLowerCase()));
    if (matched) return matched;
  }

  // 2. Fallback to official default account
  const defaultAcc = accounts.find(a => a.isDefault);
  if (defaultAcc) return defaultAcc;

  // 3. Fallback to null
  return null;
}

export async function resolveCategory(userId: string, householdId: string | null, categoryName: string, transactionType: string, merchantName?: string) {
  const categories = await prisma.category.findMany({
    where: { 
      OR: [{ userId }, { householdId: householdId ?? "" }],
      type: transactionType as any
    }
  });

  // 0. Use MerchantMemory if exists
  if (merchantName) {
    const memory = await prisma.merchantMemory.findFirst({
      where: {
        OR: [{ householdId: householdId ?? "" }, { userId }],
        merchantName: { equals: merchantName, mode: "insensitive" },
        categoryId: { not: null }
      },
      orderBy: { correctedCount: "desc" }
    });
    if (memory && memory.categoryId) {
      const matched = categories.find(c => c.id === memory.categoryId);
      if (matched) return { id: matched.id, name: matched.name, fromMemory: true };
    }
  }

  if (categoryName === "Outros") return { id: null, name: "Outros" };

  const matched = categories.find(c => c.name.toLowerCase().includes(categoryName.toLowerCase()));
  if (matched) return { id: matched.id, name: matched.name };
  
  return { id: null, name: "Outros" };
}

export function shouldAutoSave(draft: AIComposerTransactionDraft, missing: string[]): boolean {
  if (missing.length > 0) return false;
  return draft.confidence.overall >= 0.85;
}

export type CreateAiCaptureEventInput = {
  userId: string;
  householdId: string | null;
  captureGroupId?: string | null;
  source: string;
  inputType: string;
  rawText: string | null;
  normalizedDraft: any | null;
  confidenceOverall: number;
  decision: string;
  createdTransactionId: string | null;
};

export async function logAiCaptureEvent(data: CreateAiCaptureEventInput) {
  try {
    return await prisma.aiCaptureEvent.create({ data });
  } catch (err) {
    console.error("[ai/composer] failed to log ai capture event", err);
    return null;
  }
}

export async function learnFromCorrection(userId: string, householdId: string | null, merchantName: string, categoryId: string | null, bankAccountId: string | null) {
  if (!merchantName || merchantName.length < 3) return;

  const mName = merchantName.trim();
  const existing = await prisma.merchantMemory.findFirst({
    where: {
      OR: [{ householdId: householdId ?? "" }, { userId }],
      merchantName: mName,
      categoryId: categoryId,
      bankAccountId: bankAccountId,
    }
  });

  if (existing) {
    await prisma.merchantMemory.update({
      where: { id: existing.id },
      data: { correctedCount: { increment: 1 }, lastUsedAt: new Date() }
    });
  } else {
    await prisma.merchantMemory.create({
      data: {
        userId,
        householdId,
        merchantName: mName,
        categoryId,
        bankAccountId,
        correctedCount: 1,
      }
    });
  }
}

// ─────────────────────────────────────────────
// Phase 11-14: Persistence & AI
// ─────────────────────────────────────────────

export async function getOrCreateConversation(userId: string, householdId: string | null, conversationId?: string | null) {
  if (conversationId) {
    const conv = await prisma.aiConversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    });
    if (conv) return conv.id;
  }
  const newConv = await prisma.aiConversation.create({
    data: { userId, householdId, title: "Nova Conversa" }
  });
  return newConv.id;
}

export async function saveAiMessage(data: {
  conversationId: string;
  userId: string;
  role: "user" | "assistant" | "system";
  mode: string;
  inputType?: string;
  content: string;
  metadata?: any;
}) {
  try {
    const message = await prisma.aiMessage.create({
      data: {
        conversationId: data.conversationId,
        userId: data.userId,
        role: data.role,
        mode: data.mode,
        inputType: data.inputType ?? "text",
        content: data.content,
        metadata: data.metadata ?? null,
      }
    });
    await prisma.aiConversation.update({
      where: { id: data.conversationId },
      data: { updatedAt: new Date() },
    });
    return message;
  } catch (err) {
    console.error("[ai/composer] failed to save ai message", err);
    return null;
  }
}

export async function createFinancialPlan(userId: string, householdId: string | null, planData: any) {
  try {
    const visibility = planData.visibility === "HOUSEHOLD" && householdId ? "HOUSEHOLD" : "PERSONAL";
    
    const plan = await prisma.financialPlan.create({
      data: {
        userId,
        householdId: visibility === "HOUSEHOLD" ? householdId : null,
        visibility,
        title: planData.title ?? "Plano Financeiro",
        objectiveType: planData.objectiveType ?? "general",
        targetAmount: planData.targetAmount,
        targetMonths: planData.targetMonths,
        monthlyRequiredAmount: planData.monthlyRequiredAmount,
        summary: planData.summary ?? "",
        recommendedCuts: planData.recommendedCuts,
        scenarioData: planData.scenarioData,
      }
    });
    // Auto sync immediately upon creation to seed initial snapshot
    const { syncFinancialPlan } = await import("./planner");
    await syncFinancialPlan(plan.id);
    return plan;
  } catch (err) {
    console.error("[ai/composer] failed to create financial plan", err);
    return null;
  }
}

export async function createRecommendation(userId: string, householdId: string | null, recData: any) {
  try {
    const visibility = recData.visibility === "HOUSEHOLD" && householdId ? "HOUSEHOLD" : "PERSONAL";
    
    return await prisma.aiRecommendation.create({
      data: {
        userId,
        householdId: visibility === "HOUSEHOLD" ? householdId : null,
        visibility,
        relatedPlanId: recData.relatedPlanId ?? null,
        type: recData.type ?? "insight",
        message: recData.message,
        actionLabel: recData.actionLabel,
        actionTarget: recData.actionTarget,
        score: recData.score ?? 0,
      }
    });
  } catch (err) {
    console.error("[ai/composer] failed to create rec", err);
    return null;
  }
}

// ─────────────────────────────────────────────
// Phase 15-18: Product Feedback Loop
// ─────────────────────────────────────────────

export async function createProductFeedback(
  userId: string,
  householdId: string | null,
  feedbackData: {
    rawInput: string;
    normalizedTitle: string;
    summary: string;
    type: string;
    area: string;
    impact: string;
    reproductionSteps?: any[];
    suggestedSolution?: string;
    acceptanceCriteria?: any[];
  },
  artifacts?: Array<{ kind: string; url?: string; content?: any }>
) {
  try {
    // 1. Deduplication: Find similar feedback in the same area
    const similarFeedbacks: any[] = await prisma.$queryRaw`
      SELECT id, "normalizedTitle", similarity("normalizedTitle", ${feedbackData.normalizedTitle}) as sim
      FROM "ProductFeedback"
      WHERE area = ${feedbackData.area}
      AND similarity("normalizedTitle", ${feedbackData.normalizedTitle}) > 0.7
      ORDER BY sim DESC
      LIMIT 1
    `;

    const relatedToId = similarFeedbacks.length > 0 ? similarFeedbacks[0].id : null;

    // 2. Calculate priorityScore
    // impact high=3 medium=2 low=1. score = impact*10 + (relatedCount*2)
    const impactMultiplier = feedbackData.impact === "high" ? 3 : feedbackData.impact === "medium" ? 2 : 1;
    
    let relatedCount = 0;
    if (relatedToId) {
      relatedCount = await prisma.productFeedback.count({
        where: { OR: [{ id: relatedToId }, { relatedToId }] }
      });
    }
    
    const priorityScore = (impactMultiplier * 10) + (relatedCount * 2);

    // 3. Create feedback record
    const feedback = await prisma.productFeedback.create({
      data: {
        userId,
        householdId,
        source: "composer",
        rawInput: feedbackData.rawInput,
        normalizedTitle: feedbackData.normalizedTitle,
        summary: feedbackData.summary,
        type: feedbackData.type,
        area: feedbackData.area,
        impact: feedbackData.impact,
        reproductionSteps: (feedbackData.reproductionSteps as any) ?? undefined,
        suggestedSolution: feedbackData.suggestedSolution ?? null,
        acceptanceCriteria: (feedbackData.acceptanceCriteria as any) ?? undefined,
        status: "new",
        priorityScore,
        relatedToId,
      }
    });

    // Create artifacts if provided
    if (artifacts && artifacts.length > 0) {
      await Promise.all(
        artifacts.map(artifact =>
          prisma.feedbackArtifact.create({
            data: {
              feedbackId: feedback.id,
              kind: artifact.kind,
              url: artifact.url ?? null,
              content: artifact.content ?? null,
            }
          })
        )
      );
    }

    return feedback;
  } catch (err) {
    console.error("[ai/composer] failed to create product feedback", err);
    return null;
  }
}

```

#### lib/ai/contracts.ts

```ts
/**
 * Contrato central de extração operacional do AI Composer.
 */

export type AIComposerIntent =
  | "chat_reply"
  | "transaction_created"
  | "transaction_draft"
  | "clarification_needed"
  | "batch_review"
  | "saved_plan"
  | "product_feedback_logged";

export type AIComposerMode = "Registrar" | "Revisar" | "Perguntar" | "Planejar" | "Sugerir";

export type AIComposerTransactionDraft = {
  amount: number | null;
  date: string | null; // YYYY-MM-DD
  description: string;
  transactionType: "INCOME" | "EXPENSE" | "TRANSFER";
  categoryName: string | null;
  categoryId: string | null;
  accountId: string | null;
  accountName: string | null;
  confidence: {
    overall: number; // 0..1
    amount: number;
    date: number;
    description: number;
    category: number;
    account: number;
    transactionType: number;
  };
  source: "text" | "image" | "text+image" | "audio" | "pdf" | "csv" | "ofx" | "import";
};

export type AIComposerBatchDraftItem = {
  eventId: string | null;
  draft: AIComposerTransactionDraft;
};

export type AIComposerResponse = {
  intent: AIComposerIntent;
  message: string;
  requiresReview: boolean;
  autoSaved: boolean;
  transactionDraft: AIComposerTransactionDraft | null;
  batchDrafts?: AIComposerBatchDraftItem[];
  createdTransactionId: string | null;
  savedPlanId?: string | null;
  feedbackId?: string | null;
  normalizedFeedback?: any | null;
  userTranscript?: string;
  undoAvailable: boolean;
  undoToken: string | null;
  eventId: string | null;
  captureGroupId: string | null;
  conversationId: string | null;
  missingFields: Array<"amount" | "date" | "description" | "category" | "account" | "transactionType">;
};

```

#### lib/ai/ingest.ts

```ts
import { prisma } from "@/lib/prisma";
import { AIProviderRegistry } from "./providers/registry";
import { AICapability, AIGenerationOptions } from "./providers/types";
import { randomUUID } from "crypto";
import { AIComposerResponse, AIComposerMode, AIComposerBatchDraftItem } from "@/lib/ai/contracts";
import { logAiCaptureEvent } from "@/lib/ai/composer";
import { parseCSVForAI } from "./csv-pdf-parser";
import { formatCurrency } from "@/lib/format";
import { runPromptGuard } from "@/lib/ai/prompt-guard";
import { routeAIRequest } from "@/lib/ai/router";
import { extractWithProvider } from "@/lib/ai/review-protocol/extractor";
import { resolveDraft } from "@/lib/ai/review-protocol/resolver";
import { reviewDraft } from "@/lib/ai/review-protocol/reviewer";
import { commitDraft } from "@/lib/ai/review-protocol/committer";
import { evaluateTransactionQuality } from "@/lib/finance/quality";


const JSON_PROMPT_SINGLE = `
Você é o AI Composer do CtrlBank, sistema de governança da saúde financeira familiar.
Analise a entrada e crie um rascunho de UM único movimento financeiro.
Extraia as informações e retorne APENAS um JSON válido.
Formato:
{
  "userTranscript": "<transcrição do áudio se a entrada for áudio; null caso contrário>",
  "amount": <número float ex: 50.90, ou null>,
  "date": "<YYYY-MM-DD ou null>",
  "description": "<Nome curto do estabelecimento ou descrição, max 60 chars>",
  "transactionType": "<INCOME, EXPENSE ou TRANSFER>",
  "categoryName": "<Uma destas: Alimentação, Transporte, Saúde, Lazer, Moradia, Educação, Vestuário, Serviços, Supermercado, Farmácia, Combustível. Se incerto: Outros>",
  "accountName": "<Nome da conta bancária deduzida. null se não houver menção explícita>",
  "confidence": {
    "overall": 0.0 a 1.0,
    "amount": 0.0 a 1.0,
    "date": 0.0 a 1.0,
    "description": 0.0 a 1.0,
    "category": 0.0 a 1.0,
    "account": 0.0 a 1.0,
    "transactionType": 0.0 a 1.0
  }
}
Regras:
1. Recebimento: INCOME. Gasto: EXPENSE.
2. overall é a média da sua certeza sobre todo o bloco.
`;

const JSON_PROMPT_BATCH = `
Você é o AI Composer do CtrlBank. Leia o extrato/fatura e identifique TODAS as transações financeiras.
Retorne APENAS um array JSON de transações. Exemplo:
[
  {
    "amount": 50.90, "date": "2026-04-10", "description": "Uber", "transactionType": "EXPENSE",
    "categoryName": "Transporte", "accountName": null,
    "confidence": { "overall": 0.9, "amount": 0.9, "date": 0.9, "description": 0.9, "category": 0.9, "account": 0, "transactionType": 0.9 }
  }
]
`;

export type ProcessIngestInput = {
  userId: string;
  householdId: string | null;
  mode: AIComposerMode;
  inputType: "text" | "image" | "text+image" | "audio" | "pdf" | "csv";
  content?: string;
  imageBase64?: string;
  mimeType?: string; // image/jpeg, application/pdf, audio/webm etc.
  disableAutoSave?: boolean;
};

export async function processAiIngest(input: ProcessIngestInput): Promise<AIComposerResponse> {
  const isChatMode = input.mode === "Perguntar" || input.mode === "Planejar";
  const isSuggestMode = input.mode === "Sugerir";
  const isBatch = input.inputType === "pdf" || input.inputType === "csv";
  const captureGroupId = randomUUID();
  
  let prompt = isBatch ? JSON_PROMPT_BATCH : JSON_PROMPT_SINGLE;
  let finContext = "";

  if (isSuggestMode) {
    prompt = "Você analisa feedback de produto. Converta input em JSON com: title, summary, type (bug|ux|feature|improvement), area (composer|mobile|dashboard|orcamentos|metas|relatorios|planner|other), impact (low|medium|high), reproductionSteps[], suggestedSolution, acceptanceCriteria[]";
    if (input.inputType === 'audio') prompt += " Se a entrada for Áudio, DEVE retornar o campo raiz 'userTranscript' com a transcrição.";
  } else if (isChatMode) {
    finContext = await buildFinancialContext(input.userId, input.householdId);
    prompt = input.mode === "Planejar"
      ? `Você é o CtrlBot, consultor de saúde financeira familiar do CtrlBank.
Responda sempre em português, de forma objetiva, prática e acionável.
Contexto financeiro (últimos 30 dias):
${finContext}

Se o usuário estiver pedindo para criar ou fazer um plano financeiro específico, responda APENAS com um JSON válido (sem markdown tags fora do JSON) neste formato estruturado:
{
  "plan": {
    "title": "...",
    "objectiveType": "...",
    "targetAmount": <numero ou null>,
    "targetMonths": <numero ou null>,
    "monthlyRequiredAmount": <numero ou null>,
    "summary": "...",
    "visibility": "PERSONAL",
    "recommendedCuts": [{"category": "...", "amount": 100}],
    "scenarioData": {"conservative": "...", "aggressive": "..."}
  }
}
Se ele fizer perguntas soltas ou se o contexto não suportar criar um plano, responda APENAS um JSON (sem texto fora) com a seguinte chave:
{
  "chatReply": "1. Diagnóstico... 2. Onde otimizar..."
}
${input.inputType === 'audio' ? 'Se a entrada for Áudio, você DEVE retornar o campo raiz "userTranscript" com a transcrição do que o usuário disse.' : ''}`
      : `Você é o CtrlBot, assistente analítico premium no CtrlBank.
Responda sempre em português, de forma concisa e útil.
Contexto financeiro (últimos 30 dias):
${finContext}

Responda à pergunta do usuário de forma clara. Se houver áudio, forneça um JSON com { "chatReply": "sua reposta", "userTranscript": "o que o usuario falou" } ao invés de texto simples!`;
  }

  const registry = new AIProviderRegistry();
  
  let capability: AICapability = "transaction_extract";
  if (isSuggestMode) capability = "suggestion";
  else if (isChatMode && input.mode === "Planejar") capability = "planning";
  else if (isChatMode) capability = "conversation";

  const isJsonExpected = capability !== "conversation" || input.inputType === "audio";

  let processedContent = input.content;
  if (input.inputType === "csv" && input.content) {
    processedContent = parseCSVForAI(input.content);
  }

  const payloadText = processedContent ?? input.content ?? "";
  const guard = runPromptGuard({
    text: payloadText,
    sourceChannel: input.mode === "Revisar" ? "composer" : "manual",
    inputType: input.inputType,
    strict: input.mode === "Revisar" || input.mode === "Registrar",
  });

  const promptWithInput = (input.inputType === "text" || input.inputType === "csv")
    ? (processedContent ? `${prompt}

Entrada:
${processedContent}` : prompt)
    : (input.content ? `${prompt}

Entrada do Usuário: "${input.content}"` : prompt);

  const route = await routeAIRequest({
    capability,
    inputType: input.inputType,
    textLength: promptWithInput.length,
    taintLevel: guard.taintLevel,
    householdId: input.householdId,
  });

  const opts: AIGenerationOptions = {
    responseFormat: isJsonExpected ? "json_object" : "text",
    providerHint: route.providerHint,
    allowFallback: route.allowFallback,
  };

  const extraction = await extractWithProvider({
    registry,
    capability,
    prompt: promptWithInput,
    inputType: input.inputType,
    imageBase64: input.imageBase64,
    mimeType: input.mimeType,
    opts,
  });

  let parsedItems: any = extraction.parsedItems;
  let rawTextResponse = extraction.rawTextResponse;

  // extract JSON / reply
  let parsedJson: any = null;
  
  if (isSuggestMode) {
    // Handle Sugerir mode
    try {
      const parsed = parsedItems;
      if (parsed) {
        const { createProductFeedback } = await import("@/lib/ai/composer");
        
        // Prepare artifacts if audio or image
        const artifacts: Array<{ kind: string; url?: string; content?: any }> = [];
        if (input.inputType === "audio") {
          artifacts.push({
            kind: "transcript",
            content: { transcript: parsed.userTranscript || "[Audio enviado]" }
          });
        }
        if (input.inputType === "image" || input.inputType === "text+image") {
          artifacts.push({
            kind: "image",
            url: input.imageBase64 ? `data:${input.mimeType || "image/jpeg"};base64,${input.imageBase64}` : undefined
          });
        }
        
        // Create feedback
        const feedback = await createProductFeedback(
          input.userId,
          input.householdId,
          {
            rawInput: input.content || "[Feedback enviado]",
            normalizedTitle: parsed.title || "Feedback sem título",
            summary: parsed.summary || input.content || "",
            type: parsed.type || "improvement",
            area: parsed.area || "other",
            impact: parsed.impact || "low",
            reproductionSteps: parsed.reproductionSteps,
            suggestedSolution: parsed.suggestedSolution,
            acceptanceCriteria: parsed.acceptanceCriteria
          },
          artifacts
        );
        
        if (feedback) {
          return {
            intent: "product_feedback_logged",
            message: "Sugestão registrada com sucesso.",
            requiresReview: false,
            autoSaved: true,
            transactionDraft: null,
            feedbackId: feedback.id,
            normalizedFeedback: parsed,
            createdTransactionId: null,
            undoAvailable: false,
            undoToken: null,
            eventId: null,
            captureGroupId,
            conversationId: null,
            missingFields: [],
            userTranscript: parsed.userTranscript
          };
        }
      }
    } catch (e) {
      console.error("[ai/ingest] Failed to process Sugerir mode:", e);
    }
    
    throw new Error("Não foi possível processar o feedback de produto.");
  } else if (isChatMode) {
    if (input.mode === "Planejar") {
      try {
        const parsed = parsedItems;
        if (parsed) {
          parsedJson = parsed;
          if (parsed.plan) {
            return {
              intent: "saved_plan",
              message: "Plano de saúde financeira rascunhado para revisão.",
              requiresReview: true,
              autoSaved: false,
              transactionDraft: parsed.plan, // reusing draft temporarily or returning raw plan block
              createdTransactionId: null,
              undoAvailable: false,
              undoToken: null,
              eventId: null,
              captureGroupId: null,
              conversationId: null,
              missingFields: [],
              userTranscript: parsed.userTranscript,
            };
          } else if (parsed.chatReply) {
             rawTextResponse = parsed.chatReply;
          }
        }
      } catch {
         // fallback
      }
    } else if (parsedItems && parsedItems.chatReply) {
       rawTextResponse = parsedItems.chatReply;
       parsedJson = parsedItems;
    }
    
    return {
      intent: "chat_reply",
      message: rawTextResponse,
      requiresReview: false,
      autoSaved: false,
      transactionDraft: null,
      createdTransactionId: null,
      undoAvailable: false,
      undoToken: null,
      eventId: null,
      captureGroupId: null,
      conversationId: null,
      missingFields: [],
      userTranscript: parsedJson?.userTranscript,
    };
  }

  if (!parsedItems) {
    throw new Error("A IA não retornou um formato JSON rastreável.");
  }

  if (isBatch) {
    const drafts = await Promise.all((parsedItems as any[]).map(async (item) => (await resolveDraft({ parsed: item, userId: input.userId, householdId: input.householdId, source: input.inputType })).draft));
    const batchDrafts: AIComposerBatchDraftItem[] = await Promise.all(
      drafts.map(async (draft) => {
        const aiEvent = await logAiCaptureEvent({
          userId: input.userId,
          householdId: input.householdId,
          captureGroupId,
          source: input.inputType,
          inputType: "composer",
          rawText: input.content ?? null,
          normalizedDraft: draft,
          confidenceOverall: draft.confidence.overall,
          decision: "batch_review",
          createdTransactionId: null,
        });

        return {
          eventId: aiEvent?.id ?? null,
          draft,
        };
      })
    );

    return {
       intent: "batch_review",
       message: `Encontrei ${drafts.length} itens. Confirme a importação.`,
       requiresReview: true,
       autoSaved: false,
       transactionDraft: null,
       batchDrafts,
       createdTransactionId: null,
       undoAvailable: false,
       undoToken: null,
       eventId: null,
       captureGroupId,
       conversationId: null,
       missingFields: []
    };
  }

  // Single Item
  const { draft, missingFields } = await resolveDraft({
    parsed: parsedItems,
    userId: input.userId,
    householdId: input.householdId,
    source: input.inputType,
  });

  const quality = await evaluateTransactionQuality({
    userId: input.userId,
    householdId: input.householdId,
    draft,
  });

  const forcedSecurityReview = guard.shouldEscalateToReview;
  const forcedQualityReview = quality.requiresReview;
  const forceReview = forcedSecurityReview || forcedQualityReview;

  const decision = reviewDraft({
    draft,
    missingFields,
    disableAutoSave: input.disableAutoSave,
    forceReview,
    forceReason: forcedSecurityReview
      ? "Entrada sinalizada para revisão de segurança."
      : "Entrada sinalizada por heurísticas de qualidade.",
  });

  const response: AIComposerResponse = {
    intent: decision.intent,
    message: decision.message,
    requiresReview: decision.requiresReview,
    autoSaved: false,
    transactionDraft: draft,
    createdTransactionId: null,
    undoAvailable: false,
    undoToken: null,
    eventId: null,
    captureGroupId,
    conversationId: null,
    missingFields: missingFields,
    userTranscript: parsedItems.userTranscript ?? undefined,
  };

  if (decision.canCommit) {
    const tx = await commitDraft({
      draft,
      userId: input.userId,
      householdId: input.householdId,
    });

    response.intent = "transaction_created";
    response.message = "Movimento registrado com sucesso.";
    response.requiresReview = false;
    response.autoSaved = true;
    response.createdTransactionId = tx.id;
    response.undoAvailable = true;
    response.undoToken = `undo_${tx.id}`;
  }

  // Audit
  const aiEvent = await logAiCaptureEvent({
    userId: input.userId,
    householdId: input.householdId,
    captureGroupId,
    source: input.inputType,
    inputType: "composer",
    rawText: input.content ?? null,
    normalizedDraft: { draft, qualitySignals: quality.signals, taint: guard.taintLevel },
    confidenceOverall: draft.confidence.overall,
    decision: response.intent,
    createdTransactionId: response.createdTransactionId,
  });
  
  if (aiEvent) {
    response.eventId = aiEvent.id;
  }

  return response;
}

async function buildFinancialContext(userId: string, householdId: string | null): Promise<string> {
  const whereScope = householdId ? { householdId } : { userId };

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [transactions, budgets] = await Promise.all([
    prisma.transaction.findMany({
      where: { ...whereScope, date: { gte: since }, status: "COMPLETED", ignoreInTotals: false },
      select: { type: true, amount: true, category: { select: { name: true } } },
      take: 200,
    }),
    householdId
      ? prisma.budget.findMany({
          where: { householdId, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
          select: { amount: true, category: { select: { name: true } } },
        })
      : Promise.resolve([]),
  ]);

  const income  = transactions.filter(t => t.type === "INCOME" ).reduce((s, t) => s + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);

  const byCategory = new Map<string, number>();
  transactions.filter(t => t.type === "EXPENSE").forEach(t => {
    const k = t.category?.name ?? "Sem categoria";
    byCategory.set(k, (byCategory.get(k) ?? 0) + Number(t.amount));
  });

  const topCategories = Array.from(byCategory.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, val]) => `  - ${name}: ${formatCurrency(val)}`)
    .join("\n");

  const budgetLines = budgets
    .map(b => `  - ${b.category?.name ?? "?"}: limite ${formatCurrency(Number(b.amount))}`)
    .join("\n");

  return [
    `Receitas (30d): ${formatCurrency(income)}`,
    `Despesas (30d): ${formatCurrency(expense)}`,
    `Saldo líquido: ${formatCurrency(income - expense)}`,
    topCategories ? `\nTop despesas por categoria:\n${topCategories}` : "",
    budgetLines    ? `\nOrçamentos do mês:\n${budgetLines}` : "",
  ].filter(Boolean).join("\n");
}

```

#### lib/ai/prompt-guard.ts

```ts
export type PromptGuardResult = {
  taintLevel: "LOW" | "MEDIUM" | "HIGH";
  suspiciousPatterns: string[];
  outOfDomain: boolean;
  shouldEscalateToReview: boolean;
};

const INJECTION_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  { label: "prompt_override", regex: /(ignore\s+(all|previous|prior)\s+instructions|system\s+prompt|developer\s+message)/i },
  { label: "secrets_exfiltration", regex: /(api[_\s-]?key|token|senha|password|secret|credential)/i },
  { label: "tooling_commands", regex: /(rm\s+-rf|curl\s+http|wget\s+http|powershell|bash\s+-c)/i },
  { label: "jailbreak", regex: /(jailbreak|bypass|dan mode|do anything now)/i },
];

const FINANCIAL_HINTS = /(r\$|pix|fatura|extrato|cart[aã]o|boleto|compra|pagamento|dep[oó]sito|sal[aá]rio|transfer[êe]ncia|receita|despesa|conta|banco)/i;

export function classifyTaintLevel(params: {
  sourceChannel?: string | null;
  inputType?: string | null;
}): "LOW" | "MEDIUM" | "HIGH" {
  const channel = (params.sourceChannel ?? "").toLowerCase();
  const inputType = (params.inputType ?? "").toLowerCase();

  if (["whatsapp", "email"].includes(channel)) return "HIGH";
  if (["image", "pdf", "audio", "text+image"].includes(inputType)) return "MEDIUM";
  return "LOW";
}

export function runPromptGuard(input: {
  text: string;
  sourceChannel?: string | null;
  inputType?: string | null;
  strict?: boolean;
}): PromptGuardResult {
  const text = (input.text ?? "").trim();
  const baseTaint = classifyTaintLevel({ sourceChannel: input.sourceChannel, inputType: input.inputType });

  const suspiciousPatterns = INJECTION_PATTERNS
    .filter((item) => item.regex.test(text))
    .map((item) => item.label);

  const outOfDomain = text.length > 24 && !FINANCIAL_HINTS.test(text);

  let taintLevel: "LOW" | "MEDIUM" | "HIGH" = baseTaint;
  if (suspiciousPatterns.length > 0) taintLevel = "HIGH";
  else if (outOfDomain && baseTaint === "LOW") taintLevel = "MEDIUM";

  const shouldEscalateToReview = taintLevel === "HIGH" || (input.strict && outOfDomain) || suspiciousPatterns.length > 0;

  return {
    taintLevel,
    suspiciousPatterns,
    outOfDomain,
    shouldEscalateToReview,
  };
}

```

#### lib/ai/providers/types.ts

```ts
export type AICapability =
  | "transaction_extract"
  | "conversation"
  | "planning"
  | "suggestion"
  | "transcription";

export interface AIProviderConfig {
  apiKey: string;
  defaultModel?: string; // Optional if provider supplies its own default
}

export interface AIGenerationOptions {
  systemPrompt?: string;
  responseFormat?: "json_object" | "text";
  temperature?: number;
  providerHint?: "gemini" | "openai" | "nvidia";
  allowFallback?: boolean;
}

export interface AIMediaFile {
  base64: string;
  mimeType: string;
}

export interface AIProvider {
  id: string;
  
  // Checking capability based on task and if media is present
  supports(capability: AICapability, hasMedia: boolean): boolean;

  generateText(prompt: string, opts?: AIGenerationOptions): Promise<string>;
  
  // Can either take a JSON schema or a text prompt formatted as JSON request
  generateStructured(prompt: string, schema?: any, opts?: AIGenerationOptions): Promise<any>;
  
  generateMultimodal(prompt: string, media: AIMediaFile, opts?: AIGenerationOptions): Promise<any>;
}


```

#### lib/ai/review-protocol/types.ts

```ts
import { AIComposerResponse, AIComposerTransactionDraft } from "@/lib/ai/contracts";

export type MissingField = "amount" | "date" | "description" | "category" | "account" | "transactionType";

export type ReviewDecision = {
  intent: AIComposerResponse["intent"];
  message: string;
  requiresReview: boolean;
  canCommit: boolean;
};

export type ResolvedDraft = {
  draft: AIComposerTransactionDraft;
  missingFields: MissingField[];
};

```

#### lib/ai/router.ts

```ts
import { AICapability } from "./providers/types";
import { getPolicyConfig } from "@/lib/policy/engine";
import { isExperimentEnabled } from "@/lib/experiments/service";
export type RouterInput = {
  capability: AICapability;
  inputType: "text" | "image" | "text+image" | "audio" | "pdf" | "csv";
  textLength: number;
  taintLevel?: "LOW" | "MEDIUM" | "HIGH";
};

export type RouterDecision = {
  providerHint: "gemini" | "openai" | "nvidia";
  allowFallback: boolean;
  reason: string;
};

function isOpenAiEnabled() {
  return process.env.OPENAI_API_KEY && process.env.AI_ENABLE_OPENAI === "true";
}

function isNimEnabled() {
  return Boolean(process.env.NIM_API_KEY);
}

export async function routeAIRequest(input: RouterInput & { householdId?: string | null }): Promise<RouterDecision> {
  const routingPolicy = await getPolicyConfig<{
    complexTextLength?: number;
    preferredComplexMediaProvider?: "openai" | "gemini" | "nvidia";
    preferredDenseReasoningProvider?: "openai" | "gemini" | "nvidia";
  }>("provider_routing", input.householdId);
  const hasMedia = ["image", "text+image", "audio", "pdf"].includes(input.inputType);
  const complexLength = Number(routingPolicy.complexTextLength ?? 1200);
  const isComplex = input.textLength > complexLength || input.inputType === "pdf" || input.taintLevel === "HIGH";
  const routingExperiment = await isExperimentEnabled({ key: "routing_alt_provider", householdId: input.householdId });

  if (routingExperiment.enabled) {
    const config = (routingExperiment.experiment?.config as any) ?? {};
    return {
      providerHint: config.providerHint ?? "gemini",
      allowFallback: true,
      reason: `experiment:${routingExperiment.experiment?.key ?? "routing_alt_provider"}`,
    };
  }

  // Política: visão/OCR complexo => GPT-4o quando habilitado
  if (hasMedia && isComplex && isOpenAiEnabled() && input.inputType !== "audio") {
    return {
      providerHint: routingPolicy.preferredComplexMediaProvider ?? "openai",
      allowFallback: true,
      reason: "media_complexity",
    };
  }

  // Política: análises densas sem mídia => NIM
  if (!hasMedia && isComplex && isNimEnabled() && ["conversation", "planning", "suggestion"].includes(input.capability)) {
    return {
      providerHint: routingPolicy.preferredDenseReasoningProvider ?? "nvidia",
      allowFallback: true,
      reason: "dense_reasoning_no_media",
    };
  }

  // Padrão: Gemini para ingestão leve e texto estruturado
  return {
    providerHint: "gemini",
    allowFallback: true,
    reason: "default_light_ingestion",
  };
}

```

#### lib/auth.ts

```ts
import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";
import { prisma } from "./prisma";
import { SESSION_COOKIE_NAME } from "./constants";
import { signToken, verifySignedToken } from "./session-utils";

const SESSION_EXPIRY_DAYS = 30;

export { SESSION_COOKIE_NAME };

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Create a new session for a user and set the session cookie.
 *
 * Security notes:
 * - The raw token is HMAC-SHA256 signed with SESSION_SECRET before being
 *   stored in the cookie, preventing cookie forgery at the middleware layer.
 * - Only the SHA-256 hash of the raw token is stored in the database, so a
 *   database leak cannot be used to replay sessions directly.
 */
export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const signedCookieValue = await signToken(token);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  await prisma.session.create({
    data: {
      id: tokenHash,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, signedCookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // "strict" prevents the cookie from being sent on any cross-site request,
    // which is appropriate for a financial application.
    sameSite: "strict",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    path: "/",
  });

  return token;
}

/**
 * Validate the current session by reading the cookie, verifying its HMAC
 * signature, hashing the raw token, and performing a single database query
 * that includes the associated user.
 *
 * Returns both the session and user, or nulls if not authenticated.
 *
 * Note: if the database is unavailable this function returns
 * { user: null, session: null } (fail-open for read operations). Callers
 * protecting write operations should surface a 503 response in that case.
 */
export async function validateSession(): Promise<{
  user: SessionUser | null;
  session: Session | null;
}> {
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!cookieValue) {
      return { user: null, session: null };
    }

    // Verify HMAC signature before hitting the database
    const token = await verifySignedToken(cookieValue);
    if (!token) {
      cookieStore.delete(SESSION_COOKIE_NAME);
      return { user: null, session: null };
    }

    const tokenHash = hashSessionToken(token);
    const sessionRecord = await prisma.session.findUnique({
      where: { id: tokenHash },
      include: { user: true },
    });

    if (!sessionRecord || sessionRecord.expiresAt < new Date()) {
      if (sessionRecord) {
        await prisma.session.delete({ where: { id: tokenHash } }).catch((e) => {
          console.error("Failed to delete expired session:", e);
        });
      }
      cookieStore.delete(SESSION_COOKIE_NAME);
      return { user: null, session: null };
    }

    return {
      user: {
        id: sessionRecord.user.id,
        email: sessionRecord.user.email,
        name: sessionRecord.user.name,
      },
      session: {
        id: sessionRecord.id,
        userId: sessionRecord.userId,
        expiresAt: sessionRecord.expiresAt,
      },
    };
  } catch (error: any) {
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error("Error validating session:", error);
    return { user: null, session: null };
  }
}

/**
 * Get the current authenticated user.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const { user } = await validateSession();
  return user;
}

/**
 * Invalidate a specific session by its raw (unhashed) token and clear the
 * session cookie.
 *
 * The token is hashed internally before the database lookup so callers should
 * always pass the raw token, never the hash.
 */
export async function invalidateSession(token: string): Promise<void> {
  try {
    const tokenHash = hashSessionToken(token);
    await prisma.session.delete({ where: { id: tokenHash } }).catch((e) => {
      console.error("Failed to delete session during invalidation:", e);
    });
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error: any) {
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error("Error invalidating session:", error);
  }
}

/**
 * Logout the current user by invalidating the session associated with the
 * current request cookie.
 */
export async function logout(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (cookieValue) {
      // Extract raw token from signed cookie value before hashing
      const token = await verifySignedToken(cookieValue);
      if (token) {
        const tokenHash = hashSessionToken(token);
        await prisma.session.delete({ where: { id: tokenHash } }).catch((e) => {
          console.error("Failed to delete session during logout:", e);
        });
      }
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error: any) {
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error("Error logging out:", error);
  }
}

/**
 * Backwards-compatible alias for validateSession.
 * Prefer using validateSession directly in new code.
 */
export async function validateRequest() {
  return validateSession();
}

```

#### lib/authorization.ts

```ts
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export interface AuthorizedUser {
  id: string;
  email: string;
  name: string | null;
  householdId: string | null;
  role: UserRole;
}

/**
 * Get the full authenticated user context including householdId and role.
 * Throws if not authenticated or user not found.
 */
export async function getAuthorizedUser(): Promise<AuthorizedUser> {
  const { user } = await validateRequest();
  if (!user) throw new Error("Não autenticado");

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, name: true, householdId: true, role: true },
  });
  if (!fullUser) throw new Error("Usuário não encontrado");

  return fullUser;
}

/**
 * Check if the user can perform write operations (POST/PUT/DELETE).
 * VIEWERs cannot write. Returns true if allowed.
 */
export function canWrite(role: UserRole): boolean {
  return role !== UserRole.VIEWER;
}

/**
 * Check if the user is an ADMIN.
 */
export function isAdmin(role: UserRole): boolean {
  return role === UserRole.ADMIN;
}

/**
 * Check if a resource belongs to the user's household.
 * Prevents cross-household access.
 */
export function belongsToHousehold(
  resourceHouseholdId: string | null,
  userHouseholdId: string | null
): boolean {
  if (!resourceHouseholdId || !userHouseholdId) return false;
  return resourceHouseholdId === userHouseholdId;
}

/**
 * Validate that the authenticated user has write permission.
 * Returns the authorized user or throws/returns error.
 */
export async function requireWriteAccess(): Promise<AuthorizedUser> {
  const user = await getAuthorizedUser();
  if (!canWrite(user.role)) {
    throw new Error("Permissão negada: somente leitura");
  }
  return user;
}

/**
 * Validate that the authenticated user is an ADMIN.
 */
export async function requireAdmin(): Promise<AuthorizedUser> {
  const user = await getAuthorizedUser();
  if (!isAdmin(user.role)) {
    throw new Error("Permissão negada: apenas administradores");
  }
  return user;
}

```

#### lib/calibration/service.ts

```ts
import type { CalibrationMode, PolicyStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPolicyConfig } from "@/lib/policy/engine";

const CALIBRATION_MODE = {
  RECOMMEND_ONLY: "RECOMMEND_ONLY",
  APPLY_WITH_GUARDRAILS: "APPLY_WITH_GUARDRAILS",
} as const satisfies Record<string, CalibrationMode>;

const POLICY_STATUS = {
  EXPERIMENTAL: "EXPERIMENTAL",
} as const satisfies Record<string, PolicyStatus>;

type CalibrationInput = {
  householdId: string;
  policyType: string;
  mode?: CalibrationMode;
  minSampleSize?: number;
  maxStepPct?: number;
  cooldownHours?: number;
};

export async function runCalibration(input: CalibrationInput) {
  const mode = input.mode ?? CALIBRATION_MODE.RECOMMEND_ONLY;
  const minSample = input.minSampleSize ?? 25;
  const maxStepPct = input.maxStepPct ?? 0.2;
  const cooldownHours = input.cooldownHours ?? 24;

  const latest = await prisma.calibrationRun.findFirst({
    where: { householdId: input.householdId, policyType: input.policyType },
    orderBy: { createdAt: "desc" },
  });

  if (latest && Date.now() - latest.createdAt.getTime() < cooldownHours * 3600 * 1000) {
    return prisma.calibrationRun.create({
      data: {
        householdId: input.householdId,
        policyType: input.policyType,
        mode,
        applied: false,
        reason: "cooldown_active",
        guardrailStatus: "blocked_cooldown",
      },
    });
  }

  const samples = await prisma.decisionEvaluation.findMany({
    where: {
      householdId: input.householdId,
      subjectType: input.policyType,
    },
    orderBy: { evaluatedAt: "desc" },
    take: 200,
  });

  if (samples.length < minSample) {
    return prisma.calibrationRun.create({
      data: {
        householdId: input.householdId,
        policyType: input.policyType,
        mode,
        applied: false,
        reason: "insufficient_sample_size",
        guardrailStatus: "blocked_sample_size",
        baselineMetrics: { sampleSize: samples.length },
      },
    });
  }

  const incorrectRate = samples.filter((s) => s.result === "INCORRECT" || s.result === "OVERRIDDEN").length / samples.length;
  const acceptedRate = samples.filter((s) => s.result === "ACCEPTED" || s.result === "CORRECT").length / samples.length;

  const current = await getPolicyConfig<Record<string, number>>(input.policyType, input.householdId);
  const currentThreshold = Number(current.riskScoreThreshold ?? current.similarityThreshold ?? 0.45);

  const targetDelta = incorrectRate > 0.25 ? 0.05 : acceptedRate > 0.8 ? -0.03 : 0;
  const boundedDelta = Math.max(-maxStepPct, Math.min(maxStepPct, targetDelta));
  const candidateThreshold = Number(Math.max(0.1, Math.min(0.95, currentThreshold + boundedDelta)).toFixed(4));

  let applied = false;
  let policyVersionId: string | undefined;
  let reason = "recommendation_generated";

  if (mode === CALIBRATION_MODE.APPLY_WITH_GUARDRAILS && boundedDelta !== 0) {
    const latestVersion = await prisma.policyVersion.findFirst({
      where: { householdId: input.householdId, policyType: input.policyType },
      orderBy: { version: "desc" },
    });

    const next = await prisma.policyVersion.create({
      data: {
        householdId: input.householdId,
        policyType: input.policyType,
        version: (latestVersion?.version ?? 0) + 1,
        status: POLICY_STATUS.EXPERIMENTAL,
        parentPolicyVersionId: latestVersion?.id,
        config: { ...current, riskScoreThreshold: candidateThreshold },
        description: "Auto-calibrated by Wave 5 engine",
      },
    });

    policyVersionId = next.id;
    applied = true;
    reason = "applied_with_guardrails";
  }

  const run = await prisma.calibrationRun.create({
    data: {
      householdId: input.householdId,
      policyType: input.policyType,
      mode,
      applied,
      reason,
      guardrailStatus: "ok",
      policyVersionId,
      baselineMetrics: { sampleSize: samples.length, incorrectRate, acceptedRate, currentThreshold },
      candidateConfig: { riskScoreThreshold: candidateThreshold, boundedDelta },
    },
  });

  await prisma.calibrationChange.create({
    data: {
      calibrationRunId: run.id,
      metricCode: "policy_threshold",
      baselineValue: currentThreshold,
      candidateValue: candidateThreshold,
    },
  });

  return run;
}

```

#### lib/database-url.ts

```ts
const RUNTIME_DATABASE_URL_KEYS = [
  "POSTGRES_PRISMA_URL",
  "DATABASE_URL",
  "POSTGRES_URL",
  "DATABASE_URL_UNPOOLED",
  "DIRECT_URL",
  "POSTGRES_URL_NON_POOLING",
] as const;

const MIGRATION_DATABASE_URL_KEYS = [
  "DIRECT_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
  "POSTGRES_PRISMA_URL",
  "DATABASE_URL",
  "POSTGRES_URL",
] as const;

type DatabaseUrlKey =
  | (typeof RUNTIME_DATABASE_URL_KEYS)[number]
  | (typeof MIGRATION_DATABASE_URL_KEYS)[number];

export interface ResolvedDatabaseUrl {
  key: DatabaseUrlKey;
  url: string;
}

export interface DatabaseDebugInfo {
  key: DatabaseUrlKey;
  host: string;
}

function pickDatabaseUrl(
  keys: readonly DatabaseUrlKey[],
  env: NodeJS.ProcessEnv
): ResolvedDatabaseUrl | null {
  for (const key of keys) {
    const rawValue = env[key];

    if (!rawValue) {
      continue;
    }

    const url = rawValue.trim();

    if (url.length === 0) {
      continue;
    }

    return { key, url };
  }

  return null;
}

function resolveDatabaseUrl(
  keys: readonly DatabaseUrlKey[],
  env: NodeJS.ProcessEnv,
  purpose: "runtime" | "migration"
): ResolvedDatabaseUrl {
  const resolved = pickDatabaseUrl(keys, env);

  if (!resolved) {
    throw new Error(
      `Missing database URL for ${purpose}. Set one of: ${keys.join(", ")}.`
    );
  }

  return resolved;
}

export function resolveRuntimeDatabaseUrl(
  env: NodeJS.ProcessEnv = process.env
): ResolvedDatabaseUrl {
  return resolveDatabaseUrl(RUNTIME_DATABASE_URL_KEYS, env, "runtime");
}

export function resolveMigrationDatabaseUrl(
  env: NodeJS.ProcessEnv = process.env
): ResolvedDatabaseUrl {
  return resolveDatabaseUrl(MIGRATION_DATABASE_URL_KEYS, env, "migration");
}

export function getDatabaseDebugInfo(
  resolved: ResolvedDatabaseUrl
): DatabaseDebugInfo {
  try {
    const parsed = new URL(resolved.url);
    return {
      key: resolved.key,
      host: parsed.host,
    };
  } catch {
    return {
      key: resolved.key,
      host: "invalid-url",
    };
  }
}

```

#### lib/finance/alerts.ts

```ts
import { prisma } from "@/lib/prisma";
import { getAverageSpending, getMonthlySpendingByCategory } from "@/lib/finance/analysis";

export type FinanceAlert = {
  type: "warning";
  message: string;
};

export async function generateFinanceAlerts(userId: string, householdId?: string | null): Promise<FinanceAlert[]> {
  const alerts: FinanceAlert[] = [];
  const monthly = await getMonthlySpendingByCategory(userId, householdId);
  const average = await getAverageSpending(userId, householdId);

  if (average > 0 && monthly.total > average * 1.3) {
    const increasePercent = Math.round(((monthly.total - average) / average) * 100);
    alerts.push({
      type: "warning",
      message: `Seu gasto total está ${increasePercent}% acima da sua média recente.`,
    });
  }

  const dominantCategory = Object.entries(monthly.byCategory).sort((a, b) => b[1] - a[1])[0];
  if (dominantCategory && monthly.total > 0) {
    const [category, amount] = dominantCategory;
    const share = amount / monthly.total;

    if (share >= 0.7) {
      alerts.push({
        type: "warning",
        message: `A categoria ${category} representa ${Math.round(share * 100)}% dos gastos do mês.`,
      });
    }
  }

  const { start, end } = {
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  };

  const highestExpense = await prisma.transaction.findFirst({
    where: {
      OR: [{ userId }, ...(householdId ? [{ householdId }] : [])],
      type: "EXPENSE",
      status: "COMPLETED",
      ignoreInTotals: false,
      date: { gte: start, lte: end },
    },
    orderBy: { amount: "desc" },
  });

  if (highestExpense && average > 0 && Number(highestExpense.amount) > average * 0.4) {
    alerts.push({
      type: "warning",
      message: `Gasto isolado alto detectado: R$ ${Number(highestExpense.amount).toFixed(2)} em ${highestExpense.description ?? "despesa"}.`,
    });
  }

  return alerts;
}

```

#### lib/finance/analysis.ts

```ts
import { prisma } from "@/lib/prisma";

export type CategoryTotals = Record<string, number>;

function getMonthRange(referenceDate = new Date()) {
  const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export async function getMonthlySpendingByCategory(userId: string, householdId?: string | null) {
  const { start, end } = getMonthRange();

  const grouped = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      OR: [{ userId }, ...(householdId ? [{ householdId }] : [])],
      type: "EXPENSE",
      status: "COMPLETED",
      ignoreInTotals: false,
      date: { gte: start, lte: end },
    },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  const categoryIds = grouped.map((item) => item.categoryId).filter(Boolean) as string[];
  const categories = categoryIds.length
    ? await prisma.category.findMany({ where: { id: { in: categoryIds } }, select: { id: true, name: true } })
    : [];

  const byCategory: CategoryTotals = {};
  let total = 0;

  for (const item of grouped) {
    const amount = Number(item._sum.amount ?? 0);
    const categoryName = categories.find((category) => category.id === item.categoryId)?.name ?? "outros";
    byCategory[categoryName.toLowerCase()] = amount;
    total += amount;
  }

  return { total, byCategory };
}

export async function getTopCategories(userId: string, householdId?: string | null, take = 3) {
  const spending = await getMonthlySpendingByCategory(userId, householdId);

  return Object.entries(spending.byCategory)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, take);
}

export async function getAverageSpending(userId: string, householdId?: string | null) {
  const now = new Date();
  const firstMonth = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  const expenses = await prisma.transaction.findMany({
    where: {
      OR: [{ userId }, ...(householdId ? [{ householdId }] : [])],
      type: "EXPENSE",
      status: "COMPLETED",
      ignoreInTotals: false,
      date: { gte: firstMonth, lte: now },
    },
    select: { amount: true, date: true },
  });

  if (expenses.length === 0) return 0;

  const totalsByMonth = new Map<string, number>();
  for (const expense of expenses) {
    const date = new Date(expense.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    totalsByMonth.set(key, (totalsByMonth.get(key) ?? 0) + Number(expense.amount));
  }

  const totals = Array.from(totalsByMonth.values());
  return totals.reduce((sum, value) => sum + value, 0) / totals.length;
}

```

#### lib/finance/contracts.ts

```ts
export type FinanceSignalLevel = "attention" | "risk" | "direction";

export type FinanceSignal = {
  level: FinanceSignalLevel;
  signal: string;
  source: string;
  explanation: string;
  nextStep: string;
};

```

#### lib/finance/core.ts

```ts
import { TransactionStatus } from "@prisma/client";

export interface AuthContext {
  id: string;
  householdId: string | null;
}

/**
 * Cria o escopo de segurança para consultas financeiras (Contas, Transações, Categorias).
 *
 * @param ctx AuthContext atual do usuário
 * @param requireHousehold Se true, limita apenas para registros do household (usado em Orçamentos/Metas). 
 * Se false (mixed scope), busca do household atual E os registros soltos do usuário.
 */
export function buildAuthFilter(ctx: AuthContext, requireHousehold = false) {
  if (requireHousehold) {
    if (!ctx.householdId) {
      // Força um retorno vazio se existir a obrigatoriedade e ele não tiver household
      return { householdId: "NO_HOUSEHOLD_ATTACHED_FORCE_EMPTY" };
    }
    return { householdId: ctx.householdId };
  }

  // Mixed scope: vê os dados do Household atual + os próprios dados sem household (ainda não migrados)
  return {
    OR: [
      { householdId: ctx.householdId ?? "NO_HOUSEHOLD_ATTACHED_FORCE_EMPTY" },
      { userId: ctx.id, householdId: null },
    ],
  };
}

export interface AnalyticFilterParams {
  month?: number;
  year?: number;
  bankAccountId?: string;
  categoryId?: string;
}

/**
 * Cria os filtros analíticos unificados que definem o que "vale" para o DRE,
 * Relatórios, Orçamentos e Gráficos no app inteiro.
 */
export function buildAnalyticFilter(params?: AnalyticFilterParams) {
  const filter: any = {
    status: "COMPLETED" as TransactionStatus,
    ignoreInTotals: false,
  };

  if (params?.bankAccountId) {
    filter.bankAccountId = params.bankAccountId;
  }

  if (params?.categoryId) {
    filter.categoryId = params.categoryId;
  }

  if (params?.month && params?.year) {
    const start = new Date(params.year, params.month - 1, 1);
    const end = new Date(params.year, params.month, 0, 23, 59, 59);
    filter.date = { gte: start, lte: end };
  }

  return filter;
}

```

#### lib/finance/deduplication.ts

```ts
import { TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPolicyConfig } from "@/lib/policy/engine";

export type NormalizedIngestedTransaction = {
  date: Date;
  amount: number;
  description: string;
  type: "income" | "expense";
  source: string;
};

export type DeduplicationResult =
  | {
      status: "new";
    }
  | {
      status: "duplicate";
      existingId: string;
    };

type DedupInput = {
  userId: string;
  householdId: string | null;
  item: NormalizedIngestedTransaction;
};

function normalizeDescription(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string) {
  return new Set(normalizeDescription(value).split(" ").filter((token) => token.length >= 3));
}

function jaccardSimilarity(a: string, b: string) {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection++;
  }

  const union = new Set([...tokensA, ...tokensB]).size;
  return union === 0 ? 0 : intersection / union;
}

export async function detectDuplicateTransaction({ userId, householdId, item }: DedupInput): Promise<DeduplicationResult> {
  const dedupPolicy = await getPolicyConfig<{ similarityThreshold?: number; dateWindowDays?: number }>("dedup_heuristics", householdId);
  const windowDays = Number(dedupPolicy.dateWindowDays ?? 1);
  const similarityThreshold = Number(dedupPolicy.similarityThreshold ?? 0.4);
  const from = new Date(item.date);
  from.setDate(from.getDate() - windowDays);
  const to = new Date(item.date);
  to.setDate(to.getDate() + windowDays);

  const txType: TransactionType = item.type === "income" ? "INCOME" : "EXPENSE";

  const candidates = await prisma.transaction.findMany({
    where: {
      OR: [{ userId }, ...(householdId ? [{ householdId }] : [])],
      amount: item.amount,
      type: txType,
      date: { gte: from, lte: to },
    },
    select: {
      id: true,
      description: true,
    },
    take: 20,
    orderBy: { date: "desc" },
  });

  const duplicate = candidates.find((candidate) => jaccardSimilarity(candidate.description ?? "", item.description ?? "") >= similarityThreshold);

  if (!duplicate) {
    return { status: "new" };
  }

  return {
    status: "duplicate",
    existingId: duplicate.id,
  };
}

```

#### lib/finance/health.ts

```ts
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, subDays, subMonths, addDays } from "date-fns";

interface ScoreBreakdown {
  spending: number;
  growth: number;
  commitments: number;
  goals: number;
}

export interface HealthScoreData {
  score: number;
  classification: "Saudável" | "Atenção" | "Risco";
  breakdown: ScoreBreakdown;
}

export async function calculateHealthScore(householdId: string): Promise<HealthScoreData> {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const thirtyDaysAgo = subDays(now, 30);

  // COMPONENT 1: Spending Control (40 points)
  const [incomeTransactions, expenseTransactions] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        householdId,
        type: "INCOME",
        date: { gte: monthStart, lte: monthEnd },
        ignoreInTotals: false
      },
      _sum: { amount: true }
    }),
    prisma.transaction.aggregate({
      where: {
        householdId,
        type: "EXPENSE",
        date: { gte: monthStart, lte: monthEnd },
        ignoreInTotals: false
      },
      _sum: { amount: true }
    })
  ]);

  const income = Number(incomeTransactions._sum.amount || 0);
  const expenses = Number(expenseTransactions._sum.amount || 0);
  const ratio = income > 0 ? expenses / income : expenses > 0 ? 999 : 0;

  let spendingScore = 0;
  if (ratio <= 0.70) spendingScore = 40;
  else if (ratio <= 0.85) spendingScore = 28;
  else if (ratio <= 1.00) spendingScore = 16;
  else spendingScore = 0;

  // COMPONENT 2: Balance Growth (30 points)
  const currentBalance = await prisma.bankAccount.aggregate({
    where: { householdId },
    _sum: { balance: true }
  });

  const [incomeLast30DaysTransactions, expenseLast30DaysTransactions] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        householdId,
        type: "INCOME",
        status: "COMPLETED",
        date: { gte: thirtyDaysAgo },
        ignoreInTotals: false
      },
      _sum: { amount: true }
    }),
    prisma.transaction.aggregate({
      where: {
        householdId,
        type: "EXPENSE",
        status: "COMPLETED",
        date: { gte: thirtyDaysAgo },
        ignoreInTotals: false
      },
      _sum: { amount: true }
    })
  ]);

  const currentBalanceValue = Number(currentBalance._sum.balance || 0);
  const incomeLast30Days = Number(incomeLast30DaysTransactions._sum.amount || 0);
  const expensesLast30Days = Number(expenseLast30DaysTransactions._sum.amount || 0);
  const transactionsDelta = incomeLast30Days - expensesLast30Days;
  const balance30DaysAgo = currentBalanceValue - transactionsDelta;
  const balanceDelta = currentBalanceValue - balance30DaysAgo;

  let growthScore = 0;
  if (balanceDelta > 0) growthScore = 30;
  else if (balanceDelta === 0) growthScore = 15;
  else growthScore = 0;

  // COMPONENT 3: Fixed Commitments (20 points)
  const recurringExpenses = await prisma.recurringTransaction.findMany({
    where: {
      householdId,
      type: "EXPENSE",
      active: true,
      nextDate: { lte: addDays(now, 30) }
    },
    select: { amount: true }
  });

  const totalRecurringExpenses = recurringExpenses.reduce(
    (sum, rec) => sum + Number(rec.amount),
    0
  );

  const coverage = totalRecurringExpenses > 0
    ? currentBalanceValue / totalRecurringExpenses
    : currentBalanceValue > 0 ? 999 : 0;

  let commitmentsScore = 0;
  if (coverage >= 2.0) commitmentsScore = 20;
  else if (coverage >= 1.0) commitmentsScore = 12;
  else commitmentsScore = 0;

  // COMPONENT 4: Goal Progress (10 points)
  const goals = await prisma.goal.findMany({
    where: {
      householdId,
      completed: false
    },
    select: {
      currentAmount: true,
      targetAmount: true
    }
  });

  let goalsScore = 0;
  if (goals.length > 0) {
    const avgProgress = goals.reduce((sum, goal) => {
      const progress = Number(goal.targetAmount) > 0
        ? Number(goal.currentAmount) / Number(goal.targetAmount)
        : 0;
      return sum + progress;
    }, 0) / goals.length;

    goalsScore = avgProgress * 10;
  }

  // Calculate final score
  const totalScore = Math.round(
    spendingScore + growthScore + commitmentsScore + goalsScore
  );

  let classification: "Saudável" | "Atenção" | "Risco";
  if (totalScore >= 80) classification = "Saudável";
  else if (totalScore >= 50) classification = "Atenção";
  else classification = "Risco";

  return {
    score: totalScore,
    classification,
    breakdown: {
      spending: Math.round(spendingScore),
      growth: Math.round(growthScore),
      commitments: Math.round(commitmentsScore),
      goals: Math.round(goalsScore)
    }
  };
}

export interface ProjectionData {
  currentBalance: number;
  projectedBalance30d: number;
  daysUntilZero: number | null;
  message: string;
  projectionPoints: Array<{ day: number; balance: number }>;
}

export async function calculateProjection(householdId: string): Promise<ProjectionData> {
  const now = new Date();
  const threeMonthsAgo = subMonths(now, 3);
  const thirtyDaysFromNow = addDays(now, 30);

  const [currentBalance, recurringExpenses, recurringIncome, variableExpenses] = await Promise.all([
    prisma.bankAccount.aggregate({
      where: { householdId },
      _sum: { balance: true }
    }),
    prisma.recurringTransaction.findMany({
      where: {
        householdId,
        type: "EXPENSE",
        active: true,
        nextDate: { lte: thirtyDaysFromNow }
      },
      select: { amount: true }
    }),
    prisma.recurringTransaction.findMany({
      where: {
        householdId,
        type: "INCOME",
        active: true,
        nextDate: { lte: thirtyDaysFromNow }
      },
      select: { amount: true }
    }),
    prisma.transaction.aggregate({
      where: {
        householdId,
        type: "EXPENSE",
        date: { gte: threeMonthsAgo, lte: now },
        ignoreInTotals: false
      },
      _sum: { amount: true }
    })
  ]);

  const balance = Number(currentBalance._sum.balance || 0);
  const recurringExpensesTotal = recurringExpenses.reduce((s, r) => s + Number(r.amount), 0);
  const recurringIncomeTotal = recurringIncome.reduce((s, r) => s + Number(r.amount), 0);
  const avgMonthlyVariableExpenses = Number(variableExpenses._sum.amount || 0) / 3;
  const totalEstimatedOutflow = recurringExpensesTotal + avgMonthlyVariableExpenses;
  const netDailyFlow = (recurringIncomeTotal - totalEstimatedOutflow) / 30;
  const projectedBalance30d = balance + recurringIncomeTotal - totalEstimatedOutflow;

  let daysUntilZero: number | null = null;
  let message = "";

  if (projectedBalance30d > 0) {
    if (netDailyFlow < 0) {
      daysUntilZero = Math.floor(balance / Math.abs(netDailyFlow));
      message = `No ritmo atual, seu saldo dura ${daysUntilZero} dias`;
    } else {
      message = "Sua projeção está positiva para os próximos 30 dias";
    }
  } else {
    if (balance <= 0) {
      daysUntilZero = 0;
      message = "⚠️ Projeção: saldo já está negativo";
    } else if (netDailyFlow === 0) {
      message = "⚠️ Projeção: saldo negativo sem variação diária para estimar em quantos dias";
    } else {
      const daysToNegative = Math.floor(balance / Math.abs(netDailyFlow));
      message = `⚠️ Projeção: saldo negativo em ${daysToNegative} dias`;
    }
  }

  const projectionPoints: Array<{ day: number; balance: number }> = [];
  for (let i = 0; i <= 6; i++) {
    const dayOffset = i * 5;
    const dayBalance = balance + (netDailyFlow * dayOffset);
    projectionPoints.push({ day: dayOffset, balance: Math.round(dayBalance * 100) / 100 });
  }

  return {
    currentBalance: Math.round(balance * 100) / 100,
    projectedBalance30d: Math.round(projectedBalance30d * 100) / 100,
    daysUntilZero,
    message,
    projectionPoints
  };
}

```

#### lib/finance/kernel.ts

```ts
import { BankAccountType, TransactionStatus, TransactionType } from "@prisma/client";

export type CanonicalAccountLike = {
  balance: number;
  type: BankAccountType;
};

export type CanonicalTransactionLike = {
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  ignoreInTotals: boolean;
};

export type CanonicalTotals = {
  accountingBalance: number;
  netPosition: number;
};

export function computeCanonicalTotals(accounts: CanonicalAccountLike[]): CanonicalTotals {
  return accounts.reduce<CanonicalTotals>(
    (acc, account) => {
      acc.accountingBalance += account.balance;
      if (account.type === BankAccountType.CREDIT) {
        acc.netPosition -= Math.abs(account.balance);
      } else {
        acc.netPosition += account.balance;
      }
      return acc;
    },
    { accountingBalance: 0, netPosition: 0 }
  );
}

export type CanonicalFlow = {
  income: number;
  expense: number;
  net: number;
};

export function computeCanonicalFlow(transactions: CanonicalTransactionLike[]): CanonicalFlow {
  const flow = transactions.reduce(
    (acc, tx) => {
      if (tx.status !== TransactionStatus.COMPLETED || tx.ignoreInTotals) return acc;
      if (tx.type === TransactionType.INCOME) acc.income += tx.amount;
      if (tx.type === TransactionType.EXPENSE) acc.expense += tx.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  return { ...flow, net: flow.income - flow.expense };
}

export const FINANCE_POLICY = {
  accountingBalance: "Soma contábil dos saldos das contas, sem reinterpretar sinal.",
  netPosition: "Posição líquida: contas de crédito entram como exposição (subtrai valor absoluto).",
  flow: "Fluxo considera apenas transações COMPLETED, ignoreInTotals=false e exclui TRANSFER de income/expense.",
} as const;

```

#### lib/finance/normalize.ts

```ts
import { ParsedInboxItem } from "@/lib/inbox/parser";

export type NormalizedInboxTransaction = {
  date: Date;
  amount: number;
  description: string;
  type: "expense" | "income";
};

export function normalizeInboxItems(items: ParsedInboxItem[]): NormalizedInboxTransaction[] {
  return items
    .map((item) => {
      const date = new Date(item.date);
      if (Number.isNaN(date.getTime())) return null;

      return {
        date,
        amount: Math.abs(Number(item.amount) || 0),
        description: item.description.trim() || "Transação importada",
        type: item.type,
      };
    })
    .filter((item): item is NormalizedInboxTransaction => Boolean(item && item.amount > 0));
}

```

#### lib/finance/period.ts

```ts
export type MonthBounds = {
  start: Date;
  endExclusive: Date;
};

export function getMonthBoundsUtc(year: number, month: number): MonthBounds {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Invalid year/month for UTC bounds");
  }

  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const endExclusive = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

  return { start, endExclusive };
}

export function getCurrentMonthBoundsUtc(referenceDate = new Date()): MonthBounds {
  return getMonthBoundsUtc(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth() + 1);
}

```

#### lib/finance/quality.ts

```ts
import { prisma } from "@/lib/prisma";
import { AIComposerTransactionDraft } from "@/lib/ai/contracts";
import { detectDuplicateTransaction } from "@/lib/finance/deduplication";
import { getPolicyConfig } from "@/lib/policy/engine";

type Severity = "LOW" | "MEDIUM" | "HIGH";

export type QualitySignal = {
  code: "OUTLIER_AMOUNT" | "DUPLICATE_SUSPECTED" | "CATEGORY_CONFLICT";
  severity: Severity;
  reason: string;
};

export type QualityEvaluation = {
  riskScore: number;
  requiresReview: boolean;
  signals: QualitySignal[];
};

function mean(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((acc, v) => acc + v, 0) / values.length;
}

function std(values: number[]) {
  if (values.length <= 1) return 0;
  const avg = mean(values);
  const variance = mean(values.map((v) => (v - avg) ** 2));
  return Math.sqrt(variance);
}

export async function evaluateTransactionQuality(params: {
  userId: string;
  householdId: string | null;
  draft: AIComposerTransactionDraft;
}): Promise<QualityEvaluation> {
  const { userId, householdId, draft } = params;
  const [outlierPolicy, reviewPolicy] = await Promise.all([
    getPolicyConfig<{ zScoreMedium?: number; zScoreHigh?: number }>("outlier_sensitivity", householdId),
    getPolicyConfig<{ riskScoreThreshold?: number; highSeverityRequiresReview?: boolean }>("review_thresholds", householdId),
  ]);
  const signals: QualitySignal[] = [];
  const weights: number[] = [];

  if (!draft.amount || !draft.date) {
    return { riskScore: 0.2, requiresReview: false, signals };
  }

  // 1) Outlier via z-score on last transactions in same category/account
  const history = await prisma.transaction.findMany({
    where: {
      OR: [{ userId }, ...(householdId ? [{ householdId }] : [])],
      type: draft.transactionType,
      ...(draft.categoryId ? { categoryId: draft.categoryId } : {}),
      ...(draft.accountId ? { bankAccountId: draft.accountId } : {}),
    },
    select: { amount: true },
    take: 40,
    orderBy: { date: "desc" },
  });

  const values = history.map((item) => Number(item.amount)).filter((v) => Number.isFinite(v));
  if (values.length >= 8) {
    const avg = mean(values);
    const sigma = std(values);
    if (sigma > 0) {
      const z = Math.abs((Math.abs(draft.amount) - avg) / sigma);
      const zMedium = Number(outlierPolicy.zScoreMedium ?? 3);
      const zHigh = Number(outlierPolicy.zScoreHigh ?? 4);
      if (z >= zMedium) {
        signals.push({
          code: "OUTLIER_AMOUNT",
          severity: z >= zHigh ? "HIGH" : "MEDIUM",
          reason: `Valor com z-score ${z.toFixed(2)} para o histórico local`,
        });
        weights.push(z >= zHigh ? 0.55 : 0.35);
      }
    }
  }

  // 2) Duplicate suspicion (checksum/time-window/similarity via existing engine)
  const dedup = await detectDuplicateTransaction({
    userId,
    householdId,
    item: {
      amount: Math.abs(draft.amount),
      date: new Date(draft.date),
      description: draft.description,
      type: draft.transactionType === "INCOME" ? "income" : "expense",
      source: draft.source,
    },
  });

  if (dedup.status === "duplicate") {
    signals.push({
      code: "DUPLICATE_SUSPECTED",
      severity: "HIGH",
      reason: `Movimento potencialmente duplicado (${dedup.existingId})`,
    });
    weights.push(0.7);
  }

  // 3) Category/account conflict from short-term local profile
  if (draft.accountId && draft.categoryId) {
    const profile = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        OR: [{ userId }, ...(householdId ? [{ householdId }] : [])],
        bankAccountId: draft.accountId,
        type: draft.transactionType,
      },
      _count: { categoryId: true },
      orderBy: { _count: { categoryId: "desc" } },
      take: 3,
    });

    const topCategories = profile.map((p) => p.categoryId).filter(Boolean);
    if (topCategories.length >= 2 && !topCategories.includes(draft.categoryId)) {
      signals.push({
        code: "CATEGORY_CONFLICT",
        severity: "MEDIUM",
        reason: "Categoria incomum para esta conta com base no histórico recente",
      });
      weights.push(0.25);
    }
  }

  const riskScore = Math.min(1, weights.reduce((acc, w) => acc + w, 0));
  const threshold = Number(reviewPolicy.riskScoreThreshold ?? 0.45);
  const requiresReview = riskScore >= threshold || (reviewPolicy.highSeverityRequiresReview ?? true) && signals.some((s) => s.severity === "HIGH");

  return {
    riskScore,
    requiresReview,
    signals,
  };
}

```

#### lib/finance/recommendations.ts

```ts
import { getAverageSpending, getMonthlySpendingByCategory } from "@/lib/finance/analysis";
import { generateFinanceAlerts } from "@/lib/finance/alerts";

export type FinanceRecommendation = {
  message: string;
  impact: number;
};

export async function generateFinanceRecommendations(userId: string, householdId?: string | null): Promise<FinanceRecommendation[]> {
  const monthly = await getMonthlySpendingByCategory(userId, householdId);
  const average = await getAverageSpending(userId, householdId);
  const alerts = await generateFinanceAlerts(userId, householdId);

  const recommendations: FinanceRecommendation[] = [];

  if (average > 0 && monthly.total > average) {
    const diff = monthly.total - average;
    recommendations.push({
      message: `Você gastou ${Math.round((diff / average) * 100)}% a mais neste mês em relação à média recente.`,
      impact: Number(diff.toFixed(2)),
    });
  }

  const foodEntry = Object.entries(monthly.byCategory).find(([category]) =>
    ["alimentacao", "alimentação", "supermercado"].some((alias) => category.includes(alias)),
  );

  if (foodEntry) {
    const [, amount] = foodEntry;
    const saving = amount * 0.15;
    recommendations.push({
      message: `Reduzindo gastos de alimentação/delivery em 15%, você pode economizar R$ ${saving.toFixed(2)}.`,
      impact: Number(saving.toFixed(2)),
    });
  }

  if (alerts.length > 0) {
    recommendations.push({
      message: "Revise os alertas do mês e ajuste suas maiores despesas para manter o orçamento saudável.",
      impact: Number((monthly.total * 0.05).toFixed(2)),
    });
  }

  return recommendations.slice(0, 3);
}

```

#### lib/inbox/parse.ts

```ts
import { processAiIngest } from "@/lib/ai/ingest";
import { prisma } from "@/lib/prisma";
import { parseDeterministicOFX, parseDeterministicCSV } from "./deterministic";
import { logAiCaptureEvent } from "@/lib/ai/composer";
import { randomUUID } from "crypto";

export type InboxChannel = "manual" | "email" | "whatsapp" | "import";
export type InboxInputType = "text" | "image" | "pdf" | "csv" | "ofx" | "audio";
export type InboxDocumentKind = "statement" | "invoice" | "receipt" | "unknown";

function buildRawTextEnvelope(rawInput: string, documentKind: InboxDocumentKind, inputHash?: string) {
  const hashPrefix = inputHash ? `[HASH:${inputHash}] ` : "";
  return `${hashPrefix}[${documentKind.toUpperCase()}] ${rawInput}`;
}

export async function parseInboxRawInput({
  userId,
  householdId,
  rawInput,
  channel,
  inputType,
  documentKind,
  inputHash,
  captureBatchId,
}: {
  userId: string;
  householdId: string | null;
  rawInput: string;
  channel: InboxChannel;
  inputType: InboxInputType;
  documentKind: InboxDocumentKind;
  inputHash?: string;
  captureBatchId?: string;
}) {
  const rawTextEnvelope = buildRawTextEnvelope(rawInput, documentKind, inputHash);

  if (inputType === "ofx" || inputType === "csv") {
    const captureGroupId = captureBatchId ?? randomUUID();
    const isOfx = inputType === "ofx";
    const drafts = isOfx
      ? await parseDeterministicOFX(userId, householdId, rawInput)
      : await parseDeterministicCSV(userId, householdId, rawInput);

    if (drafts.length > 0) {
      const batchDrafts = await Promise.all(
        drafts.map(async (draft) => {
          const aiEvent = await logAiCaptureEvent({
            userId,
            householdId,
            captureGroupId,
            source: inputType,
            inputType: "composer",
            rawText: rawTextEnvelope,
            normalizedDraft: draft,
            confidenceOverall: draft.confidence.overall,
            decision: "batch_review",
            createdTransactionId: null,
          });
          return { eventId: aiEvent?.id ?? null, draft };
        })
      );

      return {
        intent: "batch_review",
        message: `Encontramos ${drafts.length} itens no arquivo. Verifique e confirme.`,
        requiresReview: true,
        autoSaved: false,
        transactionDraft: null,
        batchDrafts,
        createdTransactionId: null,
        undoAvailable: false,
        undoToken: null,
        eventId: batchDrafts[0]?.eventId ?? null,
        captureGroupId,
        conversationId: null,
        missingFields: [],
      };
    }
  }

  const response = await processAiIngest({
    userId,
    householdId,
    mode: "Registrar",
    inputType: inputType === "pdf" ? "pdf" : inputType === "audio" ? "audio" : "text",
    content: rawInput,
    disableAutoSave: true,
  });

  if (response.eventId) {
    await prisma.aiCaptureEvent
      .update({
        where: { id: response.eventId },
        data: {
          source: channel,
          inputType,
          rawText: rawTextEnvelope,
          captureGroupId: captureBatchId ?? response.captureGroupId ?? undefined,
        },
      })
      .catch(() => null);
  }

  return response;
}

export function getInboxSourceBadge(channel: string, inputType: string) {
  if (inputType === "ofx") return "via OFX";
  if (inputType === "csv") return "via CSV";
  if (inputType === "pdf") return "via PDF";
  if (inputType === "image") return "via OCR";
  if (inputType === "audio") return "via Áudio";
  if (channel === "whatsapp") return "via WhatsApp";
  if (channel === "email") return "via Email";
  if (channel === "import") return "via Importação";
  return "Inclusão Manual";
}

```

#### lib/inbox/parser.ts

```ts
const DATE_PATTERN = /\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\b/;
const AMOUNT_PATTERN = /(-)?\s*R\$\s*([\d.]+(?:,\d{2})?|\d+(?:,\d{2})?)/i;

export type ParsedInboxItem = {
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
};

function buildIsoDate(day: string, month: string, year?: string) {
  const now = new Date();
  const yyyy = year ? (year.length === 2 ? `20${year}` : year) : String(now.getUTCFullYear());
  const parsed = new Date(`${yyyy}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function parseMoney(rawAmount: string, hasMinusSign: boolean) {
  const normalized = rawAmount.replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value)) return null;
  return hasMinusSign ? -value : value;
}

function inferType(line: string, amount: number): "income" | "expense" {
  const text = line.toLowerCase();

  if (amount < 0) return "expense";
  if (/\b(debito|d[eé]bito|compra|pagamento|sa[ií]da|pix enviado|tarifa)\b/.test(text)) {
    return "expense";
  }
  if (/\b(receb|cr[eé]dito|sal[aá]rio|pix recebido|estorno|dep[oó]sito)\b/.test(text)) {
    return "income";
  }

  return "expense";
}

function cleanupDescription(line: string) {
  return line
    .replace(DATE_PATTERN, "")
    .replace(AMOUNT_PATTERN, "")
    .replace(/[\-|•]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseInboxText(rawText: string): ParsedInboxItem[] {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const items: ParsedInboxItem[] = [];

  for (const line of lines) {
    const amountMatch = line.match(AMOUNT_PATTERN);
    if (!amountMatch) continue;

    const dateMatch = line.match(DATE_PATTERN);
    const isoDate = dateMatch ? buildIsoDate(dateMatch[1], dateMatch[2], dateMatch[3]) : new Date().toISOString();
    if (!isoDate) continue;

    const signedAmount = parseMoney(amountMatch[2], Boolean(amountMatch[1]));
    if (signedAmount === null) continue;

    items.push({
      date: isoDate,
      description: cleanupDescription(line) || "Transação importada",
      amount: Math.abs(signedAmount),
      type: inferType(line, signedAmount),
    });
  }

  return items;
}

```

#### lib/inbox/pipeline.ts

```ts
import { createHash, randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { AIComposerBatchDraftItem, AIComposerTransactionDraft } from "@/lib/ai/contracts";
import { InboxChannel, InboxDocumentKind, InboxInputType, parseInboxRawInput } from "@/lib/inbox/parse";
import { DeduplicationResult, detectDuplicateTransaction, NormalizedIngestedTransaction } from "@/lib/finance/deduplication";

type CaptureInput = {
  rawInput: string;
  channel: InboxChannel;
  inputType: InboxInputType;
  documentKind: InboxDocumentKind;
  fileName?: string | null;
};

type DetectedType = "bank_statement" | "receipt" | "invoice";
type DetectedSource = "nubank" | "itau" | "unknown";

type IngestionItem = {
  index: number;
  fileName: string | null;
  detectedType: DetectedType;
  source: DetectedSource;
  normalized: NormalizedIngestedTransaction | null;
  status: "new" | "duplicate" | "review" | "error";
  existingId: string | null;
  message: string;
  eventId: string | null;
  createdTransactionId: string | null;
};

export type CaptureBatchResult = {
  batchId: string;
  processed: number;
  possibleDuplicates: number;
  readyToSave: number;
  conflicts: number;
  detectedType: DetectedType;
  source: DetectedSource;
  items: IngestionItem[];
};

function makeInputHash(input: string) {
  return createHash("sha256").update(input.trim().toLowerCase()).digest("hex");
}

function inferDetectedType(kind: InboxDocumentKind, input: string): DetectedType {
  if (kind === "statement") return "bank_statement";
  if (kind === "invoice") return "invoice";
  if (kind === "receipt") return "receipt";

  const raw = input.toLowerCase();
  if (/fatura|invoice|cart[aã]o/.test(raw)) return "invoice";
  if (/comprovante|recibo|pix/.test(raw)) return "receipt";
  return "bank_statement";
}

function inferSource(input: string): DetectedSource {
  const raw = input.toLowerCase();
  if (/nubank|nu pagamentos|nu financeira/.test(raw)) return "nubank";
  if (/ita[uú]|unibanco/.test(raw)) return "itau";
  return "unknown";
}

function scopeOr(userId: string, householdId: string | null) {
  return [{ userId }, ...(householdId ? [{ householdId }] : [])];
}

function extractDrafts(result: unknown): AIComposerTransactionDraft[] {
  if (!result || typeof result !== "object") return [];
  const maybe = result as { transactionDraft?: unknown; batchDrafts?: unknown };

  const drafts: AIComposerTransactionDraft[] = [];
  if (maybe.transactionDraft && typeof maybe.transactionDraft === "object" && "amount" in maybe.transactionDraft) {
    drafts.push(maybe.transactionDraft as AIComposerTransactionDraft);
  }
  if (Array.isArray(maybe.batchDrafts)) {
    for (const item of maybe.batchDrafts as AIComposerBatchDraftItem[]) {
      if (item?.draft) drafts.push(item.draft);
    }
  }
  return drafts;
}

function normalizeDraft(draft: AIComposerTransactionDraft, source: string): NormalizedIngestedTransaction | null {
  if (!draft.amount || !draft.date || !draft.description) return null;
  const parsedDate = new Date(draft.date);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return {
    date: parsedDate,
    amount: Number(draft.amount),
    description: draft.description,
    type: draft.transactionType === "INCOME" ? "income" : "expense",
    source,
  };
}

async function findDuplicateByHash(params: {
  userId: string;
  householdId: string | null;
  inputHash: string;
}): Promise<{ eventId: string | null; transactionId: string | null } | null> {
  const existing = await prisma.aiCaptureEvent.findFirst({
    where: {
      OR: scopeOr(params.userId, params.householdId),
      rawText: { startsWith: `[HASH:${params.inputHash}]` },
    },
    select: { id: true, createdTransactionId: true },
    orderBy: { createdAt: "desc" },
  });

  if (!existing) return null;
  return {
    eventId: existing.id,
    transactionId: existing.createdTransactionId,
  };
}

function chooseDominantDetectedType(items: IngestionItem[]): DetectedType {
  const counters: Record<DetectedType, number> = {
    bank_statement: 0,
    receipt: 0,
    invoice: 0,
  };
  for (const item of items) counters[item.detectedType]++;
  return Object.entries(counters).sort((a, b) => b[1] - a[1])[0][0] as DetectedType;
}

function chooseDominantSource(items: IngestionItem[]): DetectedSource {
  const counters: Record<DetectedSource, number> = {
    nubank: 0,
    itau: 0,
    unknown: 0,
  };
  for (const item of items) counters[item.source]++;
  return Object.entries(counters).sort((a, b) => b[1] - a[1])[0][0] as DetectedSource;
}

export async function processCaptureBatch(params: {
  userId: string;
  householdId: string | null;
  inputs: CaptureInput[];
}): Promise<CaptureBatchResult> {
  const batchId = randomUUID();
  const items: IngestionItem[] = [];

  for (let index = 0; index < params.inputs.length; index++) {
    const input = params.inputs[index];
    const detectedType = inferDetectedType(input.documentKind, input.rawInput);
    const source = inferSource(`${input.fileName ?? ""} ${input.rawInput}`);

    try {
      const inputHash = makeInputHash(input.rawInput);
      const duplicatedByHash = await findDuplicateByHash({
        userId: params.userId,
        householdId: params.householdId,
        inputHash,
      });

      if (duplicatedByHash) {
        items.push({
          index,
          fileName: input.fileName ?? null,
          detectedType,
          source,
          normalized: null,
          status: "duplicate",
          existingId: duplicatedByHash.transactionId,
          message: "Arquivo/conteúdo já processado anteriormente",
          eventId: duplicatedByHash.eventId,
          createdTransactionId: duplicatedByHash.transactionId,
        });
        continue;
      }

      const result = await parseInboxRawInput({
        userId: params.userId,
        householdId: params.householdId,
        rawInput: input.rawInput,
        channel: input.channel,
        inputType: input.inputType,
        documentKind: input.documentKind,
        inputHash,
        captureBatchId: batchId,
      });

      const drafts = extractDrafts(result);
      const firstNormalized = normalizeDraft(drafts[0], input.inputType);

      let dedupResult: DeduplicationResult | null = null;
      if (firstNormalized) {
        dedupResult = await detectDuplicateTransaction({
          userId: params.userId,
          householdId: params.householdId,
          item: firstNormalized,
        });
      }

      if (dedupResult?.status === "duplicate" && result.eventId) {
        await prisma.aiCaptureEvent.updateMany({
          where: { id: result.eventId },
          data: { decision: "possible_duplicate" },
        });
      }

      items.push({
        index,
        fileName: input.fileName ?? null,
        detectedType,
        source,
        normalized: firstNormalized,
        status: dedupResult?.status === "duplicate" ? "duplicate" : result.requiresReview ? "review" : "new",
        existingId: dedupResult?.status === "duplicate" ? dedupResult.existingId : null,
        message:
          dedupResult?.status === "duplicate"
            ? "Movimento já existente na base"
            : result.message ?? "Conteúdo reconhecido e pronto para confirmação",
        eventId: result.eventId ?? null,
        createdTransactionId: result.createdTransactionId ?? null,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Falha ao processar item";
      items.push({
        index,
        fileName: input.fileName ?? null,
        detectedType,
        source,
        normalized: null,
        status: "error",
        existingId: null,
        message,
        eventId: null,
        createdTransactionId: null,
      });
    }
  }

  const detectedType = items.length > 0 ? chooseDominantDetectedType(items) : "bank_statement";
  const source = items.length > 0 ? chooseDominantSource(items) : "unknown";

  return {
    batchId,
    processed: items.length,
    possibleDuplicates: items.filter((item) => item.status === "duplicate").length,
    readyToSave: items.filter((item) => item.status === "new").length,
    conflicts: items.filter((item) => item.status === "error").length,
    detectedType,
    source,
    items,
  };
}

```

#### lib/policy/engine.ts

```ts
import type { PolicyStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const POLICY_STATUS = {
  ACTIVE: "ACTIVE",
  RETIRED: "RETIRED",
  ROLLED_BACK: "ROLLED_BACK",
} as const satisfies Record<string, PolicyStatus>;

type JsonObject = Record<string, unknown>;

const DEFAULT_POLICIES: Record<string, JsonObject> = {
  review_thresholds: { riskScoreThreshold: 0.45, highSeverityRequiresReview: true },
  dedup_heuristics: { similarityThreshold: 0.4, dateWindowDays: 1 },
  outlier_sensitivity: { zScoreMedium: 3, zScoreHigh: 4 },
  provider_routing: { complexTextLength: 1200, preferredComplexMediaProvider: "openai", preferredDenseReasoningProvider: "nvidia" },
  recommendation_gating: { minimumScore: 0.2, dismissWeight: 0.8 },
  alert_gating: { minImpact: 0.05 },
};

export async function resolveActivePolicy(policyType: string, householdId?: string | null) {
  const where: Prisma.PolicyVersionWhereInput = {
    policyType,
    status: POLICY_STATUS.ACTIVE,
    OR: householdId ? [{ householdId }, { householdId: null }] : [{ householdId: null }],
  };

  const policy = await prisma.policyVersion.findFirst({
    where,
    orderBy: [{ householdId: "desc" }, { activatedAt: "desc" }, { createdAt: "desc" }],
  });

  return policy;
}

export async function getPolicyConfig<T extends JsonObject>(policyType: string, householdId?: string | null): Promise<T> {
  const active = await resolveActivePolicy(policyType, householdId);
  const fallback = (DEFAULT_POLICIES[policyType] ?? {}) as T;
  return { ...fallback, ...((active?.config as T | undefined) ?? {}) };
}

export async function activatePolicyVersion(input: {
  policyVersionId: string;
  actorUserId?: string | null;
}) {
  const target = await prisma.policyVersion.findUnique({ where: { id: input.policyVersionId } });
  if (!target) throw new Error("Policy version not found");

  return prisma.$transaction(async (tx) => {
    await tx.policyVersion.updateMany({
      where: {
        householdId: target.householdId,
        policyType: target.policyType,
        status: POLICY_STATUS.ACTIVE,
        NOT: { id: target.id },
      },
      data: { status: POLICY_STATUS.RETIRED, retiredAt: new Date() },
    });

    return tx.policyVersion.update({
      where: { id: target.id },
      data: {
        status: POLICY_STATUS.ACTIVE,
        activatedAt: new Date(),
        description: target.description ?? `Activated by ${input.actorUserId ?? "system"}`,
      },
    });
  });
}

export async function rollbackPolicy(policyType: string, householdId?: string | null) {
  const current = await prisma.policyVersion.findFirst({
    where: { policyType, householdId: householdId ?? null, status: POLICY_STATUS.ACTIVE },
    orderBy: { activatedAt: "desc" },
  });

  const previous = await prisma.policyVersion.findFirst({
    where: {
      policyType,
      householdId: householdId ?? null,
      status: { in: [POLICY_STATUS.RETIRED, POLICY_STATUS.ROLLED_BACK] },
      id: { not: current?.id },
    },
    orderBy: [{ activatedAt: "desc" }, { createdAt: "desc" }],
  });

  if (!previous) throw new Error("No previous policy available for rollback");

  return prisma.$transaction(async (tx) => {
    if (current) {
      await tx.policyVersion.update({ where: { id: current.id }, data: { status: POLICY_STATUS.ROLLED_BACK, retiredAt: new Date() } });
    }
    return tx.policyVersion.update({ where: { id: previous.id }, data: { status: POLICY_STATUS.ACTIVE, activatedAt: new Date() } });
  });
}

```

#### lib/quality/metrics.ts

```ts
import type { MetricPeriodType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { deterministicQualityScore } from "@/lib/quality/evaluation";

const METRIC_PERIOD_TYPE = {
  DAILY: "DAILY",
} as const satisfies Record<string, MetricPeriodType>;

type MetricRow = { metricCode: string; metricValue: number; dimensions?: Record<string, unknown> };

export async function computeQualityMetricsForHousehold(householdId: string, periodStart: Date, periodEnd: Date): Promise<MetricRow[]> {
  const [feedback, evals, logs, flags, events] = await Promise.all([
    prisma.decisionFeedback.findMany({ where: { householdId, createdAt: { gte: periodStart, lte: periodEnd } } }),
    prisma.decisionEvaluation.findMany({ where: { householdId, evaluatedAt: { gte: periodStart, lte: periodEnd } } }),
    prisma.ingestionLog.findMany({ where: { householdId, createdAt: { gte: periodStart, lte: periodEnd } } }),
    prisma.transactionQualityFlag.findMany({ where: { householdId, createdAt: { gte: periodStart, lte: periodEnd } } }),
    prisma.aiCaptureEvent.findMany({ where: { householdId, createdAt: { gte: periodStart, lte: periodEnd } } }),
  ]);

  const accepted = feedback.filter((f) => f.feedbackType === "suggestion_accepted").length;
  const rejected = feedback.filter((f) => f.feedbackType === "suggestion_rejected").length;
  const overridden = feedback.filter((f) => f.feedbackType === "review_overridden").length;
  const recommendationsTotal = accepted + rejected;
  const reviewRequired = events.filter((e) => e.reviewState === "REQUIRED").length;
  const reviewFalsePositive = feedback.filter((f) => f.feedbackType === "review_false_positive").length;
  const duplicates = flags.filter((f) => f.code === "DUPLICATE_SUSPECTED" || f.code === "DUPLICATE_CONFIRMED").length;
  const duplicateFalsePositive = feedback.filter((f) => f.feedbackType === "duplicate_false_positive").length;
  const completionSuccess = logs.filter((l) => l.stage === "COMMITTED" && l.status === "SUCCESS").length;
  const completionTotal = logs.filter((l) => l.stage === "COMMITTED").length;
  const routingSuccess = evals.filter((e) => e.subjectType === "routing" && e.result === "CORRECT").length;
  const routingTotal = evals.filter((e) => e.subjectType === "routing").length;

  const metrics: MetricRow[] = [
    { metricCode: "suggestion_acceptance_rate", metricValue: recommendationsTotal === 0 ? 0 : accepted / recommendationsTotal },
    { metricCode: "suggestion_override_rate", metricValue: recommendationsTotal === 0 ? 0 : overridden / Math.max(1, recommendationsTotal) },
    { metricCode: "review_required_rate", metricValue: events.length === 0 ? 0 : reviewRequired / events.length },
    { metricCode: "false_positive_review_rate", metricValue: reviewRequired === 0 ? 0 : reviewFalsePositive / reviewRequired },
    { metricCode: "duplicate_detected_rate", metricValue: events.length === 0 ? 0 : duplicates / events.length },
    { metricCode: "duplicate_false_positive_rate", metricValue: duplicates === 0 ? 0 : duplicateFalsePositive / duplicates },
    { metricCode: "routing_provider_success_rate", metricValue: routingTotal === 0 ? 0 : routingSuccess / routingTotal },
    { metricCode: "processing_completion_success_rate", metricValue: completionTotal === 0 ? 0 : completionSuccess / completionTotal },
    { metricCode: "decision_quality_score", metricValue: deterministicQualityScore(accepted, rejected, overridden) },
  ];

  return metrics;
}

export async function persistQualityMetricSnapshots(input: {
  householdId: string;
  scopeType?: string;
  scopeId?: string | null;
  periodType?: MetricPeriodType;
  periodStart: Date;
  periodEnd: Date;
}) {
  const metrics = await computeQualityMetricsForHousehold(input.householdId, input.periodStart, input.periodEnd);
  const computedAt = new Date();

  await prisma.productQualityMetricSnapshot.createMany({
    data: metrics.map((metric) => ({
      periodType: input.periodType ?? METRIC_PERIOD_TYPE.DAILY,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      householdId: input.householdId,
      scopeType: input.scopeType ?? "household",
      scopeId: input.scopeId ?? null,
      metricCode: metric.metricCode,
      metricValue: metric.metricValue,
      dimensions: (metric.dimensions as Prisma.InputJsonValue | undefined) ?? undefined,
      computedAt,
    })),
  });

  return metrics;
}

```

#### lib/security/crypto.ts

```ts
import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";

const CURRENT_VERSION = "v1";
const ALGO = "aes-256-gcm";

function parseKeys(): Record<string, Buffer> {
  const raw = process.env.TOTP_ENCRYPTION_KEYS;
  if (!raw) {
    throw new Error("TOTP_ENCRYPTION_KEYS env var is required");
  }

  const parsed: Record<string, Buffer> = {};
  for (const entry of raw.split(",").map((v) => v.trim()).filter(Boolean)) {
    const [version, key] = entry.split(":");
    if (!version || !key) continue;
    const buf = Buffer.from(key, "base64");
    if (buf.length !== 32) {
      throw new Error(`TOTP key ${version} must decode to 32 bytes`);
    }
    parsed[version] = buf;
  }

  if (!parsed[CURRENT_VERSION]) {
    throw new Error(`Missing ${CURRENT_VERSION} key in TOTP_ENCRYPTION_KEYS`);
  }

  return parsed;
}

export type EncryptedSecret = {
  ciphertext: string;
  keyVersion: string;
};

export function encryptTotpSecret(secret: string): EncryptedSecret {
  const keys = parseKeys();
  const key = keys[CURRENT_VERSION];
  const iv = randomBytes(12);

  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const payload = Buffer.concat([iv, authTag, encrypted]).toString("base64");
  return { ciphertext: payload, keyVersion: CURRENT_VERSION };
}

export function decryptTotpSecret(ciphertext: string, keyVersion: string): string {
  const keys = parseKeys();
  const key = keys[keyVersion];
  if (!key) throw new Error(`Unknown TOTP key version: ${keyVersion}`);

  const payload = Buffer.from(ciphertext, "base64");
  const iv = payload.subarray(0, 12);
  const authTag = payload.subarray(12, 28);
  const encrypted = payload.subarray(28);

  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

export function hashOpaqueToken(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

```

#### lib/security/keyring.ts

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

function parseKeyring(): SigningKey[] {
  const raw = process.env.ARTIFACT_SIGNING_KEYRING_JSON;
  if (!raw) {
    throw new Error("ARTIFACT_SIGNING_KEYRING_JSON is required");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid ARTIFACT_SIGNING_KEYRING_JSON");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Signing keyring must be a non-empty array");
  }

  const keys = parsed.map((item) => {
    const key = item as Partial<SigningKey>;
    if (!key.id || !key.secret) throw new Error("Every signing key must define id and secret");
    if (key.algorithm !== "hmac-sha256") throw new Error(`Unsupported algorithm for key ${key.id}`);
    if (!key.status || !["ACTIVE", "RETIRED", "REVOKED"].includes(key.status)) {
      throw new Error(`Invalid status for key ${key.id}`);
    }

    return {
      id: key.id,
      algorithm: "hmac-sha256" as const,
      status: key.status,
      secret: key.secret,
      activatedAt: key.activatedAt,
      retiredAt: key.retiredAt,
      revokedAt: key.revokedAt,
    };
  });

  const active = keys.filter((key) => key.status === "ACTIVE");
  if (active.length !== 1) {
    throw new Error("Exactly one ACTIVE signing key is required");
  }

  return keys;
}

export function getSigningKeyring() {
  return parseKeyring();
}

export function getActiveSigningKey() {
  return getSigningKeyring().find((key) => key.status === "ACTIVE")!;
}

export function findSigningKeyById(keyId: string) {
  return getSigningKeyring().find((key) => key.id === keyId) ?? null;
}

```

#### lib/security/rate-limit.ts

```ts
import { prisma } from "@/lib/prisma";

type Options = {
  key: string;
  limit: number;
  windowSeconds: number;
};

export async function enforceRateLimit(options: Options) {
  const now = new Date();
  const windowStart = new Date(Math.floor(now.getTime() / (options.windowSeconds * 1000)) * (options.windowSeconds * 1000));
  const bucketKey = `${options.key}:${windowStart.toISOString()}`;

  const bucket = await prisma.rateLimitBucket.upsert({
    where: { bucketKey },
    create: {
      bucketKey,
      scopeKey: options.key,
      windowStart,
      count: 1,
      expiresAt: new Date(windowStart.getTime() + options.windowSeconds * 1000),
    },
    update: {
      count: { increment: 1 },
      updatedAt: now,
    },
  });

  const allowed = bucket.count <= options.limit;
  if (!allowed) {
    console.warn("[rate-limit] limit exceeded", {
      scopeKey: options.key,
      bucketKey,
      count: bucket.count,
      limit: options.limit,
      windowSeconds: options.windowSeconds,
    });
  }

  return {
    allowed,
    remaining: Math.max(0, options.limit - bucket.count),
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.expiresAt.getTime() - now.getTime()) / 1000)),
  };
}

```

#### lib/security/scope.ts

```ts
export type ScopeContext = { userId: string; householdId: string | null };

export function scopeWhere(ctx: ScopeContext) {
  return ctx.householdId
    ? { householdId: ctx.householdId }
    : { userId: ctx.userId, householdId: null };
}

export function scopedAccessWhere<T extends object>(ctx: ScopeContext, extra?: T) {
  return {
    ...scopeWhere(ctx),
    ...(extra ?? {}),
  };
}

```

#### lib/security/verification.ts

```ts
import { createHmac, timingSafeEqual } from "crypto";
import { findSigningKeyById } from "./keyring";

export type VerificationStatus = "VALID" | "INVALID" | "REVOKED_KEY" | "ARTIFACT_NOT_FOUND" | "MALFORMED" | "UNSUPPORTED";

export function verifySignature({
  payload,
  signature,
  signatureKeyId,
  signatureAlgorithm,
}: {
  payload: Buffer;
  signature: string;
  signatureKeyId: string;
  signatureAlgorithm: string;
}): VerificationStatus {
  if (!payload || !signature || !signatureKeyId) return "MALFORMED";
  if (signatureAlgorithm !== "hmac-sha256") return "UNSUPPORTED";

  const key = findSigningKeyById(signatureKeyId);
  if (!key) return "INVALID";
  if (key.status === "REVOKED") return "REVOKED_KEY";

  const expected = createHmac("sha256", Buffer.from(key.secret, "utf-8")).update(payload).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  if (a.length !== b.length) return "INVALID";
  return timingSafeEqual(a, b) ? "VALID" : "INVALID";
}

```

### Prisma / Supabase
```text
supabase/: não encontrado
```

#### prisma/migrations
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

#### Último schema Prisma (prisma/schema.prisma)
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

#### Arquivos .sql (lista e conteúdo)
```text
./prisma/migrations/20260414190009_add_household_and_credit_fields/migration.sql
./prisma/migrations/20260414221323_add_2fa_totp_fields/migration.sql
./prisma/migrations/20260415161700_sync_schema_with_current_app/migration.sql
./prisma/migrations/20260416055106_add_product_feedback/migration.sql
./prisma/migrations/20260417044000_add_whatsapp_link_fields/migration.sql
./prisma/migrations/20260418090000_add_category_learning_rules/migration.sql
./prisma/migrations/20260419093000_wave1_blindagem/migration.sql
./prisma/migrations/20260419130000_wave2_financial_data_system/migration.sql
./prisma/migrations/20260419170000_wave4_operational_scale/migration.sql
./prisma/migrations/20260419193000_wave5_continuous_optimization/migration.sql
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

### src/lib/supabase.ts, src/lib/api.ts, src/lib/client.ts
```text
src/lib/supabase.ts: não encontrado
src/lib/api.ts: não encontrado
src/lib/client.ts: não encontrado
```

### Arquivos equivalentes em lib/

#### lib/prisma.ts

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

### Hooks em src/hooks/
```text
src/hooks/: não encontrado
```

### Hooks com nomes específicos (useAuth/useTransac/useCategor/useSaldo/useFatura/useMeta)
```text
não encontrado (src/hooks inexistente)
```

### Variáveis de ambiente referenciadas no código (chaves)
```text
process.env.AI_ENABLE_OPENAI
process.env.APP_BASE_URL
process.env.ARTIFACT_SIGNING_KEYRING_JSON
process.env.CAPTURE_SIGNING_KEY
process.env.CAPTURE_SIGNING_KEY_ID
process.env.CRON_SECRET
process.env.DATABASE_URL
process.env.GEMINI_API_KEY
process.env.GEMINI_MODEL
process.env.GROQ_API_KEY
process.env.GROQ_MODEL
process.env.INBOX_CAPTURE_DOMAIN
process.env.NEXT_PUBLIC_APP_URL
process.env.NIM_API_KEY
process.env.NODE_ENV
process.env.OPENAI_API_KEY
process.env.OPENAI_MODEL
process.env.OPENAI_VISION_MODEL
process.env.POSTMARK_WEBHOOK_SECRET
process.env.SESSION_SECRET
process.env.TOTP_ENCRYPTION_KEYS
process.env.TWILIO_ACCOUNT_SID
process.env.TWILIO_AUTH_TOKEN
process.env.TWILIO_WHATSAPP_NUMBER
process.env.WAVE5_CALIBRATION_MAX_STEP_PCT
process.env.WAVE5_CALIBRATION_MIN_SAMPLE_SIZE
process.env.WAVE5_CALIBRATION_MODE
```

### .env.example (conteúdo literal)
```env
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

| Superfície | Existe? | Arquivo principal | Status aparente | Linhas | Dependências de dados (hooks/queries/actions importadas) |
|---|---|---|---|---:|---|
| Autenticação | sim | app/login/page.tsx | não encontrado | 289 | 3:import React, { useState, Suspense } from "react";;7:import { useRouter, useSearchParams } from "next/navigation";;27:  const router = useRouter();;28:  const searchParams = useSearchParams();;31:  const [email, setEmail] = useState("");;32:  const [password, setPassword] = useState("");;33:  const [error, setError] = useState("");;34:  const [success, setSuccess] = useState("");; |
| Home/Início | sim | app/(dashboard)/InicioPageClient.tsx | não encontrado | 323 | 13:import { formatCurrency, formatDate } from "@/lib/format";;14:import { COPY, greetingForHour } from "@/lib/copy/ctrlbank";; |
| Saúde Financeira | sim | app/(dashboard)/saude/SaudePageClient.tsx | não encontrado | 391 | 3:import { useState, useEffect, useRef } from "react";;6:import { dismissRecommendation } from "@/app/actions/health";;59:  const [offset, setOffset] = useState(circ);;60:  const raf = useRef<number \| null>(null);;61:  const t0 = useRef<number \| null>(null);;63:  useEffect(() => {;170:  const [recommendations, setRecommendations] = useState(initialRecommendations);; |
| Caixa/Fluxo | sim | app/(dashboard)/caixa/CaixaPageClient.tsx | não encontrado | 246 | 3:import { useState } from "react";;75:  const [hideBalances, setHideBalances] = useState(false);; |
| Inbox | sim | app/(dashboard)/inbox/InboxPageClient.tsx | não encontrado | 260 | 4:import { useMemo, useRef, useState } from "react";;5:import { useRouter } from "next/navigation";;6:import { COPY } from "@/lib/copy/ctrlbank";;58:  const router = useRouter();;59:  const fileInputRef = useRef<HTMLInputElement>(null);;60:  const [rawInput, setRawInput] = useState("");;61:  const [selectedFile, setSelectedFile] = useState<File \| null>(null);;62:  const [loading, setLoading] = useState(false);; |
| IA/Adviser | sim | components/chat/AIChatWidget.tsx | não encontrado | 670 | 3:import React, { useState, useRef, useEffect, useTransition, useCallback } from "react";;9:import { getAccounts } from "@/app/actions/accounts";;10:import { getCategories } from "@/app/actions/categories";;11:import { getAiCaptureGroup } from "@/app/actions/ai/review";;12:import { getConversationHistory } from "@/app/actions/ai/conversation";;13:import { AIComposerBatchDraftItem, AIComposerResponse, AIComposerTransactionDraft, AIComposerMode } from "@/lib/ai/contracts";;27:  const [open, setOpen] = useState(false);;28:  const [input, setInput] = useState("");; |
| Extrato/Transações | sim | app/(dashboard)/caixa/CaixaPageClient.tsx | não encontrado | 246 | 3:import { useState } from "react";;75:  const [hideBalances, setHideBalances] = useState(false);; |
| Categorização | sim | app/(dashboard)/categorias/CategoriasPageClient.tsx | não encontrado | 115 | 3:import { useMemo, useState, useTransition } from "react";;6:import { useForm } from "react-hook-form";;10:import { seedDefaultCategoriesForUser, createCategory, updateCategory, deleteCategory } from "@/app/actions/categories";;14:import { COPY } from "@/lib/copy/ctrlbank";;33:  const [tab, setTab] = useState<TransactionType>("EXPENSE");;34:  const [open, setOpen] = useState(false);;35:  const [editing, setEditing] = useState<Category \| null>(null);;36:  const [isPending, startTransition] = useTransition();; |
| Faturas de Cartão | não | não encontrado | não encontrado | 0 | não encontrado |
| Metas | sim | app/(dashboard)/metas/MetasPageClient.tsx | não encontrado | 367 | 3:import React, { useState, useTransition } from "react";;5:import { useRouter } from "next/navigation";;10:import { formatCurrency, calcPercent, formatDate } from "@/lib/format";;12:import { createGoal, updateGoal, deleteGoal, contributeToGoal } from "@/app/actions/goals";;32:  const [showAdd, setShowAdd] = useState(false);;33:  const [addVal, setAddVal] = useState("");;150:  const [isPending, startTransition] = useTransition();;151:  const [targetAmount, setTargetAmount] = useState<string \| number>(editing?.targetAmount ?? "");; |
| Relatórios | sim | app/(dashboard)/relatorios/RelatoriosPageClient.tsx | não encontrado | 524 | 3:import React, { useState, useMemo } from "react";;5:import { useRouter, useSearchParams, usePathname } from "next/navigation";;11:import { formatCurrency, formatMonthYear } from "@/lib/format";;55:  const incomeByCategory = useMemo(() => {;66:  const expenseByCategory = useMemo(() => {;236:  const router   = useRouter();;237:  const pathname = usePathname();;238:  const searchParams = useSearchParams();; |
| Onboarding | sim | app/register/page.tsx | não encontrado | 271 | 3:import React, { useState } from "react";;7:import { useRouter } from "next/navigation";;27:  const router = useRouter();;28:  const [name, setName] = useState("");;29:  const [email, setEmail] = useState("");;30:  const [password, setPassword] = useState("");;31:  const [confirmPassword, setConfirmPassword] = useState("");;32:  const [error, setError] = useState("");; |
| Perfil/Configurações | sim | app/(dashboard)/configuracoes/page.tsx | não encontrado | 125 | 8:} from "@/app/actions/inbox";; |

## 10. QUALIDADE E CONFIGURAÇÃO

### ESLint
```text
.eslintrc*: não encontrado
eslint.config.mjs: encontrado
```
```js
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
.prettierrc*: não encontrado
```

### Husky / lint-staged
```text
.husky/: não encontrado
lint-staged: não encontrado no package.json
```

### Vitest / Jest / Playwright
```text
Vitest: encontrado (vitest.config.ts)
Jest: não encontrado
Playwright: não encontrado
```

#### Testes existentes (caminho + descrição it/test)
```text
__tests__/totp-helper.test.ts:20:  it("passes when 2FA is disabled", async () => {
__tests__/totp-helper.test.ts:25:  it("validates encrypted secret", async () => {
__tests__/inbox-parser.test.ts:6:  it("extracts expense rows from statement text", () => {
__tests__/inbox-parser.test.ts:19:  it("infers income with transfer keywords", () => {
__tests__/inbox-parser.test.ts:28:  it("ignores lines without BRL currency pattern", () => {
__tests__/inbox-parser.test.ts:35:  it("maps parsed items into persisted transaction shape", () => {
__tests__/database-url.test.ts:8:  it("prefers the Vercel Prisma URL when available", () => {
__tests__/database-url.test.ts:21:  it("prefers DATABASE_URL over direct connections for runtime", () => {
__tests__/database-url.test.ts:33:  it("falls back to the unpooled URL when pooled envs are absent", () => {
__tests__/database-url.test.ts:45:  it("throws a helpful error when no database URL exists", () => {
__tests__/database-url.test.ts:53:  it("prefers DIRECT_URL for migrations", () => {
__tests__/database-url.test.ts:65:  it("falls back to POSTGRES_URL_NON_POOLING before DATABASE_URL", () => {
__tests__/policy-engine.test.ts:30:  it("resolves defaults when no active policy exists", async () => {
__tests__/policy-engine.test.ts:36:  it("activates a policy version and retires prior one", async () => {
__tests__/policy-engine.test.ts:46:  it("rolls back to previous retired version", async () => {
__tests__/finance-kernel-invariants.test.ts:7:  it("keeps accounting balance and net position explicit for credit accounts", () => {
__tests__/finance-kernel-invariants.test.ts:17:  it("computes net as income - expense and ignores transfer/pending/ignored entries", () => {
__tests__/finance-kernel-invariants.test.ts:31:  it("builds UTC month bounds deterministically", () => {
__tests__/calibration-service.test.ts:29:  it("does not apply when sample size is insufficient", async () => {
__tests__/calibration-service.test.ts:39:  it("recommend-only mode does not create policy version", async () => {
__tests__/calibration-service.test.ts:50:  it("apply mode enforces bounded step and persists change", async () => {
__tests__/transaction-schema.test.ts:31:  it("parses a valid row", () => {
__tests__/transaction-schema.test.ts:41:  it("rejects negative amount", () => {
__tests__/transaction-schema.test.ts:46:  it("rejects description longer than 200 chars", () => {
__tests__/transaction-schema.test.ts:54:  it("rejects invalid type", () => {
__tests__/transaction-schema.test.ts:59:  it("coerces date string to Date object", () => {
__tests__/transaction-schema.test.ts:67:  it("defaults status to COMPLETED when omitted", () => {
__tests__/transaction-schema.test.ts:73:  it("accepts explicit PENDING status", () => {
__tests__/transaction-schema.test.ts:81:  it("accepts valid values", () => {
__tests__/transaction-schema.test.ts:87:  it("rejects invalid values", () => {
__tests__/checksum-signing.test.ts:10:  it("creates deterministic sha256 from canonical text", () => {
__tests__/checksum-signing.test.ts:16:  it("detects tampering in sealed payload", () => {
__tests__/security-crypto.test.ts:9:  it("encrypts and decrypts a TOTP secret", () => {
__tests__/security-crypto.test.ts:17:  it("hashes opaque tokens deterministically", () => {
__tests__/finance-utils.test.ts:19:  it("formats zero correctly", () => {
__tests__/finance-utils.test.ts:24:  it("formats positive value", () => {
__tests__/finance-utils.test.ts:29:  it("formats negative value", () => {
__tests__/finance-utils.test.ts:43:  it("returns 0 when target is 0", () => {
__tests__/finance-utils.test.ts:47:  it("returns 50 when halfway", () => {
__tests__/finance-utils.test.ts:51:  it("caps at 100 when exceeded", () => {
__tests__/finance-utils.test.ts:55:  it("returns 100 when exactly at target", () => {
__tests__/finance-utils.test.ts:81:  it("adds 1 day for DAILY", () => {
__tests__/finance-utils.test.ts:86:  it("adds 7 days for WEEKLY", () => {
__tests__/finance-utils.test.ts:91:  it("adds 14 days for BIWEEKLY", () => {
__tests__/finance-utils.test.ts:96:  it("advances 1 month for MONTHLY", () => {
__tests__/finance-utils.test.ts:101:  it("advances 3 months for QUARTERLY", () => {
__tests__/finance-utils.test.ts:106:  it("advances 1 year for YEARLY", () => {
__tests__/finance-utils.test.ts:111:  it("does not mutate the original date", () => {
__tests__/finance-utils.test.ts:123:  it("accepts 6-digit code", () => {
__tests__/finance-utils.test.ts:124:    expect(totpPattern.test("123456")).toBe(true);
__tests__/finance-utils.test.ts:127:  it("rejects fewer than 6 digits", () => {
__tests__/finance-utils.test.ts:128:    expect(totpPattern.test("12345")).toBe(false);
__tests__/finance-utils.test.ts:131:  it("rejects more than 6 digits", () => {
__tests__/finance-utils.test.ts:132:    expect(totpPattern.test("1234567")).toBe(false);
__tests__/finance-utils.test.ts:135:  it("rejects non-numeric chars", () => {
__tests__/finance-utils.test.ts:136:    expect(totpPattern.test("12345a")).toBe(false);
__tests__/finance-utils.test.ts:139:  it("rejects empty string", () => {
__tests__/finance-utils.test.ts:140:    expect(totpPattern.test("")).toBe(false);
__tests__/experiments-service.test.ts:19:  it("honors allocation strategy", async () => {
__tests__/experiments-service.test.ts:25:  it("kill switch disables experiment", async () => {
__tests__/inbox-processing-state.test.ts:5:  it("requires review when parse produced no candidates", () => {
__tests__/inbox-processing-state.test.ts:9:  it("requires review when duplicate already committed", () => {
__tests__/inbox-processing-state.test.ts:13:  it("supports idempotent confirm", () => {
__tests__/quota-service.test.ts:23:  it("passes when usage is below limit", async () => {
__tests__/quota-service.test.ts:31:  it("blocks when hard limit exceeded", async () => {
__tests__/quota-service.test.ts:38:  it("handles legacy null telemetry without crash", async () => {
__tests__/quality-feedback-evaluation.test.ts:21:  it("persists explicit and inferred feedback", async () => {
__tests__/quality-feedback-evaluation.test.ts:31:  it("creates deterministic evaluation records", async () => {
__tests__/scope-kernel.test.ts:5:  it("uses user scope when no household", () => {
__tests__/scope-kernel.test.ts:9:  it("uses household scope when household exists", () => {
__tests__/artifact-signing.test.ts:14:  it("uses the active key for new signatures", () => {
__tests__/artifact-signing.test.ts:20:  it("retired key still verifies historical signature", () => {
__tests__/artifact-signing.test.ts:35:  it("revoked key produces explicit revoked status", () => {
__tests__/artifact-signing.test.ts:47:  it("canonical payload is deterministic", () => {
__tests__/artifact-signing.test.ts:53:  it("requires exactly one active key", () => {
__tests__/quality-metrics.test.ts:28:  it("computes and persists key metrics", async () => {
__tests__/quality-metrics.test.ts:42:  it("handles legacy null/empty data without crashing", async () => {
__tests__/wave5-automation.test.ts:27:  it("runs idempotent metric/calibration generation and logs success", async () => {
__tests__/wave5-automation.test.ts:38:  it("detects representative regression", async () => {
__tests__/session-utils.test.ts:29:  it("produces a 64-char hex SHA-256 digest", () => {
__tests__/session-utils.test.ts:36:  it("is deterministic — same input yields same hash", () => {
__tests__/session-utils.test.ts:43:  it("two different tokens produce different hashes", () => {
__tests__/session-utils.test.ts:56:  it("returns a string containing the original token followed by a signature", async () => {
__tests__/session-utils.test.ts:62:  it("throws when SESSION_SECRET is absent", async () => {
__tests__/session-utils.test.ts:67:  it("throws when SESSION_SECRET is shorter than 32 characters", async () => {
__tests__/session-utils.test.ts:72:  it("produces a different signature for each unique token", async () => {
__tests__/session-utils.test.ts:85:  it("returns the original token for a correctly signed value", async () => {
__tests__/session-utils.test.ts:92:  it("round-trips correctly: sign → verify === token", async () => {
__tests__/session-utils.test.ts:97:  it("returns null for a tampered signature", async () => {
__tests__/session-utils.test.ts:105:  it("returns null for a tampered token body (signature mismatch)", async () => {
__tests__/session-utils.test.ts:114:  it("returns null when SESSION_SECRET is absent", async () => {
__tests__/session-utils.test.ts:120:  it("returns null when SESSION_SECRET is too short", async () => {
__tests__/session-utils.test.ts:126:  it("returns null when verified with a different secret", async () => {
__tests__/session-utils.test.ts:132:  it("returns null for a cookie value with no dot separator", async () => {
__tests__/session-utils.test.ts:136:  it("returns null for an empty string", async () => {
__tests__/session-utils.test.ts:140:  it("returns null for a value with only a signature (empty token part)", async () => {
```

### .github/workflows/
```text
.github/workflows/ci.yml
```

#### .github/workflows/ci.yml
```yml
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

### README.md (completo)
```md
CtrlBank: sistema de governança da saúde financeira familiar.

O CtrlBank não registra gastos. Ele governa a saúde financeira da família.
```

### tsc --noEmit (saída, até 100 linhas)
```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
app/(dashboard)/processamentos/page.tsx(58,12): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/(dashboard)/processamentos/page.tsx(63,12): error TS2339: Property 'calibrationRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/(dashboard)/processamentos/page.tsx(68,12): error TS2339: Property 'experiment' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/(dashboard)/processamentos/page.tsx(73,12): error TS2339: Property 'productQualityMetricSnapshot' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/(dashboard)/processamentos/page.tsx(81,23): error TS7006: Parameter 'quota' implicitly has an 'any' type.
app/(dashboard)/processamentos/page.tsx(159,29): error TS7006: Parameter 'artifact' implicitly has an 'any' type.
app/(dashboard)/processamentos/page.tsx(175,30): error TS7006: Parameter 'row' implicitly has an 'any' type.
app/(dashboard)/processamentos/page.tsx(191,22): error TS7006: Parameter 'job' implicitly has an 'any' type.
app/(dashboard)/processamentos/page.tsx(206,34): error TS7006: Parameter 'metric' implicitly has an 'any' type.
app/(dashboard)/processamentos/page.tsx(219,32): error TS7006: Parameter 'policy' implicitly has an 'any' type.
app/(dashboard)/processamentos/page.tsx(238,30): error TS7006: Parameter 'run' implicitly has an 'any' type.
app/(dashboard)/processamentos/page.tsx(247,29): error TS7006: Parameter 'experiment' implicitly has an 'any' type.
app/api/governance/summary/route.ts(17,12): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/api/governance/summary/route.ts(18,12): error TS2339: Property 'calibrationRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/api/governance/summary/route.ts(19,12): error TS2339: Property 'experiment' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/api/governance/summary/route.ts(20,12): error TS2339: Property 'productQualityMetricSnapshot' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/api/governance/summary/route.ts(24,30): error TS7006: Parameter 'policy' implicitly has an 'any' type.
lib/automation/wave5.ts(1,36): error TS2305: Module '"@prisma/client"' has no exported member 'CalibrationMode'.
lib/automation/wave5.ts(70,22): error TS2339: Property 'decisionEvaluation' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(1,15): error TS2305: Module '"@prisma/client"' has no exported member 'CalibrationMode'.
lib/calibration/service.ts(1,32): error TS2305: Module '"@prisma/client"' has no exported member 'PolicyStatus'.
lib/calibration/service.ts(29,31): error TS2339: Property 'calibrationRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(35,19): error TS2339: Property 'calibrationRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(47,32): error TS2339: Property 'decisionEvaluation' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(57,19): error TS2339: Property 'calibrationRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(70,41): error TS7006: Parameter 's' implicitly has an 'any' type.
lib/calibration/service.ts(71,40): error TS7006: Parameter 's' implicitly has an 'any' type.
lib/calibration/service.ts(85,40): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(90,31): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(107,28): error TS2339: Property 'calibrationRun' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/calibration/service.ts(121,16): error TS2339: Property 'calibrationChange' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/experiments/service.ts(1,15): error TS2305: Module '"@prisma/client"' has no exported member 'ExperimentStatus'.
lib/experiments/service.ts(11,35): error TS2339: Property 'experiment' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/experiments/service.ts(36,17): error TS2339: Property 'experiment' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/policy/engine.ts(1,15): error TS2305: Module '"@prisma/client"' has no exported member 'PolicyStatus'.
lib/policy/engine.ts(22,23): error TS2724: '"/workspace/ctrlbank/node_modules/.prisma/client/index".Prisma' has no exported member named 'PolicyVersionWhereInput'. Did you mean 'AiConversationWhereInput'?
lib/policy/engine.ts(28,31): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/policy/engine.ts(46,31): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/policy/engine.ts(50,14): error TS2339: Property 'policyVersion' does not exist on type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">'.
lib/policy/engine.ts(60,15): error TS2339: Property 'policyVersion' does not exist on type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">'.
lib/policy/engine.ts(72,32): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/policy/engine.ts(77,33): error TS2339: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/policy/engine.ts(91,16): error TS2339: Property 'policyVersion' does not exist on type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">'.
lib/policy/engine.ts(93,15): error TS2339: Property 'policyVersion' does not exist on type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">'.
lib/quality/evaluation.ts(1,10): error TS2305: Module '"@prisma/client"' has no exported member 'EvaluationResult'.
lib/quality/evaluation.ts(22,17): error TS2339: Property 'decisionEvaluation' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/quality/feedback.ts(19,17): error TS2339: Property 'decisionFeedback' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/quality/metrics.ts(1,15): error TS2305: Module '"@prisma/client"' has no exported member 'MetricPeriodType'.
lib/quality/metrics.ts(13,12): error TS2339: Property 'decisionFeedback' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/quality/metrics.ts(14,12): error TS2339: Property 'decisionEvaluation' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
lib/quality/metrics.ts(20,37): error TS7006: Parameter 'f' implicitly has an 'any' type.
lib/quality/metrics.ts(21,37): error TS7006: Parameter 'f' implicitly has an 'any' type.
lib/quality/metrics.ts(22,39): error TS7006: Parameter 'f' implicitly has an 'any' type.
lib/quality/metrics.ts(24,41): error TS7006: Parameter 'e' implicitly has an 'any' type.
lib/quality/metrics.ts(25,48): error TS7006: Parameter 'f' implicitly has an 'any' type.
lib/quality/metrics.ts(26,36): error TS7006: Parameter 'f' implicitly has an 'any' type.
lib/quality/metrics.ts(27,51): error TS7006: Parameter 'f' implicitly has an 'any' type.
lib/quality/metrics.ts(28,42): error TS7006: Parameter 'l' implicitly has an 'any' type.
lib/quality/metrics.ts(29,40): error TS7006: Parameter 'l' implicitly has an 'any' type.
lib/quality/metrics.ts(30,40): error TS7006: Parameter 'e' implicitly has an 'any' type.
lib/quality/metrics.ts(31,38): error TS7006: Parameter 'e' implicitly has an 'any' type.
lib/quality/metrics.ts(59,16): error TS2339: Property 'productQualityMetricSnapshot' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
```

### eslint . (saída, até 100 linhas)
```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## 11. DÍVIDA TÉCNICA VISÍVEL

### TODO/FIXME/HACK/XXX
```text
app/api/inbox/whatsapp-link/route.ts:57:    return twiml("⚠️ Código inválido. Envie no formato CTRL-XXXXXX.");
```

### `any` explícito em .ts/.tsx (top 10 arquivos)
```text
     11 lib/ai/composer.ts
      6 __tests__/database-url.test.ts
      5 lib/ai/providers/registry.ts
      5 components/chat/AIChatWidget.tsx
      4 lib/auth.ts
      4 lib/ai/providers/nvidia.ts
      4 lib/ai/ingest.ts
      3 lib/inbox/ocr.ts
      3 components/chat/AICards.tsx
      3 __tests__/policy-engine.test.ts
```

### `console.log` e `console.error` (top 10 arquivos)
```text
     10 app/actions/transactions.ts
      7 scripts/cli/ctrlbank.ts
      6 lib/auth.ts
      5 lib/ai/composer.ts
      4 scripts/generate-backlog.ts
      4 scripts/build.mjs
      3 app/actions/accounts.ts
      2 scripts/backfill-totp-secrets.ts
      2 app/api/cron/export-backlog/route.ts
      2 app/api/auth/register/route.ts
```

### Imports não utilizados
```text
eslint . não reportou imports não utilizados na saída capturada.
```

### Componentes com mais de 300 linhas
```text
21550 total
735 ./app/actions/transactions.ts
697 ./app/(dashboard)/familia/FamiliaPageClient.tsx
670 ./components/chat/AIChatWidget.tsx
576 ./app/actions/household.ts
524 ./app/(dashboard)/relatorios/RelatoriosPageClient.tsx
465 ./lib/ai/ingest.ts
391 ./app/(dashboard)/saude/SaudePageClient.tsx
372 ./components/layout/DashboardLayoutClient.tsx
367 ./app/(dashboard)/metas/MetasPageClient.tsx
351 ./app/(dashboard)/contas/ContasPageClient.tsx
327 ./lib/ai/composer.ts
323 ./app/api/health/recommendations/generate/route.ts
323 ./app/(dashboard)/InicioPageClient.tsx
```

## 12. MÉTRICAS GERAIS

### Total de arquivos .ts e .tsx
```text
.ts: 143
.tsx: 56
```

### Total de linhas de código (sem node_modules/dist/coverage)
```text
55528
```

### Build e tamanho de bundle
```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> ctrlbank@0.1.0 build
> node scripts/build.mjs

[build] Missing database URL for migration. Skipping Prisma migrate deploy. Set one of: DIRECT_URL, DATABASE_URL_UNPOOLED, POSTGRES_URL_NON_POOLING, POSTGRES_PRISMA_URL, DATABASE_URL, POSTGRES_URL.
[build] Missing database URL for runtime. Continuing Next.js build without DATABASE_URL. Set one of: POSTGRES_PRISMA_URL, DATABASE_URL, POSTGRES_URL, DATABASE_URL_UNPOOLED, DIRECT_URL, POSTGRES_URL_NON_POOLING.
[build] Injected placeholder DATABASE_URL for static build-time imports.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
▲ Next.js 16.2.3 (Turbopack)
- Experiments (use with caution):
  · optimizePackageImports

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...
✓ Compiled successfully in 23.4s
  Running TypeScript ...
Failed to type check.

./app/(dashboard)/processamentos/page.tsx:58:12
Type error: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.

  [90m56 |[0m       take: [35m8[0m,
  [90m57 |[0m     }),
[31m[1m>[0m [90m58 |[0m     prisma.policyVersion.findMany({
  [90m   |[0m            [31m[1m^[0m
  [90m59 |[0m       where: { householdId: dbUser?.householdId ?? [36mundefined[0m, status: [32m"ACTIVE"[0m },
  [90m60 |[0m       orderBy: { activatedAt: [32m"desc"[0m },
  [90m61 |[0m       take: [35m10[0m,
Next.js build worker exited with code: 1 and signal: null
[build] Failed to prepare Prisma database URL. Error: npx next build exited with code 1.
    at ChildProcess.<anonymous> (file:///workspace/ctrlbank/scripts/build.mjs:115:21)
    at ChildProcess.emit (node:events:519:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12) {
  stdout: '▲ Next.js 16.2.3 (Turbopack)\n' +
    '- Experiments (use with caution):\n' +
    '  · optimizePackageImports\n' +
    '\n' +
    '  Creating an optimized production build ...\n' +
    '✓ Compiled successfully in 23.4s\n' +
    '  Running TypeScript ...\n',
  stderr: 'npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.\n' +
    '⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy\n' +
    'Failed to type check.\n' +
    '\n' +
    './app/(dashboard)/processamentos/page.tsx:58:12\n' +
    "Type error: Property 'policyVersion' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.\n" +
    '\n' +
    '  \x1B[90m56 |\x1B[0m       take: \x1B[35m8\x1B[0m,\n' +
    '  \x1B[90m57 |\x1B[0m     }),\n' +
    '\x1B[31m\x1B[1m>\x1B[0m \x1B[90m58 |\x1B[0m     prisma.policyVersion.findMany({\n' +
    '  \x1B[90m   |\x1B[0m            \x1B[31m\x1B[1m^\x1B[0m\n' +
    '  \x1B[90m59 |\x1B[0m       where: { householdId: dbUser?.householdId ?? \x1B[36mundefined\x1B[0m, status: \x1B[32m"ACTIVE"\x1B[0m },\n' +
    '  \x1B[90m60 |\x1B[0m       orderBy: { activatedAt: \x1B[32m"desc"\x1B[0m },\n' +
    '  \x1B[90m61 |\x1B[0m       take: \x1B[35m10\x1B[0m,\n' +
    'Next.js build worker exited with code: 1 and signal: null\n'
}
```

### Tamanho do repositório em MB
```text
1170	.
```
