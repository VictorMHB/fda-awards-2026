"use client";

import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Categoria } from "@/types/voto";

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchCategorias() {
      try {
        const q = query(collection(db, "categorias"), orderBy("ordem"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Categoria[];
        if (cancelled) return;
        setCategorias(data);
        setError(null);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Erro ao carregar categorias.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCategorias();
    return () => {
      cancelled = true;
    };
  }, [version]);

  // Recarrega sem voltar ao "carregando": a lista antiga fica até a nova chegar
  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return { categorias, loading, error, refetch };
}