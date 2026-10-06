import Image from "next/image";
import { Button, DeviceFrame, Heading, Section, Text } from "@/components/ds";
import { Reveal } from "@/components/reveal";

export function HeroExample() {
  return (
    <Section id="top" first>
      <Reveal className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col items-start gap-6">
          <Heading level="page">I build products end to end.</Heading>
          <Text variant="intro">
            Recent work spans AI agent runtimes, local-first developer tools,
            and a few independent products built end to end.
          </Text>
          <Button href="#work">View work</Button>
        </div>
        <div className="flex justify-center">
          <DeviceFrame width={288}>
            <Image
              src="/projects/ayalon-poster.jpg"
              alt="Ayalon Drive, a 3D driving game on the Ayalon highway"
              fill
              priority
              sizes="288px"
              className="object-cover"
            />
          </DeviceFrame>
        </div>
      </Reveal>
    </Section>
  );
}
