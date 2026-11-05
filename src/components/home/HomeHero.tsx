import SpinCube from "@/components/ui/SpinCube";
import Trophy from "@/components/home/Trophy";

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
  desktopOnly?: boolean; // no celular ficam só 3 cubos
};

// Cubos de vidro em duas camadas: a faixa de cima e a faixa de baixo do hero.
// Nenhuma camada ocupa a linha do centro (título e troféu), então nenhum cubo
// passa atrás do título. Cada grupo fica no miolo de uma nebulosa:
//   faixa de cima: nebulosa laranja (~15% da borda direita)
//   faixa de baixo: nebulosa azul (~15% da borda esquerda)
// Desktop: 10 cubos. Celular: 3.
const UPPER_CUBES: Cube[] = [
  { size: "2.25rem", x: "30%", y: "96%", side: "end", opacity: 0.8, duration: "11s", delay: "-5s", desktopOnly: true },
  { size: "2rem", x: "26%", y: "24%", side: "end", opacity: 0.8, duration: "8s", delay: "-3s", desktopOnly: true },
  { size: "4.25rem", x: "18%", y: "70%", side: "end", opacity: 0.85, duration: "12s", delay: "-6s", desktopOnly: true },
  { size: "2.5rem", x: "14%", y: "150%", side: "end", opacity: 0.9, duration: "9s", delay: "-2s" },
  { size: "3rem", x: "9%", y: "54%", side: "end", opacity: 0.9, duration: "10s", delay: "-8s", desktopOnly: true },
];

const LOWER_CUBES: Cube[] = [
  { size: "3rem", x: "9%", y: "21%", opacity: 0.9, duration: "9s", delay: "-4s" },
  { size: "4rem", x: "20%", y: "2%", opacity: 0.85, duration: "11s", delay: "-8s", desktopOnly: true },
  { size: "2.25rem", x: "16%", y: "-60%", opacity: 0.85, duration: "10s", delay: "-7s" },
  { size: "2rem", x: "28%", y: "-40%", opacity: 0.8, duration: "8s", delay: "-1s", desktopOnly: true },
  { size: "2.75rem", x: "34%", y: "36%", opacity: 0.8, duration: "12s", delay: "-2s", desktopOnly: true },
];

// Anotações grandes do fundo (estética Y2K): o texto se repete em eco, como na
// arte antiga. Só a primeira linha é lida pelo leitor de tela.
// side: lado do hero. row: faixa de cima ("top") ou de baixo ("bottom").
const NOTES = [
  { text: "Cinco anos de história", side: "start", row: "top" },
  { text: "Os maiores prêmios do ano", side: "end", row: "bottom" },
] as const;

// Rótulos verticais pequenos nas laterais: cima à direita (CD) e baixo à esquerda (BE)
const SIDE_LABELS = [
  { text: "Show ao vivo · 12.12.2026 · 20h", side: "end", row: "top" },
  { text: "Votação · 13.11 a 30.11", side: "start", row: "bottom" },
] as const;

function CubeLayer({ cubes, position }: { cubes: Cube[]; position: "upper" | "lower" }) {
  return (
    <div aria-hidden="true" className={`home-hero__cubes home-hero__cubes--${position}`}>
      {cubes.map(({ size, x, y, side, opacity, duration, delay, desktopOnly }, i) => (
        <SpinCube
          key={i}
          className={`spin-cube--float ${desktopOnly ? "hidden sm:block" : ""}`}
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
      <div aria-hidden="true" className="home-hero__nebula home-hero__nebula--orange-center" />
      <div aria-hidden="true" className="home-hero__nebula home-hero__nebula--blue-top" />
      <div aria-hidden="true" className="home-hero__nebula home-hero__nebula--blue" />
      <div aria-hidden="true" className="home-hero__dots" />
      <div aria-hidden="true" className="home-hero__crosses" />
      <CubeLayer cubes={UPPER_CUBES} position="upper" />
      <CubeLayer cubes={LOWER_CUBES} position="lower" />

      <Trophy src="/images/trophy.png" className="home-hero__trophy" />

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

      {NOTES.map(({ text, side, row }) => (
        <p key={text} className={`home-note home-note--${side} home-note--${row}`}>
          <span>{text}</span>
          <span aria-hidden="true" className="home-note__echo">{text}</span>
          <span aria-hidden="true" className="home-note__echo">{text}</span>
        </p>
      ))}

      {/* Decorativos e repetem info que já existe no site: ocultos para leitor de tela */}
      {SIDE_LABELS.map(({ text, side, row }) => (
        <p key={text} aria-hidden="true" className={`home-side home-side--${side} home-side--${row}`}>
          {text}
        </p>
      ))}
    </section>
  );
}