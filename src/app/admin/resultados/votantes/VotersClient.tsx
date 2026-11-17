"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AeroButton from "@/components/ui/AeroButton";
import { AeroText } from "@/components/ui/AeroText";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { fill, getVotersContent } from "@/lib/content/admin/voters";
import type { VotersReport } from "@/lib/results/computeVoters";
import { fetchVoters } from "@/lib/services/adminVoters";
import CategoryVotes from "./_components/CategoryVotes"; 
import VoterCard from "./_components/VoterCard";
import VotersToolbar, { type StatusFilter } from "./_components/VotersToolbar";

const t = getVotersContent();

const timeFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  hour: "2-digit",
  minute: "2-digit",
});

// Sem acento e em minúsculas, para a busca
const fold = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const SUMMARY_KEYS = ["all", "confirmed", "draft", "annulled"] as const;

type View = "voters" | "categories";

export default function VotersClient() {
  const { user, loading: authLoading } = useAuth();
  const [report, setReport] = useState<VotersReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [version, setVersion] = useState(0);
  const [view, setView] = useState<View>("voters");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  // setState só dentro dos callbacks da promise (regra set-state-in-effect)
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    user
      .getIdToken()
      .then(fetchVoters)
      .then((data) => {
        if (cancelled) return;
        setReport(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : t.states.error;
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, version]);

  function refresh() {
    setBusy(true);
    setVersion((v) => v + 1);
  }

  const visible = useMemo(() => {
    if (!report) return [];
    const needle = fold(query.trim());
    return report.voters.filter(
      (voter) =>
        (filter === "all" || voter.status === filter) &&
        (needle === "" || fold(`${voter.name} ${voter.email}`).includes(needle)),
    );
  }, [report, filter, query]);

  if (!authLoading && !user) {
    return (
      <main className="px-6 py-10 md:py-16">
        <p role="alert" className="mx-auto max-w-3xl border-l-[3px] border-primary bg-primary/10 p-4">
          {t.states.signedOut}
        </p>
      </main>
    );
  }

  return (
    <main className="px-6 py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <h1>
          <AeroText className="block py-0 text-3xl leading-[1.35] md:text-5xl">{t.title}</AeroText>
        </h1>
        <p className="mt-3 max-w-2xl text-foreground/80">{t.description}</p>

        <div className="mt-6 mf-8 flex flex-wrap items-center gap-3">
          <AeroButton href="/admin/resultados" variant="blue" size="sm">
            <span aria-hidden="true">← </span>
            {t.back}
          </AeroButton>
          <AeroButton size="sm" shine disabled={busy} onClick={refresh}>
            {busy ? t.refreshing : t.refresh}
          </AeroButton>
          {report && (
            <p className="text-sm text-foreground/70">
              {fill(t.updatedAt, { time: timeFormat.format(report.generatedAt) })}
            </p>
          )}
        </div>

        {busy && !report && (
          <p role="status" className="mt-8 text-foreground/80">
            {t.states.loading}
          </p>
        )}

        {error && !report && (
          <p role="alert" className="mt-8 border-l-[3px] border-primary bg-primary/10 p-4">
            {error}
          </p>
        )}

        {report && (
          <>
            <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {SUMMARY_KEYS.map((key) => (
                <Card key={key} as="li" variant="stat" className="px-4 py-5">
                  <p className="font-display text-3xl text-primary md:text-4xl">
                    {report.totals[key]}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground/80">{t.summary[key]}</p>
                </Card>
              ))}
            </ul>

            {report.truncated && (
              <p role="status" className="mt-6 border-l-[3px] border-primary bg-primary/10 p-4">
                {fill(t.truncated, { count: report.voters.length })}
              </p>
            )}

            {/* Visão por categoria (opcional) */}
            <div
              role="group"
              aria-label={t.view.label}
              className="mt-8 flex flex-wrap gap-2"
            >
              <AeroButton
                size="sm"
                variant={view === "voters" ? "primary" : "blue"}
                aria-pressed={view === "voters"}
                onClick={() => setView("voters")}
              >
                {t.view.voters}
              </AeroButton>
              <AeroButton
                size="sm"
                variant={view === "categories" ? "primary" : "blue"}
                aria-pressed={view === "categories"}
                onClick={() => setView("categories")}
              >
                {t.view.categories}
              </AeroButton>
            </div>

            {view === "voters" ? (
              <>
                <VotersToolbar
                  filter={filter}
                  onFilter={setFilter}
                  query={query}
                  onQuery={setQuery}
                  totals={report.totals}
                  shown={visible.length}
                />

                {report.voters.length === 0 ? (
                  <p className="mt-6 text-foreground/80">{t.states.empty}</p>
                ) : visible.length === 0 ? (
                  <p className="mt-6 text-foreground/80">{t.states.noMatch}</p>
                ) : (
                  <ul className="mt-6 grid items-start gap-4 lg:grid-cols-2">
                    {visible.map((voter, index) => (
                      <VoterCard
                        key={voter.uid}
                        voter={voter}
                        position={index + 1}
                        categories={report.categories}
                      />
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <CategoryVotes report={report} />
            )}
          </>
        )}
      </div>
    </main>
  );
}