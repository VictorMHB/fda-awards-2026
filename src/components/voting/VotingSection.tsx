import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { getVotingRules, getVotingSteps } from "@/lib/services/voting";

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
            // O número fica na barra; a ordem para o leitor de tela vem do <ol>.
            // Cada filho (barra, título, descrição) é uma linha do subgrid da lista:
            // as descrições começam na mesma altura nos 4 cards.
            <Card
              key={step.title}
              as="li"
              variant="window"
              title={`Passo ${String(index + 1).padStart(2, "0")}`}
              className="card--flat row-span-3 grid grid-rows-subgrid gap-y-0"
            >
              <h3 className="flex items-center bg-white/12 px-6 pb-4 pt-5 text-lg font-bold text-balance text-foreground">
                {step.title}
              </h3>
              <p className="border-t border-foreground/25 px-6 pb-6 pt-4 text-sm text-foreground/80">
                {step.description}
              </p>
            </Card>
          ))}
        </ol>

        {/* Corpo numa cor só: o corte do vidro não cruza a lista */}
        <Card variant="window" title="Regras" className="card--flat mt-6 lg:mt-8">
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
      </div>
    </section>
  );
}