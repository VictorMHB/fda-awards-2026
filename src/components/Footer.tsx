import Link from "next/link";

const CONTATO = {
  email: "contato@fdaawards.com",
  instagram: { label: "@fdaawards", href: "https://instagram.com/fdaawards" },
  discord: { label: "Discord", href: "https://discord.gg/seu-convite" },
  youtube: { label: "YouTube", href: "https://youtube.com/@fdaawards" },
};

const MAPA_SITE = [
  { href: "/", label: "Home" },
  { href: "/votacao", label: "Votação" },
  { href: "/informacoes", label: "Informações" },
  { href: "/sobre", label: "Sobre" },
];

const ANO_ATUAL = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="glass-footer relative mt-24">
      {/* Faixa de texto repetido */}
      <div className="overflow-hidden border-b border-foreground/10 py-3">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center">
              {Array.from({ length: 6 }).map((_, j) => (
                <span
                  key={j}
                  className="font-display mx-6 text-lg text-primary/80 md:text-xl"
                >
                  FDA AWARDS 2026
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Bloco de identidade */}
          <div className="md:col-span-2 text-left flex flex-col items-start">
  <span className="font-display text-2xl text-primary md:text-3xl">
    FDA <span className="text-foreground">AWARDS</span>
  </span>
  <p className="mt-4 max-w-sm text-base text-foreground/70 text-left">
    Os melhores prêmios do ano. 5 anos de história.
  </p>
</div>

          {/* Mapa do site */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
              Navegação
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {MAPA_SITE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base font-bold text-foreground/80 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
              Contato
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a
                  href={`mailto:${CONTATO.email}`}
                  className="text-base font-bold text-foreground/80 transition-colors hover:text-primary"
                >
                  {CONTATO.email}
                </a>
              </li>
              <li>
                <a
                  href={CONTATO.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-bold text-foreground/80 transition-colors hover:text-primary"
                >
                  {CONTATO.instagram.label}
                </a>
              </li>
              <li>
                <a
                  href={CONTATO.discord.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-bold text-foreground/80 transition-colors hover:text-primary"
                >
                  {CONTATO.discord.label}
                </a>
              </li>
              <li>
                <a
                  href={CONTATO.youtube.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-bold text-foreground/80 transition-colors hover:text-primary"
                >
                  {CONTATO.youtube.label}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Expediente, estilo revista */}
        <div className="mt-12 flex flex-col gap-3 border-t border-foreground/10 pt-6 text-sm text-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {ANO_ATUAL}, FDA AWARDS. Todos os direitos reservados.
          </p>
          <p>
            Feito por <span className="font-bold text-foreground/80">Vermes Corp.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}