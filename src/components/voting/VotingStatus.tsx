import Link from "next/link";
import { getVotingStateContent, type VotingState } from "@/lib/services/voting";
import LoginButton from "./LoginButton";

type Props = { state: VotingState; firstName?: string };

export default function VotingStatus({ state, firstName }: Props) {
  const content = getVotingStateContent(state, firstName);

  return (
    <div role="status" className="glass info-card p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
        {content.label}
      </p>
      <h2 className="mt-3 font-display text-2xl text-foreground md:text-3xl">
        {content.title}
      </h2>
      <p className="mt-2 text-foreground/80">{content.description}</p>

      {state === "login" && content.action && (
        <div className="mt-6"><LoginButton label={content.action} /></div>
      )}
      {state === "ready" && content.action && (
        <Link href="/votacao/votar" className={/* mesmas classes do botão do VotingCta */ ""}>
          {content.action}
        </Link>
      )}
    </div>
  );
}