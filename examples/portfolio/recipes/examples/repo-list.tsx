import { Card, Section } from "@/components/ds";
import { Reveal } from "@/components/reveal";

const REPOS = [
  {
    name: "Airlock",
    description:
      "Agent coordination daemon for macOS. Named locks and a shared scratchpad for AI agents, over MCP.",
    tags: ["Go", "MCP", "macOS"],
    href: "https://github.com/adamorad/airlock",
  },
  {
    name: "PortPeek",
    description:
      "Stop your agents from fighting over ports. A macOS menu bar app plus a headless MCP server.",
    tags: ["Swift", "MCP", "macOS"],
    href: "https://github.com/adamorad/portpeek",
  },
  {
    name: "CSV Quick Look",
    description:
      "macOS QuickLook extension for CSV and TSV files, with virtual scroll, sort, filter, and dark mode.",
    tags: ["Swift", "QuickLook", "macOS"],
    href: "https://github.com/adamorad/csv-quick-look",
  },
];

export function RepoListExample() {
  return (
    <Section
      id="open-source"
      title="Open source projects"
      intro="Tools and agent templates I have published on GitHub."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {REPOS.map((r, i) => (
          <Reveal key={r.name} delay={(i % 3) * 0.08} className="h-full">
            <Card
              kind="repo"
              href={r.href}
              title={r.name}
              description={r.description}
              tags={r.tags}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
