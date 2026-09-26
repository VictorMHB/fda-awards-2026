"use client";

import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useCategorias } from "@/hooks/useCategorias";
import { Categoria } from "@/types/voto";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TextField from "@/components/ui/TextField";
import CamposDeIndicados, { IndicadoForm } from "./_components/CamposDeIndicados";
import ListaDeCategorias from "./_components/ListaDeCategorias";

function indicadoVazio(): IndicadoForm {
  return { id: "ind_1", nome: "", imagemUrl: "" };
}

function proximoIdDeIndicado(indicados: IndicadoForm[]) {
  const maiorNumero = indicados.reduce((maior, indicado) => {
    const numero = Number(indicado.id.replace(/^ind_/, ""));
    return Number.isFinite(numero) && numero > maior ? numero : maior;
  }, 0);
  return `ind_${maiorNumero + 1}`;
}

function idAPartirDoNome(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export default function AdminClient() {
  const { user } = useAuth();
  const { categorias, loading: carregandoCategorias, recarregar } = useCategorias();
  const formularioRef = useRef<HTMLFormElement>(null);

  const [id, setId] = useState("");
  const [idEditadoManualmente, setIdEditadoManualmente] = useState(false);
  const [nome, setNome] = useState("");
  const [ordem, setOrdem] = useState(1);
  const [indicados, setIndicados] = useState<IndicadoForm[]>(() => [indicadoVazio()]);
  const [salvando, setSalvando] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [categoriaParaApagar, setCategoriaParaApagar] = useState<Categoria | null>(null);
  const [apagando, setApagando] = useState(false);

  function carregarParaEdicao(categoria: Categoria) {
    setEditandoId(categoria.id);
    setId(categoria.id);
    setIdEditadoManualmente(true);
    setNome(categoria.nome);
    setOrdem(categoria.ordem);
    setIndicados(
      categoria.indicados.map((indicado) => ({
        id: indicado.id,
        nome: indicado.nome,
        imagemUrl: indicado.imagemUrl ?? "",
      }))
    );
    formularioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setId("");
    setIdEditadoManualmente(false);
    setNome("");
    setOrdem(1);
    setIndicados([indicadoVazio()]);
  }

  function alterarNome(valor: string) {
    setNome(valor);
    if (!editandoId && !idEditadoManualmente) setId(idAPartirDoNome(valor));
  }

  function alterarId(valor: string) {
    setId(valor);
    setIdEditadoManualmente(valor !== "");
  }

  function adicionarIndicado() {
    setIndicados((anteriores) => [
      ...anteriores,
      { id: proximoIdDeIndicado(anteriores), nome: "", imagemUrl: "" },
    ]);
  }

  function removerIndicado(indice: number) {
    setIndicados((anteriores) => anteriores.filter((_, i) => i !== indice));
  }

  function alterarIndicado(indice: number, campo: "nome" | "imagemUrl", valor: string) {
    setIndicados((anteriores) =>
      anteriores.map((indicado, i) => (i === indice ? { ...indicado, [campo]: valor } : indicado))
    );
  }

  async function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    const nomeLimpo = nome.trim();
    const indicadosLimpos = indicados.map((indicado) => ({
      id: indicado.id,
      nome: indicado.nome.trim(),
      imagemUrl: indicado.imagemUrl.trim(),
    }));

    if (!id || !nomeLimpo || indicadosLimpos.some((indicado) => !indicado.nome)) {
      toast.error("Preencha ID, nome da categoria e o nome de todos os indicados.");
      return;
    }

    setSalvando(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, nome: nomeLimpo, ordem, indicados: indicadosLimpos }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao salvar.");
        return;
      }
      toast.success(editandoId ? "Categoria atualizada!" : "Categoria salva!");
      cancelarEdicao();
      recarregar();
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setSalvando(false);
    }
  }

  async function apagarCategoria() {
    if (!user || !categoriaParaApagar) return;
    const categoriaId = categoriaParaApagar.id;

    setApagando(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/categorias", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: categoriaId }),
      });
      if (!res.ok) {
        toast.error("Erro ao apagar.");
        return;
      }
      toast.success("Categoria apagada.");
      if (editandoId === categoriaId) cancelarEdicao();
      setCategoriaParaApagar(null);
      recarregar();
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setApagando(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-14 sm:pt-20">
      <PageHeader
        eyebrow="Admin"
        title="Categorias"
        description="Crie, edite e organize as categorias e os indicados da votação."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start">
        <form
          ref={formularioRef}
          onSubmit={salvar}
          className="glass-strong scroll-mt-24 rounded-3xl p-5 sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-title text-2xl font-bold">{editandoId ? "Editar categoria" : "Nova categoria"}</h2>
            {editandoId && (
              <span className="rounded-full bg-primary/15 px-3 py-1 font-mono text-xs text-primary">{editandoId}</span>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_7rem]">
            <TextField
              label="Nome"
              value={nome}
              onChange={(event) => alterarNome(event.target.value)}
              placeholder="Melhor momento"
              autoComplete="off"
            />
            <TextField
              label="Ordem"
              type="number"
              min={1}
              value={ordem}
              onChange={(event) => setOrdem(Number(event.target.value))}
            />
          </div>

          <TextField
            className="mt-4"
            label="ID"
            value={id}
            onChange={(event) => alterarId(event.target.value)}
            disabled={Boolean(editandoId)}
            placeholder="melhor_momento"
            hint={
              editandoId
                ? "O ID não muda depois que a categoria é criada."
                : "Gerado a partir do nome. Sem espaços nem acentos."
            }
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
          />

          <CamposDeIndicados
            indicados={indicados}
            onAlterar={alterarIndicado}
            onRemover={removerIndicado}
            onAdicionar={adicionarIndicado}
          />

          <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
            <Button type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : editandoId ? "Atualizar categoria" : "Salvar categoria"}
            </Button>
            {editandoId && (
              <Button variant="ghost" onClick={cancelarEdicao} disabled={salvando}>
                Cancelar edição
              </Button>
            )}
          </div>
        </form>

        <ListaDeCategorias
          categorias={categorias}
          carregando={carregandoCategorias}
          editandoId={editandoId}
          onEditar={carregarParaEdicao}
          onApagar={setCategoriaParaApagar}
        />
      </div>

      <ConfirmDialog
        open={categoriaParaApagar !== null}
        title="Apagar categoria?"
        description={
          <>
            A categoria <strong className="text-foreground">{categoriaParaApagar?.nome}</strong> e seus indicados
            serão removidos. Essa ação não pode ser desfeita.
          </>
        }
        confirmLabel="Apagar"
        variant="danger"
        loading={apagando}
        onConfirm={apagarCategoria}
        onCancel={() => setCategoriaParaApagar(null)}
      />
    </main>
  );
}
