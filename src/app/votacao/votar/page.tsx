import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/session";
import { getPhase } from "@/lib/content/phases";
import VotacaoClient from "./VotacaoClient";

export default async function VotePage() {
  const user = await getServerUser();
  if (!user) redirect("/votacao?reason=login");

  const isOpen = getPhase(Date.now()) === "votacao";
  if (!isOpen && process.env.NODE_ENV !== "development") redirect("/votacao");

  return <VotacaoClient />;
}