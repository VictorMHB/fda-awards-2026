import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import GlassPanel from "@/components/ui/GlassPanel";
import Patrocinadores from "./_components/Patrocinadores";

export const metadata: Metadata = {
  title: "Sobre",
};

const destaques = [
  { valor: "[00]", rotulo: "[categorias]" },
  { valor: "[00]", rotulo: "[indicados]" },
  { valor: "[00]", rotulo: "[edições]" },
];

export default function SobrePage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-14 sm:pt-20">
      <PageHeader
        eyebrow="Sobre"
        title="O que é o FDA Awards"
        description="[Uma frase curta apresentando o FDA Awards para quem nunca ouviu falar.]"
      />

      <div className="grid gap-4 md:grid-cols-5">
        <GlassPanel className="p-6 sm:p-8 md:col-span-3">
          <h2 className="font-title text-2xl font-bold">Nossa história</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-foreground/80">
            <p>[Conte como o FDA começou, quem faz parte e por que a premiação existe.]</p>
            <p>[Um segundo parágrafo, se precisar: o que a premiação celebra e como os indicados são escolhidos.]</p>
          </div>
        </GlassPanel>

        <GlassPanel strong className="flex flex-col p-6 sm:p-8 md:col-span-2">
          <h2 className="font-title text-2xl font-bold">Edição 2026</h2>
          <p className="mt-4 leading-relaxed text-foreground/80">[O que há de novo nesta edição.]</p>
          <dl className="mt-auto grid grid-cols-3 gap-3 pt-8">
            {destaques.map((destaque) => (
              <div key={destaque.rotulo} className="flex flex-col-reverse">
                <dt className="text-sm text-foreground/60">{destaque.rotulo}</dt>
                <dd className="font-title text-3xl font-bold text-primary">{destaque.valor}</dd>
              </div>
            ))}
          </dl>
        </GlassPanel>
      </div>

      <Patrocinadores />
    </main>
  );
}
