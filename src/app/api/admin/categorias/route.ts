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