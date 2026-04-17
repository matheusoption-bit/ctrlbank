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
