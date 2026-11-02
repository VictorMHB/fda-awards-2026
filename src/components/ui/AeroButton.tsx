import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type OwnProps = {
  variant?: "primary" | "blue";
  size?: "md" | "sm" | "icon";
  shine?: boolean; // brilho diagonal no hover (só o botão principal do fluxo)
  className?: string;
};

// Sem href vira <button>; com href vira <Link> (navegação)
type ButtonProps = OwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof OwnProps> & { href?: undefined };
type LinkProps = OwnProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof OwnProps>;

type AeroButtonProps = ButtonProps | LinkProps;

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
  className = "",
  children,
  ...props
}: AeroButtonProps) {
  const classes = `btn-login ${variant === "blue" ? "btn-login--blue" : ""} ${shine ? "" : "btn-login--still"} min-h-11 text-sm font-extrabold uppercase tracking-wider text-dark-bg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${SIZES[size]} ${className}`;

  // relative: mantém o texto acima do gloss (::before)
  const content = <span className="relative">{children}</span>;

  if (props.href !== undefined) {
    return (
      <Link {...props} className={classes}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props;
  return (
    <button type={type} {...buttonProps} className={classes}>
      {content}
    </button>
  );
}