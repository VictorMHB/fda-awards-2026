"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import AeroButton from "@/components/ui/AeroButton";
import { AeroText } from "@/components/ui/AeroText";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";

import { useAuth } from "@/context/AuthContext";

import { formatDateTime, formatPercent, pad2 } from "@/lib/results/format";

import { fetchResultados } from "@/lib/services/adminResults";

import type {
  ResultadoCategoria,
  ResultadosResponse,
} from "@/types/resultados";

import CategoryDetail from "./_components/CategoryDetail";
import PieChart from "./_components/PieChart";
import ResultsSummary from "./_components/ResultsSummary";

function exportJson(data: ResultadosResponse) {
  const iso = new Date(data.geradoEm).toISOString();

  const payload = {
    geradoEm: iso,
    resumo: {
      confirmadas: data.resumo.confirmadas,
      rascunhos: data.resumo.rascunhos,
    },
    categorias: data.categorias.map((c) => ({
      id: c.id,
      nome: c.nome,
      totalVotos: c.totalVotos,
      vencedor: c.vencedor,
      empatados: c.empatados,
      indicados: c.indicados,
    })),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `fda-awards-2026-resultados-${iso
    .slice(0, 16)
    .replace(/[-:T]/g, "")}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  toast.success("JSON exportado.");
}

function LeaderLine({ category }: { category: ResultadoCategoria }) {
  if (category.vencedor) {
    return (
      <p className="mt-2 text-sm break-words">
        Líder: <strong>{category.vencedor.nome}</strong>
        <span className="tabular-nums">
          {" "}
          · {formatPercent(category.vencedor.porcentagem)}
        </span>
      </p>
    );
  }

  if (category.empatados.length > 0) {
    return (
      <p className="mt-2 text-sm break-words">
        Empate:{" "}
        <strong>{category.empatados.map((i) => i.nome).join(", ")}</strong>
        <span className="tabular-nums">
          {" "}
          · {formatPercent(category.empatados[0].porcentagem)}
        </span>
      </p>
    );
  }

  return <p className="mt-2 text-sm text-foreground/70">Sem votos</p>;
}

export default function ResultsClient() {
  const { user } = useAuth();

  const [data, setData] = useState<ResultadosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [view, setView] = useState("all");

  // Busca os resultados
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    user
      .getIdToken()
      .then((token) => fetchResultados(token))
      .then((result) => {
        if (cancelled) return;

        setData(result);
        setFailed(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;

        setFailed(true);

        toast.error(
          err instanceof Error
            ? err.message
            : "Erro ao carregar os resultados.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, refreshKey]);

  function handleRefresh() {
    if (loading) return;

    setLoading(true);
    setRefreshKey((n) => n + 1);
  }

  const categorias = data?.categorias ?? [];

  const selectedIndex = categorias.findIndex((c) => c.id === view);

  const selected = selectedIndex >= 0 ? categorias[selectedIndex] : null;

  const prevOff = selectedIndex <= 0;

  const nextOff =
    selectedIndex === -1 || selectedIndex >= categorias.length - 1;

  function go(delta: -1 | 1) {
    const target = selectedIndex + delta;

    if (target < 0 || target >= categorias.length) return;

    setView(categorias[target].id);
  }

  return (
    <main className="px-6 py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Cabeçalho */}
        <div>
          <AeroButton href="/admin" variant="blue" size="sm">
            Voltar ao admin
          </AeroButton>
        </div>

        <h1 className="mt-6">
          <AeroText className="block py-0 text-3xl leading-[1.35] md:text-5xl">
            Resultados
          </AeroText>
        </h1>

        <p className="mt-3 text-sm text-foreground/70">
          Contam só cédulas confirmadas e não anuladas.
        </p>

        {/* Barra de ações */}
        <div className="mt-8 flex flex-wrap items-end gap-3">
          {data && categorias.length > 0 && (
            <div className="min-w-0 flex-1 basis-56">
              <label
                htmlFor="results-view"
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/70"
              >
                Exibir
              </label>

              <select
                id="results-view"
                value={selected?.id ?? "all"}
                onChange={(e) => setView(e.target.value)}
                className="min-h-11 w-full min-w-0 rounded-none border border-foreground/30 bg-dark-bg px-3 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <option value="all">Visão geral</option>

                {categorias.map((c, index) => (
                  <option key={c.id} value={c.id}>
                    {pad2(index + 1)} · {c.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          <AeroButton
            variant="blue"
            size="sm"
            disabled={loading}
            onClick={handleRefresh}
          >
            {loading ? "Atualizando..." : "Atualizar"}
          </AeroButton>

          {data && (
            <AeroButton
              variant="blue"
              size="sm"
              disabled={loading}
              onClick={() => exportJson(data)}
            >
              Exportar JSON
            </AeroButton>
          )}
        </div>

        {data && (
          <p role="status" className="mt-3 text-xs text-foreground/70">
            Dados de {formatDateTime(data.geradoEm)}
          </p>
        )}

        {/* Estados de carregamento e erro */}
        {loading && !data && (
          <p role="status" className="mt-8 text-foreground/80">
            Carregando...
          </p>
        )}

        {failed && !data && !loading && (
          <p
            role="alert"
            className="mt-8 border-l-[3px] border-primary bg-primary/10 p-4"
          >
            Não foi possível carregar os resultados. Use “Atualizar” para tentar
            de novo.
          </p>
        )}

        {/* Resultados */}
        {data && (
          <>
            {/* Resumo */}
            <ResultsSummary
              confirmadas={data.resumo.confirmadas}
              rascunhos={data.resumo.rascunhos}
              categorias={categorias.length}
            />

            {data.resumo.anuladas > 0 && (
              <p className="mt-3 text-sm text-foreground/70">
                {data.resumo.anuladas} conta(s) anulada(s) fora da contagem.
              </p>
            )}

            {/* Categorias vazias */}
            {categorias.length === 0 && (
              <p className="mt-10 text-foreground/80">
                Nenhuma categoria cadastrada.
              </p>
            )}

            {categorias.length > 0 && data.resumo.confirmadas === 0 && (
              <p className="mt-10 border-l-[3px] border-primary bg-primary/10 p-4">
                Nenhuma cédula confirmada ainda. Os gráficos aparecem quando
                houver votos.
              </p>
            )}

            {/* Visão geral */}
            {categorias.length > 0 &&
              data.resumo.confirmadas > 0 &&
              !selected && (
                <>
                  <div className="mt-10">
                    <SectionHeader
                      title="Categorias"
                      description="Escolha uma para ver o ranking completo."
                    />
                  </div>

                  <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {categorias.map((category, index) => (
                      <li key={category.id} className="min-w-0">
                        <Card
                          variant="window"
                          title={`${pad2(index + 1)}/${pad2(categorias.length)}`}
                          className="h-full"
                        >
                          <div className="p-4 md:p-5">
                            <div className="flex items-center gap-4">
                              <PieChart
                                items={category.indicados}
                                className="w-24 shrink-0"
                              />

                              <div className="min-w-0">
                                <h3 className="font-display text-base leading-snug text-balance break-words">
                                  {category.nome}
                                </h3>

                                <LeaderLine category={category} />

                                <p className="mt-1 text-xs tabular-nums text-foreground/70">
                                  {category.totalVotos} votos
                                </p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <AeroButton
                                variant="blue"
                                size="sm"
                                onClick={() => setView(category.id)}
                              >
                                Ver detalhes
                                <span className="sr-only">
                                  {" "}
                                  de {category.nome}
                                </span>
                              </AeroButton>
                            </div>
                          </div>
                        </Card>
                      </li>
                    ))}
                  </ul>
                </>
              )}

            {/* Detalhes da categoria */}
            {selected && (
              <div className="mt-10">
                <CategoryDetail
                  category={selected}
                  index={selectedIndex}
                  total={categorias.length}
                />

                {/* Navegação entre categorias */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <AeroButton
                    variant="blue"
                    size="sm"
                    aria-disabled={prevOff || undefined}
                    className={prevOff ? "cursor-not-allowed opacity-50" : ""}
                    onClick={() => go(-1)}
                  >
                    Anterior
                  </AeroButton>

                  <AeroButton
                    variant="blue"
                    size="sm"
                    aria-disabled={nextOff || undefined}
                    className={nextOff ? "cursor-not-allowed opacity-50" : ""}
                    onClick={() => go(1)}
                  >
                    Próxima
                  </AeroButton>

                  <AeroButton
                    variant="blue"
                    size="sm"
                    onClick={() => setView("all")}
                  >
                    Visão geral
                  </AeroButton>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
