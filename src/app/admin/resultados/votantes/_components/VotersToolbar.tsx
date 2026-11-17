"use client";

import { useId } from "react";
import AeroButton from "@/components/ui/AeroButton";
import { fill, getVotersContent } from "@/lib/content/admin/voters";
import type { VotersReport } from "@/lib/results/computeVoters";

const t = getVotersContent();

export type StatusFilter = "all" | "confirmed" | "draft" | "annulled";

const FILTERS = ["all", "confirmed", "draft", "annulled"] as const;

const INPUT =
  "min-h-11 w-full border border-secondary bg-dark-bg px-3 py-2 text-foreground placeholder:text-foreground/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

type VotersToolbarProps = {
  filter: StatusFilter;
  onFilter: (filter: StatusFilter) => void;
  query: string;
  onQuery: (query: string) => void;
  totals: VotersReport["totals"];
  shown: number;
};

export default function VotersToolbar({
  filter,
  onFilter,
  query,
  onQuery,
  totals,
  shown,
}: VotersToolbarProps) {
  const searchId = useId();

  return (
    <div className="mt-6 space-y-4">
      <div role="group" aria-label={t.filters.label} className="flex flex-wrap gap-2">
        {FILTERS.map((key) => (
          <AeroButton
            key={key}
            size="sm"
            variant={filter === key ? "primary" : "blue"}
            aria-pressed={filter === key}
            onClick={() => onFilter(key)}
          >
            {t.filters[key]} ({totals[key]})
          </AeroButton>
        ))}
      </div>

      <div className="max-w-md">
        <label htmlFor={searchId} className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/70">
          {t.search.label}
        </label>
        <input
          id={searchId}
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={t.search.placeholder}
          className={`${INPUT} mt-1`}
        />
      </div>

      {/* Avisa o leitor de tela quando o filtro muda a quantidade */}
      <p role="status" className="text-sm text-foreground/70">
        {fill(t.search.result, { shown, total: totals.all })}
      </p>
    </div>
  );
}