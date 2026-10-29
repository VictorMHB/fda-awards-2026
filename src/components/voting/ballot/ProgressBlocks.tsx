import type { ReactNode } from "react";

type ProgressItem = { id: string; done: boolean };

type ProgressBlocksProps = {
  items: ProgressItem[];
  current: number; // índice da categoria atual (-1 na revisão)
  label: string;
  action?: ReactNode; // botão ao lado do rótulo (menu de categorias)
};

export default function ProgressBlocks({
  items,
  current,
  label,
  action,
}: ProgressBlocksProps) {
  const done = items.filter((item) => item.done).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/70">
          {label}
        </p>
        {action}
      </div>

      <div
        role="progressbar"
        aria-label="Progresso da cédula"
        aria-valuemin={0}
        aria-valuemax={items.length}
        aria-valuenow={done}
        aria-valuetext={`${done} de ${items.length} categorias respondidas`}
        className="ballot-progress mt-3"
      >
        {items.map((item, index) => {
          // O degradê vem das classes do AeroText (só definem --aero-fill)
          const fill = item.done
            ? "text-aero--primary"
            : index === current
              ? "text-aero--ice"
              : "";

          return (
            <span
              key={item.id}
              aria-hidden="true"
              className={[
                "ballot-progress__block",
                fill && `${fill} ballot-progress__block--filled`,
                index === current && "ballot-progress__block--current",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          );
        })}
      </div>
    </div>
  );
}