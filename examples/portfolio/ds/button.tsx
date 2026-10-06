import type { ReactNode } from "react";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium";

const VARIANTS = {
  primary:
    "bg-accent text-accent-foreground transition-opacity hover:opacity-90",
  outline:
    "border border-border text-foreground transition-colors hover:border-border-hover",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

type Common = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

export function Button(
  props: Common &
    (
      | { href: string; external?: boolean; onClick?: never; label?: never }
      | { href?: never; external?: never; onClick: () => void; label?: string }
    ),
) {
  const { variant = "primary", children, className = "" } = props;
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`.trim();
  if (props.href !== undefined) {
    return (
      <a
        href={props.href}
        className={cls}
        {...(props.external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={props.onClick}
      aria-label={props.label}
      className={cls}
    >
      {children}
    </button>
  );
}
