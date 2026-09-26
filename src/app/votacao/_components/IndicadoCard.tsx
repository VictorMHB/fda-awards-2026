"use client";

import Image from "next/image";
import { useState } from "react";
import { Indicado } from "@/types/voto";
import { cn } from "@/components/ui/cn";
import { iniciaisDe } from "@/components/ui/iniciais";
import { IconeCheck } from "@/components/ui/icons";

type IndicadoCardProps = {
  indicado: Indicado;
  grupo: string;
  selecionado: boolean;
  esmaecido: boolean;
  onEscolher: () => void;
};

export default function IndicadoCard({ indicado, grupo, selecionado, esmaecido, onEscolher }: IndicadoCardProps) {
  const [urlComFalha, setUrlComFalha] = useState<string | null>(null);
  const mostrarFoto = Boolean(indicado.imagemUrl) && indicado.imagemUrl !== urlComFalha;

  return (
    <label
      className={cn(
        "group relative block cursor-pointer transition duration-300",
        esmaecido && "opacity-60 saturate-50 hover:opacity-100 hover:saturate-100"
      )}
    >
      <input
        type="radio"
        name={grupo}
        value={indicado.id}
        checked={selecionado}
        onChange={onEscolher}
        className="peer sr-only"
      />
      <div
        className={cn(
          "glass relative aspect-[4/5] overflow-hidden rounded-3xl transition duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-primary",
          selecionado
            ? "-translate-y-1 ring-2 ring-primary shadow-[0_22px_48px_-16px_rgba(250,192,147,0.6)]"
            : "group-hover:-translate-y-1 group-hover:border-white/35"
        )}
      >
        {mostrarFoto ? (
          <Image
            src={indicado.imagemUrl}
            alt=""
            fill
            unoptimized
            loading="eager"
            onError={() => setUrlComFalha(indicado.imagemUrl)}
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center bg-linear-to-br from-background via-dark-bg to-secondary/50"
          >
            <span className="font-title text-5xl font-bold text-foreground/80 sm:text-6xl">
              {iniciaisDe(indicado.nome)}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-dark-bg via-dark-bg/75 to-transparent px-3 pb-3 pt-14 sm:px-4 sm:pb-4 sm:pt-16">
          <p className="text-balance font-title text-base font-bold leading-tight sm:text-lg">{indicado.nome}</p>
        </div>

        <span
          aria-hidden="true"
          className={cn(
            "absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-primary text-dark-bg shadow-lg transition duration-300",
            selecionado ? "scale-100 opacity-100" : "scale-50 opacity-0"
          )}
        >
          <IconeCheck className="size-5" />
        </span>
      </div>
    </label>
  );
}
