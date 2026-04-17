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
