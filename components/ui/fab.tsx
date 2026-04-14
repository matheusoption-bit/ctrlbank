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

export function FAB({ onClick, label = "Nova Transação", className }: FABProps) {
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
