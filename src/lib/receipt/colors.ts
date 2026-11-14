import type { ColorTools, ReceiptTheme, Rgb } from "./types";

/** Lê as cores e fontes do tema ativo do site. */
export function getReceiptTheme(): ReceiptTheme {
  const root = getComputedStyle(document.documentElement);
  const body = getComputedStyle(document.body);
  const read = (variable: string) => root.getPropertyValue(variable).trim();

  // A face da logo costuma carregar a tipografia efetivamente usada no wordmark.
  const logoElement =
    document.querySelector<HTMLElement>(".logo-aero-face") ??
    document.querySelector<HTMLElement>(".logo-aero");
  const logoStyle = logoElement ? getComputedStyle(logoElement) : null;

  const bodyFont = body.fontFamily || "sans-serif";

  return {
    primary: read("--color-primary") || "#f6b07c",
    secondary: read("--color-secondary") || "#8ba1b6",
    background: read("--color-background") || "#18304d",
    dark: read("--color-dark-bg") || "#101b32",
    foreground: read("--color-foreground") || "#e7edf2",
    bodyFont,
    logoFont:
      logoStyle?.fontFamily || read("--font-display") || bodyFont,
    logoFontWeight: logoStyle?.fontWeight || "700",
    logoFontStyle: logoStyle?.fontStyle || "normal",
  };
}

/** Converte qualquer cor CSS aceita pelo navegador para RGB e cria rgba(). */
export function createColorTools(): ColorTools {
  const sample = document.createElement("canvas");
  sample.width = 1;
  sample.height = 1;

  const context = sample.getContext("2d", { willReadFrequently: true });
  const cache = new Map<string, Rgb>();

  const toRgb = (color: string): Rgb => {
    const cached = cache.get(color);
    if (cached) return cached;

    let rgb: Rgb = [255, 255, 255];

    if (context) {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = "#ffffff";
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);

      const data = context.getImageData(0, 0, 1, 1).data;
      rgb = [data[0], data[1], data[2]];
    }

    cache.set(color, rgb);
    return rgb;
  };

  const rgba = (color: string, alpha: number) => {
    const [r, g, b] = toRgb(color);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return { rgba };
}
