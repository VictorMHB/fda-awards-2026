"use client";

function Solid({
  width, height, depth, top, left, right, duration, floatDelay, className = "",
}: {
  width: number; height: number; depth: number;
  top?: string; left?: string; right?: string;
  duration: string; floatDelay: string; className?: string;
}) {
  const w = width, h = height, d = depth;
  return (
    <div
      className={`glass-scene glass-float ${className}`}
      style={{ width: w, height: h, top, left, right, perspective: 2400, animationDelay: floatDelay }}
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
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <Solid width={120} height={120} depth={120} top="12%" right="8%" duration="34s" floatDelay="0s" />
      <Solid width={64} height={160} depth={64} top="46%" left="6%" duration="26s" floatDelay="1.2s" />
      <Solid width={150} height={70} depth={70} top="70%" right="16%" duration="40s" floatDelay="2.4s" />
      <div className="hidden lg:block">
        <Solid width={54} height={54} depth={54} top="20%" left="20%" duration="20s" floatDelay="0.6s" />
      </div>
    </div>
  );
}