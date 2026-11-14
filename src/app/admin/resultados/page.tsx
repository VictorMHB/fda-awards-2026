import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import ResultadosClient from "./ResultsClient";

export default async function ResultadosPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  return <ResultadosClient />;
}