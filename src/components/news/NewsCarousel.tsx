"use client";

import { useRef } from "react";

type Noticia = {
  id: string;
  tag: string;
  data: string;
  titulo: string;
  resumo: string;
};

// PLACEHOLDER
const NOTICIAS: Noticia[] = [
  {
    id: "1",
    tag: "Anúncio",
    data: "10 nov",
    titulo: "Como funciona a votação deste ano",
    resumo: "Entenda as categorias, os critérios de elegibilidade e como confirmar seu voto.",
  },
  {
    id: "2",
    tag: "Bastidores",
    data: "3 nov",
    titulo: "5 anos de FDA Awards",
    resumo: "Um resumo de como a premiação começou e o que mudou a cada edição.",
  },
  {
    id: "3",
    tag: "Evento",
    data: "28 out",
    titulo: "O que esperar da festa de encerramento",
    resumo: "Data, formato e as novidades da edição de 2026, incluindo a transmissão.",
  },
  {
    id: "4",
    tag: "Comunidade",
    data: "20 out",
    titulo: "Quem pode indicar e votar",
    resumo: "As regras de participação e como garantir que seu voto seja contabilizado.",
  },
];

export default function NewsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 320) + 24; // largura do card + gap
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
  <div className="relative">
    <div
      ref={trackRef}
      className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 md:gap-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {NOTICIAS.map((n) => (
        <article
          key={n.id}
          data-card
          className="glass group relative flex min-h-[23rem] w-[78vw] shrink-0 snap-start flex-col overflow-hidden sm:w-[22rem] md:min-h-[26rem] md:w-[24rem] lg:w-[26rem]"
        >
          {/* Capa placeholder */}
          <div className="relative h-44 w-full overflow-hidden bg-linear-to-br from-secondary/40 via-background to-dark-bg md:h-52">
            <div
              aria-hidden="true"
              className="absolute inset-0 text-foreground opacity-30 [background-image:radial-gradient(currentColor_1.5px,transparent_1.5px)] [background-size:14px_14px]"
            />
            <span className="absolute left-3 top-3 bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-dark-bg">
              {n.tag}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
              {n.data}
            </span>
            <h3 className="font-display text-lg leading-snug text-foreground md:text-xl">
              {n.titulo}
            </h3>
            <p className="flex-1 text-sm text-foreground/70 md:text-base">
              {n.resumo}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-primary transition-transform duration-300 group-hover:translate-x-1">
              Ler mais →
            </span>
          </div>

          <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
        </article>
      ))}
    </div>

    {/* Setas — desktop; no celular o scroll é por toque */}
    <div className="mt-4 hidden justify-end gap-2 md:flex">
      <button
        onClick={() => scrollBy(-1)}
        aria-label="Notícia anterior"
        className="glass flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-primary"
      >
        <ArrowIcon flipped />
      </button>
      <button
        onClick={() => scrollBy(1)}
        aria-label="Próxima notícia"
        className="glass flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-primary"
      >
        <ArrowIcon />
      </button>
    </div>
  </div>
);
}

function ArrowIcon({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      width="1.1em"
      height="1.1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      className={flipped ? "rotate-180" : ""}
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="13 5 20 12 13 19" />
    </svg>
  );
}