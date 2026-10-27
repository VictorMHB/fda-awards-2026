"use client";

import { useSyncExternalStore } from "react";

// A notícia aberta fica na URL (?news=slug): o link abre o modal direto,
// e o voltar do navegador fecha
const PARAM = "news";
const CHANGE_EVENT = "news-slug-change"; // pushState e replaceState não disparam popstate
const PUSHED = "newsModal"; // marca, no history.state, a entrada criada ao abrir

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}
const getSnapshot = () => new URLSearchParams(window.location.search).get(PARAM);
const getServerSnapshot = () => null;

// null no servidor e na hidratação (a Home é estática); depois, o slug da URL
export function useNewsSlug() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function urlWithSlug(slug: string | null) {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set(PARAM, slug);
  else url.searchParams.delete(PARAM);
  return url.href;
}

// Abrir cria uma entrada no histórico, que é o que o voltar desfaz.
// O Next junta o pushState nativo ao roteador dele, sem recarregar a página
export function pushNewsSlug(slug: string) {
  window.history.pushState({ [PUSHED]: true }, "", urlWithSlug(slug));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// Fechar volta para a entrada de antes. Quem chegou por um link com ?news= não
// tem essa entrada, então aí o parâmetro só sai da URL
export function clearNewsSlug() {
  if (!getSnapshot()) return; // o voltar do navegador já tirou
  if (window.history.state?.[PUSHED]) {
    window.history.back();
    return;
  }
  window.history.replaceState(null, "", urlWithSlug(null));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
