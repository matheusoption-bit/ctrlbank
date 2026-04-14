import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ========================================
   EmptyState — C6 Bank Premium Empty States
   ======================================== */

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-20 px-6",
        className
      )}
    >
      <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-secondary/50" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-secondary max-w-xs leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 btn-primary !w-auto px-8"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
