import Card from "@/components/ui/Card";

type RecordCardProps = {
  bar: string;
  label: string;
  value: string;
  detail: string;
};

// Cada filho do Card (barra, rótulo, corpo) vira uma linha do subgrid da lista,
// então o número começa na mesma altura em todos os cards da fileira.
export default function RecordCard({ bar, label, value, detail }: RecordCardProps) {
  return (
    <Card
      as="li"
      variant="window"
      title={bar}
      className="card--flat row-span-3 grid grid-rows-subgrid gap-y-0 text-center"
    >
      <p className="flex items-center justify-center bg-white/12 px-6 py-5 text-sm font-semibold uppercase tracking-wider text-foreground/80">
        {label}
      </p>
      <div className="flex flex-col items-center border-t border-foreground/25 px-6 pb-6 pt-5">
        <p className="font-display text-4xl text-primary">{value}</p>
        <p className="mt-2 text-sm text-foreground/80">{detail}</p>
      </div>
    </Card>
  );
}