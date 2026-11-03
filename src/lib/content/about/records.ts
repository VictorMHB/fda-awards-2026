import data from "@/data/about/records.json";

// null = ainda não definido: o card mostra NO_VALUE
export type RecordEntry = {
  label: string;
  value: number | string | null;
  unit?: string;
  detail: string;
};

export const NO_VALUE = "—";

const records = data as RecordEntry[];

function formatValue({ value, unit = "" }: RecordEntry) {
  if (value === null) return NO_VALUE;
  return `${typeof value === "number" ? value.toLocaleString("pt-BR") : value}${unit}`;
}

export function getRecords() {
  return records.map((record) => ({ ...record, value: formatValue(record) }));
}
