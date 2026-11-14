import { NextRequest, NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/admin";
import { getAdminDb } from "@/lib/firebase/admin";
import { computeResultados, type VotanteResumo } from "@/lib/results/computeResults";
import type { Categoria } from "@/types/voto";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  // Fecha por padrão: qualquer falha, exceção ou retorno que não seja um "admin" nega o acesso.
  let admin: unknown = null;
  try {
    admin = await requireAdminFromRequest(request);
  } catch {
    admin = null;
  }
  if (!admin || admin instanceof Response) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403, headers: NO_STORE });
  }

  try {
    const adminDb = getAdminDb();

    // Custo por atualização: 1 leitura por categoria + 1 por votante.
    const [categoriasSnap, votantesSnap] = await Promise.all([
      adminDb.collection("categorias").orderBy("ordem").get(),
      adminDb.collection("votantes").select("confirmado", "anulado", "votos").get(),
    ]);

    const categorias = categoriasSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Categoria[];
    const votantes = votantesSnap.docs.map((doc) => doc.data() as VotanteResumo);

    return NextResponse.json(computeResultados(categorias, votantes, Date.now()), {
      headers: NO_STORE,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao carregar os resultados." },
      { status: 500, headers: NO_STORE },
    );
  }
}