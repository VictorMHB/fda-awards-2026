// Todas as datas em horário de Brasília (UTC-3).
export const DATAS = {
  votacaoAbre: "2026-11-27T00:00:00-03:00",
  votacaoFecha: "2026-12-05T23:59:59-03:00",
  showInicio: "2026-12-12T20:00:00-03:00",
  showFim: "2026-12-12T23:30:00-03:00",
} as const;

export const ANUNCIO_PREVISTO = "no final de novembro";
export const LINK_TRANSMISSAO: string | null = null;
export const PROXIMA_EDICAO = 2027;

const PHASE_IDS = [
  "aguardando", // antes da abertura
  "votacao", // votação aberta
  "aguardandoShow", // votação encerrada, show ainda não começou
  "aoVivo", // show acontecendo
  "encerrado", // pós-show
] as const;

export type PhaseId = (typeof PHASE_IDS)[number];

const ts = (iso: string) => new Date(iso).getTime();

export function getForcedPhase(): PhaseId | null {
  if (process.env.NODE_ENV === "production") return null;

  const value = process.env.NEXT_PUBLIC_FORCE_PHASE;
  if (!value) return null;

  const phase = PHASE_IDS.find((id) => id === value);
  if (!phase) {
    console.warn(
      `NEXT_PUBLIC_FORCE_PHASE="${value}" é inválida. Use: ${PHASE_IDS.join(", ")}.`,
    );
    return null;
  }
  return phase;
}

export function getPhase(agora: number): PhaseId {
  const forced = getForcedPhase();
  if (forced) return forced;

  if (agora < ts(DATAS.votacaoAbre)) return "aguardando";
  if (agora < ts(DATAS.votacaoFecha)) return "votacao";
  if (agora < ts(DATAS.showInicio)) return "aguardandoShow";
  if (agora < ts(DATAS.showFim)) return "aoVivo";
  return "encerrado";
}

// Momento em que a fase atual termina (null = sem contagem).
// Com fase forçada, a contagem continua usando as datas reais.
export function targetPhase(phase: PhaseId): number | null {
  switch (phase) {
    case "aguardando": return ts(DATAS.votacaoAbre);
    case "votacao": return ts(DATAS.votacaoFecha);
    case "aguardandoShow": return ts(DATAS.showInicio);
    default: return null;
  }
}

export function formatarData(ms: number) {
  return new Date(ms).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}