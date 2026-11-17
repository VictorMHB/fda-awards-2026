import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import VotersClient from "./VotersClient";

export const metadata: Metadata = { title: "Votantes | Admin" };

export default async function VotersPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  return <VotersClient />;
}