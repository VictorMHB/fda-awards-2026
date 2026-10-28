import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { getEditions } from "@/lib/content/about/editions";

export default function EditionsSection() {
  return (
    <section id="editions" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          title="Histórico de edições"
          description="Como a premiação chegou até a 5ª edição."
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {getEditions().map((edition) => (
            <Card key={edition.year} as="li" className="p-6">
              <span className="font-display text-2xl text-primary">{edition.year}</span>
              <h3 className="mt-2 text-lg font-bold text-foreground">{edition.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{edition.description}</p>
            </Card>
          ))}
        </ul>
      </div>
    </section>
  );
}
