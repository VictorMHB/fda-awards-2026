import type { Metadata } from "next";
import { AeroText, type Tier } from "@/components/ui/AeroText";
import SectionHeader from "@/components/ui/SectionHeader";
import SponsorsSection from "@/components/sponsors/SponsorsSection";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Sobre | FDA Awards 2026",
};

// Dados de exemplo: troque pelos reais (depois dá pra mover pra lib/ ou Firestore)
const EDITIONS = [
  { year: "2022", title: "1ª edição", description: "Texto sobre a primeira edição." },
  { year: "2023", title: "2ª edição", description: "Texto sobre a segunda edição." },
  { year: "2024", title: "3ª edição", description: "Texto sobre a terceira edição." },
  { year: "2025", title: "4ª edição", description: "Texto sobre a quarta edição." },
];

const RECORDS = [
  { label: "Mais votos em um indicado", value: "—", detail: "Nome · edição" },
  { label: "Mais vitórias", value: "—", detail: "Nome" },
  { label: "Vitória mais apertada", value: "—", detail: "Categoria · edição" },
];

export default function AboutPage() {
  return (
    <main>
      {/* 1. Hero */}
      <section className="px-6 py-16 md:py-24">
  <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
    <div>
      <h1 className="uppercase leading-tight">
        <AeroText className="block text-3xl md:text-5xl">Sobre o</AeroText>
        <AeroText variant="primary" className="block text-3xl md:text-5xl">
          FDA Awards
        </AeroText>
      </h1>

      <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary md:text-base">
        Reconhecendo acontecimentos, feitos e histórias do ano.
      </p>

      <div className="mt-6 space-y-4 text-base text-foreground/80">
        <p>
          O FDA AWARDS foi criado em 2021 com o objetivo de coroar os maiores
          feitos do ano. Desde o seu início, a premiação rapidamente se
          consolidou como uma das mais prestigiadas do mundo.
        </p>
        <p>
          Nossa missão é reconhecer e enaltecer os maiores e melhores momentos
          do ano.
        </p>
      </div>
    </div>

    <div aria-hidden="true" className="about-panel">
      <span className="absolute bottom-4 left-4 z-10 font-mono text-xs tracking-[0.25em] text-foreground/60">
        EST. 2021 · 5ª EDIÇÃO
      </span>
    </div>
  </div>
</section>

      {/* 2. Histórico de edições */}
      <section id="editions" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            title="Histórico de edições"
            description="Como a premiação chegou até a 5ª edição."
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {EDITIONS.map((edition) => (
              <li key={edition.year} className="glass p-6">
                <span className="font-display text-2xl text-primary">
                  {edition.year}
                </span>
                <h3 className="mt-2 text-lg font-bold text-foreground">
                  {edition.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/70">
                  {edition.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Recordes */}
      <section id="records" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            title="Recordes"
            description="As marcas que ficaram na história da premiação."
          />
          <ul className="grid gap-6 md:grid-cols-3">
            {RECORDS.map((record) => (
              <li key={record.label} className="glass p-6 text-center">
                <p className="text-sm uppercase tracking-wider text-foreground/70">
                  {record.label}
                </p>
                <p className="mt-3 font-display text-4xl text-primary">
                  {record.value}
                </p>
                <p className="mt-2 text-sm text-foreground/70">{record.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Patrocinadores */}
      <SponsorsSection />

      <Footer />
    </main>
  );
}