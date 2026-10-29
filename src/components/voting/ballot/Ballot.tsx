"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AeroText } from "@/components/ui/AeroText";
import AeroButton from "@/components/ui/AeroButton";
import Card from "@/components/ui/Card";
import type { Categoria } from "@/types/voto";
import CategoryMenu from "./CategoryMenu";
import NomineeCard from "./NomineeCard";
import ProgressBlocks from "./ProgressBlocks";

type BallotProps = {
  categories: Categoria[];
  votes: Record<string, string>; // categoriaId -> indicadoId
  confirmed: boolean;
  confirming: boolean;
  onChoose: (categoryId: string, nomineeId: string) => void;
  onConfirm: () => void;
};

export default function Ballot({
  categories,
  votes,
  confirmed,
  confirming,
  onChoose,
  onConfirm,
}: BallotProps) {
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [agreed, setAgreed] = useState(false);

  const total = categories.length;

  // Um voto só vale se o indicado ainda existe na categoria
  const chosenIn = (category: Categoria) =>
    category.indicados.find((nominee) => nominee.id === votes[category.id]);

  const firstMissing = categories.findIndex((c) => !chosenIn(c));
  const missingCount = categories.filter((c) => !chosenIn(c)).length;

  // Abre na primeira categoria sem escolha. Todas feitas (ou já confirmada): revisão.
  const [step, setStep] = useState(() =>
    confirmed || firstMissing === -1 ? total : firstMissing,
  );

  const current = Math.min(step, total);
  const reviewing = confirmed || current === total;

  // Ao trocar de tela, leva o foco para o título (teclado e leitor de tela)
  const previousStep = useRef(current);
  useEffect(() => {
    if (previousStep.current === current) return;
    previousStep.current = current;
    headingRef.current?.focus();
  }, [current]);

  if (total === 0) {
    return (
      <section className="ballot px-6 pb-16 pt-28 md:pt-36">
        <p className="mx-auto max-w-5xl text-foreground/80">
          As categorias serão reveladas em breve.
        </p>
      </section>
    );
  }

  const category = categories[current]; // indefinido na revisão
  const heading = reviewing
    ? confirmed
      ? "Cédula confirmada"
      : "Revise sua cédula"
    : category.nome;

  return (
    <section className="ballot px-6 pb-16 pt-28 md:pb-24 md:pt-36">
      <div className="mx-auto max-w-5xl">
        <ProgressBlocks
          items={categories.map((c) => ({
            id: c.id,
            done: Boolean(chosenIn(c)),
          }))}
          current={reviewing ? -1 : current}
          label={reviewing ? "Revisão" : `Categoria ${current + 1} de ${total}`}
          action={
            confirmed ? null : (
              <CategoryMenu
                items={categories.map((c) => ({
                  id: c.id,
                  name: c.nome,
                  choice: chosenIn(c)?.nome,
                }))}
                current={reviewing ? -1 : current}
                onGo={setStep}
                onReview={() => setStep(total)}
              />
            )
          }
        />

        <h2
          ref={headingRef}
          tabIndex={-1}
          id={headingId}
          className="ballot__heading mt-8"
        >
          <AeroText
            variant={reviewing ? "primary" : "ice"}
            className="block py-0 text-2xl leading-[1.35] text-balance md:text-4xl"
          >
            {heading}
          </AeroText>
        </h2>

        {reviewing ? (
          <>
            {confirmed ? (
              <p
                role="status"
                className="mt-4 border-l-[3px] border-primary bg-primary/10 p-4"
              >
                Obrigado por participar! Os vencedores são revelados ao vivo na
                cerimônia.
              </p>
            ) : (
              <p className="mt-3 text-foreground/80">
                Confira suas escolhas. Depois de confirmar, a cédula não muda
                mais.
              </p>
            )}

            <Card variant="window" title="Revisão" className="mt-8">
              <ul className="divide-y divide-foreground/15">
                {categories.map((c, index) => {
                  const chosen = chosenIn(c);
                  return (
                    <li
                      key={c.id}
                      className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4 md:px-6"
                    >
                      <div className="min-w-0 flex-1 basis-48">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/70">
                          {c.nome}
                        </p>
                        <p
                          className={`mt-1 font-bold ${chosen ? "text-foreground" : "text-primary"}`}
                        >
                          {chosen ? chosen.nome : "Sem escolha"}
                        </p>
                      </div>
                      {!confirmed && (
                        <AeroButton
                          variant="blue"
                          size="sm"
                          onClick={() => setStep(index)}
                        >
                          {chosen ? "Alterar" : "Escolher"}
                          <span className="sr-only"> {c.nome}</span>
                        </AeroButton>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>

            {!confirmed && (
              <div className="mt-8 space-y-6">
                {missingCount > 0 ? (
                  <p
                    role="status"
                    className="border-l-[3px] border-primary bg-primary/10 p-4"
                  >
                    {missingCount === 1
                      ? "Falta 1 categoria."
                      : `Faltam ${missingCount} categorias.`}{" "}
                    Escolha um indicado em cada uma para poder confirmar.
                  </p>
                ) : (
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 text-foreground/90">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="size-5 shrink-0 accent-primary"
                    />
                    Entendo que, depois de confirmar, minha cédula não pode ser
                    alterada.
                  </label>
                )}

                <div className="flex flex-wrap justify-between gap-3">
                  <AeroButton
                    variant="blue"
                    onClick={() => setStep(total - 1)}
                  >
                    Voltar
                  </AeroButton>

                  {missingCount > 0 ? (
                    <AeroButton onClick={() => setStep(firstMissing)}>
                      Ir para a primeira pendente
                    </AeroButton>
                  ) : (
                    <AeroButton
                      disabled={!agreed || confirming}
                      onClick={onConfirm}
                    >
                      {confirming ? "Confirmando..." : "Confirmar cédula"}
                    </AeroButton>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="mt-3 text-foreground/80">
              Escolha um indicado. Sua escolha é salva na hora.
            </p>

            <div
              role="radiogroup"
              aria-labelledby={headingId}
              className="nominee-grid mt-8"
              data-count={category.indicados.length}
              style={
                { "--count": category.indicados.length } as CSSProperties
              }
            >
              {category.indicados.map((nominee, index) => (
                <div key={nominee.id} className="nominee-grid__item">
                  <NomineeCard
                    nominee={nominee}
                    index={index}
                    name={category.id}
                    selected={votes[category.id] === nominee.id}
                    disabled={confirmed}
                    onSelect={() => onChoose(category.id, nominee.id)}
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap justify-between gap-3">
              <AeroButton
                variant="blue"
                disabled={current === 0}
                onClick={() => setStep(current - 1)}
              >
                Voltar
              </AeroButton>
              <AeroButton onClick={() => setStep(current + 1)}>
                {current === total - 1 ? "Revisar" : "Próxima"}
              </AeroButton>
            </div>
          </>
        )}
      </div>
    </section>
  );
}