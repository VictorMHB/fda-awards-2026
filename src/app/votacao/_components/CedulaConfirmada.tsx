import { Categoria } from "@/types/voto";
import { ButtonLink } from "@/components/ui/Button";
import { IconeCheck } from "@/components/ui/icons";
import { Votos } from "../cedula";
import ResumoDeEscolhas from "./ResumoDeEscolhas";

type CedulaConfirmadaProps = {
  categorias: Categoria[];
  votos: Votos;
  confirmadoEm: number | null;
};

const formatoDeData = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" });

export default function CedulaConfirmada({ categorias, votos, confirmadoEm }: CedulaConfirmadaProps) {
  return (
    <div>
      <header className="text-center">
        <div className="mx-auto grid size-20 animate-selo place-items-center rounded-full bg-primary text-dark-bg shadow-[0_0_60px_-8px_rgba(250,192,147,0.8)]">
          <IconeCheck className="size-10" strokeWidth={2.5} />
        </div>
        <h1
          className="mt-8 animate-surgir font-title text-4xl font-bold leading-tight sm:text-6xl"
          style={{ animationDelay: "150ms" }}
        >
          Voto confirmado
        </h1>
        <p className="mt-4 animate-surgir text-balance text-lg text-foreground/75" style={{ animationDelay: "250ms" }}>
          Obrigado por participar do FDA Awards 2026.
        </p>
        {confirmadoEm !== null && (
          <p className="mt-1 text-sm text-foreground/55">Registrado em {formatoDeData.format(confirmadoEm)}</p>
        )}
      </header>

      <section aria-labelledby="suas-escolhas" className="mx-auto mt-12 max-w-2xl">
        <h2
          id="suas-escolhas"
          className="mb-4 font-title text-xs font-bold uppercase tracking-[0.35em] text-foreground/60"
        >
          Suas escolhas
        </h2>
        <ResumoDeEscolhas categorias={categorias} votos={votos} />
      </section>

      <div className="mt-10 text-center">
        <ButtonLink href="/" variant="glass">
          Voltar ao início
        </ButtonLink>
      </div>
    </div>
  );
}
