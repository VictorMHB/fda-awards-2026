import IsoCube from "@/components/ui/IsoCube";

// Foto antiga do fundo, trocada pelo fundo em CSS. A imagem continua em
// public/images até decidirem no PR se ela sai do projeto.
// const HOME_BG = "/images/home_page.png";

type Cube = {
  size: string;
  x: string; // distância da borda (esquerda, ou direita com side: "end")
  y: string; // topo, em % da camada
  side?: "end";
  opacity: number;
  duration: string;
  delay: string;
  desktopOnly?: boolean; // no celular ficam só os pequenos (3 no total)
};

// Cubos em duas camadas: uma acima do título (faixa do topo + troféu) e outra
// abaixo dele. Nenhuma camada ocupa a linha do título, então nenhum cubo passa
// atrás dele. Desktop: 5 cubos (3 pequenos e 2 médios). Celular: 3 pequenos.
const UPPER_CUBES: Cube[] = [
  { size: "2.5rem", x: "8%", y: "16%", side: "end", opacity: 0.55, duration: "9s", delay: "-2s" },
  { size: "4.25rem", x: "17%", y: "46%", side: "end", opacity: 0.4, duration: "12s", delay: "-6s", desktopOnly: true },
  { size: "2.25rem", x: "9%", y: "68%", opacity: 0.45, duration: "10s", delay: "-4s" },
];

const LOWER_CUBES: Cube[] = [
  { size: "4rem", x: "11%", y: "20%", opacity: 0.4, duration: "11s", delay: "-8s", desktopOnly: true },
  { size: "2.25rem", x: "30%", y: "30%", opacity: 0.5, duration: "8s", delay: "-1s" },
];

// Anotações do fundo (estética Y2K): o texto se repete em eco, como na arte
// antiga. Só a primeira linha é lida pelo leitor de tela.
const NOTES = [
  { text: "5 anos de história", position: "start" },
  { text: "Os maiores prêmios", position: "end" },
] as const;

function CubeLayer({ cubes, position }: { cubes: Cube[]; position: "upper" | "lower" }) {
  return (
    <div aria-hidden="true" className={`home-hero__cubes home-hero__cubes--${position}`}>
      {cubes.map(({ size, x, y, side, opacity, duration, delay, desktopOnly }, i) => (
        <IsoCube
          key={i}
          className={`iso-cube--float ${desktopOnly ? "hidden sm:block" : ""}`}
          style={{
            "--cube-size": size,
            "--cube-duration": duration,
            "--cube-delay": delay,
            left: side === "end" ? undefined : x,
            right: side === "end" ? x : undefined,
            top: y,
            opacity,
          }}
        />
      ))}
    </div>
  );
}

export default function HomeHero() {
  return (
    <section className="home-hero">
      {/* Fundo decorativo, de trás para frente (a base é o fundo da própria seção) */}
      {/* <div
        aria-hidden="true"
        className="home-hero__photo"
        style={{ backgroundImage: `url(${HOME_BG})` }}
      /> */}
      <div aria-hidden="true" className="home-hero__glow" />
      <div aria-hidden="true" className="home-hero__dots" />
      <div aria-hidden="true" className="home-hero__crosses" />
      <CubeLayer cubes={UPPER_CUBES} position="upper" />
      <CubeLayer cubes={LOWER_CUBES} position="lower" />

      {/* No celular o AWARDS some (fica "FDA 2026"), mas o aria-label mantém o nome completo */}
      <h1
        className="home-hero__title logo-aero logo-aero--italic font-display"
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

      {NOTES.map(({ text, position }) => (
        <p key={text} className={`home-note home-note--${position}`}>
          <span>{text}</span>
          <span aria-hidden="true" className="home-note__echo">{text}</span>
          <span aria-hidden="true" className="home-note__echo">{text}</span>
        </p>
      ))}
    </section>
  );
}
