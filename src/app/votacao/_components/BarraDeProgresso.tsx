import { Categoria } from "@/types/voto";
import { cn } from "@/components/ui/cn";
import { contarEscolhidas, indicadoEscolhido, Votos } from "../cedula";

type BarraDeProgressoProps = {
  categorias: Categoria[];
  votos: Votos;
  etapaAtual: number;
  onIrPara: (indice: number) => void;
};

export default function BarraDeProgresso({ categorias, votos, etapaAtual, onIrPara }: BarraDeProgressoProps) {
  const total = categorias.length;
  const escolhidas = contarEscolhidas(categorias, votos);
  const emRevisao = etapaAtual === total;

  return (
    <nav aria-label="Progresso da votação">
      <div className="flex items-center justify-between gap-4 font-title text-sm">
        <span className="text-foreground/70">
          <strong className="font-bold text-foreground">{escolhidas}</strong> de {total} escolhidas
        </span>
        <button
          type="button"
          onClick={() => onIrPara(total)}
          aria-current={emRevisao ? "step" : undefined}
          className={cn(
            "rounded-full px-3 py-1 transition focus-visible:outline-2 focus-visible:outline-primary",
            emRevisao ? "bg-primary/15 text-primary" : "text-foreground/70 hover:text-foreground"
          )}
        >
          Revisão
        </button>
      </div>

      <ol className="mt-2 flex items-center gap-1.5">
        {categorias.map((categoria, indice) => {
          const escolhida = Boolean(indicadoEscolhido(categoria, votos));
          const atual = indice === etapaAtual;
          return (
            <li key={categoria.id} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onIrPara(indice)}
                aria-current={atual ? "step" : undefined}
                aria-label={`${categoria.nome}, ${escolhida ? "escolhida" : "pendente"}`}
                title={categoria.nome}
                className="group flex h-6 w-full items-center rounded-full focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span
                  className={cn(
                    "block w-full rounded-full transition-all duration-300",
                    atual ? "h-2" : "h-1.5 group-hover:h-2",
                    escolhida && "bg-primary",
                    !escolhida && atual && "bg-foreground/80",
                    !escolhida && !atual && "bg-white/15 group-hover:bg-white/30",
                    escolhida && atual && "shadow-[0_0_12px_rgba(250,192,147,0.8)]"
                  )}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
