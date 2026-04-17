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
