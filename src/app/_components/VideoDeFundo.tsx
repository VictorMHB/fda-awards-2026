"use client";

import { useEffect, useRef } from "react";

const SENSIBILIDADE = 0.8;

export default function VideoDeFundo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let xAnterior: number | null = null;
    let tempoAlvo = 0;
    let tempoBuscado = 0;
    let buscando = false;

    const buscar = () => {
      buscando = true;
      tempoBuscado = tempoAlvo;
      video.currentTime = tempoAlvo;
    };

    const aoConcluirBusca = () => {
      buscando = false;
      if (tempoAlvo !== tempoBuscado) buscar();
    };

    const aoMoverMouse = (event: MouseEvent) => {
      const xAtual = event.clientX;
      if (xAnterior === null) {
        xAnterior = xAtual;
        return;
      }

      const delta = xAtual - xAnterior;
      xAnterior = xAtual;
      const duracao = video.duration;
      if (delta === 0 || !Number.isFinite(duracao) || duracao <= 0) return;

      const deslocamento = (delta / window.innerWidth) * SENSIBILIDADE * duracao;
      tempoAlvo = Math.min(duracao, Math.max(0, tempoAlvo + deslocamento));
      if (!buscando) buscar();
    };

    const aoSairDaJanela = () => {
      xAnterior = null;
    };

    video.addEventListener("seeked", aoConcluirBusca);
    window.addEventListener("mousemove", aoMoverMouse, { passive: true });
    document.documentElement.addEventListener("mouseleave", aoSairDaJanela);

    return () => {
      video.removeEventListener("seeked", aoConcluirBusca);
      window.removeEventListener("mousemove", aoMoverMouse);
      document.documentElement.removeEventListener("mouseleave", aoSairDaJanela);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <video
        ref={videoRef}
        src="/video/fundo-home.mp4"
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="size-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-b from-dark-bg/20 via-dark-bg/40 via-50% to-dark-bg/95" />
    </div>
  );
}
