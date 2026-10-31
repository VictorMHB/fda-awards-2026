"use client";

import AeroButton from "@/components/ui/AeroButton";
import { useAgora } from "@/hooks/useAgora";
import { ANUNCIO_PREVISTO, targetPhase, formatarData, getPhase } from "@/lib/content/shared/phases";

export default function AlertBanner() {
  const agora = useAgora();
  if (agora === 0) return null;

  const fase = getPhase(agora);
  if (fase !== "aguardando" && fase !== "votacao") return null;

  const alvo = targetPhase(fase);

  return (
    <div className="notice-bar relative -mt-4">
      <div className="notice-bar__inner">
        <span className="notice-bar__tag">
          {fase === "aguardando" ? "Em breve" : "Votação aberta"}
        </span>

        {fase === "aguardando" ? (
          <p className="notice-bar__text">
            Os indicados serão anunciados {ANUNCIO_PREVISTO}
          </p>
        ) : (
          <>
            {alvo && (
              <p className="notice-bar__text">Encerra em {formatarData(alvo)}</p>
            )}
            <AeroButton href="/votacao" size="sm" shine>
              Votar agora <span aria-hidden="true">→</span>
            </AeroButton>
          </>
        )}
      </div>
    </div>
  );
}