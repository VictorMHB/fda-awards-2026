"use client";

function Solid({
  width, height, depth, duration, floatDelay = "0s", className = "",
}: {
  width: number; height: number; depth: number;
  duration: string; floatDelay?: string; className?: string;
}) {
  const w = width, h = height, d = depth;
  return (
    <div
      className={`glass-scene glass-float ${className}`}

      style={{ position: "relative", width: w, height: h, perspective: 2000, animationDelay: floatDelay }}
      aria-hidden="true"
    >
      <div className="glass-solid" style={{ animationDuration: duration }}>
        <div className="solid-face solid-face-front" style={{ width: w, height: h, transform: `translateZ(${d / 2}px)` }} />
        <div className="solid-face solid-face-front" style={{ width: w, height: h, transform: `rotateY(180deg) translateZ(${d / 2}px)`, filter: "brightness(0.85)" }} />
        <div className="solid-face solid-face-side" style={{ width: d, height: h, left: w / 2 - d / 2, transform: `rotateY(90deg) translateZ(${w / 2}px)` }} />
        <div className="solid-face solid-face-side" style={{ width: d, height: h, left: w / 2 - d / 2, transform: `rotateY(-90deg) translateZ(${w / 2}px)` }} />
        <div className="solid-face solid-face-top" style={{ width: w, height: d, top: h / 2 - d / 2, transform: `rotateX(90deg) translateZ(${h / 2}px)` }} />
        <div className="solid-face solid-face-side" style={{ width: w, height: d, top: h / 2 - d / 2, transform: `rotateX(-90deg) translateZ(${h / 2}px)`, filter: "brightness(0.6)" }} />
      </div>
    </div>
  );
}

// Cubos de fundo: longe do centro, bem sutis. Os menores somem no mobile.
const CUBES = [
  { size: 70, left: "6%", top: "14%", opacity: 0.45, duration: "28s", delay: "-3s" },
  { size: 42, left: "16%", top: "62%", opacity: 0.35, duration: "36s", delay: "-9s", hide: "hidden sm:block" },
  { size: 30, left: "28%", top: "30%", opacity: 0.3, duration: "32s", delay: "-14s", hide: "hidden md:block" },
  { size: 58, right: "7%", top: "18%", opacity: 0.4, duration: "30s", delay: "-6s" },
  { size: 84, right: "14%", top: "64%", opacity: 0.32, duration: "40s", delay: "-11s", hide: "hidden sm:block" },
  { size: 34, right: "26%", top: "36%", opacity: 0.28, duration: "34s", delay: "-2s", hide: "hidden md:block" },
];

export default function GlassShapes() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Cubos ao fundo (vêm antes no DOM, então ficam atrás do prisma) */}
      {CUBES.map(({ size, left, right, top, opacity, duration, delay, hide = "" }, i) => (
        <div
          key={i}
          className={`absolute ${hide}`}
          style={{ left, right, top, opacity }}
        >
          <Solid width={size} height={size} depth={size} duration={duration} floatDelay={delay} />
        </div>
      ))}

      {/* Placeholder do troféu 3D (trocar pelo troféu real no futuro) */}
      <Solid width={180} height={550} depth={180} duration="30s" />
    </div>
  );
}