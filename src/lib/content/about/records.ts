import data from "@/data/about/records.json";

// Como o número aparece no card:
//   compact -> 220000 vira "220 mil" (1500000 vira "1,5 milhão")
//   percent -> 68.2 vira "68,2%"
//   number  -> 18 vira "18" (220000 vira "220.000")
// Sem format: número com unit opcional (ex.: unit "%"). Texto em value aparece como está.
export type RecordFormat = "compact" | "percent" | "number";

export type RecordEntry = {
  label: string;
  value: number | string | null;
  format?: RecordFormat;
  unit?: string;
  detail: string;
};

export const NO_VALUE = "—";

// Prefixo da barra de título do card: "Recorde 01", "Recorde 02"...
const BAR_PREFIX = "Recorde";

const formatters = {
  compact: new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    compactDisplay: "long",
    maximumFractionDigits: 1,
  }),
  percent: new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }),
  number: new Intl.NumberFormat("pt-BR"),
};

export function formatRecordValue(value: number | null, format: RecordFormat = "number") {
  if (value === null) return NO_VALUE;
  const text = formatters[format].format(value);
  return format === "percent" ? `${text}%` : text;
}

const records = data as RecordEntry[];

function formatValue({ value, format, unit = "" }: RecordEntry) {
  if (value === null) return NO_VALUE;
  if (typeof value === "string") return `${value}${unit}`;
  if (format) return formatRecordValue(value, format);
  return `${formatters.number.format(value)}${unit}`;
}

export function getRecords() {
  return records.map((record, index) => ({
    label: record.label,
    detail: record.detail,
    value: formatValue(record),
    bar: `${BAR_PREFIX} ${String(index + 1).padStart(2, "0")}`,
  }));
}