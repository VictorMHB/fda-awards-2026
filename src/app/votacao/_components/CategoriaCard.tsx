"use client";

import { useId } from "react";
import { Categoria } from "@/types/voto";
import IndicadoCard from "./IndicadoCard";

type CategoriaCardProps = {
  categoria: Categoria;
  posicao: number;
  total: number;
  indicadoEscolhidoId: string | undefined;
  onEscolher: (indicadoId: string) => void;
};

export default function CategoriaCard({
  categoria,
  posicao,
  total,
  indicadoEscolhidoId,
  onEscolher,
}: CategoriaCardProps) {
  const tituloId = useId();
  const temEscolha = categoria.indicados.some((indicado) => indicado.id === indicadoEscolhidoId);

  return (
    <section aria-labelledby={tituloId}>
      <header className="mx-auto max-w-3xl text-center">
        <p className="font-title text-xs font-bold uppercase tracking-[0.35em] text-primary">
          Categoria {posicao} de {total}
        </p>
        <h2 id={tituloId} className="mt-3 text-balance font-title text-4xl font-bold leading-[1.05] sm:text-5xl">
          {categoria.nome}
        </h2>
        <p className="mt-3 text-foreground/70" aria-live="polite">
          {temEscolha ? "Escolha salva. Você pode trocar depois." : "Escolha um indicado."}
        </p>
      </header>

      {categoria.indicados.length === 0 ? (
        <p className="mt-10 text-center text-foreground/60">Esta categoria ainda não tem indicados.</p>
      ) : (
        <div
          role="radiogroup"
          aria-labelledby={tituloId}
          className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-[repeat(auto-fit,minmax(11rem,14rem))] sm:justify-center sm:gap-5"
        >
          {categoria.indicados.map((indicado) => (
            <IndicadoCard
              key={indicado.id}
              indicado={indicado}
              grupo={`categoria-${categoria.id}`}
              selecionado={indicado.id === indicadoEscolhidoId}
              esmaecido={temEscolha && indicado.id !== indicadoEscolhidoId}
              onEscolher={() => onEscolher(indicado.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
