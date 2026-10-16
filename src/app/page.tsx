import GlassShapes from "@/components/ui/GlassShapes";
import Countdown from "@/components/ui/Countdown";
import Marquee from "@/components/ui/Marquee";
import NewsCarousel from "@/components/news/NewsCarousel";
import NavMap from "@/components/layout/NavMap";
import Footer from "@/components/layout/Footer";
import { AeroText } from "@/components/ui/AeroText";

const HOME_BG = "/images/home_page.png";

export default function Home() {
  return (
    <main>
      {/* 1. Hero — reservado pro troféu girando */}
      <section className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden px-6 text-center md:min-h-[calc(100vh-6rem)]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat "
          style={{ backgroundImage: `url(${HOME_BG})` }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-dark-bg/40 via-transparent to-dark-bg"
        />

        <GlassShapes />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <h1
            className="logo-aero logo-aero--italic font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
            aria-label="FDA Awards 2026"
          >
            <span
              className="logo-aero-word logo-aero-fda"
              data-l="FDA"
              aria-hidden="true"
            >
              <span className="logo-aero-face">FDA</span>
            </span>
            <span
              className="logo-aero-word logo-aero-awards"
              data-l="AWARDS"
              aria-hidden="true"
            >
              <span className="logo-aero-face">AWARDS</span>
            </span>
            <span
              className="logo-aero-word logo-aero-fda"
              data-l="2026"
              aria-hidden="true"
            >
              <span className="logo-aero-face">2026</span>
            </span>
          </h1>
        </div>
      </section>

      {/* 2. Divisão */}
      <Marquee text="OS MAIORES PRÊMIOS DO ANO" />

      {/* 3. Cronômetro */}
      <section className="px-6 py-16 md:py-24">
        <Countdown />
      </section>

      {/* 4. Notícias */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <AeroText as="h2" className="text-3xl md:text-4xl">
            Notícias
          </AeroText>
          <p className="mt-3 max-w-2xl text-base text-foreground/70">
            Fique de olho nas novidades sobre os indicados, a votação e a festa
            de encerramento.
          </p>
          <div className="mt-8">
            <NewsCarousel />
          </div>
        </div>
      </section>

      {/* 5. Mapa — ocupa a largura toda */}
      <section className="w-full py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <header className="mb-8 md:mb-12">
            <AeroText as="h2" className="text-3xl md:text-4xl">
              Explorar
            </AeroText>
            <p className="mt-3 max-w-2xl text-base text-foreground/70">
              Descubra o que o site do FDA AWARDS tem a oferecer
            </p>
          </header>

          <NavMap />
        </div>
      </section>

      <Footer />
    </main>
  );
}
