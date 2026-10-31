"use client";

import { useState } from "react";

type ImageFieldProps = {
  value: string;
  label: string;
  onChange: (url: string) => void;
};

export default function ImageField({ value, label, onChange }: ImageFieldProps) {
  // Guarda qual endereço falhou: ao trocar o texto, a prévia tenta de novo
  const [failed, setFailed] = useState<string | null>(null);
  const showPreview = value !== "" && failed !== value;

  return (
    <div className="flex items-start gap-3">
      <div className="aspect-[4/5] w-16 shrink-0 overflow-hidden border border-foreground/30 bg-dark-bg">
        {showPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            onError={() => setFailed(value)}
            className="size-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-full place-items-center font-mono text-[0.625rem] text-foreground/50"
          >
            {value ? "erro" : "4:5"}
          </span>
        )}
      </div>

      <label className="block min-w-0 flex-1">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/70">
          Imagem do {label}
        </span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... ou /images/indicados/nome.webp"
          className="mt-1 min-h-11 w-full border border-secondary bg-dark-bg px-3 py-2 text-foreground placeholder:text-foreground/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
        <span className="mt-1 block text-xs text-foreground/60">
          Opcional. Proporção 4:5 (600x750).
        </span>
      </label>
    </div>
  );
}