"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import NewsModal from "@/components/news/NewsModal";
import { clearNewsSlug, pushNewsSlug, useNewsSlug } from "@/hooks/useNewsSlug";
import type { NewsItem } from "@/lib/content/shared/news";

// Como a página manda cada notícia: sem o Markdown cru, com a data por extenso e o texto já renderizado
export type NewsCardData = Omit<NewsItem, "content"> & {
  dateLabel: string;
  body: ReactNode;
};

export default function NewsCarousel({ news }: { news: NewsCardData[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // A URL decide qual notícia está aberta. Slug que não existe (ou de rascunho) é ignorado
  const slug = useNewsSlug();
  const openNews = news.find((item) => item.slug === slug) ?? null;

  const closeNews = () => {
    clearNewsSlug();
    // O navegador devolve o foco ao card sozinho, mas nem todos (no Safari, o clique não foca o botão)
    triggerRef.current?.focus();
    triggerRef.current = null;
  };

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 320) + 24; // largura do card + gap
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (news.length === 0) {
    return <p className="text-base text-foreground/70">Nenhuma notícia por enquanto.</p>;
  }

  return (
    <div className="relative">
      {/* O scroll corta o que passa da borda: pt-3 dá espaço para o card subir no hover,
          pb-10 para a sombra, e -mt-3 / -mb-6 devolvem o espaçamento */}
      <div
        ref={trackRef}
        className="-mt-3 -mb-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pt-3 pb-10 md:gap-6 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {news.map((item) => (
          <Card
            key={item.slug}
            as="article"
            data-card
            interactive
            className="flex min-h-92 w-[78vw] shrink-0 snap-start flex-col sm:w-88 md:min-h-104 md:w-[24rem] lg:w-104"
          >
            {/* Brilho diagonal do hover (opt-in) */}
            <span aria-hidden="true" className="card__shine" />

            <div className="relative h-44 w-full overflow-hidden bg-linear-to-br from-secondary/40 via-background to-dark-bg md:h-52">
              {item.cover ? (
                <Image
                  src={item.cover}
                  alt={item.coverAlt ?? ""}
                  fill
                  sizes="(min-width: 1024px) 416px, (min-width: 768px) 384px, (min-width: 640px) 352px, 78vw"
                  className="object-cover"
                />
              ) : (
                // Sem capa, fica a retícula
                <div
                  aria-hidden="true"
                  className="absolute inset-0 text-foreground opacity-30 bg-[radial-gradient(currentColor_1.5px,transparent_1.5px)] bg-size-[14px_14px]"
                />
              )}
              {item.category && (
                <span className="tag absolute left-3 top-3">{item.category}</span>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
              <time
                dateTime={item.date}
                className="text-xs font-semibold uppercase tracking-wider text-foreground/80"
              >
                {item.dateLabel}
              </time>
              <h3 className="font-display text-lg leading-snug text-foreground md:text-xl">
                {/* O ::after do card__trigger cobre o card: o clique vale no card inteiro */}
                <button
                  type="button"
                  onClick={(e) => {
                    triggerRef.current = e.currentTarget;
                    pushNewsSlug(item.slug);
                  }}
                  className="card__trigger"
                >
                  {item.title}
                </button>
              </h3>
              <p className="flex-1 text-sm text-foreground/70 md:text-base">
                {item.excerpt}
              </p>
              <span
                aria-hidden="true"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-primary"
              >
                Ler mais
                <span className="card__arrow">→</span>
              </span>
            </div>
          </Card>
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

      <NewsModal news={openNews} onClose={closeNews} />
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