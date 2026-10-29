# Notícias

Cada notícia do site é um arquivo `.md` nesta pasta. A Home lê os arquivos no build e mostra as notícias no carrossel, da mais recente para a mais antiga. Ao clicar em um card, o texto completo abre em um modal.

Para publicar uma notícia, não é preciso mexer em nenhum componente: basta o arquivo `.md`, e a imagem de capa, se tiver.

## Como adicionar uma notícia

1. Crie um arquivo nesta pasta com o nome `AAAA-MM-DD-slug.md`, por exemplo `2026-11-20-indicados-anunciados.md` (veja [Nome do arquivo e slug](#nome-do-arquivo-e-slug)).
2. Copie o modelo abaixo e preencha o cabeçalho, que fica entre as duas linhas `---`.
3. Escreva o texto completo depois do cabeçalho.
4. Se a notícia tiver capa, coloque a imagem em `public/news/<slug>/cover.webp` (veja [Capa](#capa)).
5. Rode `npm run dev` e abra a Home para conferir. Depois de editar o arquivo, recarregue a página.

Se algo estiver errado no arquivo (um campo faltando, uma data inválida, um campo com nome errado), a página mostra um erro com o nome do arquivo e o problema, e o `npm run build` falha. É de propósito: é melhor o erro aparecer do que a notícia sumir ou ir para o site sem querer.

## Modelo

```markdown
---
title: "Indicados serão anunciados no fim de novembro"
date: "2026-11-20"
excerpt: "Resumo de uma ou duas linhas que aparece no card."
category: "Indicados"
cover: "/news/indicados-anunciados/cover.webp"
coverAlt: "Descrição da imagem para leitores de tela"
draft: false
---

Texto completo em Markdown. Parágrafos, **negrito**, [links](https://exemplo.com)
e listas funcionam.
```

## Campos do cabeçalho

Os textos vão entre aspas. Só o `draft` fica sem aspas.

| Campo | Obrigatório | Observação |
|---|---|---|
| `title` | sim | Título da notícia |
| `date` | sim | Formato `AAAA-MM-DD`, entre aspas. É a data mostrada e a que define a ordem |
| `excerpt` | sim | Resumo que aparece no card. No máximo ~160 caracteres (acima disso, o build avisa) |
| `category` | não | Aparece como etiqueta no card e no modal |
| `cover` | não | Caminho da capa dentro de `public/`, começando com `/` |
| `coverAlt` | sim, se houver `cover` | O que a imagem mostra, para quem usa leitor de tela |
| `draft` | não | `true` esconde a notícia do site |

Qualquer campo fora dessa lista faz o build falhar. Assim, um `drafts: true` digitado errado não publica a notícia sem querer.

## Nome do arquivo e slug

- O nome do arquivo segue o padrão `AAAA-MM-DD-slug.md`. A data na frente serve para os arquivos ficarem em ordem na pasta. A ordem no site vem do campo `date`.
- O **slug** é o nome do arquivo sem a data da frente e sem o `.md`: `2026-11-20-indicados-anunciados.md` tem o slug `indicados-anunciados`.
- O slug só pode ter letras minúsculas, números e hífens, sem acento e sem espaço.
- Duas notícias não podem ter o mesmo slug.

## Link para uma notícia

Toda notícia tem um link que abre a Home com ela já aberta: `/?news=<slug>`, por exemplo `/?news=indicados-anunciados`. É o mesmo endereço que aparece no navegador quando alguém clica no card, então dá para copiar de lá e compartilhar. Um link com slug que não existe (ou de uma notícia em rascunho) abre a Home normal, sem modal.

## Capa

- Cada notícia com capa tem uma pasta com o slug dela: `public/news/<slug>/cover.webp`.
- Use WebP, com no máximo 1200px de largura e cerca de 150 KB.
- No cabeçalho, o caminho começa depois de `public`: `cover: "/news/<slug>/cover.webp"`.
- Sem capa, o card usa o fundo padrão e o modal abre direto no título.

## Texto

Tudo o que vem depois do cabeçalho é o texto da notícia. Ele é obrigatório e aceita Markdown:

| Escreva | Para ter |
|---|---|
| Uma linha em branco entre os blocos | Parágrafos |
| `**texto**` | Negrito |
| `*texto*` | Itálico |
| `[texto](https://site.com)` | Link para outro site, que abre em nova aba |
| `[texto](/votacao)` | Link para outra página do site |
| `- item` ou `1. item` | Lista |
| `## Intertítulo` | Intertítulo |
| `> texto` | Citação |

HTML escrito no meio do texto aparece como texto e não vira HTML.

## Esconder uma notícia

Coloque `draft: true` no cabeçalho. A notícia some do site, mas o arquivo continua aqui. Para publicar, troque para `draft: false` ou apague a linha.
