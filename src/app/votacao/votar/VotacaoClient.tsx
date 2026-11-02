"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useCategorias } from "@/hooks/useCategorias";
import { useVotante } from "@/hooks/useVotante";
import UserMenu from "@/components/layout/UserMenu";
import Ballot from "@/components/voting/ballot/Ballot";

const MESSAGE = "px-6 pt-32 text-foreground/80";

export default function VotacaoClient() {
  const { user } = useAuth();
  const {
    categorias,
    loading: loadingCategorias,
    error: erroCategorias,
  } = useCategorias();
  const {
    votante,
    loading: loadingVotante,
    error: erroVotante,
    escolherIndicado,
  } = useVotante();

  const [confirming, setConfirming] = useState(false);

  async function handleConfirm() {
    if (!user) return;
    setConfirming(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/votar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao confirmar.");
      } else {
        toast.success("Voto confirmado com sucesso!");
      }
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setConfirming(false);
    }
  }

  if (!user) {
    return (
      <main className={MESSAGE}>
        <p className="mb-4">Você precisa estar logado pra votar.</p>
        <UserMenu />
      </main>
    );
  }

  if (loadingCategorias || loadingVotante) {
    return (
      <main className={MESSAGE}>
        <p role="status">Carregando sua cédula...</p>
      </main>
    );
  }

  const error = erroCategorias ?? erroVotante;
  if (error || !votante) {
    return (
      <main className={MESSAGE}>
        <p role="alert" className="border-l-[3px] border-primary bg-primary/10 p-4">
          {error ?? "Não foi possível carregar sua cédula. Recarregue a página."}
        </p>
      </main>
    );
  }

  return (
    <main>
      <Ballot
        categories={categorias}
        votes={votante.votos}
        confirmed={votante.confirmado}
        confirming={confirming}
        onChoose={escolherIndicado}
        onConfirm={handleConfirm}
      />
    </main>
  );
}