export type CategoriaTipo = "imagem" | "video";

export interface Indicado {
  id: string;
  nome: string;
  imagemUrl: string; // categorias de imagem ("" = sem imagem)
  videoId?: string; // categorias de vídeo: ID do YouTube (11 caracteres)
}

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string; // explica a categoria (aparece na cédula)
  ordem: number;
  tipo?: CategoriaTipo; // ausente = "imagem" (categorias já cadastradas)
  indicados: Indicado[];
}

export interface Votante {
  nome: string;
  email: string;
  confirmado: boolean;
  confirmadoEm: number | null;
  votos: Record<string, string>;
}