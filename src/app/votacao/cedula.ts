import { Categoria, Indicado } from "@/types/voto";

export type Votos = Record<string, string>;

export function indicadoEscolhido(categoria: Categoria, votos: Votos): Indicado | undefined {
  const indicadoId = votos[categoria.id];
  if (!indicadoId) return undefined;
  return categoria.indicados.find((indicado) => indicado.id === indicadoId);
}

export function contarEscolhidas(categorias: Categoria[], votos: Votos) {
  return categorias.filter((categoria) => indicadoEscolhido(categoria, votos)).length;
}

export function primeiraEtapaPendente(categorias: Categoria[], votos: Votos) {
  const indice = categorias.findIndex((categoria) => !indicadoEscolhido(categoria, votos));
  return indice === -1 ? categorias.length : indice;
}
