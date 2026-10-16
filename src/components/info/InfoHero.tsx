import type { ComponentType, SVGProps } from "react";
import { Calendar, Clock, MapPin } from "pixelarticons/react";
import { AeroText } from "@/components/ui/AeroText";
import { getEventDetails, type EventDetail } from "@/lib/event";

const ICONS: Record<EventDetail["id"], ComponentType<SVGProps<SVGSVGElement>>> = {
  date: Calendar,
  time: Clock,
  venue: MapPin,
};

export default function InfoHero() {
  const details = getEventDetails();

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <AeroText as="h1" className="text-4xl md:text-6xl">
          Informações
        </AeroText>
        <p className="mt-4 max-w-2xl text-base text-foreground/70 md:text-lg">
          Quando e onde acontece, como votar e a quem recorrer se surgir alguma dúvida.
        </p>

        <ul className="mt-10 grid gap-4 lg:grid-cols-3 lg:gap-6">
          {details.map(({ id, label, value, note }) => {
            const Icon = ICONS[id];
            return (
              <li key={id} className="glass info-card flex items-center gap-5 p-5 lg:flex-col lg:items-start lg:p-7">
                <span className="btn-aero flex h-12 w-12 shrink-0 items-center justify-center text-dark-bg md:h-14 md:w-14">
                  <Icon aria-hidden="true" width={28} height={28} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{label}</p>
                  <p className="mt-1.5 font-display text-lg text-balance text-foreground md:text-xl">{value}</p>
                  {note && <p className="mt-1 text-sm text-foreground/60">{note}</p>}
                </div>
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.75 bg-primary" />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
