"use client";

import { useSessao } from "@/hooks/useSessao";

export default function LoginButton({ label }: { label: string }) {
  const { entrar, entrando } = useSessao();

  return (
    <button
      type="button"
      onClick={entrar}
      disabled={entrando}
      className="btn-login px-7 py-2.5 text-sm font-extrabold uppercase tracking-wider text-dark-bg disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <span className="relative">{entrando ? "Entrando..." : label}</span>
    </button>
  );
}