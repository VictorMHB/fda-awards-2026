import type { ElementType } from "react";

export type Tier = "diamond" | "platinum" | "gold" | "silver" | "bronze";
type AeroVariant = "ice" | "primary" | "aqua" | Tier;

type AeroTextProps = {
  children: string;
  variant?: AeroVariant;
  italic?: boolean;
  as?: ElementType;
  className?: string;
};

export function AeroText({
  children,
  variant = "ice",
  italic = false,
  as: Tag = "span",
  className = "",
}: AeroTextProps) {
  return (
    <Tag
      className={`text-aero text-aero--${variant} ${
        italic ? "text-aero--italic" : ""
      } font-display ${className}`}
      data-text={children}
    >
      {children}
    </Tag>
  );
}