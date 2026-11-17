import { NextRequest, NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/admin";
import { getAdminDb } from "@/lib/firebase/admin";
import { computeVoters } from "@/lib/results/computeVoters";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_VOTERS = 1000;
const NO_STORE = { "Cache-Control": "no-store" };

const fail = (error: string, status: number) =>
  NextResponse.json({ error }, { status, headers: NO_STORE });

export async function GET(request: NextRequest) {
  try {
    // Qualquer resultado que não seja um admin confirmado nega o acesso
    if (!(await requireAdminFromRequest(request))) return fail("Não autorizado.", 403);

    const db = getAdminDb();
    const [categoriesSnap, votersSnap] = await Promise.all([
      db.collection("categorias").orderBy("ordem").get(),
      db.collection("votantes").limit(MAX_VOTERS + 1).get(),
    ]);

    const categories = categoriesSnap.docs.map((doc) => {
      const data = doc.data();
      const nominees: unknown[] = Array.isArray(data.indicados) ? data.indicados : [];
      return {
        id: doc.id,
        nome: typeof data.nome === "string" ? data.nome : doc.id,
        indicados: nominees.flatMap((item) => {
          const n = item as { id?: unknown; nome?: unknown };
          return typeof n?.id === "string"
            ? [{ id: n.id, nome: typeof n.nome === "string" ? n.nome : n.id }]
            : [];
        }),
      };
    });

    const truncated = votersSnap.size > MAX_VOTERS;
    const raw = votersSnap.docs
      .slice(0, MAX_VOTERS)
      .map((doc) => ({ uid: doc.id, data: doc.data() as Record<string, unknown> }));

    const report = computeVoters(categories, raw, { generatedAt: Date.now(), truncated });
    return NextResponse.json(report, { headers: NO_STORE });
  } catch (err) {
    console.error("Falha ao listar votantes:", err);
    return fail("Não foi possível carregar os votantes.", 500);
  }
}