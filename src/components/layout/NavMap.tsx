"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAgora } from "@/hooks/useAgora";
import { getPhase } from "@/lib/phases";
import { Trophy, Sparkle, Briefcase, InfoBox } from "pixelarticons/react";

type Item = {
  id: string;
  titulo: string;
  descricao: string;
  cta: string;
  href: string;
  icone: ReactNode;
  tag?: string;
  destaque?: boolean;
};

export default function NavMapa() {
  const agora = useAgora();
  const fase = agora === 0 ? null : getPhase(agora);
  const votacaoAberta = fase === "votacao";

  const itens: Item[] = [
    {
      id: "votacao",
      titulo: "Votação",
      descricao: "Participe da votação e escolha os vencedores de cada categoria.",
      // Antes da votação, o card leva pra Informações em vez de uma página vazia
      cta: votacaoAberta ? "Votar agora" : "Saiba mais",
      href: votacaoAberta ? "/votacao" : "/informacoes",
      tag: votacaoAberta ? "Aberta" : "EM BREVE",
      destaque: votacaoAberta,
      icone: <Trophy width={32} height={32} className="pixel-icon" />,
    },
    {
      id: "categorias",
      titulo: "Categorias",
      descricao: "Explore todas as categorias e veja os indicados ao FDA AWARDS.",
      cta: "Explorar",
      href: "/categorias",
      icone: <Sparkle width={32} height={32} className="pixel-icon" />,
    },
    {
      id: "patrocinadores",
      titulo: "Patrocinadores",
      descricao: "Conheça as empresas que tornam o FDA AWARDS possível todos os anos.",
      cta: "Conhecer",
      href: "/patrocinadores",
      icone: <Briefcase width={32} height={32} className="pixel-icon" />,
    },
    {
      id: "informacoes",
      titulo: "Informações",
      descricao: "Saiba tudo sobre o evento, local, horários e como participar.",
      cta: "Saber mais",
      href: "/informacoes",
      icone: <InfoBox width={32} height={32} className="pixel-icon" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
      {itens.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`glass group relative flex min-h-[13rem] flex-col gap-3 overflow-hidden p-5 md:min-h-[15rem] md:p-7 ${
  item.destaque ? "ring-1 ring-primary/60" : ""
}`}
        >
          {/* Brilho de vidro na metade de cima */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/10 to-transparent"
          />

          <div className="relative flex items-start justify-between">
            <span className="btn-aero flex h-12 w-12 items-center justify-center text-dark-bg md:h-14 md:w-14">
              {item.icone}
            </span>
            {item.tag && (
              <span className="bg-primary px-2.5 py-1 text-xs uppercase tracking-wider text-dark-bg font-pixel">
                {item.tag}
              </span>
            )}
          </div>

          <h3 className="relative font-display text-xl uppercase leading-snug text-foreground md:text-2xl">
            {item.titulo}
          </h3>
          <p className="relative flex-1 text-sm text-foreground/70 md:text-base">
            {item.descricao}
          </p>

          <span className="relative mt-1 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-primary transition-transform duration-300 group-hover:translate-x-1">
            {item.cta} →
          </span>

          <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
        </Link>
      ))}
    </div>
  );
}

const iconProps = {
  width: "1.6em",
  height: "1.6em",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function TrophyIcon() {
  return (
    <svg {...iconProps}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg {...iconProps}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}