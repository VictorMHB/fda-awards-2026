"use client";

import Link from "next/link";
import { useAgora } from "@/hooks/useAgora";
import { ANUNCIO_PREVISTO, targetPhase, formatarData, getPhase } from "@/lib/content/phases";

export default function AlertBanner() {
  const agora = useAgora();
  if (agora === 0) return null;

  const fase = getPhase(agora);
  if (fase !== "aguardando" && fase !== "votacao") return null;

  const alvo = targetPhase(fase);

  return (
    <div className="notice-bar relative -mt-4">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-3.5 text-center text-sm font-extrabold uppercase tracking-wider text-dark-bg md:py-4 md:text-lg">
        {fase === "aguardando" ? (
          <span className="notice-text">
            Os indicados serão anunciados {ANUNCIO_PREVISTO}
          </span>
        ) : (
          <>
            <span className="notice-text">Votação aberta</span>
            {alvo && (
              <span className="notice-text">Encerra em {formatarData(alvo)}</span>
            )}
            <Link href="/votacao" className="notice-btn">
              Votar agora →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}