import { getPhase } from "@/lib/content/shared/phases";
import type { Categoria, CategoriaTipo, Indicado } from "@/types/voto";

export const MIN_INDICADOS = 4;
export const MAX_INDICADOS = 5; // 5 indicados = categoria final

// O ID vira ID de documento e valor em `votos`: "." e "/" quebram a votação
export const ID_VALIDO = /^[\p{L}\p{N}_-]+$/u;

const VIDEO_ID = /^[\w-]{11}$/;

export const isVideoId = (value: string) => VIDEO_ID.test(value);

// hqdefault é 4:3 com faixas pretas; cortada em 16:9 (object-cover) fica limpa
export const youtubeThumb = (videoId: string) =>
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

// Aceita link (watch, youtu.be, embed, shorts, live) ou só o ID
export function parseYouTubeId(input: string): string | null {
  const text = input.trim();
  if (isVideoId(text)) return text;

  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^(www|m|music)\./, "");
  let id: string | null = null;

  if (host === "youtu.be") {
    id = url.pathname.split("/")[1] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id =
      url.searchParams.get("v") ??
      url.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/)?.[1] ??
      null;
  }

  return id && isVideoId(id) ? id : null;
}

// "Melhor Momento" -> "melhor_momento"
export const slug = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

// Depois que a votação abre, mexer em categorias invalida votos já gravados.
// Recebe o relógio por parâmetro: no cliente vem do useAgora.
export function categoriesLocked(now: number) {
  return getPhase(now) !== "aguardando";
}

export type CategoryResult =
  | { ok: true; value: Categoria }
  | { ok: false; error: string };

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const fail = (error: string): CategoryResult => ({ ok: false, error });
const asRecord = (value: unknown) =>
  (typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>;

// Usada no navegador (aviso rápido) e no servidor (a que vale)
export function validateCategory(input: unknown): CategoryResult {
  const body = asRecord(input);
  const id = text(body.id);
  const nome = text(body.nome);
  const ordem = body.ordem;
  const tipo: CategoriaTipo = body.tipo === "video" ? "video" : "imagem";
  const raw = body.indicados;

  if (!id || !nome || typeof ordem !== "number" || !Number.isFinite(ordem) || !Array.isArray(raw)) {
    return fail("Preencha o nome da categoria.");
  }
  if (!ID_VALIDO.test(id)) {
    return fail('ID inválido: use só letras, números, "_" e "-".');
  }
  if (raw.length < MIN_INDICADOS || raw.length > MAX_INDICADOS) {
    return fail(`Use de ${MIN_INDICADOS} a ${MAX_INDICADOS} indicados por categoria.`);
  }

  const indicados: Indicado[] = [];
  for (const item of raw) {
    const n = asRecord(item);
    const nid = text(n.id);
    const nnome = text(n.nome);

    if (!nnome) return fail("Preencha o nome de todos os indicados.");
    if (!nid || !ID_VALIDO.test(nid)) {
      return fail("Indicado com ID inválido. Recarregue a página e tente de novo.");
    }

    if (tipo === "video") {
      const videoId = text(n.videoId);
      if (!isVideoId(videoId)) return fail(`Link de vídeo inválido em "${nnome}".`);
      // Firestore não aceita undefined: videoId só entra em categoria de vídeo
      indicados.push({ id: nid, nome: nnome, imagemUrl: "", videoId });
    } else {
        const imagemUrl = text(n.imagemUrl);
        if (imagemUrl && !/^(https:\/\/|\/(?!\/))/i.test(imagemUrl)) {
        return fail(`A imagem de "${nnome}" precisa ser um link https ou um caminho que comece com "/".`);
      }
      indicados.push({ id: nid, nome: nnome, imagemUrl });
    }
  }

  if (new Set(indicados.map((i) => i.id)).size !== indicados.length) {
    return fail("Há indicados com o mesmo ID.");
  }
  const nomes = indicados.map((i) => i.nome.toLowerCase());
  if (new Set(nomes).size !== nomes.length) {
    return fail("Há indicados com o mesmo nome.");
  }
  if (tipo === "video") {
    const videos = indicados.map((i) => i.videoId);
    if (new Set(videos).size !== videos.length) return fail("Há indicados com o mesmo vídeo.");
  }

  return { ok: true, value: { id, nome, ordem, tipo, indicados } };
}