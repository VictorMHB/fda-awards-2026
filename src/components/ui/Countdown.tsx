"use client";

import { useAgora } from "@/hooks/useAgora";
import { DATAS, LINK_TRANSMISSAO, PROXIMA_EDICAO, formatarData, getPhase } from "@/lib/phases";

const ALVO_SHOW = new Date(DATAS.showInicio).getTime();

const pad = (n: number) => String(n).padStart(2, "0");

function partes(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    min: Math.floor((total % 3600) / 60),
    seg: total % 60,
  };
}

export default function Countdown() {
  const agora = useAgora();

  // Antes de montar no navegador: reserva o espaço, sem piscar valores errados
  if (agora === 0) return <div className="h-56" aria-hidden="true" />;

  const phase = getPhase(agora);
  const contando = phase !== "aoVivo" && phase !== "encerrado";

  // Show ao vivo
  if (phase === "aoVivo") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-primary md:text-base">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
          </span>
          Ao vivo
        </div>
        <p className="font-display max-w-2xl text-lg text-foreground md:text-3xl">
          O FDA Awards está acontecendo agora
        </p>
        {LINK_TRANSMISSAO && (
          <a
            href={LINK_TRANSMISSAO}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-aero mt-2 px-8 py-3 text-lg font-bold uppercase tracking-wider text-dark-bg"
          >
            Assistir agora
          </a>
        )}
      </div>
    );
  }

  // Pós-show
  if (!contando) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-sm font-bold uppercase tracking-widest text-primary md:text-base">
          Fim de festa
        </div>
        <p className="font-display max-w-2xl text-lg text-foreground md:text-3xl">
          Acabou! Até {PROXIMA_EDICAO}
        </p>
      </div>
    );
  }

  // Contagem até o show (sempre presente antes dele)
  const r = partes(ALVO_SHOW - agora);
  const blocos = [
    ["Dias", r.dias],
    ["Horas", r.horas],
    ["Min", r.min],
    ["Seg", r.seg],
  ] as const;

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="text-sm font-bold uppercase tracking-widest text-primary md:text-base">
        Contagem para o show
      </div>

      <p className="font-display max-w-2xl text-lg text-foreground md:text-3xl">
        O FDA Awards começa em
      </p>

      <div className="flex gap-2 sm:gap-3 md:gap-5">
        {blocos.map(([label, valor]) => {
          const texto = pad(valor);
          // Caixa de tamanho fixo; o número encolhe se tiver mais dígitos
          const tamanho = texto.length > 2 ? "text-2xl md:text-5xl" : "text-3xl md:text-6xl";
          return (
            <div
              key={label}
              className="glass relative flex h-24 w-16 flex-col items-center justify-center sm:w-20 md:h-36 md:w-36"
            >
              <span className={`font-display block tabular-nums text-primary ${tamanho}`}>
                {texto}
              </span>
              <span className="mt-1 block text-xs font-bold uppercase tracking-wider text-foreground/70 md:text-sm">
                {label}
              </span>
              <span className="absolute inset-x-0 bottom-0 h-0.75 bg-primary" />
            </div>
          );
        })}
      </div>

      <p className="text-sm text-foreground/60">{formatarData(ALVO_SHOW)}</p>
    </div>
  );
}