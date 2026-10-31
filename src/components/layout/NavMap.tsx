"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAgora } from "@/hooks/useAgora";
import { getPhase, type PhaseId } from "@/lib/content/shared/phases";
import { Trophy, Sparkle, Briefcase, InfoBox } from "pixelarticons/react";
import Card from "@/components/ui/Card";

type ItemTag = { label: string; muted?: boolean };

type Item = {
  id: string;
  titulo: string;
  descricao: string;
  cta: string;
  href: string;
  icone: ReactNode;
  tag?: ItemTag;
  destaque?: boolean;
};

// Só a votação aberta chama atenção; antes e depois fica discreta.
// Sem fase (relógio ainda não carregou) fica sem etiqueta, em vez de piscar uma errada.
function votacaoTag(fase: PhaseId | null): ItemTag | undefined {
  if (fase === null) return undefined;
  if (fase === "votacao") return { label: "Aberta" };
  if (fase === "aguardando") return { label: "Em breve", muted: true };
  return { label: "Encerrada", muted: true };
}

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
      tag: votacaoTag(fase),
      destaque: votacaoAberta,
      icone: <Trophy width={32} height={32} className="pixel-icon" />,
    },
    {
      id: "categorias",
      titulo: "Categorias",
      descricao: "Explore todas as categorias e veja os indicados ao FDA AWARDS.",
      cta: "Explorar",
      href: "/votacao#categories",
      icone: <Sparkle width={32} height={32} className="pixel-icon" />,
    },
    {
      id: "patrocinadores",
      titulo: "Patrocinadores",
      descricao: "Conheça as empresas que tornam o FDA AWARDS possível todos os anos.",
      cta: "Conhecer",
      href: "/sobre#sponsors",
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
      {itens.map((item, i) => (
        <Card
          key={item.id}
          as={Link}
          href={item.href}
          variant="window"
          title={`No.${String(i + 1).padStart(2, "0")}`}
          interactive
          className={`flex min-h-48 flex-col md:min-h-56 ${
            item.destaque ? "border-primary/60" : ""
          }`}
        >
          {/* Brilho diagonal do hover (opt-in) */}
          <span aria-hidden="true" className="card__shine" />

          <div className="flex flex-1 flex-col gap-4 p-5 md:p-7">
            <div className="flex items-center gap-4">
              <span className="btn-aero flex h-12 w-12 shrink-0 items-center justify-center text-dark-bg md:h-14 md:w-14">
                {item.icone}
              </span>
              <h3 className="min-w-0 font-display text-xl uppercase leading-snug text-foreground md:text-2xl">
                {item.titulo}
              </h3>
              {item.tag && (
                <span
                  className={`tag ml-auto shrink-0 ${item.tag.muted ? "tag--muted" : ""}`}
                >
                  {item.tag.label}
                </span>
              )}
            </div>

            <p className="flex-1 text-sm text-foreground/70 md:text-base">
              {item.descricao}
            </p>

            <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-primary">
              {item.cta}
              <span aria-hidden="true" className="card__arrow">→</span>
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}