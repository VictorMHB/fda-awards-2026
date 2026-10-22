import SectionHeader from "@/components/ui/SectionHeader";
import { getFaq } from "@/lib/content/faq";
import FaqItem from "./FaqItem";

export default function FaqSection() {
  return (
    <section id="faq" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          title="Perguntas frequentes"
          description="As dúvidas mais comuns sobre a votação e a cerimônia."
        />

        <div className="max-w-3xl space-y-3">
          {getFaq().map((entry) => (
            <FaqItem key={entry.question} {...entry} />
          ))}
        </div>
      </div>
    </section>
  );
}
