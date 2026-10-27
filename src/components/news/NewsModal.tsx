"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Close } from "pixelarticons/react";
import Card from "@/components/ui/Card";
import type { NewsCardData } from "@/components/news/NewsCarousel";

type NewsModalProps = {
  news: NewsCardData | null; // notícia aberta agora (vem da URL); null fecha
  onClose: () => void; // o <dialog> fechou: Esc, Fechar, clique no fundo ou voltar do navegador
};

// Um <dialog> para todas as notícias. O showModal() já cuida do foco, do Esc
// e de deixar o resto da página inerte
export default function NewsModal({ news, onClose }: NewsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pressedBackdrop = useRef(false);
  const titleId = useId();

  // A última notícia aberta continua na janela enquanto a saída anima
  const [shown, setShown] = useState(news);
  if (news && news !== shown) setShown(news);

  // Abre, troca ou fecha o <dialog> conforme a notícia. Sem setState aqui:
  // o conteúdo já foi renderizado, o efeito só mexe no elemento
  const openSlug = news?.slug ?? null;
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!openSlug) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    scrollRef.current?.scrollTo(0, 0); // toda notícia aberta começa do topo
  }, [openSlug]);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="news-modal"
      onClose={onClose}
      // Clique no fundo fecha. Conferir o pointerdown evita fechar quando a pessoa
      // seleciona o texto e solta o mouse fora da janela
      onPointerDown={(e) => {
        pressedBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (pressedBackdrop.current && e.target === e.currentTarget) close();
      }}
    >
      {shown && (
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
            {shown.cover && (
              <div className="relative aspect-video max-h-[45dvh] w-full">
                <Image
                  src={shown.cover}
                  alt={shown.coverAlt ?? ""}
                  fill
                  sizes="(min-width: 944px) 896px, 100vw"
                  className="object-cover"
                />
              </div>
            )}

            {/* Coluna de leitura: no desktop, a linha passaria de 90 caracteres na largura toda */}
            <div className="mx-auto max-w-3xl px-5 pt-6 pb-10 md:px-10 md:pt-8 md:pb-12">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                {shown.category && (
                  <span className="bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-dark-bg">
                    {shown.category}
                  </span>
                )}
                <time
                  dateTime={shown.date}
                  className="text-xs font-semibold uppercase tracking-wider text-foreground/80"
                >
                  {shown.dateLabel}
                </time>
              </div>

              <h2
                id={titleId}
                className="mt-4 font-display text-xl leading-snug text-foreground sm:text-2xl md:text-3xl"
              >
                {shown.title}
              </h2>

              <div className="mt-6">{shown.body}</div>
            </div>
          </div>
        </Card>
      )}
    </dialog>
  );
}
