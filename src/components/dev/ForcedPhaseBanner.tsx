import { getForcedPhase } from "@/lib/content/shared/phases";

// Aviso de fase forçada. Some sozinho em produção (getForcedPhase devolve null).
export default function ForcedPhaseBanner() {
  const phase = getForcedPhase();
  if (!phase) return null;

  return (
    <div role="status" className="phase-override">
      <span className="phase-override__tag">Fase forçada</span>
      <span>
        {phase} · só em desenvolvimento · remova NEXT_PUBLIC_FORCE_PHASE do
        .env.local para voltar ao relógio real
      </span>
    </div>
  );
}