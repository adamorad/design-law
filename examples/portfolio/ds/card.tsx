import Image from "next/image";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { Heading } from "./heading";
import { Text } from "./text";
import { TagList } from "./tag";

type CardProps = {
  href: string;
  kind: "site" | "repo";
  title: string;
  description: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
  featured?: boolean;
};

const SHELL =
  "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-border-hover";

export function Card({
  href,
  kind,
  title,
  description,
  tags,
  image,
  imageAlt = "",
  featured = false,
}: CardProps) {
  const Signal = kind === "repo" ? GithubLogo : ArrowUpRight;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${SHELL} ${featured ? "md:flex-row" : ""}`.trim()}
    >
      {image && (
        <div className={featured ? "md:w-2/5 md:shrink-0" : ""}>
          <div
            className={`relative aspect-video overflow-hidden border-b border-border bg-background ${
              featured ? "md:border-b-0 md:border-r" : ""
            }`}
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes={
                featured
                  ? "(min-width: 768px) 400px, 100vw"
                  : "(min-width: 1024px) 240px, (min-width: 768px) 50vw, 100vw"
              }
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <Heading level={featured ? "card-featured" : "card"}>{title}</Heading>
          <Signal
            size={18}
            aria-label={kind === "repo" ? "View on GitHub" : undefined}
            aria-hidden={kind === "repo" ? undefined : true}
            className="mt-1 shrink-0 text-muted transition-colors group-hover:text-accent"
          />
        </div>
        <Text variant="small">{description}</Text>
        <div className="mt-auto pt-2">
          <TagList tags={tags} />
        </div>
      </div>
    </a>
  );
}
