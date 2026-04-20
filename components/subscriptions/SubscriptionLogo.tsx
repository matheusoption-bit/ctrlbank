"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { getSubscriptionBrandByKey } from "@/lib/brands/subscriptions";

type SubscriptionLogoProps = {
  brandKey?: string | null;
  displayName: string;
  logoPath?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<SubscriptionLogoProps["size"]>, string> = {
  sm: "h-10 w-10 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-14 w-14 text-base",
};

const SIZE_PIXELS: Record<NonNullable<SubscriptionLogoProps["size"]>, number> = {
  sm: 40,
  md: 48,
  lg: 56,
};

function monogramFromName(displayName: string) {
  return displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk.charAt(0).toUpperCase())
    .join("") || "?";
}

export function SubscriptionLogo({
  brandKey,
  displayName,
  logoPath,
  size = "md",
  className,
}: SubscriptionLogoProps) {
  const brand = getSubscriptionBrandByKey(brandKey);
  const [imageFailed, setImageFailed] = useState(false);

  const resolvedLogoPath = logoPath ?? brand?.logoPath ?? null;
  const themeColor = brand?.themeColor ?? "#121212";
  const monogram = useMemo(() => monogramFromName(displayName), [displayName]);
  const imageSize = SIZE_PIXELS[size];

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_14px_30px_rgba(0,0,0,0.18)]",
        SIZE_CLASSES[size],
        className,
      )}
      style={{ background: `linear-gradient(135deg, ${themeColor}22 0%, rgba(255,255,255,0.03) 100%)` }}
      aria-label={`Logo de ${displayName}`}
    >
      {resolvedLogoPath && !imageFailed ? (
        <Image
          src={resolvedLogoPath}
          alt={`Logo de ${displayName}`}
          width={imageSize}
          height={imageSize}
          className="h-[58%] w-[58%] object-contain"
          unoptimized
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="font-semibold tracking-[0.08em] text-white/90">{monogram}</span>
      )}
    </div>
  );
}

export default SubscriptionLogo;
