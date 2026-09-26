"use client";

import { useAuth } from "@/context/AuthContext";
import LoginButton from "@/components/LoginButton";
import { ButtonLink } from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { IconeSetaDireita } from "@/components/ui/icons";

export default function ChamadaParaVotar() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-14 w-64 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col items-center gap-3">
        <ButtonLink href="/votacao" size="lg">
          Ir para a votação
          <IconeSetaDireita />
        </ButtonLink>
        <p className="text-sm text-foreground/60">Conectado como {user.displayName ?? user.email}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <LoginButton size="lg" />
      <p className="text-sm text-foreground/60">Basta uma conta Google para votar.</p>
    </div>
  );
}
