import data from "@/data/about/editions.json";

export type Edition = {
  year: number;
  winnerLabel: string;
  winner: string | null;
  description: string | null;
  image?: { src: string; alt: string };
};

type EditionData = {
  year?: number;
  winnerLabel?: string;
  winner?: string | null;
  description?: string | null;
  image?: string;
  imageAlt?: string;
};

const DEFAULT_WINNER_LABEL = "Maior vencedor da noite";

function readText(entry: EditionData, field: "winner" | "description", year: number) {
  const value = entry[field];
  if (value === null) return null;
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`[editions] a edição de ${year} está sem "${field}"`);
  }
  return value;
}

function readImage(entry: EditionData, year: number) {
  if (!entry.image) return undefined;
  if (!entry.imageAlt?.trim()) {
    throw new Error(`[editions] a edição de ${year} tem "image", mas está sem "imageAlt"`);
  }
  return { src: entry.image, alt: entry.imageAlt };
}

function toEdition(entry: EditionData, index: number): Edition {
  const { year } = entry;
  if (typeof year !== "number" || !Number.isInteger(year)) {
    throw new Error(`[editions] o item ${index + 1} do editions.json está sem "year" válido`);
  }

  return {
    year,
    winnerLabel: entry.winnerLabel?.trim() || DEFAULT_WINNER_LABEL,
    winner: readText(entry, "winner", year),
    description: readText(entry, "description", year),
    image: readImage(entry, year),
  };
}

const editions = (data as EditionData[]).map(toEdition).sort((a, b) => b.year - a.year);

editions.forEach((edition, index) => {
  if (edition.year === editions[index + 1]?.year) {
    throw new Error(`[editions] a edição de ${edition.year} aparece mais de uma vez`);
  }
});

export function getEditions() {
  return editions;
}
