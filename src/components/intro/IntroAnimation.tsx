"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { Press_Start_2P } from "next/font/google";
import { DATAS } from "@/lib/phases";

const pixel = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-intro-pixel",
});

// Animações CSS que fecham a capa (normal e com movimento reduzido)
const SAIDAS = ["intro-abrir", "intro-sumir"];

const nomeDaAnimacao = (a: Animation) => (a as CSSAnimation).animationName;

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
// "2026-11-27T00:00..." → "27.11", sem depender de fuso
const diaMes = (iso: string) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;
const ANO = DATAS.showInicio.slice(0, 4);
const MES_SHOW = MESES[Number(DATAS.showInicio.slice(5, 7)) - 1];

const CHAMADAS = [
  { etiqueta: "Exclusivo", texto: "Os maiores prêmios do ano" },
  { etiqueta: "Votação", texto: `Abre ${diaMes(DATAS.votacaoAbre)}` },
  { etiqueta: "Ao vivo", texto: `Show ${diaMes(DATAS.showInicio)}` },
];

// x: posição (%), s: tamanho (vmin), d: duração (s), a: atraso (s; negativo = já subindo), g: deriva (vmin)
const BOLHAS = [
  { x: 3, s: 9, d: 9, a: -6, g: 4 },
  { x: 13, s: 4, d: 7, a: -1.5, g: -3 },
  { x: 22, s: 12, d: 11, a: -8, g: 5 },
  { x: 34, s: 5, d: 8, a: -4, g: -4 },
  { x: 47, s: 3, d: 6.5, a: -2, g: 3 },
  { x: 57, s: 7, d: 9.5, a: -5.5, g: -5 },
  { x: 67, s: 4.5, d: 7.5, a: -0.5, g: 4 },
  { x: 77, s: 10, d: 10.5, a: -3, g: -3 },
  { x: 87, s: 5.5, d: 8.5, a: -7, g: 3 },
  { x: 95, s: 8, d: 9, a: -2.5, g: -6 },
];

// Brilhos em volta do logo (posição relativa à marca)
const BRILHOS = [
  { top: "-6%", left: "-7%", s: 1.2, d: 2.2, a: 1.3 },
  { top: "4%", left: "90%", s: 0.7, d: 1.9, a: 1.7 },
  { top: "56%", left: "-11%", s: 0.8, d: 2.4, a: 2.1 },
  { top: "78%", left: "97%", s: 1, d: 2, a: 1.8 },
  { top: "36%", left: "105%", s: 0.55, d: 1.7, a: 2.6 },
];

// Reflexos da lente, na diagonal que cruza a tela (vmin)
const FANTASMAS = [
  { x: -24, y: 14, s: 7 },
  { x: -40, y: 23, s: 3.5 },
  { x: -62, y: 36, s: 12 },
];

const r2 = (n: number) => Math.round(n * 100) / 100;

// Raios de capa de revista: fatias num SVG só (gira sem custo de máscara)
const FATIAS_RAIOS = (() => {
  const fatias = 24;
  let d = "";
  for (let i = 0; i < fatias; i++) {
    const a0 = (i / fatias) * Math.PI * 2;
    const a1 = a0 + ((Math.PI * 2) / fatias) * 0.36;
    d += `M100 100L${r2(100 + Math.cos(a0) * 100)} ${r2(100 + Math.sin(a0) * 100)}L${r2(100 + Math.cos(a1) * 100)} ${r2(100 + Math.sin(a1) * 100)}Z`;
  }
  return d;
})();

// Explosão de retícula, como as do fundo do site: pontos que diminuem nas pontas
const PONTOS_EXPLOSAO = (() => {
  const pontos: { x: number; y: number; r: number }[] = [{ x: 50, y: 50, r: 5.5 }];
  const raios = 16;
  for (let i = 0; i < raios; i++) {
    const ang = (i / raios) * Math.PI * 2;
    const alcance = i % 2 === 0 ? 49 : i % 4 === 1 ? 34 : 26;
    for (let d = 7; d <= alcance; d += 3.6) {
      pontos.push({
        x: r2(50 + Math.cos(ang) * d),
        y: r2(50 + Math.sin(ang) * d),
        r: r2(Math.max(0.4, 2.6 * (1 - d / 52))),
      });
    }
  }
  return pontos;
})();

// Selo de preço: estrela de 20 pontas
const PONTAS_SELO = (() => {
  const pontas = 20;
  const pts: string[] = [];
  for (let i = 0; i < pontas * 2; i++) {
    const ang = (i / (pontas * 2)) * Math.PI * 2 - Math.PI / 2;
    const raio = i % 2 === 0 ? 49 : 41;
    pts.push(`${r2(50 + Math.cos(ang) * raio)},${r2(50 + Math.sin(ang) * raio)}`);
  }
  return pts.join(" ");
})();

// Larguras alternadas barra/espaço do código de barras
const BARRAS = (() => {
  const larguras = [2, 1, 1, 3, 1, 1, 2, 2, 1, 3, 2, 1, 1, 1, 3, 1, 2, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 1, 2, 2, 1, 1, 3, 2];
  let x = 0;
  const barras: { x: number; w: number }[] = [];
  larguras.forEach((w, i) => {
    if (i % 2 === 0) barras.push({ x, w });
    x += w;
  });
  return { barras, total: x };
})();

const vars = (v: Record<string, string | number>) => v as CSSProperties;

// O script do <head> (src/lib/intro.ts) marca o <html> quando a abertura já tocou
const semInscricao = () => () => {};
const introJaVista = () => document.documentElement.dataset.intro === "vista";

export default function IntroAnimation() {
  const vista = useSyncExternalStore(semInscricao, introJaVista, () => false);
  const [fim, setFim] = useState(false);
  const terminar = useCallback(() => setFim(true), []);

  if (vista || fim) return null;
  return <Capa aoTerminar={terminar} />;
}

function Capa({ aoTerminar }: { aoTerminar: () => void }) {
  const raizRef = useRef<HTMLDivElement>(null);
  const veuRef = useRef<HTMLDivElement>(null);
  const capaRef = useRef<HTMLDivElement>(null);
  const sombraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    const veu = veuRef.current;
    const capa = capaRef.current;
    const sombra = sombraRef.current;
    if (!raiz || !veu || !capa || !sombra) return;

    let ativa = true;
    let abrindo = false;
    let pulou = false;
    let reserva: number | undefined;
    const encerrar = () => {
      if (!ativa) return;
      ativa = false;
      aoTerminar();
    };
    const usarReserva = () => {
      reserva = window.setTimeout(encerrar, 6000);
    };

    // Fim natural: o relógio CSS da raiz marca a hora, a capa abre (data-saida)
    // e a abertura termina quando essa animação acaba. O timer só entra se faltar algo.
    const abrir = () => {
      if (!ativa || abrindo || pulou) return;
      abrindo = true;
      raiz.dataset.saida = "natural";
      const saida = capa.getAnimations().find((a) => SAIDAS.includes(nomeDaAnimacao(a)));
      if (saida) saida.finished.then(encerrar, usarReserva);
      else usarReserva();
    };
    const relogio = raiz.getAnimations?.().find((a) => nomeDaAnimacao(a) === "intro-relogio");
    if (relogio) relogio.finished.then(abrir, usarReserva);
    else usarReserva();

    // Pular: a capa abre na hora, partindo de onde estiver (até no meio da saída)
    const pular = () => {
      if (!ativa || pulou) return;
      pulou = true;
      if (!abrindo) raiz.dataset.saida = "pulo";
      const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tempo: KeyframeAnimationOptions = {
        duration: reduzido ? 300 : 700,
        easing: "cubic-bezier(0.55, 0, 0.85, 0.45)",
        fill: "forwards",
      };
      veu.animate([{ opacity: 0 }], { ...tempo, easing: "ease-out" });
      sombra.animate([{ opacity: 1 }], tempo);
      capa
        .animate(
          reduzido
            ? [{ opacity: 0 }]
            : [{ opacity: 1, offset: 0.82 }, { transform: "rotateY(90deg)", opacity: 0 }],
          tempo,
        )
        .finished.then(encerrar, encerrar);
    };

    const aoTeclar = (e: KeyboardEvent) => {
      if (["Tab", "Shift", "Control", "Alt", "Meta"].includes(e.key) || e.ctrlKey || e.metaKey || e.altKey) return;
      // Não deixa a página rolar por baixo da capa
      if ([" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(e.key)) e.preventDefault();
      pular();
    };
    const aoRolar = (e: WheelEvent) => {
      e.preventDefault();
      pular();
    };

    raiz.addEventListener("pointerdown", pular);
    raiz.addEventListener("click", pular);
    raiz.addEventListener("wheel", aoRolar, { passive: false });
    window.addEventListener("keydown", aoTeclar);

    return () => {
      ativa = false;
      window.clearTimeout(reserva);
      raiz.removeEventListener("pointerdown", pular);
      raiz.removeEventListener("click", pular);
      raiz.removeEventListener("wheel", aoRolar);
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [aoTerminar]);

  return (
    <div ref={raizRef} className={`intro ${pixel.variable}`}>
      <div ref={veuRef} className="intro-veu" />

      <div ref={capaRef} className="intro-capa">
        <div className="intro-tela">
          {/* Fundo: retícula, raios, explosões, bolhas e reflexo de lente */}
          <div className="intro-fundo" aria-hidden="true">
            <div className="intro-base">
              <div className="intro-pontos" />
            </div>
            <svg className="intro-raios" viewBox="0 0 200 200">
              <defs>
                <radialGradient id="intro-raios-cor" cx="100" cy="100" r="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#fac093" stopOpacity="0.24" />
                  <stop offset="0.45" stopColor="#fac093" stopOpacity="0.1" />
                  <stop offset="1" stopColor="#fac093" stopOpacity="0" />
                </radialGradient>
              </defs>
              <path d={FATIAS_RAIOS} fill="url(#intro-raios-cor)" />
            </svg>
            <Explosao className="intro-explosao intro-explosao-1" />
            <Explosao className="intro-explosao intro-explosao-2" />
            <div className="intro-bolhas">
              {BOLHAS.map((b, i) => (
                <span
                  key={i}
                  className="intro-bolha"
                  style={vars({ "--x": b.x, "--s": b.s, "--d": b.d, "--a": b.a, "--g": b.g })}
                />
              ))}
            </div>
            <div className="intro-flare">
              <span className="intro-flare-risco" />
              <span className="intro-flare-nucleo" />
              {FANTASMAS.map((f, i) => (
                <span key={i} className="intro-flare-fantasma" style={vars({ "--gx": f.x, "--gy": f.y, "--gs": f.s })} />
              ))}
            </div>
          </div>

          <div className="intro-conteudo">
            {/* Faixa do topo, estilo revista */}
            <div className="intro-topo intro-pixel" aria-hidden="true">
              <span>
                <span className="intro-destaque">Nº 05</span> · Revista oficial
              </span>
              <span className="intro-topo-meio">
                <i className="intro-estrela" /> Edição especial de premiação <i className="intro-estrela" />
              </span>
              <span>
                {MES_SHOW} · {ANO}
              </span>
            </div>

            <div className="intro-centro">
              <div className="intro-marca">
                <span className="intro-onda" aria-hidden="true" />
                <span className="intro-onda intro-onda-2" aria-hidden="true" />

                <div className="intro-logo" role="img" aria-label={`FDA Awards ${ANO}`}>
                  <div className="intro-logo-flutua">
                    <Palavra texto="FDA" className="intro-fda" />
                    <div className="intro-awards">
                      <span className="intro-placa" />
                      <Palavra texto="AWARDS" className="intro-awards-letras" />
                    </div>
                    <span className="intro-ano btn-aero">{ANO}</span>
                  </div>
                </div>

                <div className="intro-selo" aria-hidden="true">
                  <svg viewBox="0 0 100 100">
                    <polygon points={PONTAS_SELO} />
                  </svg>
                  <span className="intro-selo-miolo" />
                  <span className="intro-selo-texto">
                    <span className="intro-selo-num">5</span>
                    <span className="intro-selo-rotulo">anos</span>
                  </span>
                </div>

                {BRILHOS.map((b, i) => (
                  <Brilho key={i} style={vars({ top: b.top, left: b.left, "--s": b.s, "--d": b.d, "--a": b.a })} />
                ))}
              </div>

              <ul className="intro-chamadas">
                {CHAMADAS.map((c, i) => (
                  <li key={c.etiqueta} style={vars({ "--i": i })}>
                    <span className="intro-etiqueta intro-pixel">{c.etiqueta}</span>
                    <span className="intro-chamada">{c.texto}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="intro-rodape">
              <CodigoDeBarras />
              <div className="intro-acoes">
                <div className="intro-carregando intro-pixel" aria-hidden="true">
                  <span className="intro-carregando-texto">Carregando</span>
                  <span className="intro-progresso">
                    <span />
                  </span>
                </div>
                <button type="button" className="intro-pular intro-pixel" aria-label="Pular abertura">
                  Pular
                </button>
              </div>
            </div>
          </div>

          <div className="intro-impacto" aria-hidden="true" />
          <div className="intro-luz" aria-hidden="true" />
          <div className="intro-crt" aria-hidden="true">
            <span className="intro-crt-linha" />
          </div>
        </div>

        <div ref={sombraRef} className="intro-sombra" aria-hidden="true" />
        <div className="intro-reflexo" aria-hidden="true" />
      </div>
    </div>
  );
}

function Palavra({ texto, className }: { texto: string; className: string }) {
  const letras = [...texto];
  return (
    <span className={className}>
      {letras.map((letra, i) => (
        <span key={i} className="intro-letra" data-l={letra} style={vars({ "--i": i })}>
          <span className="intro-face">{letra}</span>
        </span>
      ))}
      <span className="intro-reluz" aria-hidden="true">
        <span className="intro-reluz-texto">
          {letras.map((letra, i) => (
            <span key={i}>{letra}</span>
          ))}
        </span>
      </span>
    </span>
  );
}

function Explosao({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100">
      {PONTOS_EXPLOSAO.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} />
      ))}
    </svg>
  );
}

function Brilho({ style }: { style: CSSProperties }) {
  return (
    <svg className="intro-brilho" style={style} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z" />
    </svg>
  );
}

function CodigoDeBarras() {
  return (
    <div className="intro-codigo intro-pixel" aria-hidden="true">
      <svg viewBox={`0 0 ${BARRAS.total} 30`} preserveAspectRatio="none">
        {BARRAS.barras.map((b) => (
          <rect key={b.x} x={b.x} y={0} width={b.w} height={30} />
        ))}
      </svg>
      <span>7 896026 120052</span>
    </div>
  );
}
