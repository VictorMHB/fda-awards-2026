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

export default function GlassShapes() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Placeholder do troféu 3D (trocar pelo troféu real no futuro) */}
      <Solid width={180} height={550} depth={180} duration="30s" />
    </div>
  );
}