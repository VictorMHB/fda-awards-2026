"use client";

import { useSyncExternalStore } from "react";

// Relógio compartilhado: atualiza 1x por segundo e evita erro de hidratação
let snapshot = 0;
function subscribe(onChange: () => void) {
  snapshot = Date.now();
  onChange();
  const id = setInterval(() => {
    snapshot = Date.now();
    onChange();
  }, 1000);
  return () => clearInterval(id);
}
const getSnapshot = () => snapshot;
const getServerSnapshot = () => 0;

// Retorna 0 até montar no navegador
export function useAgora() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}