"use client";

import { useId, useState } from "react";
import { Plus } from "pixelarticons/react";
import { toast } from "sonner";
import AeroButton from "@/components/ui/AeroButton";
import Card from "@/components/ui/Card";
import { fill, getVotersContent } from "@/lib/content/admin/voters";
import type { ReportCategory, VoterRow, VoterStatus } from "@/lib/results/computeVoters";

const t = getVotersContent();

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  dateStyle: "short",
  timeStyle: "short",
});

// Classes escritas por inteiro, senão o Tailwind não as gera
export const STATUS_CLASS: Record<VoterStatus, string> = {
  confirmed: "tag",
  draft: "tag tag--muted",
  annulled: "tag tag--muted shadow-[inset_0_0_0_2px_var(--color-danger)]",
};

type VoterCardProps = {
  voter: VoterRow;
  position: number;
  categories: ReportCategory[];
};

export default function VoterCard({ voter, position, categories }: VoterCardProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelId = useId();
  const name = voter.name || t.voter.noName;

  async function copyUid() {
    try {
      await navigator.clipboard.writeText(voter.uid);
      toast.success(t.voter.copied);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t.voter.copyError);
    }
  }

  return (
    <Card
      as="li"
      variant="window"
      title={fill(t.voter.barLabel, { n: String(position).padStart(2, "0") })}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-11 w-full items-start justify-between gap-3 p-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary md:p-5"
      >
        <span className="min-w-0 space-y-1">
          <span className="block">
            <span className={STATUS_CLASS[voter.status]}>{t.status[voter.status]}</span>
          </span>
          <span className="block font-bold text-foreground wrap-anywhere">{name}</span>
          <span className="block text-sm text-foreground/80 wrap-anywhere">{voter.email}</span>
          <span className="block text-xs text-foreground/70">
            {voter.confirmedAt
              ? fill(t.voter.confirmedAt, { date: dateFormat.format(voter.confirmedAt) })
              : t.voter.notConfirmed}
            {" · "}
            {fill(t.voter.progress, { done: voter.votedCount, total: categories.length })}
          </span>
        </span>
        <Plus
          aria-hidden="true"
          className={`faq-icon size-6 shrink-0 text-primary ${open ? "faq-icon--open" : ""}`}
        />
      </button>

      <div id={panelId} hidden={!open} className="border-t border-foreground/15 p-4 md:p-5">
        {open && (
          <>
            {voter.status === "annulled" && (
              <p className="mb-4 border-l-[3px] border-danger bg-danger/10 p-3 text-sm">
                {t.annulledNote}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <p className="min-w-0 text-sm">
                <span className="font-semibold text-foreground/70">{t.voter.uid}: </span>
                <code className="break-all font-mono">{voter.uid}</code>
              </p>
              <AeroButton variant="blue" size="sm" onClick={copyUid}>
                {t.voter.copy}
              </AeroButton>
            </div>
            <p role="status" className="sr-only">
              {copied ? t.voter.copied : ""}
            </p>

            {/* voter.choices segue a mesma ordem de categories */}
            <ol className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {categories.map((category, index) => {
                const choice = voter.choices[index];
                return (
                  <li key={category.id} className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                      {category.name}
                    </p>
                    {choice?.kind === "voted" ? (
                      <p className="mt-0.5 font-bold text-foreground wrap-anywhere">
                        {choice.nomineeName}
                      </p>
                    ) : choice?.kind === "removed" ? (
                      <p className="mt-0.5 font-bold text-primary">{t.choice.removed}</p>
                    ) : (
                      <p className="mt-0.5 text-foreground/60">{t.choice.none}</p>
                    )}
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </div>
    </Card>
  );
}