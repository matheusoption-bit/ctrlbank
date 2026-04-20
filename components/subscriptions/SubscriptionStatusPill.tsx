import { DetectedSubscriptionStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const STATUS_META: Record<DetectedSubscriptionStatus, { label: string; className: string }> = {
  ACTIVE: {
    label: "Ativa",
    className: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
  },
  POSSIBLE: {
    label: "Possível",
    className: "border-sky-400/20 bg-sky-500/10 text-sky-300",
  },
  PRICE_CHANGED: {
    label: "Mudança de preço",
    className: "border-amber-400/20 bg-amber-500/10 text-amber-300",
  },
  DUPLICATE_SUSPECTED: {
    label: "Duplicidade",
    className: "border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-300",
  },
  INACTIVE: {
    label: "Inativa",
    className: "border-white/15 bg-white/5 text-white/60",
  },
  HIDDEN: {
    label: "Oculta",
    className: "border-white/10 bg-black/20 text-white/45",
  },
};

type SubscriptionStatusPillProps = {
  status: DetectedSubscriptionStatus;
  className?: string;
};

export function SubscriptionStatusPill({ status, className }: SubscriptionStatusPillProps) {
  const meta = STATUS_META[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
        meta.className,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}

export default SubscriptionStatusPill;
