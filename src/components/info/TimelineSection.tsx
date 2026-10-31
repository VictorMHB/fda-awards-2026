"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import { useAgora } from "@/hooks/useAgora";
import { getPhase } from "@/lib/content/shared/phases";
import { CURRENT_STEP_LABEL, getStepStatus, getTimeline } from "@/lib/content/info/timeline";

export default function TimelineSection() {
  const agora = useAgora();
  // Antes de montar no navegador não há fase: nenhuma etapa fica destacada
  const phase = agora === 0 ? null : getPhase(agora);

  return (
    <section id="timeline" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          title="Linha do tempo"
          description="As etapas da premiação, do anúncio dos indicados à cerimônia."
        />

        <ol className="timeline">
          {getTimeline().map((step) => {
            const status = phase ? getStepStatus(step.phase, phase) : "upcoming";
            const isCurrent = status === "current";
            return (
              <li
                key={step.title}
                aria-current={isCurrent ? "step" : undefined}
                className={`timeline-step timeline-step--${status}`}
              >
                <span aria-hidden="true" className="timeline-marker" />
                <div className="timeline-content">
                  <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    {step.date}
                    {isCurrent && (
                      <span className="tag">
                        {CURRENT_STEP_LABEL}
                      </span>
                    )}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm text-foreground/70">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
