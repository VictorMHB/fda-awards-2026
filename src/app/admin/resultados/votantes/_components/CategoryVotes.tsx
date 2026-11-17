"use client";

import { useId, useMemo, useState } from "react";
import { Plus } from "pixelarticons/react";
import Card from "@/components/ui/Card";
import { fill, getVotersContent } from "@/lib/content/admin/voters";
import type { VoterRow, VotersReport } from "@/lib/results/computeVoters";
import { STATUS_CLASS } from "./VoterCard";

const t = getVotersContent();

const SELECT =
  "min-h-11 w-full border border-secondary bg-dark-bg px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

type Group = {
  key: string;
  barLabel: string;
  title: string;
  voters: VoterRow[];
  confirmed: number;
};

export default function CategoryVotes({ report }: { report: VotersReport }) {
  const selectId = useId();
  const [categoryId, setCategoryId] = useState(report.categories[0]?.id ?? "");

  // Se a lista mudou ao atualizar, cai na primeira categoria
  const category = report.categories.find((c) => c.id === categoryId) ?? report.categories[0];

  const groups = useMemo<Group[]>(() => {
    if (!category) return [];
    const index = report.categories.indexOf(category);
    const byNominee = new Map<string, VoterRow[]>(category.nominees.map((n) => [n.id, []]));
    const removed: VoterRow[] = [];

    for (const voter of report.voters) {
      const choice = voter.choices[index];
      if (choice?.kind === "voted") byNominee.get(choice.nomineeId)?.push(voter);
      else if (choice?.kind === "removed") removed.push(voter);
    }

    const countConfirmed = (voters: VoterRow[]) =>
      voters.filter((v) => v.status === "confirmed").length;

    const result: Group[] = category.nominees.map((nominee, i) => {
      const voters = byNominee.get(nominee.id) ?? [];
      return {
        key: nominee.id,
        barLabel: `No.${String(i + 1).padStart(2, "0")}`,
        title: nominee.name,
        voters,
        confirmed: countConfirmed(voters),
      };
    });

    if (removed.length > 0) {
      result.push({
        key: "removed",
        barLabel: t.choice.removed,
        title: t.choice.removed,
        voters: removed,
        confirmed: countConfirmed(removed),
      });
    }
    return result;
  }, [report, category]);

  if (!category) {
    return <p className="mt-6 text-foreground/80">{t.states.noCategories}</p>;
  }

  return (
    <div className="mt-6">
      <div className="max-w-md">
        <label htmlFor={selectId} className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/70">
          {t.byCategory.select}
        </label>
        <select
          id={selectId}
          value={category.id}
          onChange={(e) => setCategoryId(e.target.value)}
          className={`${SELECT} mt-1`}
        >
          {report.categories.map((c, index) => (
            <option key={c.id} value={c.id}>
              {index + 1}. {c.name}
            </option>
          ))}
        </select>
      </div>

      <ul className="mt-6 grid items-start gap-4 lg:grid-cols-2">
        {groups.map((group) => (
          <Card key={group.key} as="li" variant="window" title={group.barLabel}>
            <details className="group">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 p-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary md:p-5 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">
                  <span className="block font-bold text-foreground wrap-anywhere">{group.title}</span>
                  <span className="block text-sm text-foreground/70">
                    {fill(t.byCategory.votes, { count: group.confirmed })}
                  </span>
                </span>
                <Plus
                  aria-hidden="true"
                  className="size-6 shrink-0 text-primary transition-transform group-open:rotate-45 motion-reduce:transition-none"
                />
              </summary>

              {group.voters.length === 0 ? (
                <p className="border-t border-foreground/15 p-4 text-sm text-foreground/70 md:p-5">
                  {t.byCategory.empty}
                </p>
              ) : (
                <ul className="space-y-3 border-t border-foreground/15 p-4 md:p-5">
                  {group.voters.map((voter) => (
                    <li key={voter.uid} className="min-w-0">
                      <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-bold text-foreground wrap-anywhere">
                          {voter.name || t.voter.noName}
                        </span>
                        {voter.status !== "confirmed" && (
                          <span className={STATUS_CLASS[voter.status]}>{t.status[voter.status]}</span>
                        )}
                      </p>
                      <p className="text-sm text-foreground/70 wrap-anywhere">{voter.email}</p>
                    </li>
                  ))}
                </ul>
              )}
            </details>
          </Card>
        ))}
      </ul>
    </div>
  );
}