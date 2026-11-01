import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireAdminFromRequest } from "@/lib/auth/admin";
import { categoriesLocked, ID_VALIDO, validateCategory } from "@/lib/voting/categories";

const forbidden = () => NextResponse.json({ error: "Não autorizado." }, { status: 403 });

// Função (e não constante): uma Response só pode ser lida uma vez
const locked = () =>
  NextResponse.json(
    { error: "A votação já abriu: categorias e indicados não podem mais ser alterados." },
    { status: 423 },
  );

export async function POST(request: NextRequest) {
  if (!(await requireAdminFromRequest(request))) return forbidden();
  if (categoriesLocked(Date.now())) return locked();

  const result = validateCategory(await request.json().catch(() => null));
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  const { id, ...data } = result.value;
  await getAdminDb().collection("categorias").doc(id).set(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdminFromRequest(request))) return forbidden();
  if (categoriesLocked(Date.now())) return locked();

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id.trim() : "";
  if (!id || !ID_VALIDO.test(id)) {
    return NextResponse.json({ error: "ID não informado." }, { status: 400 });
  }

  await getAdminDb().collection("categorias").doc(id).delete();
  return NextResponse.json({ success: true });
}

// Reordena: recebe os IDs na ordem nova e regrava `ordem` (1..N) de todas, num lote só
export async function PATCH(request: NextRequest) {
  if (!(await requireAdminFromRequest(request))) return forbidden();
  if (categoriesLocked(Date.now())) return locked();

  const body = await request.json().catch(() => null);
  const ids: unknown = body?.ids;

  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    !ids.every((id) => typeof id === "string" && ID_VALIDO.test(id))
  ) {
    return NextResponse.json({ error: "Lista de categorias inválida." }, { status: 400 });
  }
  if (new Set(ids).size !== ids.length) {
    return NextResponse.json({ error: "Há categorias repetidas na lista." }, { status: 400 });
  }

  const db = getAdminDb();
  const categorias = db.collection("categorias");

  // A lista tem de ser exatamente a que existe agora: se alguém criou ou apagou
  // uma categoria no meio do caminho, recusa em vez de bagunçar a ordem
  const existentes = (await categorias.listDocuments()).map((ref) => ref.id);
  const igual =
    existentes.length === ids.length && existentes.every((id) => ids.includes(id));
  if (!igual) {
    return NextResponse.json(
      { error: "A lista mudou. Recarregue a página e tente de novo." },
      { status: 409 },
    );
  }

  const batch = db.batch();
  ids.forEach((id, index) => batch.update(categorias.doc(id), { ordem: index + 1 }));
  await batch.commit();

  return NextResponse.json({ success: true });
}