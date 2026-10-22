"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { toast } from "sonner";
import { auth, googleProvider } from "@/lib/firebase/client";

const errosDeCancelamento = new Set(["auth/popup-closed-by-user", "auth/cancelled-popup-request"]);

async function criarSessao(usuario: User) {
  const idToken = await usuario.getIdToken();
  const resposta = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  return resposta.ok;
}

export function useSessao() {
  const router = useRouter();
  const [entrando, setEntrando] = useState(false);
  const [saindo, setSaindo] = useState(false);

  async function entrar() {
    if (entrando) return;
    setEntrando(true);
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      const sessaoCriada = await criarSessao(user).catch(() => false);

      if (!sessaoCriada) {
        await signOut(auth);
        toast.error("Não foi possível iniciar sua sessão. Tente de novo.");
        return;
      }

      router.refresh();
    } catch (err) {
      if (err instanceof FirebaseError && errosDeCancelamento.has(err.code)) return;
      console.error("Erro ao fazer login:", err);
      if (err instanceof FirebaseError && err.code === "auth/popup-blocked") {
        toast.error("O navegador bloqueou a janela de login. Permita pop-ups para este site.");
        return;
      }
      toast.error("Não foi possível entrar. Tente de novo.");
    } finally {
      setEntrando(false);
    }
  }

  async function sair() {
    if (saindo) return;
    setSaindo(true);
    try {
      await fetch("/api/session", { method: "DELETE" });
      await signOut(auth);
      router.refresh();
    } catch (err) {
      console.error("Erro ao sair:", err);
      toast.error("Não foi possível sair. Tente de novo.");
    } finally {
      setSaindo(false);
    }
  }

  return { entrar, sair, entrando, saindo };
}
