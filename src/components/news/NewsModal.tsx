"use client";

import { useId, useImperativeHandle, useRef, useState, type Ref } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { Close } from "pixelarticons/react";
import Card from "@/components/ui/Card";
import type { NewsCardData } from "@/components/news/NewsCarousel";

export type NewsModalHandle = {
  open: (news: NewsCardData, trigger: HTMLElement) => void;
};

// Um <dialog> para todas as notícias: o carrossel chama open() no clique do card.
// O showModal() já cuida do foco, do Esc e de deixar o resto da página inerte
export default function NewsModal({ ref }: { ref: Ref<NewsModalHandle> }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const pressedBackdrop = useRef(false);
  const [news, setNews] = useState<NewsCardData | null>(null);
  const titleId = useId();

  useImperativeHandle(
    ref,
    () => ({
      open(item, trigger) {
        triggerRef.current = trigger;
        // Troca o conteúdo antes de abrir: o modal já aparece com a notícia certa
        flushSync(() => setNews(item));
        dialogRef.current?.showModal();
        scrollRef.current?.scrollTo(0, 0);
      },
    }),
    [],
  );

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="news-modal"
      // O navegador devolve o foco ao card sozinho, mas nem todos (no Safari, o clique não foca o botão)
      onClose={() => triggerRef.current?.focus()}
      // Clique no fundo fecha. Conferir o pointerdown evita fechar quando a pessoa
      // seleciona o texto e solta o mouse fora da janela
      onPointerDown={(e) => {
        pressedBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (pressedBackdrop.current && e.target === e.currentTarget) close();
      }}
    >
      {news && (
        <Card
          variant="window"
          title="Notícia"
          barAction={
            <button type="button" onClick={close} className="news-modal__close">
              Fechar
              <Close aria-hidden="true" width={16} height={16} />
            </button>
          }
          className="flex min-h-0 flex-col [--card-bg-alpha:94%]"
        >
          {/* Só o texto rola: a barra com o Fechar fica sempre à vista */}
          <div
            ref={scrollRef}
            role="region"
            aria-labelledby={titleId}
            tabIndex={0}
            className="news-modal__scroll"
          >
            {news.cover && (
              <div className="relative aspect-video max-h-[45dvh] w-full">
                <Image
                  src={news.cover}
                  alt={news.coverAlt ?? ""}
                  fill
                  sizes="(min-width: 944px) 896px, 100vw"
                  className="object-cover"
                />
              </div>
            )}

            {/* Coluna de leitura: no desktop, a linha passaria de 90 caracteres na largura toda */}
            <div className="mx-auto max-w-3xl px-5 pt-6 pb-10 md:px-10 md:pt-8 md:pb-12">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                {news.category && (
                  <span className="bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-dark-bg">
                    {news.category}
                  </span>
                )}
                <time
                  dateTime={news.date}
                  className="text-xs font-semibold uppercase tracking-wider text-foreground/80"
                >
                  {news.dateLabel}
                </time>
              </div>

              <h2
                id={titleId}
                className="mt-4 font-display text-xl leading-snug text-foreground sm:text-2xl md:text-3xl"
              >
                {news.title}
              </h2>

              <div className="mt-6">{news.body}</div>
            </div>
          </div>
        </Card>
      )}
    </dialog>
  );
}
