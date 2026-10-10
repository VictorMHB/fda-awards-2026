"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { useSessao } from "@/hooks/useSessao";

type Variante = "header" | "menu";

const FOCO_VISIVEL = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

export default function UserMenu({ variante = "header" }: { variante?: Variante }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <span
        aria-hidden="true"
        className={`block animate-pulse bg-foreground/10 ${variante === "menu" ? "h-12 w-full" : "h-10 w-28"}`}
      />
    );
  }

  if (user) return <UsuarioLogado user={user} variante={variante} />;
  return <BotaoEntrar variante={variante} />;
}

function BotaoEntrar({ variante }: { variante: Variante }) {
  const { entrar, entrando } = useSessao();

  return (
    <button
      type="button"
      onClick={entrar}
      disabled={entrando}
      className={`btn-login text-sm font-extrabold uppercase tracking-wider text-dark-bg disabled:cursor-wait disabled:opacity-70 ${FOCO_VISIVEL} ${
        variante === "menu" ? "w-full py-3.5" : "px-7 py-2.5"
      }`}
    >
      <span className="relative">{entrando ? "Entrando..." : "Entrar"}</span>
    </button>
  );
}

function UsuarioLogado({ user, variante }: { user: User; variante: Variante }) {
  const { sair, saindo } = useSessao();
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const nomeCompleto = user.displayName ?? user.email ?? "";

  // Fecha ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setAberto(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", tecla);
    };
  }, [aberto]);

  if (variante === "menu") {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 mb-4">
        <Avatar nome={nomeCompleto} fotoUrl={user.photoURL} />
        <div className="min-w-0 flex-1">
          <span className="user-dropdown-label">Conectado como</span>
          <p title={nomeCompleto} className="truncate text-base font-extrabold uppercase tracking-wider text-foreground">
            {nomeCompleto}
          </p>
          {user.email && user.email !== nomeCompleto && (
            <p className="mt-0.5 truncate text-xs text-foreground/60">{user.email}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={sair}
        disabled={saindo}
        className={`btn-logout btn-logout-full ${FOCO_VISIVEL}`}
      >
        {saindo ? "Saindo..." : "Sair"}
      </button>
    </div>
  );
}

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-label="Menu da conta"
        aria-expanded={aberto}
        aria-haspopup="menu"
        className={`relative block cursor-pointer rounded-full ${FOCO_VISIVEL}`}
      >
        <Avatar nome={nomeCompleto} fotoUrl={user.photoURL} />
      </button>

      {aberto && (
  <div role="menu" className="user-dropdown">
    <div className="user-dropdown-info">
      <span className="user-dropdown-label">Conectado como</span>
      <p className="truncate text-base font-extrabold uppercase tracking-wider text-foreground">
        {nomeCompleto}
      </p>
      {user.email && user.email !== nomeCompleto && (
        <p className="mt-0.5 truncate text-xs text-foreground/60">{user.email}</p>
      )}
    </div>
    <button
      type="button"
      role="menuitem"
      onClick={sair}
      disabled={saindo}
      className={`btn-logout ${FOCO_VISIVEL}`}
    >
      {saindo ? "Saindo..." : "Sair"}
    </button>
  </div>
)}
    </div>
  );
}

function Avatar({ nome, fotoUrl }: { nome: string; fotoUrl: string | null }) {
  const [fotoComFalha, setFotoComFalha] = useState<string | null>(null);
  const mostrarFoto = fotoUrl !== null && fotoUrl !== fotoComFalha;

  return (
    <span className="avatar-frame relative grid size-11 shrink-0 place-items-center overflow-hidden font-bold text-primary">
      {mostrarFoto ? (
        <Image
          src={fotoUrl}
          alt=""
          fill
          sizes="44px"
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