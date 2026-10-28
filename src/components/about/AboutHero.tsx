import type { CSSProperties } from "react";
import { AeroText } from "@/components/ui/AeroText";

type CloudStyle = CSSProperties & Record<`--${string}`, string>;

const CLOUDS: { style: CloudStyle; className?: string }[] = [
  { style: { "--w": "30rem", "--x": "62%", "--y": "6%" } },
  { style: { "--w": "22rem", "--x": "4%", "--y": "28%" }, className: "hidden md:block" },
];

export default function AboutHero() {
  return (
    <section className="about-hero px-6 pb-44 pt-20 md:pb-56 md:pt-28">
      {/* Fundo decorativo */}
      <div aria-hidden="true" className="about-hero__sky" />
      {CLOUDS.map(({ style, className = "" }, i) => (
        <span key={i} aria-hidden="true" className={`about-cloud ${className}`} style={style} />
      ))}
      <div aria-hidden="true" className="about-swoosh about-swoosh--a" />
      <div aria-hidden="true" className="about-swoosh about-swoosh--b" />
      <div aria-hidden="true" className="about-hero__dots" />

      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground/70">
          <span aria-hidden="true" className="size-2 bg-primary" />
          FDA Awards · Desde 2021
        </p>

        <h1 className="mt-4 uppercase">
          <AeroText className="block text-4xl leading-[1.3] md:text-6xl">Sobre o</AeroText>
          <AeroText variant="primary" className="block text-4xl leading-[1.3] md:text-6xl">
            FDA Awards
          </AeroText>
        </h1>

        <div aria-hidden="true" className="mx-auto mt-6 h-[3px] w-28 bg-linear-to-r from-primary to-secondary" />

        <p className="mx-auto mt-6 max-w-xl text-sm font-bold uppercase tracking-[0.2em] text-primary md:text-base">
          Reconhecendo acontecimentos, feitos e histórias do ano.
        </p>

        <div className="mx-auto mt-6 max-w-2xl space-y-4 text-base text-foreground/80">
          <p>
            O FDA AWARDS foi criado em 2021 com o objetivo de coroar os maiores feitos do ano.
            Desde o seu início, a premiação se consolidou como uma das mais prestigiadas da comunidade.
          </p>
          <p>Nossa missão é reconhecer e enaltecer os maiores e melhores momentos do ano.</p>
        </div>
      </div>
    </section>
  );
}