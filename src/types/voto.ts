export interface Indicado {
  id: string;
  nome: string;
  imagemUrl: string;
}

export interface Categoria {
  id: string;
  nome: string;
  ordem: number;
  indicados: Indicado[];
}

export interface Votante {
  nome: string;
  email: string;
  confirmado: boolean;
  confirmadoEm: number | null; 
  votos: Record<string, string>; 
}