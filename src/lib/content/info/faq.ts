import data from "@/data/info/faq.json";

export type FaqEntry = {
  question: string;
  answer: string;
};

const faq = data as FaqEntry[];

export function getFaq() {
  return faq;
}
