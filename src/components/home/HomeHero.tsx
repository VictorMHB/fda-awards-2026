import GlassShapes from "@/components/ui/GlassShapes";

const HOME_BG = "/images/home_page.png";

export default function HomeHero() {
  return (
    <section className="home-hero flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center px-6 py-16 text-center md:min-h-[calc(100svh-6rem)]">
      {/* Fundo decorativo */}
      <div
        aria-hidden="true"
        className="home-hero__photo"
        style={{ backgroundImage: `url(${HOME_BG})` }}
      />
      <div aria-hidden="true" className="home-hero__aurora" />
      <GlassShapes />

      <h1
        className="logo-aero logo-aero--italic relative z-10 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
        aria-label="FDA Awards 2026"
      >
        <span className="logo-aero-word logo-aero-fda" data-l="FDA" aria-hidden="true">
          <span className="logo-aero-face">FDA</span>
        </span>
        <span className="logo-aero-word logo-aero-awards" data-l="AWARDS" aria-hidden="true">
          <span className="logo-aero-face">AWARDS</span>
        </span>
        <span className="logo-aero-word logo-aero-fda" data-l="2026" aria-hidden="true">
          <span className="logo-aero-face">2026</span>
        </span>
      </h1>
    </section>
  );
}