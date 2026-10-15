import type { ElementType } from "react";

type AeroVariant = "ice" | "primary" | "aqua";

type AeroTextProps = {
  children: string;
  variant?: AeroVariant;
  as?: ElementType;
  className?: string;
};

export function AeroText({
  children,
  variant = "ice",
  as: Tag = "span",
  className = "",
}: AeroTextProps) {
  return (
    <Tag
      className={`text-aero text-aero--${variant} ${className}`}
      data-text={children}
    >
      {children}
    </Tag>
  );
}