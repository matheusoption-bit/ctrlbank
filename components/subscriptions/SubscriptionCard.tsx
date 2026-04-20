"use client";

import Link from "next/link";
import { CheckCircle2, EyeOff, ExternalLink, Repeat2 } from "lucide-react";
import { DetectedSubscriptionView } from "@/lib/subscriptions/contracts";
import SubscriptionLogo from "@/components/subscriptions/SubscriptionLogo";
import SubscriptionStatusPill from "@/components/subscriptions/SubscriptionStatusPill";

type SubscriptionCardProps = {
  subscription: DetectedSubscriptionView;
  onConfirm: (id: string) => void;
  onHide: (id: string) => void;
  isBusy?: boolean;
};

function formatCurrency(value: number | null) {
  if (value == null) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function confidenceLabel(confidence: number) {
  return `${Math.round(confidence * 100)}%`;
}

export function SubscriptionCard({ subscription, onConfirm, onHide, isBusy = false }: SubscriptionCardProps) {
  return (
    <article className="rounded-[28px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[0_22px_50px_rgba(0,0,0,0.18)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <SubscriptionLogo
            brandKey={subscription.brandKey}
            displayName={subscription.displayName}
            logoPath={subscription.logoPath}
            size="lg"
          />

          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-xl font-semibold text-white">{subscription.displayName}</h3>
              <SubscriptionStatusPill status={subscription.status} />
              {subscription.isUserConfirmed ? (
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                  Confirmada
                </span>
              ) : null}
            </div>

            <p className="text-sm text-white/50">
              {subscription.normalizedMerchant}
              {subscription.bankAccountName ? ` · ${subscription.bankAccountName}` : ""}
            </p>

            <p className="max-w-3xl text-sm leading-6 text-white/65">{subscription.whyDetected ?? "Sem explicação detalhada."}</p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[320px]">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Última cobrança</p>
            <p className="mt-2 text-sm font-semibold text-white">{formatCurrency(subscription.lastAmount)}</p>
            <p className="mt-1 text-xs text-white/45">{formatDate(subscription.lastChargeAt)}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Próxima estimada</p>
            <p className="mt-2 text-sm font-semibold text-white">{formatDate(subscription.estimatedNextChargeAt)}</p>
            <p className="mt-1 text-xs text-white/45">{subscription.billingFrequency.toLowerCase()}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Ticket médio</p>
            <p className="mt-2 text-sm font-semibold text-white">{formatCurrency(subscription.averageAmount)}</p>
            <p className="mt-1 text-xs text-white/45">confiança {confidenceLabel(subscription.confidence)}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Evidências</p>
            <p className="mt-2 text-sm font-semibold text-white">{subscription.charges.length} cobranças</p>
            <p className="mt-1 text-xs text-white/45">merchant + histórico reconciliado</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {subscription.matchedSignals.slice(0, 5).map((signal) => (
          <span
            key={signal}
            className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-white/50"
          >
            {signal.replaceAll("-", " ").replaceAll(":", " · ")}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-3 xl:grid-cols-[1fr_auto] xl:items-start">
        <div className="rounded-2xl border border-white/[0.08] bg-black/10 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
            <Repeat2 className="h-4 w-4 text-white/45" />
            Últimas cobranças relacionadas
          </div>
          <div className="space-y-2">
            {subscription.charges.slice(0, 3).map((charge) => (
              <div
                key={charge.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-white/80">{charge.transaction.description ?? subscription.displayName}</p>
                  <p className="mt-1 text-xs text-white/45">
                    {formatDate(charge.transaction.date)} · {charge.matchedBy}
                  </p>
                </div>
                <span className="text-sm font-semibold text-white">{formatCurrency(charge.transaction.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 xl:min-w-[220px]">
          <button
            type="button"
            onClick={() => onConfirm(subscription.id)}
            disabled={isBusy || subscription.isUserConfirmed}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirmar assinatura
          </button>
          <button
            type="button"
            onClick={() => onHide(subscription.id)}
            disabled={isBusy}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <EyeOff className="h-4 w-4" />
            Ocultar detecção
          </button>
          <Link
            href={subscription.openTransactionsHref}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-black/30 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir no Caixa
          </Link>
        </div>
      </div>
    </article>
  );
}

export default SubscriptionCard;
