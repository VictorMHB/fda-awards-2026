import type { ResultadosResponse } from "@/types/resultados";

export async function fetchResultados(token: string): Promise<ResultadosResponse> {
  let res: Response;
  try {
    res = await fetch("/api/admin/resultados", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    throw new Error("Erro de conexão.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Erro inesperado.");
  return data as ResultadosResponse;
}