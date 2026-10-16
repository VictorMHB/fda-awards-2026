import SectionHeader from "@/components/ui/SectionHeader";
import { getVotingRules, getVotingSteps } from "@/lib/voting";
import VotingCta from "./VotingCta";

export default function VotingSection() {
  return (
    <section id="voting" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          title="Como funciona a votação"
          description="Do login à confirmação, leva poucos minutos."
        />

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {getVotingSteps().map((step, index) => (
            <li key={step.title} className="glass info-card p-6">
              <span aria-hidden="true" className="font-display text-4xl text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
          <div className="glass info-card p-6 md:p-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Regras</h3>
            <ul className="mt-4 space-y-3">
              {getVotingRules().map((rule) => (
                <li key={rule} className="flex gap-3 text-foreground/80">
                  <span aria-hidden="true" className="mt-2 size-2 shrink-0 bg-primary" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
          <VotingCta />
        </div>
      </div>
    </section>
  );
}
