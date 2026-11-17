import type { Categoria, Indicado } from "@/types/voto";

export type ReportCategory = {
  id: string;
  name: string;
  nominees: { id: string; name: string }[];
};

export type VoterStatus = "confirmed" | "draft" | "annulled";

export type VoterChoice =
  | { categoryId: string; kind: "voted"; nomineeId: string; nomineeName: string }
  | { categoryId: string; kind: "none" }
  | { categoryId: string; kind: "removed" };

export type VoterRow = {
  uid: string;
  name: string;
  email: string;
  status: VoterStatus;
  confirmedAt: number | null;
  votedCount: number;
  choices: VoterChoice[]; // mesma ordem de VotersReport.categories
};

export type VotersReport = {
  generatedAt: number;
  truncated: boolean;
  categories: ReportCategory[];
  totals: { all: number; confirmed: number; draft: number; annulled: number };
  voters: VoterRow[];
};

type CategoryInput = Pick<Categoria, "id" | "nome"> & {
  indicados: Pick<Indicado, "id" | "nome">[];
};

export type RawVoter = { uid: string; data: Record<string, unknown> };

const str = (value: unknown) => (typeof value === "string" ? value : "");

// Número (ms) ou Timestamp do Firestore
function toMillis(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object") {
    const v = value as { toMillis?: () => number; seconds?: number; _seconds?: number };
    if (typeof v.toMillis === "function") return v.toMillis();
    const seconds = v.seconds ?? v._seconds;
    if (typeof seconds === "number") return seconds * 1000;
  }
  return null;
}

export function computeVoters(
  categories: CategoryInput[],
  raw: RawVoter[],
  options: { generatedAt: number; truncated: boolean },
): VotersReport {
  const voters: VoterRow[] = raw.map(({ uid, data }) => {
    const votes =
      data.votos && typeof data.votos === "object" ? (data.votos as Record<string, unknown>) : {};

    const choices: VoterChoice[] = categories.map((category) => {
      const chosen = votes[category.id];
      if (typeof chosen !== "string" || chosen === "") {
        return { categoryId: category.id, kind: "none" };
      }
      const nominee = category.indicados.find((n) => n.id === chosen);
      // O indicado pode ter sido removido depois do voto
      return nominee
        ? { categoryId: category.id, kind: "voted", nomineeId: nominee.id, nomineeName: nominee.nome }
        : { categoryId: category.id, kind: "removed" };
    });

    const status: VoterStatus =
      data.anulado === true ? "annulled" : data.confirmado === true ? "confirmed" : "draft";

    return {
      uid,
      name: str(data.nome),
      email: str(data.email),
      status,
      confirmedAt: toMillis(data.confirmadoEm),
      votedCount: choices.filter((c) => c.kind === "voted").length,
      choices,
    };
  });

  // Confirmação mais recente primeiro; sem data (rascunhos) no fim, por nome
  voters.sort((a, b) => {
    if (a.confirmedAt !== b.confirmedAt) {
      if (a.confirmedAt === null) return 1;
      if (b.confirmedAt === null) return -1;
      return b.confirmedAt - a.confirmedAt;
    }
    return (a.name || a.email).localeCompare(b.name || b.email, "pt-BR");
  });

  return {
    generatedAt: options.generatedAt,
    truncated: options.truncated,
    categories: categories.map((c) => ({
      id: c.id,
      name: c.nome,
      nominees: c.indicados.map((n) => ({ id: n.id, name: n.nome })),
    })),
    totals: {
      all: voters.length,
      confirmed: voters.filter((v) => v.status === "confirmed").length,
      draft: voters.filter((v) => v.status === "draft").length,
      annulled: voters.filter((v) => v.status === "annulled").length,
    },
    voters,
  };
}