"use client";

import AeroButton from "@/components/ui/AeroButton";
import { AeroText } from "@/components/ui/AeroText";
import Card from "@/components/ui/Card";
import { useAgora } from "@/hooks/useAgora";
import { DATAS, LINK_TRANSMISSAO, PROXIMA_EDICAO, formatarData, getPhase } from "@/lib/content/shared/phases";

const ALVO_SHOW = new Date(DATAS.showInicio).getTime();

const TITLE = "block py-0 text-2xl leading-[1.35] text-balance md:text-4xl";
const EYEBROW = "text-sm font-bold uppercase tracking-widest text-primary md:text-base";

const pad = (n: number) => String(n).padStart(2, "0");
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function partes(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    min: Math.floor((total % 3600) / 60),
    seg: total % 60,
  };
}

// Cada dígito numa caixa de largura fixa: o número não "treme" a cada segundo
function Digits({ value }: { value: string }) {
  return (
    <span className="inline-flex justify-center">
      {[...value].map((digit, i) => (
        <span key={value.length - i} className="inline-block w-[1ch] text-center">
          {digit}
        </span>
      ))}
    </span>
  );
}

export default function Countdown() {
  const agora = useAgora();

  // Antes de montar no navegador: reserva o espaço, sem piscar valores errados
  if (agora === 0) return <div className="h-104 md:h-80" aria-hidden="true" />;

  const phase = getPhase(agora);

  // Show ao vivo
  if (phase === "aoVivo") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className={`${EYEBROW} flex items-center gap-3`}>
          <span aria-hidden="true" className="relative flex size-3">
            <span className="absolute inline-flex size-full bg-primary opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex size-3 bg-primary" />
          </span>
          Ao vivo
        </p>
        <h2>
          <AeroText className={TITLE}>O FDA Awards está acontecendo agora</AeroText>
        </h2>
        {LINK_TRANSMISSAO && (
          <AeroButton
            href={LINK_TRANSMISSAO}
            target="_blank"
            rel="noopener noreferrer"
            shine
            className="mt-2"
          >
            Assistir agora
            <span className="sr-only"> (abre em nova aba)</span>
          </AeroButton>
        )}
      </div>
    );
  }

  // Pós-show
  if (phase === "encerrado") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className={EYEBROW}>Fim de festa</p>
        <h2>
          <AeroText className={TITLE}>{`Acabou! Até ${PROXIMA_EDICAO}`}</AeroText>
        </h2>
      </div>
    );
  }

  // Contagem até o show (qualquer fase antes dele)
  const r = partes(ALVO_SHOW - agora);
  const blocos = [
    ["Dias", r.dias],
    ["Horas", r.horas],
    ["Min", r.min],
    ["Seg", r.seg],
  ] as const;

  const resumo = `Faltam ${plural(r.dias, "dia", "dias")}, ${plural(r.horas, "hora", "horas")} e ${plural(r.min, "minuto", "minutos")} para o show.`;

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className={EYEBROW}>Contagem para o show</p>

      <h2>
        <AeroText className={TITLE}>O FDA Awards começa em</AeroText>
      </h2>

      {/* Os números mudam a cada segundo e ficam fora do leitor de tela.
          Ele lê este resumo, que só muda a cada minuto */}
      <p className="sr-only">{resumo}</p>

      <div
        aria-hidden="true"
        className="mt-2 grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-5"
      >
        {blocos.map(([label, valor]) => {
          const texto = pad(valor);
          // O número encolhe se tiver mais dígitos (mais de 99 dias)
          const tamanho = texto.length > 2 ? "text-3xl md:text-5xl" : "text-4xl md:text-6xl";
          return (
            <Card key={label} variant="window" title={label}>
              <div className={`py-5 font-display text-primary md:py-7 ${tamanho}`}>
                <Digits value={texto} />
              </div>
            </Card>
          );
        })}
      </div>

      <p className="text-sm text-foreground/70">{formatarData(ALVO_SHOW)}</p>
    </div>
  );
}