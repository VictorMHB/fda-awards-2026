import data from "@/data/event.json";

// null = ainda não definido: o card mostra "Em breve"
export type EventInfo = {
  date: string | null; // AAAA-MM-DD
  time: string | null; // HH:MM, horário de Brasília
  venue: string | null;
  city: string | null;
};

export type EventDetail = {
  id: "date" | "time" | "venue";
  label: string;
  value: string;
  note?: string;
};

export const TO_BE_ANNOUNCED = "Em breve";

const event = data as EventInfo;

// Um formato errado no JSON viraria "Invalid Date" no card
if (event.date && !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
  console.warn(`[event] data fora do formato AAAA-MM-DD: "${event.date}"`);
}
if (event.time && !/^\d{2}:\d{2}$/.test(event.time)) {
  console.warn(`[event] hora fora do formato HH:MM: "${event.time}"`);
}

// Data sem hora: formata em UTC, senão no fuso de Brasília ela volta um dia
const formatDate = (date: string, options: Intl.DateTimeFormatOptions) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("pt-BR", { timeZone: "UTC", ...options });

// "20:00" vira "20h" e "19:30" vira "19h30"
function formatTime(time: string) {
  const [hours, minutes] = time.split(":");
  return `${Number(hours)}h${minutes === "00" ? "" : minutes}`;
}

export function getEventDetails(): EventDetail[] {
  const { date, time, venue, city } = event;

  return [
    {
      id: "date",
      label: "Data",
      value: date ? formatDate(date, { day: "numeric", month: "long", year: "numeric" }) : TO_BE_ANNOUNCED,
      note: date ? formatDate(date, { weekday: "long" }) : undefined,
    },
    {
      id: "time",
      label: "Hora",
      value: time ? formatTime(time) : TO_BE_ANNOUNCED,
      note: time ? "horário de Brasília" : undefined,
    },
    {
      id: "venue",
      label: "Local",
      value: venue ?? TO_BE_ANNOUNCED,
      note: venue && city ? city : undefined,
    },
  ];
}
