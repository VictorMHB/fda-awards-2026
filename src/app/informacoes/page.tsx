import type { Metadata } from "next";
import InfoHero from "@/components/info/InfoHero";
import TimelineSection from "@/components/info/TimelineSection";
import RulesSection from "@/components/info/RulesSection";
import FaqSection from "@/components/info/FaqSection";
import ContactSection from "@/components/info/ContactSection";

export const metadata: Metadata = {
  title: "Informações | FDA Awards 2026",
};

export default function InfoPage() {
  return (
    <main>
      {/* 1. Hero: data, hora e local */}
      <InfoHero />

      {/* 2. Linha do tempo */}
      <TimelineSection />

      {/* 3. Regras: indicados e vencedores */}
      <RulesSection />

      {/* 4. Perguntas frequentes */}
      <FaqSection />

      {/* 5. Contato */}
      <ContactSection />
    </main>
  );
}