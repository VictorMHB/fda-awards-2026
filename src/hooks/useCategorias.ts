
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Categoria } from "@/types/voto";

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const latest = useRef(0);

  const refetch = useCallback(async () => {
    const request = ++latest.current;

    try {
      const q = query(collection(db, "categorias"), orderBy("ordem"));
      const snapshot = await getDocs(q);

      if (request !== latest.current) return;

      setCategorias(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Categoria[],
      );

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

  useEffect(() => {
    void (async () => {
      await refetch();
    })();
  }, [refetch]);

  return { categorias, loading, error, refetch };
}
