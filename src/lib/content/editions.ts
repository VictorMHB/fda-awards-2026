import data from "@/data/editions.json";

export type Edition = {
  year: string;
  title: string;
  description: string;
};

const editions = data as Edition[];

export function getEditions() {
  return editions;
}
