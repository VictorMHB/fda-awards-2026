
import { AeroText } from "@/components/ui/AeroText";
import Card from "@/components/ui/Card";
import { pad2 } from "@/lib/results/format";
import type { ResultadoCategoria } from "@/types/resultados";

import PieChart from "./PieChart";
import RankingList from "./RankingList";

type CategoryDetailProps = {
  category: ResultadoCategoria;
  index: number;
  total: number;
};

export default function CategoryDetail({
  category,
  index,
  total,
}: CategoryDetailProps) {
  const leaderIds =
    category.empatados.length > 0
      ? category.empatados.map((item) => item.id)
      : category.vencedor
        ? [category.vencedor.id]
        : [];

  return (
    <Card
      variant="window"
      title={`${pad2(index + 1)}/${pad2(total)}`}
    >
      <div className="p-4 md:p-6">
        <h2>
          <AeroText className="block py-0 text-xl leading-[1.35] text-balance break-words md:text-3xl">
            {category.nome}
          </AeroText>
        </h2>

        <p className="mt-2 text-sm tabular-nums text-foreground/80">
          Total: {category.totalVotos} votos
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:items-start">
          <PieChart
            items={category.indicados}
            className="mx-auto w-full max-w-52"
          />

          <RankingList
            indicados={category.indicados}
            leaderIds={leaderIds}
            tie={category.empatados.length > 0}
          />
        </div>
      </div>
    </Card>
  );
}
