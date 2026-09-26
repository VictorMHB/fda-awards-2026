import { patrocinadores } from "@/data/patrocinadores";
import { TierDePatrocinio } from "@/types/patrocinador";
import { cn } from "@/components/ui/cn";

type EstiloDoTier = {
  tier: TierDePatrocinio;
  rotulo: string;
  cor: string;
  cartao: string;
  nome: string;
  colunas: string;
};

const estilosPorTier: EstiloDoTier[] = [
  {
    tier: "diamond",
    rotulo: "Diamond",
    cor: "text-tier-diamond",
    cartao: "min-h-40 border-tier-diamond/50 shadow-[0_0_60px_-18px_var(--color-tier-diamond)]",
    nome: "text-3xl sm:text-5xl",
    colunas: "grid-cols-1",
  },
  {
    tier: "platinum",
    rotulo: "Platinum",
    cor: "text-tier-platinum",
    cartao: "min-h-32 border-tier-platinum/40",
    nome: "text-2xl sm:text-3xl",
    colunas: "grid-cols-1 sm:grid-cols-2",
  },
  {
    tier: "gold",
    rotulo: "Gold",
    cor: "text-tier-gold",
    cartao: "min-h-28 border-tier-gold/35",
    nome: "text-xl sm:text-2xl",
    colunas: "grid-cols-2 lg:grid-cols-3",
  },
  {
    tier: "bronze",
    rotulo: "Bronze",
    cor: "text-tier-bronze",
    cartao: "min-h-20 border-tier-bronze/30",
    nome: "text-base sm:text-lg",
    colunas: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  },
];

export default function Patrocinadores() {
  return (
    <section aria-labelledby="patrocinadores-titulo" className="mt-20 sm:mt-28">
      <div className="text-center">
        <p className="font-title text-xs font-bold uppercase tracking-[0.35em] text-primary">Apoio</p>
        <h2 id="patrocinadores-titulo" className="mt-3 font-title text-3xl font-bold sm:text-5xl">
          Patrocinadores
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-foreground/75">
          O FDA Awards 2026 acontece graças a quem acredita no projeto.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-12">
        {estilosPorTier.map((estilo) => {
          const doTier = patrocinadores.filter((patrocinador) => patrocinador.tier === estilo.tier);
          if (doTier.length === 0) return null;

          return (
            <div key={estilo.tier} className={estilo.cor}>
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="h-px flex-1 bg-linear-to-r from-transparent to-current opacity-40" />
                <h3 className="font-title text-sm font-bold uppercase tracking-[0.35em]">{estilo.rotulo}</h3>
                <span aria-hidden="true" className="h-px flex-1 bg-linear-to-l from-transparent to-current opacity-40" />
              </div>

              <ul className={cn("mt-5 grid gap-3 sm:gap-4", estilo.colunas)}>
                {doTier.map((patrocinador) => (
                  <li
                    key={patrocinador.nome}
                    className={cn("glass grid place-items-center rounded-3xl px-5 py-6 text-center", estilo.cartao)}
                  >
                    <span className={cn("text-balance font-title font-bold leading-tight", estilo.nome)}>
                      {patrocinador.nome}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
