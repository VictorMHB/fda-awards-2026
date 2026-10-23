import SectionHeader from "@/components/ui/SectionHeader";
import { getRecords } from "@/lib/content/records";

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
            <li key={record.label} className="glass p-6 text-center">
              <p className="text-sm uppercase tracking-wider text-foreground/70">{record.label}</p>
              <p className="mt-3 font-display text-4xl text-primary">{record.value}</p>
              <p className="mt-2 text-sm text-foreground/70">{record.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
