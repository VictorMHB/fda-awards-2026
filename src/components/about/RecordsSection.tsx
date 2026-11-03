import RecordCard from "@/components/about/RecordCard";
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
            <RecordCard
              key={record.label}
              bar={record.bar}
              label={record.label}
              value={record.value}
              detail={record.detail}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}