export type ResultadoIndicado = {
  id: string;
  nome: string;
  votos: number;
  porcentagem: number;
};

export type ResultadoCategoria = {
  id: string;
  nome: string;
  totalVotos: number;
  vencedor: ResultadoIndicado | null;
  empatados: ResultadoIndicado[];
  indicados: ResultadoIndicado[];
};

export type ResultadosResponse = {
  geradoEm: number;
  resumo: { confirmadas: number; rascunhos: number; anuladas: number };
  categorias: ResultadoCategoria[];
};