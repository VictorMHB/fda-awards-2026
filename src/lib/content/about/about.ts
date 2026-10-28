import data from "@/data/about/about.json";

export type AboutContent = {
  title: string;
  titleHighlight: string; // segunda linha do título, em laranja
  tagline: string;
  paragraphs: string[];
  badge: string;
};

const about = data as AboutContent;

export function getAbout() {
  return about;
}
