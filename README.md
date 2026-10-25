# Finance Manager — Frontend

Interface do Finance Manager: login/cadastro, dashboard de finanças do household
(contas, cartões, gastos) e um design system próprio em `/design-system`.

## Stack

- Next.js (App Router) + React, Turbopack
- Vitest + Testing Library para testes de componente
- Tokens de design em camadas (`src/styles/tokens`) — primitivos → semânticos

## Rodando localmente

Pré-requisitos: Node 20+, backend rodando em `http://localhost:5228` (ver `../back`).

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`. Para apontar para outra API, defina
`NEXT_PUBLIC_API_BASE_URL` (ex.: `.env.local`).

## Testes

```bash
npm test          # roda uma vez
npm run test:watch
```

## Estrutura

- `src/app/` — rotas (`login`, `register`, `dashboard/*`, `design-system/*`)
- `src/components/ui/` — componentes de design system (Button, Input, DropdownMenu, etc.)
- `src/lib/auth/` — cliente de API de autenticação, armazenamento de tokens, sessão
- `src/styles/tokens/` — variáveis CSS de tema (claro/escuro)
