import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const REQUIRED = [
  "FIREBASE_ADMIN_PROJECT_ID",
  "FIREBASE_ADMIN_CLIENT_EMAIL",
  "FIREBASE_ADMIN_PRIVATE_KEY",
] as const;

// Inicializa só no primeiro uso: o `next build` importa as rotas para coletar
// configuração e não deve precisar das credenciais de admin.
function getAdminApp(): App {
  if (getApps().length) return getApps()[0];

  const missing = REQUIRED.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(`Faltam variáveis do firebase-admin no .env.local: ${missing.join(", ")}`);
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const getAdminDb = () => getFirestore(getAdminApp());
export const getAdminAuth = () => getAuth(getAdminApp());