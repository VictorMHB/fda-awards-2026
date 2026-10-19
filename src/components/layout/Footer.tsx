import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";
import { getMasterSponsors, type Sponsor } from "@/lib/sponsors";

// Troque pelos canais oficiais (depois pode vir de src/data/contact.json)
const CONTACTS = [
  { label: "E-mail", href: "mailto:contato@exemplo.com" },
  { label: "Instagram", href: "https://instagram.com/exemplo" },
  { label: "Discord", href: "https://discord.gg/exemplo" },
];

function SponsorTile({ sponsor }: { sponsor: Sponsor }) {
  const content = sponsor.logo ? (
    <Image
      src={sponsor.logo}
      alt={sponsor.name}
      fill
      sizes="(min-width: 768px) 256px, 45vw"
      className="object-contain p-4"
    />
  ) : (
    <span className="px-3 text-center text-sm text-foreground/80">{sponsor.name}</span>
  );

  return sponsor.url ? (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={sponsor.name}
      className="footer-tile footer-tile--link"
    >
      {content}
    </a>
  ) : (
    <div className="footer-tile">{content}</div>
  );
}

export default function Footer() {
  const masters = getMasterSponsors();

  return (
    <footer className="site-footer">
      {/* 1. Patrocinadores master */}
      {masters.length > 0 && (
        <section
          aria-label="Patrocinadores master"
          className="border-b border-foreground/15 px-6 py-8 md:py-10"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="footer-eyebrow">Apresentado por</p>
            <ul className="grid w-full max-w-lg grid-cols-2 gap-3 md:gap-5">
              {masters.map((sponsor) => (
                <li key={sponsor.name}>
                  <SponsorTile sponsor={sponsor} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 2. Corpo */}
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" aria-label="FDA Awards" className="group inline-block">
            <span aria-hidden="true" className="logo-aero font-display text-2xl md:text-3xl">
              <span className="logo-aero-word logo-aero-fda" data-l="FDA">
                <span className="logo-aero-face">FDA</span>
              </span>
              <span className="logo-aero-word logo-aero-awards" data-l="AWARDS">
                <span className="logo-aero-face">AWARDS</span>
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm text-foreground/70">
            Reconhecendo acontecimentos, feitos e histórias do ano.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="footer-heading">01 / Navegação</h2>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="footer-heading">02 / Contato</h2>
          <ul>
            {CONTACTS.map((contact) => {
              const external = contact.href.startsWith("http");
              return (
                <li key={contact.label}>
                  <a
                    href={contact.href}
                    className="footer-link"
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {contact.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 03 / Legal: adicionar quando /privacidade e /termos existirem */}
      </div>

      {/* 3. Faixa técnica estilo embalagem Y2K */}
      <div className="footer-strip">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-5">
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>No.005 / 2026</span>
            <span>Ver 5.0</span>
            <span className="footer-status">System ready</span>
          </p>

          <span aria-hidden="true" className="footer-barcode" />

          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© 2026 FDA Awards · 5ª edição</span>
            <span aria-hidden="true" lang="ja" className="opacity-60">
              アワード
            </span>
            <a href="#" aria-label="Voltar ao topo" className="btn-aero footer-top">
              <svg
                aria-hidden="true"
                width="1.1em"
                height="1.1em"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="square"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5,12 12,5 19,12" />
              </svg>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}