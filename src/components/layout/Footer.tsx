import Link from "next/link";
import Marquee from "../ui/Marquee";

const CONTATO = {
  email: "contato@fdaawards.com",
  instagram: { label: "@fdaawards", href: "https://instagram.com/fdaawards" },
  discord: { label: "Discord", href: "https://discord.gg/seu-convite" },
  youtube: { label: "YouTube", href: "https://youtube.com/@fdaawards" },
};

const SUMARIO = [
  { href: "/", label: "Home" },
  { href: "/votacao", label: "Votação" },
  { href: "/categorias", label: "Categorias" },
  { href: "/patrocinadores", label: "Patrocinadores" },
  { href: "/informacoes", label: "Informações" },
  { href: "/sobre", label: "Sobre" },
];

const REDACAO = [
  { rotulo: "E-mail", texto: CONTATO.email, href: `mailto:${CONTATO.email}` },
  { rotulo: "Instagram", texto: CONTATO.instagram.label, href: CONTATO.instagram.href },
  { rotulo: "Discord", texto: CONTATO.discord.label, href: CONTATO.discord.href },
  { rotulo: "YouTube", texto: CONTATO.youtube.label, href: CONTATO.youtube.href },
];

// Larguras alternadas barra/espaço
const BARRAS = (() => {
  const larguras = [2, 1, 1, 3, 1, 1, 2, 2, 1, 3, 2, 1, 1, 1, 3, 1, 2, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 1, 2, 2, 1, 1, 3, 2];
  let x = 0;
  const barras: { x: number; w: number }[] = [];
  larguras.forEach((w, i) => {
    if (i % 2 === 0) barras.push({ x, w });
    x += w;
  });
  return { barras, total: x };
})();

const ANO_ATUAL = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="glass-footer relative mt-24">
      <Marquee text="SOU BURROW" />

      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          {/* Identidade + expediente */}
          <div className="md:col-span-4">
            <span className="font-display text-2xl text-primary md:text-3xl">
              FDA <span className="text-foreground">AWARDS</span>
            </span>
            <p className="mt-4 max-w-xs text-base text-foreground/70">
              Os melhores prêmios do ano. 5 anos de história.
            </p>

            <div className="rev-selo mt-6">
              <span className="rev-selo-num">Nº 05</span>
              <span className="rev-selo-texto">Edição {ANO_ATUAL}</span>
            </div>
          </div>

          {/* Sumário */}
          <nav aria-label="Sumário" className="md:col-span-4">
            <h3 className="rev-titulo">Nesta edição</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SUMARIO.map((item, i) => (
                <li key={item.href}>
                  <Link href={item.href} className="rev-sumario-item group">
                    <span className="rev-sumario-nome">{item.label}</span>
                    <span className="rev-sumario-pontos" aria-hidden="true" />
                    <span className="rev-sumario-pag">{String(i + 2).padStart(2, "0")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Redação + código de barras */}
          <div className="flex flex-col gap-8 md:col-span-4">
            <div>
              <h3 className="rev-titulo">Fale com a redação</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {REDACAO.map((c) => (
                  <li key={c.rotulo} className="flex items-baseline gap-3 text-sm md:text-base">
                    <span className="w-20 shrink-0 text-xs font-bold uppercase tracking-widest text-foreground/50">
                      {c.rotulo}
                    </span>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="font-bold text-foreground/85 transition-colors hover:text-primary"
                    >
                      {c.texto}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rev-codigo" aria-hidden="true">
              <svg viewBox={`0 0 ${BARRAS.total} 30`} preserveAspectRatio="none">
                {BARRAS.barras.map((b) => (
                  <rect key={b.x} x={b.x} y={0} width={b.w} height={30} />
                ))}
              </svg>
              <span>7 896026 120052</span>
            </div>
          </div>
        </div>

        {/* Expediente */}
        <div className="mt-12 flex flex-col gap-3 border-t border-foreground/10 pt-6 text-sm text-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>© {ANO_ATUAL}, FDA AWARDS. Todos os direitos reservados.</p>
          <p>
            Feito por <span className="font-bold text-foreground/80">Vermes Corp.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}