import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Um .md por notícia. Como escrever: src/content/news/README.md
const NEWS_DIR = path.join(process.cwd(), "src/content/news");
const PUBLIC_DIR = path.join(process.cwd(), "public");

export type NewsItem = {
  slug: string; // nome do arquivo sem a data da frente e sem o .md
  title: string;
  date: string; // AAAA-MM-DD
  excerpt: string;
  category?: string;
  cover?: string; // caminho dentro de public/, ex.: /news/<slug>/cover.webp
  coverAlt?: string;
  content: string; // texto completo, em Markdown
};

const FIELDS = new Set(["title", "date", "excerpt", "category", "cover", "coverAlt", "draft"]);
const EXCERPT_MAX = 160;
const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;
const SLUG_FORMAT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Sem o timeZone UTC, "2026-10-05" vira dia 4 nos fusos atrás de Greenwich, como o do Brasil
const DATE_LABEL = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" });

export function formatNewsDate(date: string) {
  return DATE_LABEL.format(new Date(date));
}

// "2026-11-31" passa no formato, mas não existe no calendário
function isRealDate(date: string) {
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(date);
}

// Arquivo com problema derruba o build com o nome dele: melhor do que a notícia sumir ou aparecer sem querer
function readNewsFile(fileName: string) {
  const fail = (problem: string): never => {
    throw new Error(`[news] ${fileName}: ${problem}`);
  };

  const raw = fs.readFileSync(path.join(NEWS_DIR, fileName), "utf8");
  let file: matter.GrayMatterFile<string>;
  try {
    file = matter(raw);
  } catch (error) {
    return fail(`cabeçalho com erro (${error instanceof Error ? error.message : error})`);
  }
  const { data } = file;

  // Campo digitado errado seria ignorado em silêncio (um "drafts: true" publicaria a notícia)
  for (const field of Object.keys(data)) {
    if (!FIELDS.has(field)) fail(`campo desconhecido "${field}"`);
  }

  // Data sem aspas chega do YAML como Date e cai aqui também
  const optional = (field: string) => {
    const value: unknown = data[field];
    if (value === undefined || value === null) return undefined;
    if (typeof value !== "string") return fail(`"${field}" precisa ser um texto entre aspas`);
    return value.trim() || undefined;
  };
  const required = (field: string) => optional(field) ?? fail(`falta o campo "${field}"`);

  const slug = fileName.replace(/\.md$/, "").replace(DATE_PREFIX, "");
  if (!SLUG_FORMAT.test(slug)) {
    fail("o nome do arquivo só pode ter letras minúsculas, números e hífens, sem acento");
  }

  const date = required("date");
  if (!isRealDate(date)) fail(`"date" precisa ser uma data no formato AAAA-MM-DD (veio "${date}")`);

  const excerpt = required("excerpt");
  if (excerpt.length > EXCERPT_MAX) {
    console.warn(`[news] ${fileName}: o resumo tem ${excerpt.length} caracteres (o ideal é até ${EXCERPT_MAX})`);
  }

  const cover = optional("cover");
  const coverAlt = cover ? required("coverAlt") : optional("coverAlt");
  if (cover && !fs.existsSync(path.join(PUBLIC_DIR, cover))) {
    fail(`a capa "${cover}" não existe em public/`);
  }

  const draft: unknown = data.draft ?? false;
  if (typeof draft !== "boolean") fail(`"draft" precisa ser true ou false, sem aspas`);

  const content = file.content.trim();
  if (!content) fail("falta o texto da notícia, depois do cabeçalho");

  const item: NewsItem = {
    slug,
    title: required("title"),
    date,
    excerpt,
    category: optional("category"),
    cover,
    coverAlt,
    content,
  };
  return { item, draft: draft === true };
}

function readAllNews() {
  const fileNames = fs
    .readdirSync(NEWS_DIR)
    .filter((name) => name.endsWith(".md") && name !== "README.md");

  const entries = fileNames.map((fileName) => ({ fileName, ...readNewsFile(fileName) }));

  // O slug identifica a notícia (e vai para a URL na fase 2), então não pode repetir
  const seen = new Map<string, string>();
  for (const { fileName, item } of entries) {
    const other = seen.get(item.slug);
    if (other) throw new Error(`[news] ${fileName} e ${other} têm o mesmo slug "${item.slug}"`);
    seen.set(item.slug, fileName);
  }

  return entries;
}

// Mais recente primeiro, sem os rascunhos
export function getAllNews(): NewsItem[] {
  return readAllNews()
    .filter(({ draft }) => !draft)
    .map(({ item }) => item)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return getAllNews().find((item) => item.slug === slug);
}
