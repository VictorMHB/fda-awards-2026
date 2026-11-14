import type { Categoria } from "@/types/voto";
import type { ResultadoCategoria, ResultadosResponse } from "@/types/resultados";

export type VotanteResumo = {
  confirmado?: boolean;
  anulado?: boolean;
  votos?: Record<string, string>;
};

// Só cédulas confirmadas e não anuladas entram na contagem.
export function computeResultados(
  categorias: Categoria[],
  votantes: VotanteResumo[],
  geradoEm: number,
): ResultadosResponse {
  let confirmadas = 0;
  let rascunhos = 0;
  let anuladas = 0;
  // categoriaId -> indicadoId -> votos
  const contagem = new Map<string, Map<string, number>>();

  for (const votante of votantes) {
    if (votante.anulado === true) {
      anuladas++;
      continue;
    }
    if (votante.confirmado !== true) {
      if (votante.votos && Object.keys(votante.votos).length > 0) rascunhos++;
      continue;
    }
    confirmadas++;
    for (const [categoriaId, indicadoId] of Object.entries(votante.votos ?? {})) {
      let porIndicado = contagem.get(categoriaId);
      if (!porIndicado) {
        porIndicado = new Map();
        contagem.set(categoriaId, porIndicado);
      }
      porIndicado.set(indicadoId, (porIndicado.get(indicadoId) ?? 0) + 1);
    }
  }

  const resultado: ResultadoCategoria[] = categorias.map((categoria) => {
    const porIndicado = contagem.get(categoria.id);
    const base = categoria.indicados.map((indicado) => ({
      id: indicado.id,
      nome: indicado.nome,
      votos: porIndicado?.get(indicado.id) ?? 0,
    }));
    const totalVotos = base.reduce((soma, i) => soma + i.votos, 0);

    // sort é estável: em empate, mantém a ordem original dos indicados
    const indicados = base
      .map((i) => ({
        ...i,
        porcentagem: totalVotos > 0 ? Math.round((i.votos / totalVotos) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.votos - a.votos);

    const maior = indicados[0]?.votos ?? 0;
    const lideres = maior > 0 ? indicados.filter((i) => i.votos === maior) : [];

    return {
      id: categoria.id,
      nome: categoria.nome,
      totalVotos,
      // Empate nunca é desempatado aqui: vencedor fica null e os empatados vão na lista.
      vencedor: lideres.length === 1 ? lideres[0] : null,
      empatados: lideres.length > 1 ? lideres : [],
      indicados,
    };
  });

  return { geradoEm, resumo: { confirmadas, rascunhos, anuladas }, categorias: resultado };
}