import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import type { Tier } from "@/components/ui/AeroText";

export type CardVariant = "default" | "window" | "feature" | "stat" | "tier";

type CardOwnProps<T extends ElementType> = {
  variant?: CardVariant;
  title?: string; // rótulo da barra (variante window)
  tier?: Tier; // variante tier
  interactive?: boolean; // liga o hover (card clicável)
  as?: T; // "li", "article", "a"...
  className?: string;
  children: ReactNode;
};

// Também aceita as props do elemento escolhido em `as` (href, role, data-*...)
type CardProps<T extends ElementType> = CardOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps<T>>;

export default function Card<T extends ElementType = "div">({
  variant = "default",
  title,
  tier,
  interactive = false,
  as,
  className = "",
  children,
  ...props
}: CardProps<T>) {
  const Tag: ElementType = as ?? "div";

  const classes = [
    "card",
    variant !== "default" && `card--${variant}`,
    variant === "tier" && tier && `card--tier-${tier}`,
    interactive && "card--interactive",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} {...props}>
      {/* Barra decorativa: se o rótulo importar, o conteúdo repete ele em texto acessível */}
      {variant === "window" && (
        <div aria-hidden="true" className="card__bar">
          <span>{title}</span>
          <span className="card__dots">
            <i />
            <i />
            <i />
          </span>
        </div>
      )}
      {children}
    </Tag>
  );
}
