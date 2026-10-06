import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { Button, Heading, Section, Text } from "@/components/ds";
import { Reveal } from "@/components/reveal";

export function ContactExample() {
  return (
    <Section id="contact" snap={false}>
      <Reveal className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <Heading level="section">Get in touch</Heading>
          <Text variant="intro">
            Open to interesting problems, collaborations, and the odd consulting
            project.
          </Text>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button external href="https://www.linkedin.com/in/adam-morad/">
            <LinkedinLogo size={18} weight="fill" />
            LinkedIn
          </Button>
          <Button
            external
            variant="outline"
            href="https://github.com/adamorad"
          >
            <GithubLogo size={18} />
            GitHub
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
