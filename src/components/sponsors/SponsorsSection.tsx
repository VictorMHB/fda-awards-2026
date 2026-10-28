import Image from "next/image";
import { AeroText, type Tier } from "@/components/ui/AeroText";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { getSponsorsByTier, type Sponsor } from "@/lib/content/shared/sponsors";

// Classes escritas por inteiro, senão o Tailwind não as gera.
// Quantos cards por linha fica em styles/components/sponsor-grid.css
const CARD_HEIGHT: Record<Tier, string> = {
  diamond: "h-44",
  platinum: "h-36",
  gold: "h-32",
  silver: "h-28",
  bronze: "h-24",
};

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const className = `flex h-full items-center justify-center p-3 text-center text-sm text-foreground/90`;

  const content = sponsor.logo ? (
    <Image
      src={sponsor.logo}
      alt={sponsor.name}
      fill
      sizes="(min-width: 1024px) 25vw, 40vw"
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

              <ul className={`sponsor-grid sponsor-grid--${id} mt-5`}>
                {sponsors.map((sponsor) => (
                  // A altura fica no item e o Card preenche (h-full)
                  <li
                    key={sponsor.name}
                    className={`sponsor-grid__item ${CARD_HEIGHT[id]}`}
                  >
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