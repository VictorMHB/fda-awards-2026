import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  return <AdminClient />;
}