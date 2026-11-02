import GlassShapes from "@/components/ui/GlassShapes";
import Countdown from "@/components/home/Countdown";
import Marquee from "@/components/ui/Marquee";
import NewsCarousel from "@/components/news/NewsCarousel";
import NewsBody from "@/components/news/NewsBody";
import NavMap from "@/components/layout/NavMap";
import { AeroText } from "@/components/ui/AeroText";
import HomeHero from "@/components/home/HomeHero";
import { formatNewsDate, getAllNews } from "@/lib/content/shared/news";

export default function Home() {
  // Os .md de src/content/news são lidos aqui, no servidor. O texto já vai renderizado para o carrossel
  const news = getAllNews().map(({ content, ...item }) => ({
    ...item,
    dateLabel: formatNewsDate(item.date),
    body: <NewsBody markdown={content} />,
  }));

  return (
    <main>
      {/* 1. Hero */}
      <HomeHero />

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
            <NewsCarousel news={news} />
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
    </main>
  );
}
