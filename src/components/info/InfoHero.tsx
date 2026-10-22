import type { ComponentType, CSSProperties, SVGProps } from "react";
import { Calendar, Clock, MapPin } from "pixelarticons/react";
import { AeroText } from "@/components/ui/AeroText";
import { getEventDetails, type EventDetail } from "@/lib/event";

const ICONS: Record<EventDetail["id"], ComponentType<SVGProps<SVGSVGElement>>> = {
  date: Calendar,
  time: Clock,
  venue: MapPin,
};

type BubbleStyle = CSSProperties & Record<`--${string}`, string>;

// As menores somem no mobile para economizar GPU
const BUBBLES: { style: BubbleStyle; className?: string }[] = [
  { style: { "--s": "9rem", "--x": "6%", "--y": "18%", "--d": "8s" } },
  { style: { "--s": "4.5rem", "--x": "22%", "--y": "62%", "--d": "6s" }, className: "hidden sm:block" },
  { style: { "--s": "6rem", "--x": "78%", "--y": "14%", "--d": "9s" } },
  { style: { "--s": "3rem", "--x": "90%", "--y": "58%", "--d": "5s" }, className: "hidden sm:block" },
  { style: { "--s": "2rem", "--x": "58%", "--y": "8%", "--d": "7s" }, className: "hidden md:block" },
];

export default function InfoHero({ imageSrc }: { imageSrc?: string }) {
  const details = getEventDetails();

  return (
    <section className="info-hero px-6 pb-20 pt-32 md:pb-28 md:pt-40">
      {/* Fundo decorativo */}
      <div aria-hidden="true" className="info-hero__sky" />
      {imageSrc && (
        <div
          aria-hidden="true"
          className="info-hero__photo"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
      )}
      <div aria-hidden="true" className="info-hero__rays" />
      <div aria-hidden="true" className="info-hero__dots" />
      {BUBBLES.map(({ style, className = "" }, i) => (
        <span key={i} aria-hidden="true" className={`info-bubble ${className}`} style={style} />
      ))}

      <div className="mx-auto max-w-6xl">
        <p className="info-eyebrow">FDA Awards 2026 · 5ª edição</p>

        <AeroText as="h1" className="mt-4 block text-5xl md:text-7xl">
          Informações
        </AeroText>

        <ul className="mt-12 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {details.map(({ id, label, value, note }) => {
            const Icon = ICONS[id];
            return (
              <li key={id} className="info-tile">
                <div className="info-tile__bar">
                  <span>{label}</span>
                  <span className="info-tile__dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
                <div className="flex items-center gap-5 p-5 pb-6 lg:p-7 lg:pb-8">
                  <span className="btn-aero flex h-12 w-12 shrink-0 items-center justify-center text-dark-bg md:h-14 md:w-14">
                    <Icon aria-hidden="true" width={28} height={28} />
                  </span>
                  <div>
                    <p className="font-display text-lg text-balance text-foreground md:text-xl">{value}</p>
                    {note && <p className="mt-1 text-sm text-foreground/60">{note}</p>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}