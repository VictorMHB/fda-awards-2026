import Image from "next/image";
import { AeroText, type Tier } from "@/components/ui/AeroText";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { getSponsorsByTier, type Sponsor } from "@/lib/content/sponsors";

// Classes escritas por inteiro, senão o Tailwind não as gera
const TIER_STYLES: Record<Tier, { grid: string; card: string }> = {
  diamond:  { grid: "grid-cols-1 sm:grid-cols-2",                   card: "h-44" },
  platinum: { grid: "grid-cols-2 lg:grid-cols-3",                   card: "h-36" },
  gold:     { grid: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",    card: "h-32" },
  silver:   { grid: "grid-cols-2 md:grid-cols-4 lg:grid-cols-5",    card: "h-28" },
  bronze:   { grid: "grid-cols-3 md:grid-cols-5 lg:grid-cols-6",    card: "h-24" },
};

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const className = `flex items-center justify-center p-3 text-center text-sm text-foreground/90 ${TIER_STYLES[sponsor.tier].card}`;

  const content = sponsor.logo ? (
    <Image
      src={sponsor.logo}
      alt={sponsor.name}
      fill
      sizes="(min-width: 1024px) 20vw, 40vw"
      className="object-contain p-4"
    />
  ) : (
    // Card estreito (bronze no celular): nome longo quebra com hífen
    <span className="hyphens-auto">{sponsor.name}</span>
  );

  return sponsor.url ? (
    <Card
      as="a"
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      variant="tier"
      tier={sponsor.tier}
      interactive
      className={className}
    >
      {content}
    </Card>
  ) : (
    <Card variant="tier" tier={sponsor.tier} className={className}>
      {content}
    </Card>
  );
}

export default function SponsorsSection() {
  const groups = getSponsorsByTier();

  return (
    <section id="sponsors" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          title="Patrocinadores"
          description="Quem apoia a premiação e torna ela possível."
        />

        <div className="space-y-12">
          {groups.map(({ id, label, sponsors }) => (
            <div key={id}>
              <AeroText as="h3" variant={id} className="text-xl md:text-2xl">
                {label}
              </AeroText>

              <ul className={`mt-5 grid gap-4 ${TIER_STYLES[id].grid}`}>
                {sponsors.map((sponsor) => (
                  <li key={sponsor.name}>
                    <SponsorCard sponsor={sponsor} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}