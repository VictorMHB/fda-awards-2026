"use client";

import { Categoria } from "@/types/voto";
import Avatar from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/components/ui/cn";
import { IconeLapis, IconeLixeira } from "@/components/ui/icons";

type ListaDeCategoriasProps = {
  categorias: Categoria[];
  carregando: boolean;
  editandoId: string | null;
  onEditar: (categoria: Categoria) => void;
  onApagar: (categoria: Categoria) => void;
};

function Conteudo({ categorias, carregando, editandoId, onEditar, onApagar }: ListaDeCategoriasProps) {
  if (carregando) {
    return (
      <div className="mt-4 flex flex-col gap-3">
        {Array.from({ length: 3 }, (_, indice) => (
          <Skeleton key={indice} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (categorias.length === 0) {
    return (
      <p className="mt-4 rounded-2xl border border-dashed border-white/20 p-6 text-center text-foreground/60">
        Nenhuma categoria criada ainda.
      </p>
    );
  }

  return (
    <ul className="mt-4 flex flex-col gap-3">
      {categorias.map((categoria) => (
        <li
          key={categoria.id}
          className={cn("glass rounded-2xl p-4", editandoId === categoria.id && "border-primary/60 bg-primary/5")}
        >
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 font-title text-sm font-bold">
              {categoria.ordem}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-title text-lg font-bold leading-tight">{categoria.nome}</p>
              <p className="mt-0.5 truncate font-mono text-xs text-foreground/50">{categoria.id}</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {categoria.indicados.slice(0, 5).map((indicado, indice) => (
                    <Avatar
                      key={`${indicado.id}-${indice}`}
                      nome={indicado.nome}
                      fotoUrl={indicado.imagemUrl}
                      className={cn("size-7 text-[0.6rem] ring-2 ring-dark-bg", indice >= 3 && "max-sm:hidden")}
                    />
                  ))}
                </div>
                <span className="whitespace-nowrap text-sm text-foreground/60">
                  {categoria.indicados.length === 1 ? "1 indicado" : `${categoria.indicados.length} indicados`}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEditar(categoria)}
                aria-label={`Editar ${categoria.nome}`}
              >
                <IconeLapis className="size-4.5" />
              </Button>
              <Button
                variant="danger"
                size="icon"
                onClick={() => onApagar(categoria)}
                aria-label={`Apagar ${categoria.nome}`}
              >
                <IconeLixeira className="size-4.5" />
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ListaDeCategorias(props: ListaDeCategoriasProps) {
  return (
    <section aria-labelledby="categorias-existentes">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="categorias-existentes" className="font-title text-2xl font-bold">
          Categorias existentes
        </h2>
        {!props.carregando && (
          <span className="font-title text-sm text-foreground/60">{props.categorias.length}</span>
        )}
      </div>
      <Conteudo {...props} />
    </section>
  );
}
