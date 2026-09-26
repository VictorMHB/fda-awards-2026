import { Categoria } from "@/types/voto";
import Avatar from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { indicadoEscolhido, Votos } from "../cedula";

type ResumoDeEscolhasProps = {
  categorias: Categoria[];
  votos: Votos;
  onAlterar?: (indice: number) => void;
};

export default function ResumoDeEscolhas({ categorias, votos, onAlterar }: ResumoDeEscolhasProps) {
  return (
    <ol className="flex flex-col gap-3">
      {categorias.map((categoria, indice) => {
        const escolhido = indicadoEscolhido(categoria, votos);
        const rotuloDaAcao = escolhido ? "Alterar" : "Escolher";

        return (
          <li
            key={categoria.id}
            className={cn(
              "glass flex items-center gap-4 rounded-2xl p-3 pr-4 sm:p-4",
              !escolhido && "border-dashed border-danger/40"
            )}
          >
            {escolhido ? (
              <Avatar
                nome={escolhido.nome}
                fotoUrl={escolhido.imagemUrl}
                forma="quadrado"
                className="size-14 text-base"
              />
            ) : (
              <span
                aria-hidden="true"
                className="grid size-14 shrink-0 place-items-center rounded-xl border border-dashed border-white/25 font-title text-xl text-foreground/40"
              >
                ?
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="font-title text-xs uppercase leading-snug tracking-[0.18em] text-foreground/60 wrap-break-word">
                {categoria.nome}
              </p>
              <p
                className={cn(
                  "mt-1 font-title text-lg font-bold leading-tight wrap-break-word",
                  escolhido ? "text-foreground" : "text-danger"
                )}
              >
                {escolhido ? escolhido.nome : "Nenhuma escolha"}
              </p>
            </div>

            {onAlterar && (
              <Button
                variant={escolhido ? "ghost" : "glass"}
                size="sm"
                onClick={() => onAlterar(indice)}
                aria-label={`${rotuloDaAcao} em ${categoria.nome}`}
              >
                {rotuloDaAcao}
              </Button>
            )}
          </li>
        );
      })}
    </ol>
  );
}
