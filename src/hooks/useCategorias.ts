"use client";

import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Categoria } from "@/types/voto";

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function fetchCategorias() {
      try {
        const q = query(collection(db, "categorias"), orderBy("ordem"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Categoria[];
        if (!ativo) return;
        setCategorias(data);
        setError(null);
      } catch (err) {
        console.error(err);
        if (ativo) setError("Erro ao carregar categorias.");
      } finally {
        if (ativo) setLoading(false);
      }
    }
    fetchCategorias();

    return () => {
      ativo = false;
    };
  }, [versao]);

  const recarregar = useCallback(() => setVersao((anterior) => anterior + 1), []);

  return { categorias, loading, error, recarregar };
}
