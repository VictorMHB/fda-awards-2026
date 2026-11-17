import type { VotersReport } from "@/lib/results/computeVoters";

// Mesmo comportamento do `call` dos outros serviços do admin: lança Error com a mensagem da API
export async function fetchVoters(token: string): Promise<VotersReport> {
  let res: Response;
  try {
    res = await fetch("/api/admin/resultados/votantes", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    throw new Error("Erro de conexão.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Erro inesperado.");
  return data as VotersReport;
}