import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/session";
import ForcedPhaseBanner from "@/components/dev/ForcedPhaseBanner";
import { getPhase } from "@/lib/content/shared/phases";
import VotacaoClient from "./VotacaoClient";

export default async function VotePage() {
  const user = await getServerUser();
  if (!user) redirect("/votacao?reason=login");

  if (getPhase(Date.now()) !== "votacao") redirect("/votacao");

  return (
    <>
      <ForcedPhaseBanner />
      <VotacaoClient />
    </>
  );
}