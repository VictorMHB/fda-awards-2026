import Image from "next/image";

type TrophyProps = {
  // Imagem do troféu, ex.: "/images/trophy.png". Sem ela aparece o retângulo de placeholder
  src?: string;
  className?: string;
};

// Pixels do troféu do placeholder (grade 16x16): [x, y, largura, altura]
const PIXELS = [
  [4, 2, 8, 4], [5, 6, 6, 1], [6, 7, 4, 1], // taça
  [2, 3, 2, 1], [2, 4, 1, 2], [3, 6, 1, 1], // alça esquerda
  [12, 3, 2, 1], [13, 4, 1, 2], [12, 6, 1, 1], // alça direita
  [7, 8, 2, 3], // haste
  [5, 11, 6, 1], [4, 12, 8, 2], // base
];

export default function Trophy({ src, className = "" }: TrophyProps) {
  return (
    <div aria-hidden="true" className={`trophy ${className}`}>
      <div className={`trophy__spin ${src ? "" : "trophy__spin--placeholder"}`}>
        {src ? (
          <Image src={src} alt="" fill sizes="(width >= 48rem) 23rem, 17rem" className="trophy__image" />
        ) : (
          <>
            <svg viewBox="0 0 16 16" className="trophy__icon" shapeRendering="crispEdges">
              {PIXELS.map(([x, y, width, height]) => (
                <rect key={`${x}-${y}`} x={x} y={y} width={width} height={height} fill="currentColor" />
              ))}
              {/* Reflexo na taça */}
              <rect x={5} y={3} width={1} height={2} className="trophy__icon-gloss" />
            </svg>
            <span className="trophy__label">Troféu</span>
          </>
        )}
      </div>
    </div>
  );
}