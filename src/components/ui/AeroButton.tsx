import type { ComponentPropsWithoutRef } from "react";

type AeroButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "blue";
  size?: "md" | "sm" | "icon";
  shine?: boolean; // brilho diagonal no hover (só o botão principal do fluxo)
};

// Classes escritas por inteiro, senão o Tailwind não as gera
const SIZES = {
  md: "px-7 py-2.5",
  sm: "px-5 py-2",
  icon: "size-11",
} as const;

// Mesmo botão do login (.btn-login): gloss em cima e "apertar" ao clicar.
export default function AeroButton({
  variant = "primary",
  size = "md",
  shine = false,
  type = "button",
  className = "",
  children,
  ...props
}: AeroButtonProps) {
  const still = !shine;

  return (
    <button
      type={type}
      className={`btn-login ${variant === "blue" ? "btn-login--blue" : ""} ${still ? "btn-login--still" : ""} min-h-11 text-sm font-extrabold uppercase tracking-wider text-dark-bg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${SIZES[size]} ${className}`}
      {...props}
    >
      {/* relative: mantém o texto acima do gloss (::before) */}
      <span className="relative">{children}</span>
    </button>
  );
}