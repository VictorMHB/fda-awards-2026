"use client";

import { useState } from "react";
import { Check } from "pixelarticons/react";
import type { Indicado } from "@/types/voto";

type NomineeCardProps = {
  nominee: Indicado;
  index: number;
  name: string; // nome do grupo de radios (id da categoria)
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
};

export default function NomineeCard({
  nominee,
  index,
  name,
  selected,
  disabled,
  onSelect,
}: NomineeCardProps) {
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(nominee.imagemUrl) && !broken;

  // <img> simples até decidirmos a origem das imagens (remotePatterns ou Storage)
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={nominee.imagemUrl}
      alt=""
      width={600}
      height={750}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
      className="size-full object-cover"
    />
  );

  return (
    <label
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
      <span className="nominee__media">
        {showImage ? (
          image
        ) : (
          <span aria-hidden="true" className="nominee__fallback">
            {nominee.nome.charAt(0)}
          </span>
        )}
        <span aria-hidden="true" className="nominee__check">
          <Check width={20} height={20} />
        </span>
      </span>

      <span className="nominee__name">{nominee.nome}</span>
      <span aria-hidden="true" className="nominee__line" />
    </label>
  );
}