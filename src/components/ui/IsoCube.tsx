import type { CSSProperties } from "react";

type IsoCubeProps = {
  className?: string;
  // Tamanho em --cube-size; posição, opacidade e tempo da animação também vêm por aqui
  style?: CSSProperties & Record<`--${string}`, string>;
};

// Cubo isométrico em 2D: um hexágono só, com três losangos (topo claro,
// esquerda média e direita escura). Sem perspective nem preserve-3d, então
// nenhuma face disputa profundidade com outra: a animação move o cubo inteiro.
export default function IsoCube({ className = "", style }: IsoCubeProps) {
  return <span aria-hidden="true" className={`iso-cube ${className}`} style={style} />;
}
