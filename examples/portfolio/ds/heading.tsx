import type { ReactNode } from "react";

const LEVELS = {
  page: {
    tag: "h1",
    cls: "text-4xl font-medium tracking-tight md:text-5xl",
  },
  section: {
    tag: "h2",
    cls: "text-2xl font-medium tracking-tight md:text-3xl",
  },
  card: { tag: "h3", cls: "text-lg font-medium tracking-tight" },
  "card-featured": { tag: "h3", cls: "text-xl font-medium tracking-tight" },
} as const;

export type HeadingLevel = keyof typeof LEVELS;

export function Heading({
  level,
  children,
  className = "",
}: {
  level: HeadingLevel;
  children: ReactNode;
  className?: string;
}) {
  const { tag: Tag, cls } = LEVELS[level];
  return <Tag className={`${cls} ${className}`.trim()}>{children}</Tag>;
}
