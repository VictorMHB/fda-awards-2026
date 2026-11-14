import { SLICE_FILL } from "./palette";

type PieChartProps = {
  items: { votos: number }[];
  className?: string;
};

const CENTER = 50;
const RADIUS = 48;

// Ângulo em radianos, 0 = topo, sentido horário
function point(angle: number): string {
  const x = CENTER + RADIUS * Math.sin(angle);
  const y = CENTER - RADIUS * Math.cos(angle);
  return `${x.toFixed(3)} ${y.toFixed(3)}`;
}

// Decorativo: os números ficam sempre em texto visível ao lado.
export default function PieChart({ items, className = "" }: PieChartProps) {
  const total = items.reduce((soma, i) => soma + i.votos, 0);
  const withVotes = items
    .map((item, index) => ({ votos: item.votos, index }))
    .filter((item) => item.votos > 0);

  const slices: { path: string; index: number }[] = [];
  let start = 0;
  for (const { votos, index } of withVotes) {
    const end = start + (votos / total) * Math.PI * 2;
    const large = end - start > Math.PI ? 1 : 0;
    slices.push({
      path: `M${CENTER} ${CENTER} L${point(start)} A${RADIUS} ${RADIUS} 0 ${large} 1 ${point(end)} Z`,
      index,
    });
    start = end;
  }

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      className={`aspect-square ${className}`}
    >
      {total === 0 ? (
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          strokeWidth={1}
          className="fill-dark-bg stroke-foreground/30"
        />
      ) : withVotes.length === 1 ? (
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          strokeWidth={1}
          className={`stroke-dark-bg ${SLICE_FILL[withVotes[0].index % SLICE_FILL.length]}`}
        />
      ) : (
        slices.map((slice) => (
          <path
            key={slice.index}
            d={slice.path}
            strokeWidth={1}
            strokeLinejoin="miter"
            className={`stroke-dark-bg ${SLICE_FILL[slice.index % SLICE_FILL.length]}`}
          />
        ))
      )}
    </svg>
  );
}