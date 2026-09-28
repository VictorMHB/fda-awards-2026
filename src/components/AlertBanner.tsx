"use client";

import Link from "next/link";
import { useAgora } from "@/hooks/useAgora";
import { ANUNCIO_PREVISTO, targetPhase, formatarData, getPhase } from "@/lib/phases";

export default function AvisoFaixa() {
  const agora = useAgora();
  if (agora === 0) return null;

  const fase = getPhase(agora);
  if (fase !== "aguardando" && fase !== "votacao") return null;

  const alvo = targetPhase(fase);

  return (
    <div className="faixa-aviso relative z-10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2.5 text-center text-sm font-bold uppercase tracking-wider text-dark-bg md:text-base">
        <span className="bg-dark-bg px-2.5 py-0.5 text-xs text-primary md:text-sm">
          {fase === "aguardando" ? "Em breve" : "Votação aberta"}
        </span>

        {fase === "aguardando" ? (
          <span>
            Os indicados serão anunciados {ANUNCIO_PREVISTO}
          </span>
        ) : (
          <>
            {alvo && <span>Encerra em {formatarData(alvo)}</span>}
            <Link
              href="/votacao"
              className="underline decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
            >
              Votar agora →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}