"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useCategorias } from "@/hooks/useCategorias";
import { Categoria } from "@/types/voto";

type IndicadoForm = { id: string; nome: string; imagemUrl: string };

export default function AdminClient() {
  const { user } = useAuth();
  const { categorias } = useCategorias();

  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [ordem, setOrdem] = useState(1);
  const [indicados, setIndicados] = useState<IndicadoForm[]>([
    { id: "ind_1", nome: "", imagemUrl: "" },
  ]);
  const [salvando, setSalvando] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  function carregarParaEdicao(categoria: Categoria) {
    setEditandoId(categoria.id);
    setId(categoria.id);
    setNome(categoria.nome);
    setOrdem(categoria.ordem);
    setIndicados(categoria.indicados.map((i) => ({ ...i })));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setId("");
    setNome("");
    setOrdem(1);
    setIndicados([{ id: "ind_1", nome: "", imagemUrl: "" }]);
  }

  function addIndicado() {
    setIndicados((prev) => [...prev, { id: `ind_${prev.length + 1}`, nome: "", imagemUrl: "" }]);
  }

  function removeIndicado(index: number) {
    setIndicados((prev) => prev.filter((_, i) => i !== index));
  }

  function updateIndicado(index: number, campo: keyof IndicadoForm, valor: string) {
    setIndicados((prev) => prev.map((ind, i) => (i === index ? { ...ind, [campo]: valor } : ind)));
  }

  async function handleSalvar() {
    if (!user) return;
    if (!id || !nome || indicados.some((i) => !i.nome)) {
      toast.error("Preencha ID, nome da categoria e o nome de todos os indicados.");
      return;
    }
    setSalvando(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, nome, ordem, indicados }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao salvar.");
      } else {
        toast.success(editandoId ? "Categoria atualizada!" : "Categoria salva!");
        cancelarEdicao();
      }
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar(categoriaId: string) {
    if (!user) return;
    if (!confirm(`Apagar a categoria "${categoriaId}"?`)) return;
    const token = await user.getIdToken();
    const res = await fetch("/api/admin/categorias", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: categoriaId }),
    });
    if (res.ok) {
      toast.success("Categoria apagada.");
      if (editandoId === categoriaId) cancelarEdicao();
    } else {
      toast.error("Erro ao apagar.");
    }
  }

  return (
    <main className="p-10 max-w-2xl">
      <h1 className="text-3xl font-title font-bold mb-6">Admin — Categorias</h1>

      <div className="mb-10 border p-4 rounded">
        <h2 className="text-xl font-title mb-3">
          {editandoId ? `Editando: ${editandoId}` : "Nova categoria"}
        </h2>

        <label className="block mb-2">
          ID (sem espaço, ex: melhor_momento)
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            disabled={!!editandoId}
            className="border p-2 w-full text-black disabled:bg-gray-200"
          />
        </label>

        <label className="block mb-2">
          Nome
          <input value={nome} onChange={(e) => setNome(e.target.value)} className="border p-2 w-full text-black" />
        </label>

        <label className="block mb-4">
          Ordem
          <input
            type="number"
            value={ordem}
            onChange={(e) => setOrdem(Number(e.target.value))}
            className="border p-2 w-full text-black"
          />
        </label>

        <h3 className="font-bold mb-2">Indicados</h3>
        {indicados.map((ind, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              placeholder="Nome do indicado"
              value={ind.nome}
              onChange={(e) => updateIndicado(index, "nome", e.target.value)}
              className="border p-2 flex-1 text-black"
            />
            <input
              placeholder="URL da imagem (opcional)"
              value={ind.imagemUrl}
              onChange={(e) => updateIndicado(index, "imagemUrl", e.target.value)}
              className="border p-2 flex-1 text-black"
            />
            <button onClick={() => removeIndicado(index)} className="px-2 border rounded">
              ✕
            </button>
          </div>
        ))}
        <button onClick={addIndicado} className="text-sm underline mb-4 block">
          + adicionar indicado
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="bg-primary text-dark-bg font-bold px-4 py-2 rounded"
          >
            {salvando ? "Salvando..." : editandoId ? "Atualizar categoria" : "Salvar categoria"}
          </button>

          {editandoId && (
            <button onClick={cancelarEdicao} className="px-4 py-2 rounded border">
              Cancelar edição
            </button>
          )}
        </div>
      </div>

      <h2 className="text-xl font-title mb-3">Categorias existentes</h2>
      {categorias.map((cat) => (
        <div key={cat.id} className="flex justify-between items-center border-b py-2">
          <span>
            {cat.nome} ({cat.indicados.length} indicados)
          </span>
          <div className="flex gap-3">
            <button onClick={() => carregarParaEdicao(cat)} className="text-secondary underline text-sm">
              editar
            </button>
            <button onClick={() => handleDeletar(cat.id)} className="text-red-400 underline text-sm">
              apagar
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}