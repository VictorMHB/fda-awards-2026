
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";

type ResultsSummaryProps = {
  confirmadas: number;
  rascunhos: number;
  categorias: number;
};

export default function ResultsSummary({
  confirmadas,
  rascunhos,
  categorias,
}: ResultsSummaryProps) {
  const stats = [
    {
      id: "confirmed",
      label: "Cédulas confirmadas",
      value: confirmadas,
      description: "Votos válidos contabilizados",
      number: "01",
    },
    {
      id: "drafts",
      label: "Contas com rascunho",
      value: rascunhos,
      description: "Rascunhos registrados",
      number: "02",
    },
    {
      id: "categories",
      label: "Categorias",
      value: categorias,
      description: "Categorias cadastradas",
      number: "03",
    },
  ];

  return (
    <section className="mt-10">
      <div className="mb-5">
        <SectionHeader title="Resumo" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.id}
            variant="stat"
            className="h-full overflow-hidden"
          >
            <div className="w-full p-4 text-left md:p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                  {stat.label}
                </p>

                <span className="font-mono text-[0.65rem] tracking-widest text-foreground/40">
                  {stat.number}
                </span>
              </div>

              <p className="mt-3 font-display text-4xl leading-none tabular-nums md:text-5xl">
                {stat.value}
              </p>

              <p className="mt-2 text-xs text-foreground/60">
                {stat.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
