import Image from "next/image";
import { AeroText } from "@/components/ui/AeroText";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { getEditions, type Edition } from "@/lib/content/about/editions";
import { TO_BE_ANNOUNCED } from "@/lib/content/info/event";

function EditionItem({ edition, eager = false }: { edition: Edition; eager?: boolean }) {
  const { year, winnerLabel, winner, description, image } = edition;

  return (
    <li className="grid gap-6 md:grid-cols-[2fr_3fr] md:items-start md:gap-10">
      <Card className="aspect-video">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center font-display text-4xl text-foreground/40 md:text-5xl"
          >
            {year}
          </span>
        )}
      </Card>

      <div className="min-w-0">
        <AeroText as="h3" variant="primary" className="text-4xl md:text-5xl">
          {String(year)}
        </AeroText>
        <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {winnerLabel}:
          </span>{" "}
          <span className="min-w-0 font-display text-lg text-balance break-words text-foreground">
            {winner ?? TO_BE_ANNOUNCED}
          </span>
        </p>
        {description && (
          <p className="mt-4 max-w-[65ch] text-foreground/80">{description}</p>
        )}
      </div>
    </li>
  );
}

export default function EditionsSection() {
  return (
    <section id="editions" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          title="Histórico de edições"
          description="Como a premiação chegou até a 5ª edição."
        />

        <ol className="space-y-16 md:space-y-24">
          {getEditions().map((edition) => (
            <EditionItem key={edition.year} edition={edition} eager />
          ))}
        </ol>
      </div>
    </section>
  );
}
