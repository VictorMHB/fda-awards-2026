import { ReactNode } from "react";
import { cn } from "@/components/ui/cn";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
};

export default function PageHeader({ eyebrow, title, description, align = "left" }: PageHeaderProps) {
  const centralizado = align === "center";

  return (
    <header className={cn("mb-10 animate-surgir sm:mb-14", centralizado && "text-center")}>
      {eyebrow && (
        <p className="font-title text-xs font-bold uppercase tracking-[0.35em] text-primary">{eyebrow}</p>
      )}
      <h1 className="mt-3 text-balance font-title text-4xl font-bold leading-[1.05] sm:text-6xl">{title}</h1>
      {description && (
        <p className={cn("mt-4 max-w-2xl text-lg text-foreground/75", centralizado && "mx-auto")}>{description}</p>
      )}
    </header>
  );
}
