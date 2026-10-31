"use client";

import { useId, useState } from "react";
import { Check, Play } from "pixelarticons/react";
import { youtubeThumb } from "@/lib/voting/categories";
import type { Indicado } from "@/types/voto";

type NomineeCardProps = {
  nominee: Indicado;
  index: number;
  name: string; // nome do grupo de radios (id da categoria)
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
  onWatch?: () => void; // só em categorias de vídeo
};

export default function NomineeCard({
  nominee,
  index,
  name,
  selected,
  disabled,
  onSelect,
  onWatch,
}: NomineeCardProps) {
  const nameId = useId();
  const [broken, setBroken] = useState(false);

  const isVideo = Boolean(nominee.videoId);
  const src = nominee.videoId ? youtubeThumb(nominee.videoId) : nominee.imagemUrl;
  const showImage = Boolean(src) && !broken;

  return (
    <div
      className={[
        "nominee",
        selected && "nominee--selected",
        disabled && "nominee--locked",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        type="radio"
        name={name}
        value={nominee.id}
        checked={selected}
        disabled={disabled}
        onChange={onSelect}
        aria-labelledby={nameId}
        className="nominee__input"
      />

      <span aria-hidden="true" className="nominee__bar">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span className="nominee__dots">
          <i />
          <i />
          <i />
        </span>
      </span>

      {/* A imagem é decorativa: o nome em texto já identifica o indicado */}
      <span className={`nominee__media ${isVideo ? "nominee__media--video" : ""}`}>
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            width={isVideo ? 480 : 600}
            height={isVideo ? 360 : 750}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            className="size-full object-cover"
          />
        ) : (
          <span aria-hidden="true" className="nominee__fallback">
            {nominee.nome.charAt(0)}
          </span>
        )}

        <span aria-hidden="true" className="nominee__check">
          <Check width={20} height={20} />
        </span>

        {onWatch && (
          <button
            type="button"
            className="nominee__play"
            aria-label={`Assistir ao vídeo: ${nominee.nome}`}
            onClick={onWatch}
          >
            <Play aria-hidden="true" width={24} height={24} />
          </button>
        )}
      </span>

      <span id={nameId} className="nominee__name">
        {nominee.nome}
      </span>
      <span aria-hidden="true" className="nominee__line" />
    </div>
  );
}