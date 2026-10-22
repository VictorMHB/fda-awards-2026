import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/session";
import VotacaoClient from "./VotacaoClient";

export default async function VotacaoPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/");
  }

  return <VotacaoClient />;
}