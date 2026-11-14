
import type { ReceiptTheme, Stops } from "./types";

type LetterSpacingContext = CanvasRenderingContext2D & {
  letterSpacing: string;
};

type LogoPart = {
  text: string;
  stops: Stops;
};

function measureWithTracking(
  ctx: CanvasRenderingContext2D,
  text: string,
  tracking: number,
): number {
  return (
    ctx.measureText(text).width +
    Math.max(0, Array.from(text).length - 1) * tracking
  );
}

/** Desenha uma palavra com contorno marinho, extrusão e face metálica. */
function drawLogoWord(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  baselineY: number,
  size: number,
  stops: Stops,
  ink: string,
  tracking: number,
): void {
  const textCtx = ctx as LetterSpacingContext;
  const metrics = ctx.measureText(text);
  const strokeWidth = size * 0.16;
  const skew = Math.tan((-8 * Math.PI) / 180);

  ctx.save();
  ctx.translate(x, baselineY);

  // Degradê em coordenadas locais da palavra.
  const top = -metrics.actualBoundingBoxAscent;
  const bottom = metrics.actualBoundingBoxDescent;

  const face = ctx.createLinearGradient(0, top, 0, bottom);

  for (const [position, color] of stops) {
    face.addColorStop(position, color);
  }

  // Inclinação equivalente ao skewX(-8deg).
  ctx.transform(1, 0, skew, 1, 0, 0);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.miterLimit = 2;
  textCtx.letterSpacing = `${tracking}px`;

  // Extrusão escura.
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;

  for (const offset of [0.06, 0.045, 0.03, 0.015]) {
    const distance = size * offset;

    ctx.strokeText(text, distance, distance);
    ctx.fillText(text, distance, distance);
  }

  // Contorno frontal.
  ctx.strokeText(text, 0, 0);

  // Face metálica.
  ctx.fillStyle = face;
  ctx.fillText(text, 0, 0);

  ctx.restore();
}

/** Monta FDA + AWARDS + 2026 e ajusta o tamanho ao espaço disponível. */
export function drawReceiptLogo(
  ctx: CanvasRenderingContext2D,
  options: {
    titleFda: string;
    titleAwards: string;
    titleYear: string;
    baselineY: number;
    centerX: number;
    maxWidth: number;
    theme: ReceiptTheme;
  },
): void {
  const {
    titleFda,
    titleAwards,
    titleYear,
    baselineY,
    centerX,
    maxWidth,
    theme,
  } = options;

  // FDA e 2026: degradê pêssego.
  // Transição antecipada para evitar que o laranja fique concentrado na base.
  const primaryStops: Stops = [
    [0, "#fff8ef"],
    [0.18, "#ffe2c6"],
    [0.36, theme.primary],
    [0.38, "#e48c50"],
    [0.68, "#f6b07c"],
    [1, "#ffd6b3"],
  ];

  // AWARDS: degradê prateado.
  const secondaryStops: Stops = [
    [0, "#ffffff"],
    [0.25, "#eef3f6"],
    [0.40, "#b6c6d4"],
    [0.42, "#8ba1b6"],
    [0.72, "#dbe3e9"],
    [1, "#ffffff"],
  ];

  const parts: LogoPart[] = [
    { text: titleFda, stops: primaryStops },
    { text: titleAwards, stops: secondaryStops },
    { text: titleYear, stops: primaryStops },
  ];

  const textCtx = ctx as LetterSpacingContext;

  const gapRatio = 0.3;

  let fontSize = 96;
  let tracking = 0;
  let gap = 0;
  let widths: number[] = [];
  let totalWidth = 0;

  // Ajusta o tamanho para caber no cartão.
  for (let pass = 0; pass < 16; pass++) {
    ctx.font = `${theme.logoFontStyle} ${theme.logoFontWeight} ${fontSize}px ${theme.logoFont}`;

    textCtx.letterSpacing = "0px";

    tracking = fontSize * 0.03;

    widths = parts.map((part) =>
      measureWithTracking(ctx, part.text, tracking),
    );

    gap = fontSize * gapRatio;

    totalWidth =
      widths.reduce((sum, width) => sum + width, 0) +
      gap * 2;

    // Reserva espaço para inclinação, contorno e extrusão.
    if (totalWidth + fontSize * 0.42 <= maxWidth) {
      break;
    }

    fontSize = Math.max(30, Math.floor(fontSize * 0.94));
  }

  let x = centerX - totalWidth / 2;

  parts.forEach((part, index) => {
    ctx.font = `${theme.logoFontStyle} ${theme.logoFontWeight} ${fontSize}px ${theme.logoFont}`;

    drawLogoWord(
      ctx,
      part.text,
      x,
      baselineY,
      fontSize,
      part.stops,
      "#0b1430",
      tracking,
    );

    x += widths[index] + gap;
  });

  // Reseta o espaçamento para os próximos desenhos.
  textCtx.letterSpacing = "0px";
}
