import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/session";
import VotacaoClient from "./VotacaoClient";

export const metadata: Metadata = {
  title: "Votação",
};

export default async function VotacaoPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/");
  }

  return <VotacaoClient />;
}
