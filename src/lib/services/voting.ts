import type { PhaseId } from "@/lib/content/shared/phases";
import data from "@/data/voting/voting.json";

export type VotingState = "upcoming" | "login" | "ready" | "closed";

export type VotingStep = {
  title: string;
  description: string;
};

type VotingStateContent = {
  label: string;
  title: string;
  description: string;
  action?: string;
};

type VotingInfo = {
  hero: {
    eyebrow: string;
    titleTop: string;
    titleHighlight: string;
    subtitle: string;
  };
  states: Record<VotingState, VotingStateContent>;
  notices: { login: string };
  categories: { title: string; description: string; empty: string };
  steps: VotingStep[];
  rules: string[];
};

const voting = data satisfies VotingInfo;

export function getVotingSteps() {
  return voting.steps;
}

export function getVotingRules() {
  return voting.rules;
}

export function getVotingState(phase: PhaseId, loggedIn: boolean): VotingState {
  if (phase === "aguardando") return "upcoming";
  if (phase === "votacao") return loggedIn ? "ready" : "login";
  return "closed";
}

export function getVotingStateContent(
  state: VotingState,
  firstName?: string,
): VotingStateContent {
  const content = voting.states[state];
  return {
    ...content,
    description: content.description.replace("{name}", firstName ? `, ${firstName}` : ""),
  };
}

export function getVotingHero() {
  return voting.hero;
}

export function getVotingNotice(reason?: string) {
  return reason === "login" ? voting.notices.login : null;
}

export function getVotingCategoriesContent() {
  return voting.categories;
}