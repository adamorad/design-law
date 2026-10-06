import { Card, Section } from "@/components/ds";
import { Reveal } from "@/components/reveal";

export function FeaturedProjectExample() {
  return (
    <Section id="featured">
      <Reveal className="h-full">
        <Card
          featured
          kind="repo"
          href="https://github.com/adamorad/cv-tailor"
          title="CV Tailor"
          description="Tailors a CV to a job description entirely on your own machine, using a local model through Ollama. No API key, nothing leaves your computer."
          tags={["Next.js", "Ollama", "Local LLM"]}
          image="/projects/cv-tailor.jpg"
          imageAlt="CV Tailor home screen: Tailor your CV. Nothing leaves your Mac."
        />
      </Reveal>
    </Section>
  );
}
