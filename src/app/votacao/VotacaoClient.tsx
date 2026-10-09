"use client";

import { useState } from "react";
import { useCategorias } from "@/hooks/useCategorias";
import { useVotante } from "@/hooks/useVotante";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import LoginButton from "@/components/ui/LoginButton";

export default function VotacaoPage() {
  const { categorias, loading: loadingCategorias } = useCategorias();
  const { user } = useAuth();
  const {
    votante,
    loading: loadingVotante,
    error: erroVotante,
    escolherIndicado,
  } = useVotante();

  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleConfirmar() {
    if (!user) return;
    setConfirmando(true);
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
      setConfirmando(false);
    }
  }

  if (!user) {
    return (
      <main className="p-10">
        <p className="mb-4">Você precisa estar logado pra votar.</p>
        <LoginButton />
      </main>
    );
  }

  if (loadingCategorias || loadingVotante)
    return <p className="p-10">Carregando...</p>;

  return (
    <main className="p-10">
      <h1 className="text-4xl font-title font-bold mb-6">Votação</h1>

      {erroVotante && (
        <p className="mb-4 text-red-400 border border-red-400 rounded p-3">
          ⚠️ {erroVotante}
        </p>
      )}

      {categorias.map((categoria) => (
        <div key={categoria.id} className="mb-8">
          <h2 className="text-2xl font-title mb-2">{categoria.nome}</h2>
          <div className="flex gap-2 flex-wrap">
            {categoria.indicados.map((indicado) => {
              const selecionado = votante?.votos[categoria.id] === indicado.id;
              return (
                <button
                  key={indicado.id}
                  onClick={() => escolherIndicado(categoria.id, indicado.id)}
                  disabled={votante?.confirmado}
                  className={`px-4 py-2 rounded border ${
                    selecionado ? "bg-primary text-dark-bg" : "border-secondary"
                  }`}
                >
                  {indicado.nome}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {votante?.confirmado ? (
        <p className="text-primary font-bold text-xl">
          ✅ Voto confirmado, obrigado por participar!
        </p>
      ) : (
        <>
          {erro && <p className="text-red-400 mb-2">{erro}</p>}
          <button
            onClick={handleConfirmar}
            disabled={confirmando}
            className="px-6 py-3 rounded bg-primary text-dark-bg font-bold"
          >
            {confirmando ? "Confirmando..." : "Confirmar votos"}
          </button>
        </>
      )}
    </main>
  );
}
