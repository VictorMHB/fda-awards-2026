import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

async function checarAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    if (decoded.uid !== process.env.ADMIN_UID) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const admin = await checarAdmin(request);
  if (!admin) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const { id, nome, ordem, indicados } = await request.json();

  if (!id || !nome || typeof ordem !== "number" || !Array.isArray(indicados) || indicados.length === 0) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  await adminDb.collection("categorias").doc(id).set({ nome, ordem, indicados });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const admin = await checarAdmin(request);
  if (!admin) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "ID não informado." }, { status: 400 });

  await adminDb.collection("categorias").doc(id).delete();
  return NextResponse.json({ success: true });
}