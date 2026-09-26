import { Categoria } from "@/types/voto";
import { cn } from "@/components/ui/cn";
import { contarEscolhidas, Votos } from "../cedula";
import ResumoDeEscolhas from "./ResumoDeEscolhas";

type RevisaoDeVotosProps = {
  categorias: Categoria[];
  votos: Votos;
  onAlterar: (indice: number) => void;
};

function textoDePendencia(pendentes: number) {
  if (pendentes === 0) return "Tudo certo. Confirme para registrar seu voto.";
  if (pendentes === 1) return "Falta escolher em 1 categoria.";
  return `Falta escolher em ${pendentes} categorias.`;
}

export default function RevisaoDeVotos({ categorias, votos, onAlterar }: RevisaoDeVotosProps) {
  const pendentes = categorias.length - contarEscolhidas(categorias, votos);

  return (
    <section aria-labelledby="revisao-titulo">
      <header className="mx-auto max-w-3xl text-center">
        <p className="font-title text-xs font-bold uppercase tracking-[0.35em] text-primary">Revisão</p>
        <h2 id="revisao-titulo" className="mt-3 font-title text-4xl font-bold leading-[1.05] sm:text-5xl">
          Confira sua cédula
        </h2>
        <p className={cn("mt-3", pendentes > 0 ? "text-danger" : "text-foreground/70")}>
          {textoDePendencia(pendentes)}
        </p>
      </header>

      <div className="mx-auto mt-8 max-w-2xl sm:mt-10">
        <ResumoDeEscolhas categorias={categorias} votos={votos} onAlterar={onAlterar} />
      </div>
    </section>
  );
}
