"use client";

import Image from "next/image";
import { useState } from "react";
import type { User } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { useSessao } from "@/hooks/useSessao";

type Variante = "header" | "menu";

const FOCO_VISIVEL = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

export default function AreaDoUsuario({ variante = "header" }: { variante?: Variante }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <span
        aria-hidden="true"
        className={`block animate-pulse bg-foreground/10 ${variante === "menu" ? "h-14 w-full" : "h-12 w-60"}`}
      />
    );
  }

  if (user) return <UsuarioLogado user={user} />;
  return <BotaoEntrar variante={variante} />;
}

function BotaoEntrar({ variante }: { variante: Variante }) {
  const { entrar, entrando } = useSessao();

  return (
    <button
      type="button"
      onClick={entrar}
      disabled={entrando}
      className={`btn-aero flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-dark-bg disabled:cursor-wait disabled:opacity-70 ${FOCO_VISIVEL} ${
        variante === "menu" ? "w-full justify-center p-3" : "py-2 pl-2 pr-5"
      }`}
    >
      <span className="grid size-8 shrink-0 place-items-center bg-white">
        <IconeGoogle />
      </span>
      {entrando ? "Entrando..." : "Entrar com Google"}
    </button>
  );
}

function UsuarioLogado({ user }: { user: User }) {
  const { sair, saindo } = useSessao();
  const nomeCompleto = user.displayName ?? user.email ?? "";
  const primeiroNome = nomeCompleto.split(" ")[0];

  return (
    <div className="flex items-center gap-3">
      <Avatar nome={nomeCompleto} fotoUrl={user.photoURL} />
      <span title={nomeCompleto} className="max-w-40 truncate text-lg font-bold uppercase tracking-wider">
        {primeiroNome}
      </span>
      <button
        type="button"
        onClick={sair}
        disabled={saindo}
        className={`group relative ml-auto py-2 pl-2 text-sm font-bold uppercase tracking-wider text-foreground/70 transition-colors duration-300 hover:text-primary disabled:cursor-wait disabled:opacity-60 ${FOCO_VISIVEL}`}
      >
        {saindo ? "Saindo..." : "Sair"}
        <span className="absolute bottom-0 left-2 right-0 h-0.75 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
      </button>
    </div>
  );
}

function Avatar({ nome, fotoUrl }: { nome: string; fotoUrl: string | null }) {
  const [fotoComFalha, setFotoComFalha] = useState<string | null>(null);
  const mostrarFoto = fotoUrl !== null && fotoUrl !== fotoComFalha;

  return (
    <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-background font-bold text-primary ring-2 ring-primary/70">
      {mostrarFoto ? (
        <Image
          src={fotoUrl}
          alt=""
          fill
          sizes="40px"
          unoptimized
          referrerPolicy="no-referrer"
          onError={() => setFotoComFalha(fotoUrl)}
          className="object-cover"
        />
      ) : (
        <span aria-hidden="true">{nome.charAt(0).toUpperCase() || "?"}</span>
      )}
    </span>
  );
}

function IconeGoogle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4.5">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 01-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0012 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 010-4.6V6.6h-4a12 12 0 000 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 001.3 6.6l4 3.1c.9-2.8 3.6-4.9 6.7-4.9z" />
    </svg>
  );
}
