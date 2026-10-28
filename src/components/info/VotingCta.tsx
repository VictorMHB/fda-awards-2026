"use client";

import Link from "next/link";
import { useAgora } from "@/hooks/useAgora";
import { getPhase } from "@/lib/content/shared/phases";
import { getVotingCtaLabel } from "@/lib/services/voting";

export default function VotingCta() {
  const agora = useAgora();
  const label = getVotingCtaLabel(agora === 0 ? null : getPhase(agora));

  return (
    <Link
      href="/votacao"
      className="btn-aero inline-flex items-center justify-center px-8 py-4 text-base font-bold uppercase tracking-wider text-dark-bg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      {label}
    </Link>
  );
}
