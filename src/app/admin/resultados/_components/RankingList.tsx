import { formatPercent } from "@/lib/results/format";
import type { ResultadoIndicado } from "@/types/resultados";
import { SLICE_SWATCH } from "./palette";

type RankingListProps = {
  indicados: ResultadoIndicado[];
  leaderIds: string[];
  tie: boolean;
};

export default function RankingList({ indicados, leaderIds, tie }: RankingListProps) {
  return (
    <ol className="divide-y divide-foreground/15">
      {indicados.map((item, index) => {
        const isLeader = leaderIds.includes(item.id);
        const ratio = Math.min(1, Math.max(0, item.porcentagem / 100));

        return (
          <li
            key={item.id}
            className={`min-w-0 border-l-[3px] py-3 pl-3 ${
              isLeader ? "border-primary bg-primary/10" : "border-transparent"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2">
                <span
                  aria-hidden="true"
                  className={`mt-1.5 size-3 shrink-0 border border-dark-bg ${SLICE_SWATCH[index % SLICE_SWATCH.length]}`}
                />
                <p className="min-w-0 text-balance break-words font-bold">{item.nome}</p>
              </div>
              <p className="shrink-0 text-right text-sm tabular-nums">
                <span className="font-bold">{item.votos}</span>
                <span className="text-foreground/70"> · {formatPercent(item.porcentagem)}</span>
              </p>
            </div>

            {isLeader && (
              <p className="mt-2">
                {tie ? (
                  <span className="tag tag--muted">Empate</span>
                ) : (
                  <span className="tag">Vencedor</span>
                )}
              </p>
            )}

            <div
              aria-hidden="true"
              className="mt-2 h-3 w-full overflow-hidden border border-foreground/20 bg-dark-bg"
            >
              <div
                className="h-full w-full origin-left bg-linear-to-r from-primary/60 to-primary"
                style={{ transform: `scaleX(${ratio})` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}