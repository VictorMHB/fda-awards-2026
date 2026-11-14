"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp } from "pixelarticons/react";
import { toast } from "sonner";
import AeroButton from "@/components/ui/AeroButton";
import { AeroText } from "@/components/ui/AeroText";
import { useAuth } from "@/context/AuthContext";
import { useAgora } from "@/hooks/useAgora";
import { useCategorias } from "@/hooks/useCategorias";
import { deleteCategory, reorderCategories } from "@/lib/services/adminCategories";
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
  const [moving, setMoving] = useState(false);
  const [announcement, setAnnouncement] = useState(""); // aviso para leitor de tela

  const nextOrder = categorias.length
    ? Math.max(...categorias.map((c) => c.ordem)) + 1
    : 1;

  // Com o formulário em edição, mover outras categorias deixaria a ordem dela desatualizada
  const reorderBlocked = locked || moving || editing !== null;

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

  async function handleMove(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (!user || reorderBlocked || target < 0 || target >= categorias.length) return;

    const ids = categorias.map((c) => c.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];

    setMoving(true);
    try {
      await reorderCategories(await user.getIdToken(), ids);
      await refetch(); // só libera as setas quando a lista nova chegar
      setAnnouncement(`${categorias[index].nome} movida para a posição ${target + 1}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao reordenar.");
    } finally {
      setMoving(false);
    }
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

        <div className="mt-6">
          <AeroButton href="/admin/resultados" variant="blue" size="sm">
            Ver resultados
          </AeroButton>
        </div>

        {locked && (
          <p role="status" className="mt-6 border-l-[3px] border-primary bg-primary/10 p-4">
            A votação já abriu: criar, editar, reordenar e apagar estão bloqueados, porque isso
            invalidaria votos já gravados.
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

        {editing && (
          <p className="mt-2 text-sm text-foreground/70">
            Termine ou cancele a edição para reordenar as categorias.
          </p>
        )}

        {error && (
          <p role="alert" className="mt-4 border-l-[3px] border-primary bg-primary/10 p-4">
            {error}
          </p>
        )}

        {/* Avisa o leitor de tela da nova posição (o foco fica na seta clicada) */}
        <p role="status" className="sr-only">
          {announcement}
        </p>

        {!loading && categorias.length === 0 ? (
          <p className="mt-4 text-foreground/80">Nenhuma categoria cadastrada.</p>
        ) : (
          <ul className="mt-4 divide-y divide-foreground/15 border border-foreground/20">
            {categorias.map((category, index) => {
              // aria-disabled (e não disabled) mantém o foco na seta depois do clique
              const upOff = reorderBlocked || index === 0;
              const downOff = reorderBlocked || index === categorias.length - 1;

              return (
                <li
                  key={category.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div className="min-w-0">
                    <p className="font-bold wrap-anywhere">
                      <span className="mr-3 font-mono text-sm text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {category.nome}
                    </p>
                    <p className="text-xs text-foreground/70">
                      {category.tipo === "video" ? "Vídeo" : "Imagem"} ·{" "}
                      {category.indicados.length} indicados
                      {category.indicados.length === MAX_INDICADOS && " · final"}
                      {!category.descricao && " · sem descrição"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <AeroButton
                      variant="blue"
                      size="icon"
                      aria-label={`Subir ${category.nome}`}
                      aria-disabled={upOff || undefined}
                      className={upOff ? "cursor-not-allowed opacity-50" : ""}
                      onClick={() => handleMove(index, -1)}
                    >
                      <ArrowUp aria-hidden="true" width={20} height={20} />
                    </AeroButton>
                    <AeroButton
                      variant="blue"
                      size="icon"
                      aria-label={`Descer ${category.nome}`}
                      aria-disabled={downOff || undefined}
                      className={downOff ? "cursor-not-allowed opacity-50" : ""}
                      onClick={() => handleMove(index, 1)}
                    >
                      <ArrowDown aria-hidden="true" width={20} height={20} />
                    </AeroButton>
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
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}