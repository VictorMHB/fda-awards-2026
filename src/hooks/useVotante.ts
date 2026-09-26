"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Votante } from "@/types/voto";
import { toast } from "sonner";

type EstadoDaCedula = {
  uid: string;
  votante: Votante | null;
  error: string | null;
};

export function useVotante() {
  const { user } = useAuth();
  const [estado, setEstado] = useState<EstadoDaCedula | null>(null);

  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "votantes", user.uid);

    const unsubscribe = onSnapshot(
      ref,
      async (snap) => {
        try {
          if (!snap.exists()) {
            const novoVotante: Votante = {
              nome: user.displayName ?? "",
              email: user.email ?? "",
              confirmado: false,
              confirmadoEm: null,
              votos: {},
            };
            await setDoc(ref, novoVotante);
            return;
          }
          setEstado({ uid: user.uid, votante: snap.data() as Votante, error: null });
        } catch (err) {
          console.error(err);
          setEstado({ uid: user.uid, votante: null, error: "Não foi possível criar sua cédula de votação." });
        }
      },
      (err) => {
        console.error(err);
        setEstado({ uid: user.uid, votante: null, error: "Não foi possível conectar ao servidor de votação." });
      }
    );

    return () => unsubscribe();
  }, [user]);

  const estadoDoUsuario = user && estado?.uid === user.uid ? estado : null;
  const votante = estadoDoUsuario?.votante ?? null;
  const error = estadoDoUsuario?.error ?? null;
  const loading = Boolean(user) && !estadoDoUsuario;

  async function escolherIndicado(categoriaId: string, indicadoId: string) {
    if (!user) return;
    try {
      const ref = doc(db, "votantes", user.uid);
      await updateDoc(ref, {
        [`votos.${categoriaId}`]: indicadoId,
      });
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível salvar sua escolha. Tente de novo.");
    }
  }

  return { votante, loading, error, escolherIndicado };
}
