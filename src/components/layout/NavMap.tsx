"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAgora } from "@/hooks/useAgora";
import { getPhase } from "@/lib/content/phases";
import { Trophy, Sparkle, Briefcase, InfoBox } from "pixelarticons/react";
import Card from "@/components/ui/Card";

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
        <Card
          key={item.id}
          as={Link}
          href={item.href}
          variant="feature"
          interactive
          className={`min-h-[13rem] p-5 md:min-h-[15rem] md:p-7 ${
            item.destaque ? "border-primary/60" : ""
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="btn-aero flex h-12 w-12 items-center justify-center text-dark-bg md:h-14 md:w-14">
              {item.icone}
            </span>
            {item.tag && (
              <span className="bg-primary px-2.5 py-1 text-xs uppercase tracking-wider text-dark-bg font-pixel">
                {item.tag}
              </span>
            )}
          </div>

          <h3 className="font-display text-xl uppercase leading-snug text-foreground md:text-2xl">
            {item.titulo}
          </h3>
          <p className="flex-1 text-sm text-foreground/70 md:text-base">
            {item.descricao}
          </p>

          <span className="mt-1 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-primary">
            {item.cta} →
          </span>
        </Card>
      ))}
    </div>
  );
}