import data from "@/data/records.json";

// null = ainda não definido: o card mostra NO_VALUE
export type RecordEntry = {
  label: string;
  value: string | null;
  detail: string;
};

export const NO_VALUE = "—";

const records = data as RecordEntry[];

export function getRecords() {
  return records.map((record) => ({ ...record, value: record.value ?? NO_VALUE }));
}
