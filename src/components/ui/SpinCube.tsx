import type { CSSProperties } from "react";

type SpinCubeProps = {
  className?: string;
  // Aceita as variáveis --cube-size, --cube-duration e --cube-delay
  style?: CSSProperties & Record<`--${string}`, string | number>;
};

const FACES = ["front", "back", "right", "left", "top", "bottom"] as const;

// Estrutura em camadas, cada uma com um trabalho só:
//   spin-cube        posição, opacidade e flutuar (nunca no elemento que gira)
//   __scene          só a perspective
//   __body           preserve-3d e giro
//   __face           6 faces opacas
export default function SpinCube({ className = "", style }: SpinCubeProps) {
  return (
    <div aria-hidden="true" className={`spin-cube ${className}`} style={style}>
      <div className="spin-cube__scene">
        <div className="spin-cube__body">
          {FACES.map((face) => (
            <div key={face} className={`spin-cube__face spin-cube__face--${face}`} />
          ))}
        </div>
      </div>
    </div>
  );
}