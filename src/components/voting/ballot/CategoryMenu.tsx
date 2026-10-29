"use client";

import { useId, useRef } from "react";
import { Check, Close } from "pixelarticons/react";
import { AeroText } from "@/components/ui/AeroText";
import AeroButton from "@/components/ui/AeroButton";

export type MenuItem = {
  id: string;
  name: string;
  choice?: string; // nome do indicado escolhido
};

type CategoryMenuProps = {
  items: MenuItem[];
  current: number; // -1 na revisão
  onGo: (index: number) => void;
  onReview: () => void;
};

export default function CategoryMenu({
  items,
  current,
  onGo,
  onReview,
}: CategoryMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const done = items.filter((item) => item.choice).length;

  function open() {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    // Já abre com a categoria atual à vista
    dialog
      .querySelector('[aria-current="step"]')
      ?.scrollIntoView({ block: "nearest" });
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <AeroButton variant="blue" size="sm" aria-haspopup="dialog" onClick={open}>
        Categorias · {done}/{items.length}
      </AeroButton>

      {/* Esc e foco preso já vêm do <dialog>; o foco volta para o botão ao fechar */}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="cat-menu"
        onClick={(e) => {
          // Clique no backdrop (o alvo é o próprio dialog)
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="cat-menu__window">
          <div className="cat-menu__bar">
            <h2 id={titleId}>
              <AeroText className="block py-0 text-lg leading-[1.35]">
                Categorias
              </AeroText>
            </h2>
            <AeroButton
              variant="blue"
              size="icon"
              aria-label="Fechar"
              onClick={close}
            >
              <Close aria-hidden="true" width={20} height={20} />
            </AeroButton>
          </div>

          <ol className="cat-menu__list">
            {items.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-current={index === current ? "step" : undefined}
                  className="cat-menu__item"
                  onClick={() => {
                    close();
                    onGo(index);
                  }}
                >
                  <span aria-hidden="true" className="cat-menu__num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-foreground wrap-anywhere">
                      {item.name}
                    </span>
                    <span className="block text-xs text-foreground/70 wrap-anywhere">
                      {item.choice ?? "Sem escolha"}
                    </span>
                  </span>
                  <span
                    className={`cat-menu__status ${item.choice ? "cat-menu__status--done" : ""}`}
                  >
                    {item.choice ? (
                      <>
                        <Check aria-hidden="true" width={14} height={14} />
                        Feita
                      </>
                    ) : (
                      "Pendente"
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="cat-menu__foot">
            <AeroButton
              size="sm"
              aria-current={current === -1 ? "step" : undefined}
              onClick={() => {
                close();
                onReview();
              }}
            >
              Ir para a revisão
            </AeroButton>
          </div>
        </div>
      </dialog>
    </>
  );
}