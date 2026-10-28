import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import type { Tier } from "@/components/ui/AeroText";

export type CardVariant = "default" | "window" | "feature" | "stat" | "tier";

type CardOwnProps<T extends ElementType> = {
  variant?: CardVariant;
  title?: string; // rótulo da barra (variante window)
  barAction?: ReactNode; // botão no fim da barra, ex.: Fechar (variante window)
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
  barAction,
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
      {/* Rótulo e quadradinhos são decorativos: se o rótulo importar, o conteúdo repete ele em texto acessível */}
      {variant === "window" && (
        <div className="card__bar">
          <span aria-hidden="true" className="card__label">{title}</span>
          <span aria-hidden="true" className="card__dots">
            <i />
            <i />
            <i />
          </span>
          {barAction}
        </div>
      )}
      {children}
    </Tag>
  );
}
