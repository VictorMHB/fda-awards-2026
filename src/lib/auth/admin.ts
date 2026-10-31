import { getServerUser } from "@/lib/auth/session";
import { getAdminAuth } from "@/lib/firebase/admin";

// ADMIN_UIDS="uid1,uid2". Aceita ADMIN_UID (um só) por compatibilidade.
function adminUids(): string[] {
  const raw = process.env.ADMIN_UIDS ?? process.env.ADMIN_UID ?? "";
  return raw
    .split(",")
    .map((uid) => uid.trim())
    .filter(Boolean);
}

export function isAdminUid(uid: string) {
  return adminUids().includes(uid);
}

// Páginas: usa o cookie de sessão
export async function requireAdmin() {
  const user = await getServerUser();
  if (!user || !isAdminUid(user.uid)) return null;
  return user;
}

export async function requireAdminFromRequest(
  request: Request,
  { checkRevoked = true }: { checkRevoked?: boolean } = {},
) {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;

  try {
    const decoded = await getAdminAuth().verifyIdToken(token, checkRevoked);
    return isAdminUid(decoded.uid) ? decoded : null;
  } catch {
    return null;
  }
}