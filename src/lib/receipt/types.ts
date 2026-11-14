import type { ReceiptContent } from "@/lib/content/receipt";

export const RECEIPT_WIDTH = 1080;
export const RECEIPT_HEIGHT = 1350;

export type Rgb = [number, number, number];
export type Stops = [number, string][];

export type ReceiptParams = {
  name: string;
  confirmedAt: number;
  content: ReceiptContent;
};

export type ReceiptTheme = {
  primary: string;
  secondary: string;
  background: string;
  dark: string;
  foreground: string;
  bodyFont: string;
  logoFont: string;
  logoFontWeight: string;
  logoFontStyle: string;
};

export type ColorTools = {
  rgba: (color: string, alpha: number) => string;
};
