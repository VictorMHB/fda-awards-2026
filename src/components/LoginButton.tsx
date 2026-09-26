"use client";

import { useSessao } from "@/hooks/useSessao";
import { Button, ButtonSize } from "@/components/ui/Button";
import { IconeGoogle } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";

type LoginButtonProps = {
  size?: ButtonSize;
  className?: string;
};

export default function LoginButton({ size = "md", className }: LoginButtonProps) {
  const { entrar, entrando } = useSessao();

  return (
    <Button size={size} onClick={entrar} disabled={entrando} className={className}>
      <span
        className={cn(
          "grid place-items-center rounded-full bg-white",
          size === "lg" ? "size-7" : "size-5"
        )}
      >
        <IconeGoogle className={size === "lg" ? "size-4" : "size-3"} />
      </span>
      {entrando ? "Entrando..." : "Entrar com Google"}
    </Button>
  );
}
