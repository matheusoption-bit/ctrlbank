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
