"use client";

import { useState } from "react";
import { toast } from "sonner";
import AeroButton from "@/components/ui/AeroButton";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { saveCategory } from "@/lib/services/adminCategories";
import {
  MAX_INDICADOS,
  MIN_INDICADOS,
  parseYouTubeId,
  slug,
  validateCategory,
} from "@/lib/voting/categories";
import type { Categoria, CategoriaTipo, Indicado } from "@/types/voto";
import NomineeFields, { INPUT, LABEL, type NomineeDraft } from "./NomineeFields";

type CategoryFormProps = {
  initial: Categoria | null; // null = nova categoria
  nextOrder: number;
  locked: boolean;
  onSaved: () => void;
  onCancel: () => void;
};

// crypto.randomUUID só existe em https/localhost; o fallback cobre teste por IP da rede
const newId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `ind-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const newNominee = (): NomineeDraft => ({ id: newId(), nome: "", imagemUrl: "", videoUrl: "" });

const toDraft = (nominee: Indicado): NomineeDraft => ({
  id: nominee.id,
  nome: nominee.nome,
  imagemUrl: nominee.imagemUrl ?? "",
  videoUrl: nominee.videoId ? `https://youtu.be/${nominee.videoId}` : "",
});

export default function CategoryForm({
  initial,
  nextOrder,
  locked,
  onSaved,
  onCancel,
}: CategoryFormProps) {
  const { user } = useAuth();

  const [name, setName] = useState(initial?.nome ?? "");
  const [id, setId] = useState(initial?.id ?? "");
  const [idTouched, setIdTouched] = useState(Boolean(initial));
  const [order, setOrder] = useState<number | null>(initial?.ordem ?? null);
  const [type, setType] = useState<CategoriaTipo>(initial?.tipo ?? "imagem");
  const [nominees, setNominees] = useState<NomineeDraft[]>(() =>
    initial ? initial.indicados.map(toDraft) : Array.from({ length: MIN_INDICADOS }, newNominee),
  );
  const [saving, setSaving] = useState(false);

  function changeName(value: string) {
    setName(value);
    // O ID acompanha o nome até a pessoa mexer nele (e nunca na edição)
    if (!initial && !idTouched) setId(slug(value));
  }

  function patchNominee(index: number, patch: Partial<NomineeDraft>) {
    setNominees((prev) => prev.map((n, i) => (i === index ? { ...n, ...patch } : n)));
  }

  function move(index: number, delta: -1 | 1) {
    setNominees((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  async function handleSave() {
    if (!user) return;

    const result = validateCategory({
      id,
      nome: name,
      ordem: order ?? nextOrder,
      tipo: type,
      indicados: nominees.map((n) => ({
        id: n.id,
        nome: n.nome,
        imagemUrl: n.imagemUrl,
        videoId: parseYouTubeId(n.videoUrl) ?? "",
      })),
    });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setSaving(true);
    try {
      await saveCategory(await user.getIdToken(), result.value);
      toast.success(initial ? "Categoria atualizada!" : "Categoria salva!");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card variant="window" title={initial ? "Editando" : "Nova categoria"}>
      <fieldset disabled={locked} className="space-y-5 p-5 md:p-6">
        <legend className="sr-only">{initial ? `Editando ${initial.nome}` : "Nova categoria"}</legend>

        <label className="block">
          <span className={LABEL}>Nome</span>
          <input
            value={name}
            onChange={(e) => changeName(e.target.value)}
            className={`${INPUT} mt-1`}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-[1fr_8rem_10rem]">
          <label className="block">
            <span className={LABEL}>ID {initial ? "(fixo)" : "(gerado do nome)"}</span>
            <input
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setIdTouched(true);
              }}
              disabled={Boolean(initial)}
              className={`${INPUT} mt-1 font-mono`}
            />
          </label>
          <label className="block">
            <span className={LABEL}>Ordem</span>
            <input
              type="number"
              min={1}
              value={order ?? nextOrder}
              onChange={(e) => setOrder(Number(e.target.value))}
              className={`${INPUT} mt-1`}
            />
          </label>
          <label className="block">
            <span className={LABEL}>Tipo</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CategoriaTipo)}
              className={`${INPUT} mt-1`}
            >
              <option value="imagem">Imagem</option>
              <option value="video">Vídeo do YouTube</option>
            </select>
          </label>
        </div>

        <div>
          <p className={LABEL}>
            Indicados · {nominees.length} de {MAX_INDICADOS}
            {nominees.length === MAX_INDICADOS && " (final)"}
          </p>

          <ol className="mt-3 space-y-3">
            {nominees.map((nominee, index) => (
              <NomineeFields
                key={nominee.id}
                draft={nominee}
                index={index}
                total={nominees.length}
                type={type}
                canRemove={nominees.length > MIN_INDICADOS}
                onChange={(patch) => patchNominee(index, patch)}
                onMove={(delta) => move(index, delta)}
                onRemove={() => setNominees((prev) => prev.filter((_, i) => i !== index))}
              />
            ))}
          </ol>

          <div className="mt-3">
            <AeroButton
              variant="blue"
              size="sm"
              disabled={nominees.length >= MAX_INDICADOS}
              onClick={() => setNominees((prev) => [...prev, newNominee()])}
            >
              Adicionar indicado
            </AeroButton>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <AeroButton shine disabled={saving} onClick={handleSave}>
            {saving ? "Salvando..." : initial ? "Atualizar categoria" : "Salvar categoria"}
          </AeroButton>
          {initial && (
            <AeroButton variant="blue" onClick={onCancel}>
              Cancelar edição
            </AeroButton>
          )}
        </div>
      </fieldset>
    </Card>
  );
}