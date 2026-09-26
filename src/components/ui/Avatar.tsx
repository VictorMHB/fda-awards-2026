"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "./cn";
import { iniciaisDe } from "./iniciais";

type AvatarProps = {
  nome: string;
  fotoUrl?: string | null;
  forma?: "circulo" | "quadrado";
  className?: string;
};

export default function Avatar({ nome, fotoUrl, forma = "circulo", className }: AvatarProps) {
  const [urlComFalha, setUrlComFalha] = useState<string | null>(null);
  const mostrarFoto = Boolean(fotoUrl) && fotoUrl !== urlComFalha;

  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden bg-linear-to-br from-background to-secondary/70 font-title font-bold text-foreground",
        forma === "circulo" ? "rounded-full" : "rounded-xl",
        className
      )}
    >
      {mostrarFoto && fotoUrl ? (
        <Image
          src={fotoUrl}
          alt=""
          fill
          unoptimized
          referrerPolicy="no-referrer"
          onError={() => setUrlComFalha(fotoUrl)}
          className="object-cover"
        />
      ) : (
        <span aria-hidden="true">{iniciaisDe(nome)}</span>
      )}
    </span>
  );
}
