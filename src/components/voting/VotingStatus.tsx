import AeroButton from "@/components/ui/AeroButton";
import Card from "@/components/ui/Card";
import { getVotingStateContent, type VotingState } from "@/lib/services/voting";
import LoginButton from "./LoginButton";

type Props = { state: VotingState; firstName?: string };

export default function VotingStatus({ state, firstName }: Props) {
  const content = getVotingStateContent(state, firstName);

  // O rótulo ("Status") vai na barra da janela
  return (
    <Card variant="window" title={content.label} role="status">
      <div className="p-6 md:p-8">
        <h2 className="font-display text-2xl text-foreground md:text-3xl">
          {content.title}
        </h2>
        <p className="mt-2 text-foreground/80">{content.description}</p>

        {state === "login" && content.action && (
          <div className="mt-6">
            <LoginButton label={content.action} />
          </div>
        )}
        {state === "ready" && content.action && (
          <div className="mt-6">
            <AeroButton href="/votacao/votar" shine>
              {content.action}
            </AeroButton>
          </div>
        )}
      </div>
    </Card>
  );
}