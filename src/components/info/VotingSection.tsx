import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { getVotingRules, getVotingSteps } from "@/lib/services/voting";
import VotingCta from "./VotingCta";

export default function VotingSection({ showCta = true }: { showCta?: boolean }) {
  return (
    <section id="voting" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          title="Como funciona a votação"
          description="Do login à confirmação, leva poucos minutos."
        />

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {getVotingSteps().map((step, index) => (
            // O número fica na barra; a ordem para o leitor de tela vem do <ol>
            <Card
              key={step.title}
              as="li"
              variant="window"
              title={`Passo ${String(index + 1).padStart(2, "0")}`}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-balance text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-foreground/80">{step.description}</p>
              </div>
            </Card>
          ))}
        </ol>

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
          <Card variant="window" title="Regras">
            <div className="p-6 md:p-8">
              <h3 className="sr-only">Regras</h3>
              <ul className="space-y-3">
                {getVotingRules().map((rule) => (
                  <li key={rule} className="flex gap-3 text-foreground/80">
                    <span aria-hidden="true" className="mt-2 size-2 shrink-0 bg-primary" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
          {showCta && <VotingCta />}
        </div>
      </div>
    </section>
  );
}
