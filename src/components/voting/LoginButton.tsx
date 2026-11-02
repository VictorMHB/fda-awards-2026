"use client";

import AeroButton from "@/components/ui/AeroButton";
import { useSessao } from "@/hooks/useSessao";

export default function LoginButton({ label }: { label: string }) {
  const { entrar, entrando } = useSessao();

  return (
    <AeroButton shine disabled={entrando} onClick={entrar}>
      {entrando ? "Entrando..." : label}
    </AeroButton>
  );
}