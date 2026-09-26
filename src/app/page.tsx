import Link from "next/link";
import GlassShapes from "@/components/GlassShapes";
import GlassPanel from "@/components/ui/GlassPanel";
import ChamadaParaVotar from "./_components/ChamadaParaVotar";

const passos = [
  {
    titulo: "Entre com o Google",
    texto: "Cada conta tem uma única cédula, e é nela que seu voto fica guardado.",
  },
  {
    titulo: "Escolha seus favoritos",
    texto: "Uma categoria por vez. Cada escolha é salva na hora, então dá para parar e continuar depois.",
  },
  {
    titulo: "Confirme a cédula",
    texto: "Revise tudo e confirme. Depois da confirmação, o voto não muda mais.",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative isolate flex min-h-[calc(100svh-4.25rem)] items-center overflow-hidden">
        <div className="absolute inset-0 opacity-45 sm:opacity-100">
          <GlassShapes />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 text-center">
          <p className="animate-surgir font-title text-xs font-bold uppercase tracking-[0.4em] text-primary sm:text-sm">
            Edição 2026
          </p>
          <h1 className="mt-5 animate-surgir font-title font-bold leading-[0.9]" style={{ animationDelay: "80ms" }}>
            <span className="block text-7xl sm:text-8xl lg:text-9xl">FDA</span>
            <span className="mt-3 block bg-linear-to-r from-primary via-[#fde3cf] to-primary bg-clip-text text-4xl tracking-wide text-transparent sm:text-6xl lg:text-7xl">
              Awards
            </span>
          </h1>
          <p
            className="mx-auto mt-8 max-w-xl animate-surgir text-lg text-foreground/80 sm:text-xl"
            style={{ animationDelay: "160ms" }}
          >
            Escolha seus favoritos em cada categoria e ajude a definir os vencedores deste ano.
          </p>
          <div className="mt-10 animate-surgir" style={{ animationDelay: "240ms" }}>
            <ChamadaParaVotar />
          </div>
        </div>
      </section>

      <section aria-labelledby="como-funciona" className="mx-auto w-full max-w-6xl px-4 pb-24">
        <div className="text-center">
          <p className="font-title text-xs font-bold uppercase tracking-[0.35em] text-primary">Como funciona</p>
          <h2 id="como-funciona" className="mt-3 font-title text-3xl font-bold sm:text-4xl">
            Três passos até a sua cédula
          </h2>
        </div>

        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {passos.map((passo, indice) => (
            <li key={passo.titulo}>
              <GlassPanel className="h-full p-6 sm:p-7">
                <span className="font-title text-5xl font-bold text-primary/80">
                  {String(indice + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-title text-xl font-bold">{passo.titulo}</h3>
                <p className="mt-2 text-foreground/75">{passo.texto}</p>
              </GlassPanel>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-center text-foreground/70">
          Ficou com dúvida?{" "}
          <Link
            href="/informacoes"
            className="text-primary underline decoration-primary/40 underline-offset-4 transition hover:decoration-primary"
          >
            Veja as informações da votação
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
