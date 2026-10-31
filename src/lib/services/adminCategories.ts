import type { Categoria } from "@/types/voto";

async function call<T>(token: string, url: string, init: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error("Erro de conexão.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Erro inesperado.");
  return data as T;
}

const JSON_HEADERS = { "Content-Type": "application/json" };

export const saveCategory = (token: string, category: Categoria) =>
  call(token, "/api/admin/categorias", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(category),
  });

export const deleteCategory = (token: string, id: string) =>
  call(token, "/api/admin/categorias", {
    method: "DELETE",
    headers: JSON_HEADERS,
    body: JSON.stringify({ id }),
  });