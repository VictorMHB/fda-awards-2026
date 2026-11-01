import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { getRecords } from "@/lib/content/about/records";

export default function RecordsSection() {
  return (
    <section id="records" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          title="Recordes"
          description="As marcas que ficaram na história da premiação."
        />

        <ul className="grid gap-6 md:grid-cols-3">
          {getRecords().map((record) => (
            <Card key={record.label} as="li" className="grid grid-rows-2 text-center">
              <p className="flex items-center justify-center px-6 pb-4 pt-6 text-sm font-semibold uppercase tracking-wider text-foreground/80">
                {record.label}
              </p>
              <div className="flex flex-col items-center px-6 pb-6 pt-4">
                <p className="font-display text-4xl text-primary">{record.value}</p>
                <p className="mt-2 text-sm text-foreground/80">{record.detail}</p>
              </div>
            </Card>
          ))}
        </ul>
      </div>
    </section>
  );
}