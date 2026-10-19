import data from "@/data/sponsors.json";

export type Sponsor = {
  name: string;
  tier: Tier;
  logo?: string;
  url?: string;
  master?: boolean;
};

export type Tier = "diamond" | "platinum" | "gold" | "silver" | "bronze";

export const TIERS: { id: Tier; label: string }[] = [
  { id: "diamond", label: "Diamante" },
  { id: "platinum", label: "Platina" },
  { id: "gold", label: "Ouro" },
  { id: "silver", label: "Prata" },
  { id: "bronze", label: "Bronze" },
];

const sponsors = data as Sponsor[];

// Um tier digitado errado no JSON faria o patrocinador sumir em silêncio
const knownTiers = new Set<string>(TIERS.map((t) => t.id));
for (const s of sponsors) {
  if (!knownTiers.has(s.tier)) {
    console.warn(`[sponsors] "${s.name}" tem tier desconhecido: "${s.tier}"`);
  }
}

export function getSponsorsByTier() {
  return TIERS.map((tier) => ({
    ...tier,
    sponsors: sponsors.filter((s) => s.tier === tier.id),
  })).filter((group) => group.sponsors.length > 0);
}

export function getMasterSponsors() {
  return sponsors.filter((s) => s.master).slice(0, 2);
}