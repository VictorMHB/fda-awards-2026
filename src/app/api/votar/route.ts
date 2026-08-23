import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { Categoria, Votante } from "@/types/voto";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Token inválido." }, { status: 401 });
  }

  const votanteRef = adminDb.collection("votantes").doc(uid);
  const votanteSnap = await votanteRef.get();

  if (!votanteSnap.exists) {
    return NextResponse.json({ error: "Cédula não encontrada." }, { status: 404 });
  }

  const votante = votanteSnap.data() as Votante;

  if (votante.confirmado) {
    return NextResponse.json({ error: "Voto já confirmado anteriormente." }, { status: 409 });
  }

  const categoriasSnap = await adminDb.collection("categorias").get();
  const categorias = categoriasSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Categoria[];

  for (const categoria of categorias) {
    const indicadoEscolhido = votante.votos[categoria.id];

    if (!indicadoEscolhido) {
      return NextResponse.json(
        { error: `Falta escolher um indicado em "${categoria.nome}".` },
        { status: 400 }
      );
    }

    const existe = categoria.indicados.some((i) => i.id === indicadoEscolhido);
    if (!existe) {
      return NextResponse.json(
        { error: `Indicado inválido em "${categoria.nome}".` },
        { status: 400 }
      );
    }
  }

  await votanteRef.update({
    confirmado: true,
    confirmadoEm: Date.now(),
  });

  return NextResponse.json({ success: true });
}