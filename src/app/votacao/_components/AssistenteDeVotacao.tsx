"use client";

import { useState } from "react";
import { Categoria } from "@/types/voto";
import { Button } from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { cn } from "@/components/ui/cn";
import { IconeSetaDireita, IconeSetaEsquerda } from "@/components/ui/icons";
import { contarEscolhidas, indicadoEscolhido, primeiraEtapaPendente, Votos } from "../cedula";
import BarraDeProgresso from "./BarraDeProgresso";
import CategoriaCard from "./CategoriaCard";
import RevisaoDeVotos from "./RevisaoDeVotos";

type AssistenteDeVotacaoProps = {
  categorias: Categoria[];
  votos: Votos;
  confirmando: boolean;
  onEscolher: (categoriaId: string, indicadoId: string) => void;
  onConfirmar: () => Promise<void>;
};

export default function AssistenteDeVotacao({
  categorias,
  votos,
  confirmando,
  onEscolher,
  onConfirmar,
}: AssistenteDeVotacaoProps) {
  const [etapa, setEtapa] = useState(() => primeiraEtapaPendente(categorias, votos));
  const [direcao, setDirecao] = useState<"avancar" | "voltar">("avancar");
  const [dialogoAberto, setDialogoAberto] = useState(false);

  const total = categorias.length;
  const etapaAtual = Math.min(etapa, total);
  const emRevisao = etapaAtual === total;
  const categoriaAtual = emRevisao ? null : categorias[etapaAtual];
  const escolhaAtual = categoriaAtual ? indicadoEscolhido(categoriaAtual, votos) : undefined;
  const pendentes = total - contarEscolhidas(categorias, votos);

  function irPara(indice: number) {
    if (indice === etapaAtual || indice < 0 || indice > total) return;
    setDirecao(indice > etapaAtual ? "avancar" : "voltar");
    setEtapa(indice);
    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduzirMovimento ? "auto" : "smooth" });
  }

  async function confirmar() {
    await onConfirmar();
    setDialogoAberto(false);
  }

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <BarraDeProgresso categorias={categorias} votos={votos} etapaAtual={etapaAtual} onIrPara={irPara} />
      </div>

      <div
        key={etapaAtual}
        className={cn(
          "mt-10 sm:mt-14",
          direcao === "avancar" ? "animate-etapa-avancar" : "animate-etapa-voltar"
        )}
      >
        {categoriaAtual ? (
          <CategoriaCard
            categoria={categoriaAtual}
            posicao={etapaAtual + 1}
            total={total}
            indicadoEscolhidoId={escolhaAtual?.id}
            onEscolher={(indicadoId) => onEscolher(categoriaAtual.id, indicadoId)}
          />
        ) : (
          <RevisaoDeVotos categorias={categorias} votos={votos} onAlterar={irPara} />
        )}
      </div>

      <div className="sticky bottom-3 z-30 mt-12 sm:bottom-6">
        <div className="glass-strong mx-auto flex max-w-xl items-center justify-between gap-3 rounded-full p-2">
          <Button variant="ghost" onClick={() => irPara(etapaAtual - 1)} disabled={etapaAtual === 0}>
            <IconeSetaEsquerda />
            <span className="max-sm:sr-only">Anterior</span>
          </Button>

          <span className="font-title text-sm text-foreground/70">
            {emRevisao ? "Revisão" : `${etapaAtual + 1} / ${total}`}
          </span>

          {emRevisao ? (
            <Button onClick={() => setDialogoAberto(true)} disabled={pendentes > 0 || confirmando}>
              Confirmar votos
            </Button>
          ) : (
            <Button variant={escolhaAtual ? "primary" : "glass"} onClick={() => irPara(etapaAtual + 1)}>
              {etapaAtual === total - 1 ? "Revisar" : "Próxima"}
              <IconeSetaDireita />
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={dialogoAberto}
        title="Confirmar seus votos?"
        description="Depois de confirmar, suas escolhas ficam registradas e não podem mais ser alteradas."
        confirmLabel="Confirmar votos"
        loading={confirmando}
        onConfirm={confirmar}
        onCancel={() => setDialogoAberto(false)}
      />
    </>
  );
}
