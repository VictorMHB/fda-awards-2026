"use client";

import { useState } from "react";
import { toast } from "sonner";
import AeroButton from "@/components/ui/AeroButton";
import { AeroText } from "@/components/ui/AeroText";
import { useAuth } from "@/context/AuthContext";
import { useAgora } from "@/hooks/useAgora";
import { useCategorias } from "@/hooks/useCategorias";
import { deleteCategory } from "@/lib/services/adminCategories";
import { categoriesLocked, MAX_INDICADOS } from "@/lib/voting/categories";
import type { Categoria } from "@/types/voto";
import CategoryForm from "./_components/CategoryForm";

export default function AdminClient() {
  const { user } = useAuth();
  const { categorias, loading, error, refetch } = useCategorias();
  const agora = useAgora();
  // Só avisa; quem trava de verdade é a API
  const locked = agora !== 0 && categoriesLocked(agora);

  const [editing, setEditing] = useState<Categoria | null>(null);
  const [run, setRun] = useState(0); // trocar a key reinicia o formulário

  const nextOrder = categorias.length
    ? Math.max(...categorias.map((c) => c.ordem)) + 1
    : 1;

  function reset() {
    setEditing(null);
    setRun((n) => n + 1);
  }

  function startEdit(category: Categoria) {
    setEditing(category);
    setRun((n) => n + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSaved() {
    refetch();
    reset();
  }

  async function handleDelete(category: Categoria) {
    if (!user) return;
    if (!confirm(`Apagar a categoria "${category.nome}"?`)) return;
    try {
      await deleteCategory(await user.getIdToken(), category.id);
      toast.success("Categoria apagada.");
      if (editing?.id === category.id) reset();
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao apagar.");
    }
  }

  return (
    <main className="px-6 py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h1>
          <AeroText className="block py-0 text-3xl leading-[1.35] md:text-5xl">
            Categorias
          </AeroText>
        </h1>

        {locked && (
          <p role="status" className="mt-6 border-l-[3px] border-primary bg-primary/10 p-4">
            A votação já abriu: criar, editar e apagar estão bloqueados, porque isso invalidaria
            votos já gravados.
          </p>
        )}

        <div className="mt-8">
          {loading ? (
            <p role="status" className="text-foreground/80">
              Carregando...
            </p>
          ) : (
            <CategoryForm
              key={`${editing?.id ?? "new"}-${run}`}
              initial={editing}
              nextOrder={nextOrder}
              locked={locked}
              onSaved={handleSaved}
              onCancel={reset}
            />
          )}
        </div>

        <h2 className="mt-12">
          <AeroText variant="primary" className="block py-0 text-2xl leading-[1.35] md:text-3xl">
            Existentes
          </AeroText>
        </h2>

        {error && (
          <p role="alert" className="mt-4 border-l-[3px] border-primary bg-primary/10 p-4">
            {error}
          </p>
        )}

        {!loading && categorias.length === 0 ? (
          <p className="mt-4 text-foreground/80">Nenhuma categoria cadastrada.</p>
        ) : (
          <ul className="mt-4 divide-y divide-foreground/15 border border-foreground/20">
            {categorias.map((category) => (
              <li
                key={category.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div className="min-w-0">
                  <p className="font-bold wrap-anywhere">
                    <span className="mr-3 font-mono text-sm text-primary">
                      {String(category.ordem).padStart(2, "0")}
                    </span>
                    {category.nome}
                  </p>
                  <p className="text-xs text-foreground/70">
                    {category.tipo === "video" ? "Vídeo" : "Imagem"} · {category.indicados.length}{" "}
                    indicados
                    {category.indicados.length === MAX_INDICADOS && " · final"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <AeroButton
                    variant="blue"
                    size="sm"
                    disabled={locked}
                    onClick={() => startEdit(category)}
                  >
                    Editar<span className="sr-only"> {category.nome}</span>
                  </AeroButton>
                  <AeroButton
                    variant="blue"
                    size="sm"
                    disabled={locked}
                    onClick={() => handleDelete(category)}
                  >
                    Apagar<span className="sr-only"> {category.nome}</span>
                  </AeroButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}