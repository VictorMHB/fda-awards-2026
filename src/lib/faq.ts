import data from "@/data/faq.json";

export type FaqEntry = {
  question: string;
  answer: string;
};

const faq = data as FaqEntry[];

export function getFaq() {
  return faq;
}
