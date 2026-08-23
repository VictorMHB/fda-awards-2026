import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  return <AdminClient />;
}