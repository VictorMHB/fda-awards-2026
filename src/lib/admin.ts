import { getServerUser } from "@/lib/session";

export async function requireAdmin() {
  const user = await getServerUser();
  if (!user || user.uid !== process.env.ADMIN_UID) {
    return null;
  }
  return user;
}