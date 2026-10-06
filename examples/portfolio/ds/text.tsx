import type { ReactNode } from "react";

const VARIANTS = {
  intro: "max-w-intro text-muted leading-relaxed",
  body: "text-foreground leading-relaxed",
  small: "text-sm leading-relaxed text-muted",
} as const;

export type TextVariant = keyof typeof VARIANTS;

export function Text({
  variant = "body",
  children,
  className = "",
}: {
  variant?: TextVariant;
  children: ReactNode;
  className?: string;
}) {
  return <p className={`${VARIANTS[variant]} ${className}`.trim()}>{children}</p>;
}
