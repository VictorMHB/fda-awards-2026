import type { ComponentType, SVGProps } from "react";
import { Discord, Instagram, Link as LinkIcon, Mail, Youtube } from "pixelarticons/react";
import SectionHeader from "@/components/ui/SectionHeader";
import { getContactChannels, NEW_TAB_HINT, type ContactType } from "@/lib/services/contact";

const ICONS: Record<ContactType, ComponentType<SVGProps<SVGSVGElement>>> = {
  email: Mail,
  instagram: Instagram,
  discord: Discord,
  youtube: Youtube,
};

export default function ContactSection() {
  return (
    <section id="contact" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="Contato" description="Ainda com dúvida? Fale com a gente." />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {getContactChannels().map((channel) => {
            // Tipo fora da lista (aviso em lib/contact) cai num ícone de link
            const Icon = ICONS[channel.type] ?? LinkIcon;
            return (
              <li key={channel.href}>
                <a
                  href={channel.href}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noopener noreferrer" : undefined}
                  className="glass info-card group flex h-full items-center gap-4 p-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:flex-col lg:items-start"
                >
                  <span className="btn-aero flex h-12 w-12 shrink-0 items-center justify-center text-dark-bg">
                    <Icon aria-hidden="true" width={26} height={26} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-[0.2em] text-primary">
                      {channel.name}
                    </span>
                    <span className="mt-1 block font-bold text-foreground wrap-anywhere">{channel.handle}</span>
                    {channel.external && <span className="sr-only">{NEW_TAB_HINT}</span>}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.75 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
