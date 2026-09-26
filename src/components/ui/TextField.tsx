"use client";

import { ComponentPropsWithoutRef, useId } from "react";
import { cn } from "./cn";

type TextFieldProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
  hint?: string;
  hideLabel?: boolean;
};

export default function TextField({ label, hint, hideLabel = false, id, className, ...props }: TextFieldProps) {
  const idGerado = useId();
  const inputId = id ?? idGerado;
  const hintId = `${inputId}-dica`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={inputId}
        className={cn(
          "font-title text-xs font-bold uppercase tracking-[0.18em] text-foreground/70",
          hideLabel && "sr-only"
        )}
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-describedby={hint ? hintId : undefined}
        className="h-11 w-full min-w-0 rounded-xl border border-white/15 bg-dark-bg/60 px-4 text-foreground transition placeholder:text-foreground/35 hover:border-white/25 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-55"
        {...props}
      />
      {hint && (
        <p id={hintId} className="text-xs text-foreground/55">
          {hint}
        </p>
      )}
    </div>
  );
}
