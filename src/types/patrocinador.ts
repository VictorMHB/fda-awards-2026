export type TierDePatrocinio = "diamond" | "platinum" | "gold" | "bronze";

export interface Patrocinador {
  nome: string;
  tier: TierDePatrocinio;
}
