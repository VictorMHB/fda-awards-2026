import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase-admin";

export async function getServerUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;

  const adminAuth = getAdminAuth();
  try {
    return await adminAuth.verifySessionCookie(session, true);
  } catch {
    return null;
  }
}
