import type { PhaseId } from "@/lib/content/phases";
import data from "@/data/info/timeline.json";

export type TimelineStep = {
  phase: PhaseId; // fase de lib/phases em que a etapa é a atual
  date: string;
  title: string;
  description: string;
};

export type StepStatus = "past" | "current" | "upcoming";

export const CURRENT_STEP_LABEL = "Agora";

// Só a sequência das fases; as datas continuam em lib/phases
const PHASE_ORDER: PhaseId[] = ["aguardando", "votacao", "aguardandoShow", "aoVivo", "encerrado"];

const steps = data as TimelineStep[];

// Uma fase digitada errada no JSON deixaria a etapa sem destaque em silêncio
for (const step of steps) {
  if (!PHASE_ORDER.includes(step.phase)) {
    console.warn(`[timeline] "${step.title}" tem fase desconhecida: "${step.phase}"`);
  }
}

export function getTimeline() {
  return steps;
}

export function getStepStatus(stepPhase: PhaseId, currentPhase: PhaseId): StepStatus {
  const distance = PHASE_ORDER.indexOf(stepPhase) - PHASE_ORDER.indexOf(currentPhase);
  if (distance < 0) return "past";
  return distance === 0 ? "current" : "upcoming";
}
