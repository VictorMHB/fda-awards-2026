"use client";

import { ReactNode, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useCategorias } from "@/hooks/useCategorias";
import { useVotante } from "@/hooks/useVotante";
import LoginButton from "@/components/LoginButton";
import { Button } from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/components/ui/cn";
import AssistenteDeVotacao from "./_components/AssistenteDeVotacao";
import CedulaConfirmada from "./_components/CedulaConfirmada";

function Pagina({ children, centralizada = false }: { children: ReactNode; centralizada?: boolean }) {
  return (
    <main
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-10 pt-10 sm:pt-14",
        centralizada && "justify-center pb-24"
      )}
    >
      {children}
    </main>
  );
}

function CarregandoCedula() {
  return (
    <Pagina>
      <div aria-busy="true">
        <span className="sr-only">Carregando sua cédula...</span>
        <div className="mx-auto max-w-3xl">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-4 h-2 w-full rounded-full" />
        </div>
        <div className="mt-14 flex flex-col items-center gap-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-12 w-80 max-w-full" />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(11rem,14rem))] sm:justify-center sm:gap-5">
          {Array.from({ length: 4 }, (_, indice) => (
            <Skeleton key={indice} className="aspect-[4/5] rounded-3xl" />
          ))}
        </div>
      </div>
    </Pagina>
  );
}

export default function VotacaoClient() {
  const { user, loading: carregandoUsuario } = useAuth();
  const { categorias, loading: carregandoCategorias, error: erroCategorias } = useCategorias();
  const { votante, loading: carregandoVotante, error: erroVotante, escolherIndicado } = useVotante();
  const [confirmando, setConfirmando] = useState(false);

  async function confirmarVotos() {
    if (!user) return;
    setConfirmando(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/votar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao confirmar.");
        return;
      }
      toast.success("Voto confirmado com sucesso!");
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setConfirmando(false);
    }
  }

  if (carregandoUsuario) return <CarregandoCedula />;

  if (!user) {
    return (
      <Pagina centralizada>
        <EmptyState
          title="Entre para votar"
          description="Você precisa estar conectado com sua conta Google para acessar a cédula."
          action={<LoginButton size="lg" />}
        />
      </Pagina>
    );
  }

  const erro = erroCategorias ?? erroVotante;
  if (erro) {
    return (
      <Pagina centralizada>
        <EmptyState
          title="Não foi possível carregar a votação"
          description={erro}
          action={<Button onClick={() => window.location.reload()}>Tentar de novo</Button>}
        />
      </Pagina>
    );
  }

  if (carregandoCategorias || carregandoVotante || !votante) return <CarregandoCedula />;

  if (categorias.length === 0) {
    return (
      <Pagina centralizada>
        <EmptyState
          title="A cédula ainda está sendo montada"
          description="Nenhuma categoria foi publicada até agora. Volte mais tarde."
        />
      </Pagina>
    );
  }

  const votos = votante.votos ?? {};

  if (votante.confirmado) {
    return (
      <Pagina>
        <CedulaConfirmada categorias={categorias} votos={votos} confirmadoEm={votante.confirmadoEm} />
      </Pagina>
    );
  }

  return (
    <Pagina>
      <h1 className="sr-only">Votação</h1>
      <AssistenteDeVotacao
        categorias={categorias}
        votos={votos}
        confirmando={confirmando}
        onEscolher={escolherIndicado}
        onConfirmar={confirmarVotos}
      />
    </Pagina>
  );
}
