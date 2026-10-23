"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import { useCategorias } from "@/hooks/useCategorias";

type Props = { title: string; description: string; empty: string };

export default function CategoriesSection({ title, description, empty }: Props) {
  const { categorias, loading } = useCategorias();

  return (
    <section id="categories" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={title} description={description} />

        {loading ? (
          <ul aria-hidden="true" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="h-20 animate-pulse bg-foreground/10" />
            ))}
          </ul>
        ) : categorias.length === 0 ? (
          <p className="glass info-card p-6 text-foreground/80">{empty}</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categorias.map((category, index) => (
              <li key={category.id} className="glass info-card flex items-center gap-4 p-5">
                <span aria-hidden="true" className="font-display text-2xl text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-bold text-foreground">{category.nome}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}