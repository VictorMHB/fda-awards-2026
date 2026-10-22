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

export type PhaseId =
  | "aguardando" // antes da abertura
  | "votacao" // votação aberta
  | "aguardandoShow" // votação encerrada, show ainda não começou
  | "aoVivo" // show acontecendo
  | "encerrado"; // pós-show

const ts = (iso: string) => new Date(iso).getTime();

export function getPhase(agora: number): PhaseId {
  if (agora < ts(DATAS.votacaoAbre)) return "aguardando";
  if (agora < ts(DATAS.votacaoFecha)) return "votacao";
  if (agora < ts(DATAS.showInicio)) return "aguardandoShow";
  if (agora < ts(DATAS.showFim)) return "aoVivo";
  return "encerrado";
}

// Momento em que a fase atual termina (null = sem contagem)
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