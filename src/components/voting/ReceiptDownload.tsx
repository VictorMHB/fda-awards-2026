"use client";

import { useState } from "react";
import { toast } from "sonner";
import AeroButton from "@/components/ui/AeroButton";
import { AeroText } from "@/components/ui/AeroText";
import Card from "@/components/ui/Card";
import { getReceiptContent } from "@/lib/content/receipt";
import { renderReceipt } from "@/lib/receipt/renderReceipt";

type ReceiptDownloadProps = {
  name: string;
  confirmedAt: number;
};

export default function ReceiptDownload({ name, confirmedAt }: ReceiptDownloadProps) {
  const content = getReceiptContent();
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await renderReceipt({
        name: name.trim() || content.fallbackName,
        confirmedAt,
        content,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = content.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      toast.error(content.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="px-6 pb-16 md:pb-24">
      <div className="mx-auto max-w-3xl">
        {/* O rótulo da barra é decorativo (aria-hidden); o título abaixo carrega o texto acessível */}
        <Card variant="window" title={content.windowTitle}>
          <div className="p-6 md:p-8">
            <h2>
              <AeroText className="block py-0 text-2xl leading-[1.35] md:text-4xl">
                {content.heading}
              </AeroText>
            </h2>
            <p className="mt-3 max-w-xl text-foreground/80">{content.hint}</p>
            <div className="mt-6">
              <AeroButton variant="blue" disabled={busy} onClick={handleDownload}>
                {busy ? content.busy : content.button}
              </AeroButton>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}