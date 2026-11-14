import { drawReceiptAccentLine, drawReceiptBackground } from "./background";
import { drawReceiptCard } from "./card";
import { getReceiptTheme } from "./colors";
import { loadReceiptFonts } from "./text";
import {
  RECEIPT_HEIGHT,
  RECEIPT_WIDTH,
  type ReceiptParams,
} from "./types";

/** Ponto de entrada: gera o comprovante de votação em PNG. */
export async function renderReceipt({
  name,
  confirmedAt,
  content,
}: ReceiptParams): Promise<Blob> {
  const theme = getReceiptTheme();

  await loadReceiptFonts(
    theme.bodyFont,
    theme.logoFont,
    theme.logoFontWeight,
    theme.logoFontStyle,
  );

  const canvas = document.createElement("canvas");
  canvas.width = RECEIPT_WIDTH;
  canvas.height = RECEIPT_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível.");

  drawReceiptBackground(ctx, theme);
  drawReceiptCard(ctx, { name, confirmedAt, content }, theme);
  drawReceiptAccentLine(ctx, theme);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Falha ao gerar a imagem."));
    }, "image/png");
  });
}

export type { ReceiptParams } from "./types";
