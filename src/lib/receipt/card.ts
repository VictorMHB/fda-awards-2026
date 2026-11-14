import { createColorTools } from "./colors";
import { drawReceiptLogo } from "./logo";
import { formatConfirmedAt, wrapLines } from "./text";
import {
  RECEIPT_HEIGHT,
  RECEIPT_WIDTH,
  type ReceiptParams,
  type ReceiptTheme,
} from "./types";

const NAME_LINE_HEIGHT = 64;

/** Desenha o cartão, logo, status, nome e data do comprovante. */
export function drawReceiptCard(
  ctx: CanvasRenderingContext2D,
  params: ReceiptParams,
  theme: ReceiptTheme,
): void {
  const { rgba } = createColorTools();
  const { name, confirmedAt, content } = params;

  // Mede o nome antes de calcular a altura do cartão.
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = `700 56px ${theme.bodyFont}`;
  const nameLines = wrapLines(ctx, name, 780, 3);

  const relative = {
    bar: 56,
    title: 175,
    rule: 250,
    status: 320,
    name: 405,
  };

  const dateRelative =
    relative.name + (Math.max(nameLines.length, 1) - 1) * NAME_LINE_HEIGHT + 85;
  const cardHeight = dateRelative + 70;
  const cardWidth = 900;
  const cardX = (RECEIPT_WIDTH - cardWidth) / 2;
  const cardY = Math.round((RECEIPT_HEIGHT - cardHeight) / 2);

  // Corpo de vidro azul-marinho, mantendo os cantos quadrados.
  ctx.fillStyle = rgba(theme.dark, 0.82);
  ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

  ctx.fillStyle = rgba(theme.foreground, 0.08);
  ctx.fillRect(cardX, cardY, cardWidth, cardHeight / 2);

  ctx.strokeStyle = rgba(theme.foreground, 0.25);
  ctx.lineWidth = 2;
  ctx.strokeRect(cardX + 1, cardY + 1, cardWidth - 2, cardHeight - 2);

  // Barra superior e três quadrados decorativos.
  ctx.fillStyle = rgba(theme.foreground, 0.12);
  ctx.fillRect(cardX, cardY, cardWidth, relative.bar);

  ctx.fillStyle = rgba(theme.foreground, 0.6);
  for (let index = 0; index < 3; index++) {
    ctx.fillRect(
      cardX + cardWidth - 28 - 16 - index * 28,
      cardY + (relative.bar - 16) / 2,
      16,
      16,
    );
  }

  // Logo principal com a mesma linguagem do header da Voting Page.
  drawReceiptLogo(ctx, {
    titleFda: content.titleFda,
    titleAwards: content.titleAwards,
    titleYear: content.titleYear,
    baselineY: cardY + relative.title,
    centerX: RECEIPT_WIDTH / 2,
    maxWidth: cardWidth - 100,
    theme,
  });

  // Filete curto sob o título.
  const ruleWidth = 140;
  const ruleX = (RECEIPT_WIDTH - ruleWidth) / 2;
  const rule = ctx.createLinearGradient(ruleX, 0, ruleX + ruleWidth, 0);
  rule.addColorStop(0, theme.primary);
  rule.addColorStop(1, theme.secondary);
  ctx.fillStyle = rule;
  ctx.fillRect(ruleX, cardY + relative.rule, ruleWidth, 6);

  // Status confirmado.
  const status = content.status.toUpperCase();
  ctx.font = `700 34px ${theme.bodyFont}`;
  ctx.textBaseline = "middle";
  const statusWidth = ctx.measureText(status).width;
  const markerSize = 14;
  const statusGap = 16;
  const statusStart =
    (RECEIPT_WIDTH - (markerSize + statusGap + statusWidth)) / 2;

  ctx.fillStyle = theme.primary;
  ctx.fillRect(
    statusStart,
    cardY + relative.status - markerSize / 2,
    markerSize,
    markerSize,
  );

  ctx.fillStyle = rgba(theme.foreground, 0.75);
  ctx.textAlign = "left";
  ctx.fillText(status, statusStart + markerSize + statusGap, cardY + relative.status);

  // Nome do participante.
  ctx.textAlign = "center";
  ctx.font = `700 56px ${theme.bodyFont}`;
  ctx.fillStyle = theme.foreground;

  nameLines.forEach((line, index) => {
    ctx.fillText(
      line,
      RECEIPT_WIDTH / 2,
      cardY + relative.name + index * NAME_LINE_HEIGHT,
    );
  });

  // Data e horário de confirmação.
  const { data, hora } = formatConfirmedAt(confirmedAt);
  const dateLine = content.dateLine
    .replace("{data}", data)
    .replace("{hora}", hora);

  ctx.font = `400 34px ${theme.bodyFont}`;
  ctx.fillStyle = rgba(theme.foreground, 0.8);
  ctx.fillText(dateLine, RECEIPT_WIDTH / 2, cardY + dateRelative);
}
