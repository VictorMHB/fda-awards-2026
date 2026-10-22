"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/context/AuthContext";
import { Votante } from "@/types/voto";
import { toast } from "sonner";

export function useVotante() {
  const { user } = useAuth();
  const [votante, setVotante] = useState<Votante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setVotante(null);
      setLoading(false);
      return;
    }

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
          } else {
            setVotante(snap.data() as Votante);
            setError(null);
            setLoading(false);
          }
        } catch (err) {
          console.error(err);
          toast.error("Não foi possível criar sua cédula de votação. Recarregue a página.");
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        toast.error("Não foi possível conectar ao servidor de votação.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  async function escolherIndicado(categoriaId: string, indicadoId: string) {
    if (!user) return;
    try {
      const ref = doc(db, "votantes", user.uid);
      await updateDoc(ref, {
        [`votos.${categoriaId}`]: indicadoId,
      });
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível salvar sua escolha. Tenta de novo.");
    }
  }

  return { votante, loading, error, escolherIndicado };
}