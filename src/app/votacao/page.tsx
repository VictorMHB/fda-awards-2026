import type { Metadata } from "next";
import { AeroText } from "@/components/ui/AeroText";
import VotingSection from "@/components/info/VotingSection";
import VotingStatus from "@/components/voting/VotingStatus";
import { getServerUser } from "@/lib/auth/session";
import { getPhase } from "@/lib/content/phases";
import { getVotingHero, getVotingNotice, getVotingState } from "@/lib/services/voting";

export const metadata: Metadata = { title: "Votação | FDA Awards 2026" };

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
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="uppercase">
            <AeroText variant="primary" className="block text-3xl md:text-5xl">
              {hero.title}
            </AeroText>
          </h1>
          <p className="mt-4 text-foreground/80">{hero.subtitle}</p>

          {notice && (
            <p role="alert" className="mt-6 border-l-[3px] border-primary bg-primary/10 p-4">
              {notice}
            </p>
          )}

          <div className="mt-8">
            <VotingStatus state={state} firstName={firstName} />
          </div>
        </div>
      </section>

      <VotingSection showCta={false} />
    </main>
  );
}