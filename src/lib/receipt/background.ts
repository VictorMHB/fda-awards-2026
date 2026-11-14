import { createColorTools } from "./colors";
import {
  RECEIPT_HEIGHT,
  RECEIPT_WIDTH,
  type ReceiptTheme,
} from "./types";

function drawNebula(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  color: string,
  alpha: number,
  rgba: (color: string, alpha: number) => string,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(rx, ry);

  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  gradient.addColorStop(0, rgba(color, alpha));
  gradient.addColorStop(0.7, rgba(color, 0));

  ctx.fillStyle = gradient;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
}

type Star = { x: number; y: number; radius: number; alpha: number; primary?: boolean };

function drawTiledStars(
  ctx: CanvasRenderingContext2D,
  theme: ReceiptTheme,
  rgba: (color: string, alpha: number) => string,
): void {
  const layers: { width: number; height: number; stars: Star[]; opacity: number }[] = [
    {
      width: 340,
      height: 320,
      opacity: 0.9,
      stars: [
        { x: 20, y: 30, radius: 1.2, alpha: 1 },
        { x: 90, y: 140, radius: 1, alpha: 0.8 },
        { x: 160, y: 60, radius: 1.6, alpha: 1 },
        { x: 230, y: 210, radius: 1, alpha: 0.7 },
        { x: 300, y: 100, radius: 1.2, alpha: 1 },
        { x: 60, y: 250, radius: 1.6, alpha: 0.8 },
        { x: 270, y: 290, radius: 1, alpha: 1 },
      ],
    },
    {
      width: 470,
      height: 410,
      opacity: 0.78,
      stars: [
        { x: 50, y: 70, radius: 1, alpha: 0.85 },
        { x: 180, y: 20, radius: 1.4, alpha: 1 },
        { x: 120, y: 190, radius: 1, alpha: 0.7 },
        { x: 330, y: 160, radius: 1.4, alpha: 1 },
        { x: 400, y: 300, radius: 1, alpha: 0.8 },
        { x: 250, y: 340, radius: 1.6, alpha: 1, primary: true },
      ],
    },
  ];

  for (const layer of layers) {
    for (let tileY = -layer.height; tileY < RECEIPT_HEIGHT + layer.height; tileY += layer.height) {
      for (let tileX = -layer.width; tileX < RECEIPT_WIDTH + layer.width; tileX += layer.width) {
        for (const star of layer.stars) {
          const x = tileX + star.x;
          const y = tileY + star.y;
          if (x < 0 || x > RECEIPT_WIDTH || y < 0 || y > RECEIPT_HEIGHT) continue;

          // Equivale ao mask-image: preto até 45%, desaparecendo até a base.
          const fade = y <= RECEIPT_HEIGHT * 0.45
            ? 1
            : Math.max(0, 1 - (y - RECEIPT_HEIGHT * 0.45) / (RECEIPT_HEIGHT * 0.55));
          if (fade <= 0) continue;

          ctx.fillStyle = rgba(
            star.primary ? theme.primary : "#ffffff",
            star.alpha * layer.opacity * fade,
          );
          ctx.beginPath();
          ctx.arc(x, y, star.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }
}

function drawBottomDots(
  ctx: CanvasRenderingContext2D,
  rgba: (color: string, alpha: number) => string,
): void {
  const top = RECEIPT_HEIGHT * 0.45;

  for (let y = top; y < RECEIPT_HEIGHT; y += 10) {
    const progress = (y - top) / (RECEIPT_HEIGHT - top);
    // A máscara fica totalmente visível perto da base e some acima dela.
    const mask = Math.max(0, Math.min(1, (progress - 0.15) / 0.85));
    if (mask <= 0) continue;

    ctx.fillStyle = rgba("#ffffff", 0.18 * mask);
    ctx.beginPath();

    for (let x = 0; x < RECEIPT_WIDTH; x += 10) {
      ctx.moveTo(x + 1.5, y);
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    }

    ctx.fill();
  }
}

function drawTopLeftDots(
  ctx: CanvasRenderingContext2D,
  rgba: (color: string, alpha: number) => string,
): void {
  const radius = 643;

  for (let y = 0; y < RECEIPT_HEIGHT * 0.6; y += 10) {
    for (let x = 0; x < RECEIPT_WIDTH * 0.4; x += 10) {
      const distance = Math.hypot(x, y);
      if (distance >= radius) continue;

      const mask = 1 - distance / radius;
      ctx.fillStyle = rgba("#ffffff", 0.12 * mask);
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawSpark(
  ctx: CanvasRenderingContext2D,
  options: { x: number; y: number; size: number; color: string },
  rgba: (color: string, alpha: number) => string,
): void {
  const { x, y, size, color } = options;
  const shape: [number, number][] = [
    [50, 0], [60, 40], [100, 50], [60, 60],
    [50, 100], [40, 60], [0, 50], [40, 40],
  ];

  ctx.fillStyle = rgba(color, 0.85);
  ctx.beginPath();

  shape.forEach(([px, py], index) => {
    const pointX = x - size / 2 + (px / 100) * size;
    const pointY = y - size / 2 + (py / 100) * size;
    if (index === 0) ctx.moveTo(pointX, pointY);
    else ctx.lineTo(pointX, pointY);
  });

  ctx.closePath();
  ctx.fill();
}

function drawShootingStar(
  ctx: CanvasRenderingContext2D,
  rgba: (color: string, alpha: number) => string,
): void {
  ctx.save();
  ctx.translate(RECEIPT_WIDTH * 0.28, RECEIPT_HEIGHT * 0.09);
  ctx.rotate((28 * Math.PI) / 180);

  const length = 210;
  const gradient = ctx.createLinearGradient(0, 0, length, 0);
  gradient.addColorStop(0, rgba("#ffffff", 0));
  gradient.addColorStop(1, rgba("#ffffff", 0.9));

  ctx.fillStyle = gradient;
  ctx.fillRect(0, -1, length, 2);
  ctx.restore();
}

/** Reproduz o céu estático do .vote-hero no Canvas do comprovante. */
export function drawReceiptBackground(
  ctx: CanvasRenderingContext2D,
  theme: ReceiptTheme,
): void {
  const { rgba } = createColorTools();

  // Fundo base: linear-gradient(180deg, dark-bg, background).
  const sky = ctx.createLinearGradient(0, 0, 0, RECEIPT_HEIGHT);
  sky.addColorStop(0, theme.dark);
  sky.addColorStop(1, theme.background);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, RECEIPT_WIDTH, RECEIPT_HEIGHT);

  // As duas nebulosas suaves do vote-hero.
  drawNebula(
    ctx,
    RECEIPT_WIDTH * 0.82,
    RECEIPT_HEIGHT * 0.3,
    RECEIPT_WIDTH * 0.45,
    RECEIPT_HEIGHT * 0.55,
    theme.primary,
    0.16,
    rgba,
  );
  drawNebula(
    ctx,
    RECEIPT_WIDTH * 0.12,
    RECEIPT_HEIGHT * 0.75,
    RECEIPT_WIDTH * 0.55,
    RECEIPT_HEIGHT * 0.6,
    theme.secondary,
    0.28,
    rgba,
  );

  // Padrões estrelados em duas escalas.
  drawTiledStars(ctx, theme, rgba);

  // Halftone na base e no canto superior esquerdo.
  drawBottomDots(ctx, rgba);
  drawTopLeftDots(ctx, rgba);

  // Brilhos de quatro pontas. Distribuição fixa para manter o comprovante estável.
  const sparks = [
    { x: 150, y: 140, size: 56, color: theme.foreground },
    { x: 900, y: 190, size: 44, color: theme.primary },
    { x: 980, y: 80, size: 34, color: theme.foreground },
    { x: 700, y: 110, size: 28, color: theme.foreground },
    { x: 110, y: 1190, size: 48, color: theme.primary },
    { x: 880, y: 1150, size: 60, color: theme.foreground },
    { x: 520, y: 1250, size: 30, color: theme.foreground },
  ];

  for (const spark of sparks) drawSpark(ctx, spark, rgba);

  // Estrela cadente estática: a animação CSS não existe em uma imagem PNG.
  drawShootingStar(ctx, rgba);
}

/** Linha inferior de 3px usada pelo ::after do .vote-hero. */
export function drawReceiptAccentLine(
  ctx: CanvasRenderingContext2D,
  theme: ReceiptTheme,
): void {
  const gradient = ctx.createLinearGradient(0, 0, RECEIPT_WIDTH, 0);
  gradient.addColorStop(0, theme.primary);
  gradient.addColorStop(1, theme.secondary);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, RECEIPT_HEIGHT - 3, RECEIPT_WIDTH, 3);
}
