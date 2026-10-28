import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

// O ID da categoria vira ID de documento e chave de `votos.<id>` no cliente,
// então "." e "/" (entre outros) quebram a votação daquela categoria.
const ID_VALIDO = /^[\p{L}\p{N}_-]+$/u;

const preenchido = (valor: unknown): valor is string =>
  typeof valor === "string" && valor.trim() !== "";

async function checarAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  const adminAuth = getAdminAuth();
  try {
    const decoded = await adminAuth.verifyIdToken(token, true);
    if (decoded.uid !== process.env.ADMIN_UID) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const admin = await checarAdmin(request);
  if (!admin) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const { id, nome, ordem, indicados } = (await request.json().catch(() => null)) ?? {};

  if (
    !preenchido(id) ||
    !preenchido(nome) ||
    typeof ordem !== "number" ||
    !Array.isArray(indicados) ||
    indicados.length === 0 ||
    !indicados.every((i) => preenchido(i?.id) && preenchido(i?.nome))
  ) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  if (!ID_VALIDO.test(id)) {
    return NextResponse.json(
      { error: 'ID inválido: use só letras, números, "_" e "-".' },
      { status: 400 }
    );
  }

  if (new Set(indicados.map((i) => i.id)).size !== indicados.length) {
    return NextResponse.json({ error: "Há indicados com o mesmo ID." }, { status: 400 });
  }

  await getAdminDb()
    .collection("categorias")
    .doc(id)
    .set({
      nome,
      ordem,
      indicados: indicados.map((i) => ({
        id: i.id,
        nome: i.nome,
        imagemUrl: typeof i.imagemUrl === "string" ? i.imagemUrl : "",
      })),
    });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const admin = await checarAdmin(request);
  if (!admin) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const { id } = (await request.json().catch(() => null)) ?? {};
  if (!preenchido(id)) return NextResponse.json({ error: "ID não informado." }, { status: 400 });

  await getAdminDb().collection("categorias").doc(id).delete();
  return NextResponse.json({ success: true });
}
