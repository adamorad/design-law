import type { ReactNode } from "react";
import { Reveal } from "../reveal";
import { Heading } from "./heading";
import { Text } from "./text";

export function Section({
  id,
  title,
  intro,
  first = false,
  snap = true,
  children,
}: {
  id: string;
  title?: string;
  intro?: string;
  first?: boolean;
  snap?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`${snap ? "snap-section" : ""} flex items-center py-12 ${
        first ? "" : "border-t border-border"
      }`.replace(/\s+/g, " ")}
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        {title && (
          <Reveal>
            <Heading level="section">{title}</Heading>
            {intro && <Text variant="intro" className="mt-3">{intro}</Text>}
          </Reveal>
        )}
        <div className={title ? "mt-8" : ""}>{children}</div>
      </div>
    </section>
  );
}
