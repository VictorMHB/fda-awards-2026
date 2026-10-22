"use client";

import { useSyncExternalStore } from "react";
import { getPhase, type PhaseId } from "@/lib/content/phases";

const STATUS_LABEL: Record<PhaseId, string> = {
  aguardando: "System loading",
  votacao: "Voting open",
  aguardandoShow: "Counting votes",
  aoVivo: "Live now",
  encerrado: "Results ready",
};

// Reavalia a fase a cada 30s. Como o valor é uma string, o React só
// re-renderiza quando a fase realmente muda.
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}

const getSnapshot = (): PhaseId | null => getPhase(Date.now());
const getServerSnapshot = (): PhaseId | null => null;

export default function FooterStatus() {
  const phase = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <span className="footer-status" data-phase={phase ?? "unknown"}>
      {phase ? STATUS_LABEL[phase] : "System online"}
    </span>
  );
}