import type { PhaseId } from "@/lib/content/phases";
import data from "@/data/voting.json";

export type VotingStep = {
  title: string;
  description: string;
};

type VotingInfo = {
  steps: VotingStep[];
  rules: string[];
  cta: { upcoming: string; open: string; closed: string };
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
