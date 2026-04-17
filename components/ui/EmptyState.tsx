import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-4">
        <Icon size={32} className="text-secondary" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <p className="text-sm text-secondary max-w-xs mx-auto">
        {description}
      </p>
      <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20">
        <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
        <span className="text-[10px] font-bold text-warning uppercase tracking-wider">Em Construção</span>
      </div>
    </div>
  );
}
