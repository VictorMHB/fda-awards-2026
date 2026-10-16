# FDA Awards 2026

Site do FDA Awards 2026: a página do evento, a votação do público com login Google e o painel de administração das categorias.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) com React 19 e TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Firebase](https://firebase.google.com): Authentication (login Google) e Firestore no navegador, Firebase Admin SDK nas rotas de servidor

## Como rodar

Requisitos: Node.js 20.9 ou superior e um projeto Firebase com o login Google ativado e o Firestore criado.

```bash
npm install
cp .env.example .env.local   # preencha as variáveis abaixo
npm run dev
```

O site sobe em [http://localhost:3000](http://localhost:3000).

### Variáveis de ambiente

| Variável | Para que serve | Onde encontrar |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_*` (as seis do `.env.example`) | Firebase no navegador. Obrigatórias também no build | Console do Firebase → Configurações do projeto → Seus apps (app web) |
| `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY` | Firebase Admin nas rotas de API, só no servidor | Configurações do projeto → Contas de serviço → Gerar nova chave privada. A chave pode ficar em uma linha, com `\n` no lugar das quebras |
| `ADMIN_UID` | UID da conta que acessa `/admin` | Console do Firebase → Authentication → Usuários |

Sem as variáveis `NEXT_PUBLIC_FIREBASE_*`, o `npm run build` falha com `auth/invalid-api-key`. As credenciais de admin só são lidas no primeiro uso, então o build não depende delas.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Sobe o build de produção |
| `npm run lint` | ESLint |

## Como funciona

### Fases do evento

As datas da votação e da cerimônia ficam em `src/lib/phases.ts`, no horário de Brasília. A partir delas o site sabe em que fase está (antes da votação, votação aberta, aguardando a cerimônia, ao vivo e encerrado), e a contagem regressiva, o aviso no topo das páginas e a API de votação acompanham sozinhos. Para mudar uma data, basta editar esse arquivo.

### Votação

1. O login é feito com Google. Em seguida, `POST /api/session` troca o token do Firebase por um cookie de sessão `session` (httpOnly, válido por 5 dias), que as páginas do servidor usam para identificar o usuário.
2. Cada conta tem uma cédula em `votantes/{uid}` no Firestore. As escolhas são salvas na hora e podem ser trocadas até a confirmação.
3. `POST /api/votar` confirma a cédula: em uma transação, verifica se todas as categorias têm um indicado válido e marca o voto como confirmado. Depois disso, a cédula não muda mais.

Em produção, a API só aceita votos dentro do período definido em `phases.ts`. Com `npm run dev` o prazo não é aplicado, para permitir testar a votação fora das datas.

### Painel de administração

`/admin` só abre para a conta cujo UID está em `ADMIN_UID`. Nele é possível criar, editar e excluir categorias e indicados, que ficam na coleção `categorias` do Firestore, ordenados pelo campo `ordem`.

> As regras de segurança do Firestore são configuradas no console do Firebase e não estão versionadas neste repositório.

## Estrutura

```
src/
├── app/            # páginas (App Router), rotas de API e estilos
│   ├── api/        # session, votar e admin/categorias
│   ├── admin/      # painel de categorias
│   ├── votacao/    # cédula de votação (exige login)
│   └── styles/     # CSS em camadas: core, components e features
├── components/     # layout (header, footer, menus), notícias, feedback e ui
├── context/        # AuthContext, com o usuário logado
├── hooks/          # sessão, cédula, categorias e relógio compartilhado
├── lib/            # Firebase (cliente e admin), sessão e fases do evento
└── types/          # tipos da votação
```

## Como contribuir

- Uma branch por issue, criada a partir da `main` (`feat/…`, `fix/…`, `refactor/…`).
- Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat:`, `fix:`, `refactor:`, `docs:`).
- PR pequeno para a `main`, com prints quando a mudança for visual. O merge é feito com **Squash and merge**.
- Antes de abrir o PR, rode `npm run lint` e `npm run build` e confira que não há erros novos.

## Deploy

O projeto roda em qualquer hospedagem com suporte a Next.js, como a Vercel:

1. Configure no ambiente de produção as mesmas variáveis do `.env.local`.
2. Adicione o domínio de produção em Authentication → Configurações → Domínios autorizados, no console do Firebase. Sem isso, o login com Google é bloqueado.

---

Feito por **Vermes Corp.** © 2026 FDA Awards. Todos os direitos reservados.
