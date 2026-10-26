import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { AeroText } from "@/components/ui/AeroText";
import VotingSection from "@/components/info/VotingSection";
import VotingStatus from "@/components/voting/VotingStatus";
import CategoriesSection from "@/components/voting/CategoriesSection";
import { getServerUser } from "@/lib/auth/session";
import { getPhase } from "@/lib/content/phases";
import {
  getVotingCategoriesContent,
  getVotingHero,
  getVotingNotice,
  getVotingState,
} from "@/lib/services/voting";

export const metadata: Metadata = { title: "Votação | FDA Awards 2026" };

type SparkStyle = CSSProperties & Record<`--${string}`, string>;

// Os menores somem no mobile, pra poupar GPU em aparelho fraco
const SPARKS: { style: SparkStyle; className?: string }[] = [
  { style: { "--s": "1.6rem", "--x": "8%", "--y": "22%", "--d": "2.4s" } },
  {
    style: { "--s": "1rem", "--x": "44%", "--y": "12%", "--d": "3.1s" },
    className: "hidden sm:block",
  },
  { style: { "--s": "2rem", "--x": "90%", "--y": "18%", "--d": "2.8s" } },
  {
    style: {
      "--s": "0.9rem",
      "--x": "72%",
      "--y": "58%",
      "--d": "3.6s",
      "--c": "var(--color-primary)",
    },
    className: "hidden md:block",
  },
  {
    style: {
      "--s": "1.2rem",
      "--x": "26%",
      "--y": "70%",
      "--d": "3.3s",
      "--c": "var(--color-primary)",
    },
    className: "hidden sm:block",
  },
  {
    style: { "--s": "0.8rem", "--x": "58%", "--y": "34%", "--d": "4s" },
    className: "hidden md:block",
  },
];

export default async function VotingPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const [{ reason }, user] = await Promise.all([searchParams, getServerUser()]);
  const state = getVotingState(getPhase(Date.now()), Boolean(user));
  const notice = state === "login" ? getVotingNotice(reason) : null;
  const hero = getVotingHero();
  const firstName = user?.name?.split(" ")[0];

  return (
    <main>
      <section className="vote-hero px-6 py-16 md:py-28">
        {/* Fundo decorativo */}
        <div aria-hidden="true" className="vote-hero__sky" />
        <div
          aria-hidden="true"
          className="vote-hero__stars vote-hero__stars--a"
        />
        <div
          aria-hidden="true"
          className="vote-hero__stars vote-hero__stars--b"
        />
        <div aria-hidden="true" className="vote-hero__dots" />
        <span aria-hidden="true" className="vote-shoot" />
        {SPARKS.map(({ style, className = "" }, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`vote-spark ${className}`}
            style={style}
          />
        ))}

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground/70">
              <span aria-hidden="true" className="size-2 bg-primary" />
              {hero.eyebrow}
            </p>

            <h1 className="mt-4 uppercase">
  <AeroText className="block py-0 text-4xl leading-[1.35] md:text-6xl">
    {hero.titleTop}
  </AeroText>
  <AeroText
    variant="primary"
    className="block py-0 text-4xl leading-[1.35] md:text-6xl"
  >
    {hero.titleHighlight}
  </AeroText>
</h1>

            <div
              aria-hidden="true"
              className="mt-6 h-0.75 w-28 bg-linear-to-r from-primary to-secondary"
            />

            <p className="mt-6 max-w-xl text-base text-foreground/80 md:text-lg">
              {hero.subtitle}
            </p>

            {notice && (
              <p
                role="alert"
                className="mt-6 max-w-xl border-l-[3px] border-primary bg-primary/10 p-4"
              >
                {notice}
              </p>
            )}
          </div>

          <VotingStatus state={state} firstName={firstName} />
        </div>
      </section>

      <VotingSection showCta={false} />

      <CategoriesSection {...getVotingCategoriesContent()} />
    </main>
  );
}
