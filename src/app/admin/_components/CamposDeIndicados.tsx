"use client";

import Avatar from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { IconeLixeira, IconeMais } from "@/components/ui/icons";

export type IndicadoForm = { id: string; nome: string; imagemUrl: string };

type CamposDeIndicadosProps = {
  indicados: IndicadoForm[];
  onAlterar: (indice: number, campo: "nome" | "imagemUrl", valor: string) => void;
  onRemover: (indice: number) => void;
  onAdicionar: () => void;
};

export default function CamposDeIndicados({ indicados, onAlterar, onRemover, onAdicionar }: CamposDeIndicadosProps) {
  return (
    <fieldset className="mt-8">
      <legend className="font-title text-xs font-bold uppercase tracking-[0.18em] text-foreground/70">
        Indicados ({indicados.length})
      </legend>

      <ul className="mt-3 flex flex-col gap-3">
        {indicados.map((indicado, indice) => (
          <li key={indice} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-dark-bg/40 p-3">
            <Avatar
              nome={indicado.nome}
              fotoUrl={indicado.imagemUrl.trim() || null}
              forma="quadrado"
              className="size-11 text-sm"
            />
            <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
              <TextField
                label={`Nome do indicado ${indice + 1}`}
                hideLabel
                placeholder="Nome do indicado"
                value={indicado.nome}
                onChange={(event) => onAlterar(indice, "nome", event.target.value)}
                autoComplete="off"
              />
              <TextField
                label={`URL da imagem do indicado ${indice + 1}`}
                hideLabel
                placeholder="URL da imagem (opcional)"
                inputMode="url"
                value={indicado.imagemUrl}
                onChange={(event) => onAlterar(indice, "imagemUrl", event.target.value)}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemover(indice)}
              disabled={indicados.length === 1}
              aria-label={`Remover ${indicado.nome || `indicado ${indice + 1}`}`}
            >
              <IconeLixeira className="size-4.5" />
            </Button>
          </li>
        ))}
      </ul>

      <Button variant="glass" size="sm" className="mt-3" onClick={onAdicionar}>
        <IconeMais className="size-4" />
        Adicionar indicado
      </Button>
    </fieldset>
  );
}
