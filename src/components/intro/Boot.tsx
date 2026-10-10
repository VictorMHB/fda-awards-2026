"use client";

import { useEffect, useState, type CSSProperties } from "react";

const BLOCOS = 20;
const INICIO_BARRA = 2.0; // s: quando a barra começa a encher
const DURACAO = 5200; // ms: quando começa o fade out
const FADE = 900; // ms: duração do fade out
const CHAVE = "fda-boot-visto";
const ANO = "2026";

// Quando cada bloco acende (s). As "travadinhas" fazem parecer carregamento de verdade
const ATRASOS = Array.from({ length: BLOCOS }, (_, i) =>
  Math.round((i * 0.1 + (i > 6 ? 0.25 : 0) + (i > 13 ? 0.35 : 0)) * 100) / 100,
);

const vars = (v: Record<string, string | number>) => v as CSSProperties;

export default function Boot() {
  const [estado, setEstado] = useState<"ativo" | "saindo" | "fim">("ativo");
  const [blocos, setBlocos] = useState(0);

  // Toca uma vez por sessão + agenda a barra e o fade out
  useEffect(() => {
    try {
      if (sessionStorage.getItem(CHAVE)) {
        setEstado("fim");
        return;
      }
    } catch {}

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];

    if (reduzido) {
      setBlocos(BLOCOS);
      timers.push(window.setTimeout(() => setEstado("saindo"), 1200));
    } else {
      ATRASOS.forEach((s, i) => {
        timers.push(window.setTimeout(() => setBlocos(i + 1), (INICIO_BARRA + s) * 1000));
      });
      timers.push(window.setTimeout(() => setEstado("saindo"), DURACAO));
    }

    return () => timers.forEach((t) => window.clearTimeout(t));
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

  const pct = Math.round((blocos / BLOCOS) * 100);

  return (
    <div
      className="boot"
      data-saindo={estado === "saindo" ? "" : undefined}
      onClick={() => setEstado("saindo")}
      role="presentation"
    >
      <div className="boot-base" aria-hidden="true">
        <div className="boot-pontos" />
      </div>
      <div className="boot-varredura" aria-hidden="true" />

      <div className="boot-centro">
        <div className="boot-logo" role="img" aria-label={`FDA Awards ${ANO}`}>
          <Palavra texto="FDA" className="boot-fda" inicio={0.7} passo={0.14} />
          <div className="boot-awards">
            <span className="boot-placa" />
            <Palavra texto="AWARDS" className="boot-awards-letras" inicio={1.25} passo={0.08} />
          </div>
          <span className="boot-ano btn-aero">{ANO}</span>
        </div>

        <div className="boot-barra" aria-hidden="true">
          <div className="boot-barra-topo">
            <span className="boot-barra-rotulo">Carregando</span>
            <span>{pct}%</span>
          </div>
          <div className="boot-trilho">
            <div className="boot-blocos">
              {Array.from({ length: BLOCOS }, (_, i) => (
                <span key={i} data-on={i < blocos ? "" : undefined} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="boot-luz" aria-hidden="true" />
      <div className="boot-crt" aria-hidden="true">
        <span className="boot-crt-linha" />
      </div>
    </div>
  );
}

function Palavra({
  texto,
  className,
  inicio,
  passo,
}: {
  texto: string;
  className: string;
  inicio: number;
  passo: number;
}) {
  return (
    <span className={className} style={vars({ "--t0": inicio, "--p": passo })}>
      {[...texto].map((letra, i) => (
        <span key={i} className="boot-letra" data-l={letra} style={vars({ "--i": i })}>
          <span className="boot-face">{letra}</span>
        </span>
      ))}
    </span>
  );
}