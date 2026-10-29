import type { ComponentPropsWithoutRef } from "react";

type AeroButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "blue";
  size?: "md" | "sm" | "icon";
};

// Classes escritas por inteiro, senão o Tailwind não as gera
const SIZES = {
  md: "px-7 py-2.5",
  sm: "px-5 py-2",
  icon: "size-11",
} as const;

export default function AeroButton({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  children,
  ...props
}: AeroButtonProps) {
  return (
    <button
      type={type}
      className={`btn-login ${variant === "blue" ? "btn-login--blue" : ""} min-h-11 text-sm font-extrabold uppercase tracking-wider text-dark-bg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${SIZES[size]} ${className}`}
      {...props}
    >
      {/* relative: mantém o texto acima do gloss (::before) */}
      <span className="relative">{children}</span>
    </button>
  );
}