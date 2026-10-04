import GlassShapes from "@/components/GlassShapes";
import LoginButton from "@/components/LoginButton";
import Countdown from "@/components/Countdown";
import Marquee from "@/components/Marquee";
import NewsCarousel from "@/components/NewsCarousel";
import Footer from "@/components/Footer";


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
          <h1 className="font-display text-5xl tracking-tight text-primary md:text-7xl">
            FDA AWARDS 2026
          </h1>
          <div className="mt-2">
            <LoginButton />
          </div>
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
    <h2 className="font-display text-3xl text-foreground md:text-4xl">Notícias</h2>
    <p className="mt-3 max-w-2xl text-base text-foreground/70">
      Fique de olho nas novidades sobre os indicados, a votação e a festa de encerramento.
    </p>
    <div className="mt-8">
      <NewsCarousel />
    </div>
  </div>
</section>

      {/* 5. Mapa — ocupa a largura toda */}
      <section className="w-full">
        <div className="flex h-96 w-full items-center justify-center bg-dark-bg/60 text-foreground/50">
          Mapa em breve
        </div>
      </section>

      <Footer />
    </main>
  );
}