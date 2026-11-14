/** Quebra um texto em linhas sem ultrapassar a largura ou a quantidade máxima. */
export function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const fits = (value: string) => ctx.measureText(value).width <= maxWidth;
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  const splitLongWord = (word: string): string => {
    let chunk = "";

    for (const character of Array.from(word)) {
      if (fits(chunk + character)) {
        chunk += character;
      } else {
        if (chunk) lines.push(chunk);
        chunk = character;
      }
    }

    return chunk;
  };

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (fits(candidate)) {
      current = candidate;
      continue;
    }

    if (current) lines.push(current);
    current = fits(word) ? word : splitLongWord(word);
  }

  if (current) lines.push(current);

  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1];

    while (last.length > 0 && !fits(`${last}…`)) {
      last = last.slice(0, -1);
    }

    kept[maxLines - 1] = `${last.trimEnd()}…`;
    return kept;
  }

  return lines;
}

export function formatConfirmedAt(ms: number): { data: string; hora: string } {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(ms));

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    data: `${get("day")}/${get("month")}/${get("year")}`,
    hora: `${get("hour")}:${get("minute")}`,
  };
}

export function loadReceiptFonts(
  bodyFont: string,
  logoFont: string,
  logoFontWeight: string,
  logoFontStyle: string,
): Promise<void> {
  return (async () => {
    try {
      await Promise.all([
        document.fonts.load(`400 40px ${bodyFont}`),
        document.fonts.load(`700 40px ${bodyFont}`),
        document.fonts.load(`${logoFontStyle} ${logoFontWeight} 96px ${logoFont}`),
      ]);
      await document.fonts.ready;
    } catch {
      // Se uma fonte falhar, o Canvas continua com a fonte de reserva.
    }
  })();
}
