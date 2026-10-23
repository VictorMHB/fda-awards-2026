import { DATAS, formatarData, type PhaseId } from "@/lib/content/phases";
import data from "@/data/voting.json";


export type VotingState = "upcoming" | "login" | "ready" | "closed";

export type VotingStep = {
  title: string;
  description: string;
};

type VotingInfo = {
  hero: { title: string; subtitle: string };
  states: Record<VotingState, VotingStateContent>;
  notices: { login: string };
  steps: VotingStep[];
  rules: string[];
  cta: { upcoming: string; open: string; closed: string };
};

type VotingStateContent = {
  label: string;
  title: string;
  description: string;
  action?: string;
};

const voting = data as VotingInfo;

export function getVotingSteps() {
  return voting.steps;
}

export function getVotingRules() {
  return voting.rules;
}

// Texto do botão para /votacao (null = ainda sem fase, antes de montar no navegador)
export function getVotingCtaLabel(phase: PhaseId | null) {
  if (phase === "votacao") return voting.cta.open;
  if (phase === null || phase === "aguardando") return voting.cta.upcoming;
  return voting.cta.closed;
}

export function getVotingState(phase: PhaseId, loggedIn: boolean): VotingState {
  if (phase === "aguardando") return "upcoming";
  if (phase === "votacao") return loggedIn ? "ready" : "login";
  return "closed";
}

export function getVotingStateContent(state: VotingState, firstName?: string) {
  const content = voting.states[state];
  const opensAt = formatarData(new Date(DATAS.votacaoAbre).getTime());
  return {
    ...content,
    description: content.description
      .replace("{date}", opensAt)
      .replace("{name}", firstName ? `, ${firstName}` : ""),
  };
}

export function getVotingHero() {
  return voting.hero;
}

export function getVotingNotice(reason?: string) {
  return reason === "login" ? voting.notices.login : null;
}