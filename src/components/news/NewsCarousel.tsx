"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import type { NewsItem } from "@/lib/content/news";

// Como a página manda cada notícia: sem o Markdown cru, com a data por extenso e o texto já renderizado
export type NewsCardData = Omit<NewsItem, "content"> & {
  dateLabel: string;
  body: ReactNode;
};

export default function NewsCarousel({ news }: { news: NewsCardData[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

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
      {/* O scroll corta o que passa da borda: pb-10 dá espaço para a sombra dos cards e -mb-6 devolve o espaçamento */}
      <div
        ref={trackRef}
        className="-mb-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-10 md:gap-6 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {news.map((item) => (
          <Card
            key={item.slug}
            as="article"
            data-card
            className="flex min-h-92 w-[78vw] shrink-0 snap-start flex-col sm:w-88 md:min-h-104 md:w-[24rem] lg:w-104"
          >
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
                <span className="absolute left-3 top-3 bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-dark-bg">
                  {item.category}
                </span>
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
                {item.title}
              </h3>
              <p className="flex-1 text-sm text-foreground/70 md:text-base">
                {item.excerpt}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-primary">
                Ler mais →
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
