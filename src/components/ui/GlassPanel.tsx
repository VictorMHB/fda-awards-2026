import { ComponentPropsWithoutRef } from "react";
import { cn } from "./cn";

type GlassPanelProps = ComponentPropsWithoutRef<"div"> & {
  strong?: boolean;
};

export default function GlassPanel({ strong = false, className, ...props }: GlassPanelProps) {
  return <div className={cn(strong ? "glass-strong" : "glass", "rounded-3xl", className)} {...props} />;
}
