import { Card, Section } from "@/components/ds";
import { Reveal } from "@/components/reveal";

const PRODUCTS = [
  {
    name: "StackFollow",
    description:
      "Only the notable updates for the tools in your stack, dated and sourced. Pick your tools and get a weekly email every Monday.",
    tags: ["Release tracking", "Weekly digest"],
    href: "https://stackfollow.xyz/",
    image: "/projects/stackfollow.jpg",
    imageAlt: "StackFollow home page",
  },
  {
    name: "RealCy",
    description:
      "Relocation to Cyprus in one place: 260+ new-build developments on an interactive map, service directories, relocation tools, and in-depth guides.",
    tags: ["Interactive map", "Directories", "Guides"],
    href: "https://realcy.app/",
    image: "/projects/realcy.jpg",
    imageAlt: "RealCy home page with an illustrated map of Cyprus",
  },
];

export function ProjectGridExample() {
  return (
    <Section
      id="work"
      title="Selected work"
      intro="Independent products that are live today, each built and shipped end to end."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08} className="h-full">
            <Card
              kind="site"
              href={p.href}
              title={p.name}
              description={p.description}
              tags={p.tags}
              image={p.image}
              imageAlt={p.imageAlt}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
