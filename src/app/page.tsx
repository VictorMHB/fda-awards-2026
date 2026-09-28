import Countdown from "@/components/Countdown";
import GlassShapes from "@/components/GlassShapes";
import LoginButton from "@/components/LoginButton";


const main_bg = "/images/main_background.png";

export default function Home() {
  return (
    <main>
      <section className="relative min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-7rem)] overflow-hidden flex flex-col items-center justify-center text-center px-6">
        {/* <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${main_bg})` }}
        /> */}

        {/* Overlay: funde as bordas de cima e de baixo com o fundo do site */}
        {/* <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-dark-bg via-transparent to-dark-bg"
        /> */}

        <GlassShapes />

        <div className="relative z-10 flex flex-col items-center gap-6">
          <h1 className="font-title font-bold italic text-primary text-pixel-shadow text-5xl md:text-7xl tracking-wide">
            FDA AWARDS 2026
          </h1>
          <h2 className="font-text text-foreground">
            Sou muito burrow, né pouco não, faço isso por diversão
          </h2>
          <Countdown />
          <LoginButton />
        </div>

        <div>
          
        </div>
      </section>
    </main>
  );
}