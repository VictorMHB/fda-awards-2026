"use client";

import { ReactNode, useEffect, useId, useRef } from "react";
import { Button } from "./Button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  variant = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tituloId = useId();
  const descricaoId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function cancelar() {
    if (loading) return;
    onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={tituloId}
      aria-describedby={descricaoId}
      onCancel={(event) => {
        event.preventDefault();
        cancelar();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) cancelar();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md bg-transparent p-0 text-foreground backdrop:bg-dark-bg/75 backdrop:backdrop-blur-sm open:animate-dialogo"
    >
      <div className="glass-strong rounded-3xl p-6 sm:p-7">
        <h2 id={tituloId} className="font-title text-2xl font-bold leading-tight">
          {title}
        </h2>
        <div id={descricaoId} className="mt-3 leading-relaxed text-foreground/80">
          {description}
        </div>
        <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={cancelar} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} disabled={loading}>
            {loading ? "Aguarde..." : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
