"use client";

import { useId } from "react";
import { ArrowDown, ArrowUp, Close } from "pixelarticons/react";
import AeroButton from "@/components/ui/AeroButton";
import { parseYouTubeId, youtubeThumb } from "@/lib/voting/categories";
import type { CategoriaTipo } from "@/types/voto";
import ImageField from "./ImageField";

export const INPUT =
  "min-h-11 w-full border border-secondary bg-dark-bg px-3 py-2 text-foreground placeholder:text-foreground/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60";

export const LABEL = "font-mono text-xs uppercase tracking-[0.2em] text-foreground/70";

// videoUrl é o texto colado; o videoId só é extraído na hora de salvar
export type NomineeDraft = {
  id: string;
  nome: string;
  imagemUrl: string;
  videoUrl: string;
};

type NomineeFieldsProps = {
  draft: NomineeDraft;
  index: number;
  total: number;
  type: CategoriaTipo;
  canRemove: boolean;
  onChange: (patch: Partial<NomineeDraft>) => void;
  onMove: (delta: -1 | 1) => void;
  onRemove: () => void;
};

export default function NomineeFields({
  draft,
  index,
  total,
  type,
  canRemove,
  onChange,
  onMove,
  onRemove,
}: NomineeFieldsProps) {
  const hintId = useId();
  const position = index + 1;
  const videoId = parseYouTubeId(draft.videoUrl);

  return (
    <li className="space-y-3 border border-foreground/20 p-3 md:p-4">
      <div className="flex items-center justify-between gap-3">
        <span aria-hidden="true" className="font-mono text-sm text-primary">
          {String(position).padStart(2, "0")}
        </span>
        <div className="flex gap-2">
          <AeroButton
            variant="blue"
            size="icon"
            aria-label={`Subir indicado ${position}`}
            disabled={index === 0}
            onClick={() => onMove(-1)}
          >
            <ArrowUp aria-hidden="true" width={20} height={20} />
          </AeroButton>
          <AeroButton
            variant="blue"
            size="icon"
            aria-label={`Descer indicado ${position}`}
            disabled={index === total - 1}
            onClick={() => onMove(1)}
          >
            <ArrowDown aria-hidden="true" width={20} height={20} />
          </AeroButton>
          <AeroButton
            variant="blue"
            size="icon"
            aria-label={`Remover indicado ${position}`}
            disabled={!canRemove}
            onClick={onRemove}
          >
            <Close aria-hidden="true" width={20} height={20} />
          </AeroButton>
        </div>
      </div>

      <label className="block">
        <span className={LABEL}>Nome</span>
        <input
          value={draft.nome}
          onChange={(e) => onChange({ nome: e.target.value })}
          className={`${INPUT} mt-1`}
        />
      </label>

      {type === "imagem" ? (
        <ImageField
          value={draft.imagemUrl}
          label={`indicado ${position}`}
          onChange={(imagemUrl) => onChange({ imagemUrl })}
        />
      ) : (
        <div>
          <label className="block">
            <span className={LABEL}>Link do YouTube</span>
            <input
              value={draft.videoUrl}
              onChange={(e) => onChange({ videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              aria-invalid={draft.videoUrl !== "" && !videoId}
              aria-describedby={hintId}
              className={`${INPUT} mt-1`}
            />
          </label>
          <div className="mt-2 flex items-center gap-3">
            {videoId && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={youtubeThumb(videoId)}
                alt=""
                className="aspect-video w-28 shrink-0 border border-foreground/30 object-cover"
              />
            )}
            <p id={hintId} className="text-sm text-foreground/70">
              {!draft.videoUrl
                ? "Cole o link do vídeo (watch, youtu.be, shorts...)."
                : videoId
                  ? `Vídeo reconhecido (${videoId}).`
                  : "Link inválido."}
            </p>
          </div>
        </div>
      )}
    </li>
  );
}