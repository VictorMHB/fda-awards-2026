"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Categoria } from "@/types/voto";

async function loadCategorias(): Promise<Categoria[]> {
  const q = query(collection(db, "categorias"), orderBy("ordem"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Categoria[];
}

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Descarta respostas antigas quando uma busca mais nova começa
  const latest = useRef(0);

  // Uso manual (admin depois de salvar, apagar ou reordenar): setState só depois do await
  const refetch = useCallback(async () => {
    const request = ++latest.current;

    try {
      const data = await loadCategorias();
      if (request !== latest.current) return;

      setCategorias(data);
      setError(null);
    } catch (err) {
      console.error(err);
      if (request === latest.current) {
        setError("Erro ao carregar categorias.");
      }
    } finally {
      if (request === latest.current) {
        setLoading(false);
      }
    }
  }, []);

  // Carga inicial: todo setState fica em callback de promise
  useEffect(() => {
    let active = true; // vira false na limpeza, sem precisar ler o ref lá
    const request = ++latest.current;

    loadCategorias()
      .then((data) => {
        if (!active || request !== latest.current) return;
        setCategorias(data);
        setError(null);
      })
      .catch((err: unknown) => {
        console.error(err);
        if (active && request === latest.current) {
          setError("Erro ao carregar categorias.");
        }
      })
      .finally(() => {
        if (active && request === latest.current) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { categorias, loading, error, refetch };
}