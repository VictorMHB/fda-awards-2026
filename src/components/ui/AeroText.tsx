import type { ElementType } from "react";

type AeroVariant = "silver" | "primary" | "aqua";

type AeroTextProps = {
  children: string;
  variant?: AeroVariant;
  italic?: boolean;
  as?: ElementType;
  className?: string;
};

export function AeroText({
  children,
  variant = "silver",
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