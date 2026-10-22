"use client";

import { useId, useState } from "react";
import { Plus } from "pixelarticons/react";
import type { FaqEntry } from "@/lib/content/faq";

export default function FaqItem({ question, answer }: FaqEntry) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const buttonId = `${id}-question`;
  const answerId = `${id}-answer`;

  return (
    <div className="glass info-card">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={answerId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left font-bold text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary md:text-lg"
        >
          {question}
          <Plus
            aria-hidden="true"
            className={`faq-icon size-6 shrink-0 text-primary ${open ? "faq-icon--open" : ""}`}
          />
        </button>
      </h3>
      <div
        id={answerId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="faq-answer px-5 pb-5 text-foreground/80"
      >
        {answer}
      </div>
    </div>
  );
}
