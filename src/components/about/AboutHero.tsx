import { AeroText } from "@/components/ui/AeroText";
import { getAbout } from "@/lib/content/about";

export default function AboutHero() {
  const { title, titleHighlight, tagline, paragraphs, badge } = getAbout();

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="uppercase leading-tight">
            <AeroText className="block text-3xl md:text-5xl">{title}</AeroText>
            <AeroText variant="primary" className="block text-3xl md:text-5xl">
              {titleHighlight}
            </AeroText>
          </h1>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary md:text-base">
            {tagline}
          </p>

          <div className="mt-6 space-y-4 text-base text-foreground/80">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div aria-hidden="true" className="about-panel">
          <span className="absolute bottom-4 left-4 z-10 font-mono text-xs tracking-[0.25em] text-foreground/60">
            {badge}
          </span>
        </div>
      </div>
    </section>
  );
}
