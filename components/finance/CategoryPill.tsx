import React from "react";

type Props = {
  name: string;
  color: string;
  icon?: string;
  size?: "sm" | "md";
};

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function CategoryPill({ name, color, icon, size = "md" }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"}`}
      style={{ borderColor: hexToRgba(color, 0.5), backgroundColor: hexToRgba(color, 0.12), color }}
      aria-label={`Categoria ${name}`}
    >
      {icon ? <span className="mr-1" aria-hidden>{icon}</span> : null}
      {name}
    </span>
  );
}
