import data from "@/data/admin/voters.json";

export const getVotersContent = () => data;

// "Atualizado às {time}" -> troca cada {nome} pelo valor
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}