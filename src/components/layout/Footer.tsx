import Image from "next/image";
import Link from "next/link";
import FooterStatus from "./FooterStatus";
import { getMasterSponsors, type Sponsor } from "@/lib/sponsors";

function SponsorTile({ sponsor }: { sponsor: Sponsor }) {
  const content = sponsor.logo ? (
    <Image
      src={sponsor.logo}
      alt={sponsor.name}
      fill
      sizes="240px"
      className="object-contain p-2"
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
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 md:flex-row md:items-start md:justify-between md:py-10">
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
          <p className="mt-4 max-w-sm text-sm text-foreground/70">
            Há cinco anos reconhecendo histórias, feitos e pessoas. Vote e escolha os próximos vencedores dos maiores prêmios do ano.
          </p>
        </div>

        {masters.length > 0 && (
          <section aria-labelledby="footer-sponsors" className="md:w-60">
            <h2 id="footer-sponsors" className="footer-heading">
              01 / Apresentado por
            </h2>
            <ul className="flex max-w-60 flex-col gap-3">
              {masters.map((sponsor) => (
                <li key={sponsor.name}>
                  <SponsorTile sponsor={sponsor} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Faixa técnica estilo embalagem Y2K */}
      <div className="footer-strip">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-3">
          <p className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span>© 2026 FDA Awards - 5ª edição</span>
            <FooterStatus />
          </p>

          <span aria-hidden="true" className="footer-barcode hidden md:block" />

          <p>Feito por Vermes Corp.</p>
        </div>
      </div>
    </footer>
  );
}