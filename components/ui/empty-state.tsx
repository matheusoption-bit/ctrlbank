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
    <div className="card-c6 text-center py-14 space-y-4 w-full">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto border border-border"
      >
        <Icon size={22} className="text-secondary" />
      </motion.div>
      <div className="space-y-1">
        <h3 className="font-bold text-white text-base">{title}</h3>
        <p className="text-secondary text-sm max-w-sm mx-auto leading-relaxed">{description}</p>
      </div>
      {action && (
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick} 
          className="btn-primary px-5 mx-auto w-fit text-sm mt-2"
        >
          {action.icon && <action.icon size={15} />}
          {action.label}
        </motion.button>
      )}
    </div>
  );
}
