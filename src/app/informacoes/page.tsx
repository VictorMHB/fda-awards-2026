import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import GlassPanel from "@/components/ui/GlassPanel";
import { IconeMais } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Informações",
};

const passos = [
  {
    titulo: "Entre com sua conta Google",
    texto: "Cada conta tem uma única cédula. É por ela que seu voto fica guardado.",
  },
  {
    titulo: "Escolha um indicado por categoria",
    texto: "As categorias aparecem uma por vez. Cada escolha é salva na hora, então você pode sair e continuar depois.",
  },
  {
    titulo: "Revise a cédula",
    texto: "No final você vê todas as escolhas juntas e pode trocar qualquer uma quantas vezes quiser.",
  },
  {
    titulo: "Confirme o voto",
    texto: "A confirmação só é liberada com todas as categorias preenchidas. Depois dela, o voto não pode mais ser alterado.",
  },
];

const regras = [
  "[Quem pode votar.]",
  "[Até quando a votação fica aberta.]",
  "[Como os vencedores são definidos.]",
];

const perguntas = [
  {
    pergunta: "Posso mudar meu voto?",
    resposta: "Sim, até confirmar a cédula. Depois da confirmação, as escolhas ficam travadas.",
  },
  {
    pergunta: "Preciso votar em todas as categorias?",
    resposta: "Sim. A cédula só pode ser confirmada com um indicado escolhido em cada categoria.",
  },
  {
    pergunta: "Se eu fechar a página, perco minhas escolhas?",
    resposta: "Não. Cada escolha é salva na sua conta no momento em que você escolhe o indicado.",
  },
  {
    pergunta: "Quando saem os resultados?",
    resposta: "[Data ou forma de divulgação dos resultados.]",
  },
  {
    pergunta: "[Outra pergunta frequente]",
    resposta: "[Resposta.]",
  },
];

export default function InformacoesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-14 sm:pt-20">
      <PageHeader
        eyebrow="Informações"
        title="Como funciona a votação"
        description="Tudo o que você precisa saber antes de preencher sua cédula."
      />

      <section aria-labelledby="como-votar">
        <h2 id="como-votar" className="font-title text-2xl font-bold sm:text-3xl">
          Como votar
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {passos.map((passo, indice) => (
            <li key={passo.titulo}>
              <GlassPanel className="flex h-full gap-5 p-6">
                <span className="font-title text-4xl font-bold leading-none text-primary/80">
                  {String(indice + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-title text-lg font-bold">{passo.titulo}</h3>
                  <p className="mt-2 text-foreground/75">{passo.texto}</p>
                </div>
              </GlassPanel>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
        <section aria-labelledby="regras">
          <h2 id="regras" className="font-title text-2xl font-bold sm:text-3xl">
            Regras
          </h2>
          <GlassPanel strong className="mt-6 p-6">
            <ul className="space-y-4">
              {regras.map((regra) => (
                <li key={regra} className="flex gap-3 text-foreground/80">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {regra}
                </li>
              ))}
            </ul>
          </GlassPanel>
        </section>

        <section aria-labelledby="perguntas">
          <h2 id="perguntas" className="font-title text-2xl font-bold sm:text-3xl">
            Perguntas frequentes
          </h2>
          <div className="mt-6 flex flex-col gap-3">
            {perguntas.map((item) => (
              <details key={item.pergunta} className="glass group rounded-2xl">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 font-title text-lg font-bold focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                  {item.pergunta}
                  <IconeMais className="size-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="px-5 pb-5 leading-relaxed text-foreground/80">{item.resposta}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
