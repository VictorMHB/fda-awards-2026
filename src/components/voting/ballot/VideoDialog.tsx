"use client";

import { useId } from "react";
import { Close } from "pixelarticons/react";
import AeroButton from "@/components/ui/AeroButton";

type VideoDialogProps = {
  videoId: string;
  title: string;
  onClose: () => void;
};

export default function VideoDialog({ videoId, title, onClose }: VideoDialogProps) {
  const titleId = useId();

  return (
    <dialog
      ref={(el) => {
        if (el && !el.open) el.showModal();
      }}
      aria-labelledby={titleId}
      className="cat-menu video-dialog"
      onClose={onClose}
      onClick={(e) => {
        // Clique no fundo (o alvo é o próprio dialog)
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      <div className="cat-menu__window">
        <div className="cat-menu__bar">
          <h2
            id={titleId}
            className="min-w-0 truncate font-mono text-xs uppercase tracking-[0.2em] text-foreground/80"
          >
            {title}
          </h2>
          {/* close() dispara o evento "close", que chama onClose e devolve o foco ao botão de assistir */}
          <AeroButton
            variant="blue"
            size="icon"
            aria-label="Fechar vídeo"
            onClick={(e) => e.currentTarget.closest("dialog")?.close()}
          >
            <Close aria-hidden="true" width={20} height={20} />
          </AeroButton>
        </div>

        <div className="video-dialog__frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="size-full"
          />
        </div>
      </div>
    </dialog>
  );
}