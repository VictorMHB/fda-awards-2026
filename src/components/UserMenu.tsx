"use client";

import { User } from "firebase/auth";
import { useSessao } from "@/hooks/useSessao";
import Avatar from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

export default function UserMenu({ user }: { user: User }) {
  const { sair, saindo } = useSessao();
  const nomeCompleto = user.displayName ?? user.email ?? "";
  const primeiroNome = nomeCompleto.split(" ")[0];

  return (
    <div className="flex items-center gap-2">
      <Avatar nome={nomeCompleto} fotoUrl={user.photoURL} className="size-8 text-xs" />
      <span className="max-w-32 truncate font-title text-sm" title={nomeCompleto}>
        {primeiroNome}
      </span>
      <Button variant="ghost" size="sm" onClick={sair} disabled={saindo}>
        Sair
      </Button>
    </div>
  );
}
