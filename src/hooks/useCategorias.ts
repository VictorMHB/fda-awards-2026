"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Categoria } from "@/types/voto";

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const q = query(collection(db, "categorias"), orderBy("ordem"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Categoria[];
        setCategorias(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar categorias.");
      } finally {
        setLoading(false);
      }
    }
    fetchCategorias();
  }, []);

  return { categorias, loading, error };
}