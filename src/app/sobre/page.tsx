import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import EditionsSection from "@/components/about/EditionsSection";
import RecordsSection from "@/components/about/RecordsSection";
import SponsorsSection from "@/components/sponsors/SponsorsSection";

export const metadata: Metadata = {
  title: "Sobre | FDA Awards 2026",
};

export default function AboutPage() {
  return (
    <main>
      {/* 1. Hero */}
      <AboutHero />

      {/* 2. Histórico de edições */}
      <EditionsSection />

      {/* 3. Recordes */}
      <RecordsSection />

      {/* 4. Patrocinadores */}
      <SponsorsSection />
    </main>
  );
}
