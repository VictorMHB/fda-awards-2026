import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { getRuleGroups, getRulesSection } from "@/lib/content/info/rules";

export default function RulesSection() {
  const { title, description } = getRulesSection();

  return (
    <section id="rules" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={title} description={description} />

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          {getRuleGroups().map((group) => (
            <Card key={group.id} variant="window" title={group.title}>
              <div className="p-6 md:p-8">
                <h3 className="sr-only">{group.title}</h3>
                <ol className="space-y-4">
                  {group.items.map((item, index) => (
                    <li key={item} className="flex gap-4 text-foreground/80">
                      <span
                        aria-hidden="true"
                        className="shrink-0 font-mono text-sm leading-6 text-primary"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}