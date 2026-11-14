import data from "@/data/voting/receipt.json";

export type ReceiptContent = typeof data;

export function getReceiptContent(): ReceiptContent {
  return data;
}