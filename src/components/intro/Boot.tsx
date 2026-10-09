"use client";

import { useEffect, useState, type CSSProperties } from "react";

// x: posição (%), w: largura (vmin), h: altura (vh), b: base (vh), a: atraso (s), d: duração do flutuar (s)
const TORRES = [
  { x: 5, w: 3, h: 38, b: 4, a: 0.6, d: 5 },
  { x: 13, w: 2, h: 26, b: 14, a: 0.9, d: 6.5 },
  { x: 21, w: 4, h: 48, b: 0, a: 0.7, d: 7 },
  { x: 30, w: 2.5, h: 32, b: 10, a: 1.1, d: 5.5 },
  { x: 41, w: 3.5, h: 55, b: -4, a: 0.8, d: 8 },
  { x: 52, w: 2, h: 22, b: 18, a: 1.3, d: 6 },
  { x: 60, w: 3, h: 44, b: 2, a: 0.9, d: 7.5 },
  { x: 68, w: 4, h: 36, b: 8, a: 1.2, d: 5 },
  { x: 76, w: 2.5, h: 50, b: -2, a: 0.7, d: 6.5 },
  { x: 84, w: 3, h: 28, b: 16, a: 1.4, d: 8 },
  { x: 92, w: 3.5, h: 42, b: 4, a: 1, d: 5.5 },
];

// x: posição (%), s: tamanho (vmin), d: duração (s), a: atraso (s), g: deriva (vmin)
const BOLHAS = [
  { x: 4, s: 9, d: 9, a: -6, g: 4 },
  { x: 16, s: 4, d: 7, a: -1.5, g: -3 },
  { x: 28, s: 11, d: 11, a: -8, g: 5 },
  { x: 44, s: 3.5, d: 6.5, a: -2, g: 3 },
  { x: 58, s: 7, d: 9.5, a: -5, g: -5 },
  { x: 72, s: 5, d: 7.5, a: -0.5, g: 4 },
  { x: 84, s: 10, d: 10.5, a: -3, g: -3 },
  { x: 94, s: 6, d: 8.5, a: -7, g: 3 },
];

const DURACAO = 4400; // quando começa o fade out (ms)
const FADE = 900; // duração do fade out (ms)
const CHAVE = "fda-boot-visto";
const ANO = "2026";

const vars = (v: Record<string, string | number>) => v as CSSProperties;

export default function Boot() {
  const [estado, setEstado] = useState<"ativo" | "saindo" | "fim">("ativo");

  // Toca uma vez por sessão
useEffect(() => {
  try {
    if (sessionStorage.getItem(CHAVE)) {
      setEstado("fim");
      return;
    }
  } catch {}

  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t = window.setTimeout(() => setEstado("saindo"), reduzido ? 1200 : DURACAO);
  return () => window.clearTimeout(t);
}, []);

  // Depois do fade, sai do DOM
  useEffect(() => {
  if (estado !== "saindo") return;
  try {
    sessionStorage.setItem(CHAVE, "1");
  } catch {}
  const t = window.setTimeout(() => setEstado("fim"), FADE);
  return () => window.clearTimeout(t);
}, [estado]);

  // Trava a rolagem enquanto a capa está na tela
  useEffect(() => {
    if (estado === "fim") return;
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = antes;
    };
  }, [estado]);

  // Qualquer tecla pula
  useEffect(() => {
    if (estado !== "ativo") return;
    const pular = (e: KeyboardEvent) => {
      if (["Tab", "Shift", "Control", "Alt", "Meta"].includes(e.key)) return;
      setEstado("saindo");
    };
    window.addEventListener("keydown", pular);
    return () => window.removeEventListener("keydown", pular);
  }, [estado]);

  if (estado === "fim") return null;

  return (
    <div
      className="boot"
      data-saindo={estado === "saindo" ? "" : undefined}
      onClick={() => setEstado("saindo")}
      role="presentation"
    >
      {/* Fundo: degradê, scanlines e retícula */}
      <div className="boot-base" aria-hidden="true">
        <div className="boot-pontos" />
      </div>

      <div className="boot-torres" aria-hidden="true">
        {TORRES.map((t, i) => (
          <span
            key={i}
            className="boot-torre"
            style={vars({ "--x": t.x, "--w": t.w, "--h": t.h, "--b": t.b, "--a": t.a, "--d": t.d })}
          />
        ))}
      </div>

      <div className="boot-bolhas" aria-hidden="true">
        {BOLHAS.map((b, i) => (
          <span
            key={i}
            className="boot-bolha"
            style={vars({ "--x": b.x, "--s": b.s, "--d": b.d, "--a": b.a, "--g": b.g })}
          />
        ))}
      </div>

      <div className="boot-centro">
        <div className="boot-logo" role="img" aria-label={`FDA Awards ${ANO}`}>
          <Palavra texto="FDA" className="boot-fda" />
          <div className="boot-awards">
            <span className="boot-placa" />
            <Palavra texto="AWARDS" className="boot-awards-letras" />
          </div>
          <span className="boot-ano btn-aero">{ANO}</span>
        </div>
      </div>

      <div className="boot-rodape">
        <div className="boot-carregando" aria-hidden="true">
          <span className="boot-carregando-texto">Carregando</span>
          <span className="boot-progresso">
            <span />
          </span>
        </div>
        <button type="button" className="boot-pular" aria-label="Pular abertura">
          Pular
        </button>
      </div>

      <div className="boot-impacto" aria-hidden="true" />
      <div className="boot-luz" aria-hidden="true" />
      <div className="boot-crt" aria-hidden="true">
        <span className="boot-crt-linha" />
      </div>
    </div>
  );
}

function Palavra({ texto, className }: { texto: string; className: string }) {
  return (
    <span className={className}>
      {[...texto].map((letra, i) => (
        <span key={i} className="boot-letra" data-l={letra} style={vars({ "--i": i })}>
          <span className="boot-face">{letra}</span>
        </span>
      ))}
    </span>
  );
}