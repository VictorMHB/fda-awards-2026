import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { getPhase } from "@/lib/phases";
import { Categoria, Votante } from "@/types/voto";

export async function POST(request: NextRequest) {
  // Em `next dev` o prazo não é aplicado, para dar pra testar fora das datas.
  const fase = getPhase(Date.now());
  if (process.env.NODE_ENV === "production" && fase !== "votacao") {
    const error = fase === "aguardando" ? "A votação ainda não começou." : "A votação já foi encerrada.";
    return NextResponse.json({ error }, { status: 403 });
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const adminAuth = getAdminAuth();
  const adminDb = getAdminDb();

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(token, true);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Token inválido." }, { status: 401 });
  }

  // Mesma consulta do cliente (useCategorias), para validar exatamente as categorias exibidas.
  const categoriasSnap = await adminDb.collection("categorias").orderBy("ordem").get();
  const categorias = categoriasSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Categoria[];

  if (categorias.length === 0) {
    return NextResponse.json({ error: "Nenhuma categoria cadastrada." }, { status: 400 });
  }

  const votanteRef = adminDb.collection("votantes").doc(uid);

  // Lê, valida e confirma na mesma transação, para a cédula não mudar entre a validação e a confirmação.
  const falha = await adminDb.runTransaction(async (tx) => {
    const votanteSnap = await tx.get(votanteRef);

    if (!votanteSnap.exists) {
      return { error: "Cédula não encontrada.", status: 404 };
    }

    const votante = votanteSnap.data() as Votante;

    if (votante.confirmado) {
      return { error: "Voto já confirmado anteriormente.", status: 409 };
    }

    for (const categoria of categorias) {
      const indicadoEscolhido = votante.votos[categoria.id];

      if (!indicadoEscolhido) {
        return { error: `Falta escolher um indicado em "${categoria.nome}".`, status: 400 };
      }

      const existe = categoria.indicados.some((i) => i.id === indicadoEscolhido);
      if (!existe) {
        return { error: `Indicado inválido em "${categoria.nome}".`, status: 400 };
      }
    }

    tx.update(votanteRef, {
      confirmado: true,
      confirmadoEm: Date.now(),
    });
    return null;
  });

  if (falha) {
    return NextResponse.json({ error: falha.error }, { status: falha.status });
  }

  return NextResponse.json({ success: true });
}
