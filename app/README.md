# Semana Acadêmica — aplicação web

MVP para centralizar inscrição, presença e certificados de eventos acadêmicos.

**Status:** fundação local concluída (Etapa 1A). Cadastro de eventos, inscrição,
presença e certificados serão implementados nas próximas etapas.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- SQLite local via libSQL (`@libsql/client`)
- Drizzle ORM + drizzle-kit
- Vitest
- Produção prevista: Vercel + Turso (SQLite gerenciado)

## Requisitos

- Node.js 22 ou superior
- npm

## Configuração local

```bash
npm install
cp .env.example .env.local
npm run db:migrate
npm run db:seed
npm run dev
```

Acesse <http://localhost:3000>. O health check do banco fica em
<http://localhost:3000/api/health>.

O arquivo `.env.local` não é versionado. Nunca commite senhas, tokens ou
credenciais.

## Scripts

| Comando | Função |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Executa o build de produção |
| `npm run lint` | Análise estática com ESLint |
| `npm run typecheck` | Verificação de tipos com TypeScript |
| `npm test` | Testes automatizados (Vitest) |
| `npm run db:generate` | Gera migration a partir do schema Drizzle |
| `npm run db:migrate` | Aplica migrations no banco configurado |
| `npm run db:seed` | Insere um evento fictício para desenvolvimento |

## Banco de dados

- Desenvolvimento: arquivo local `app/local.db`, ignorado pelo Git.
- Produção: banco libSQL/Turso configurado por `DATABASE_URL` e
  `DATABASE_AUTH_TOKEN` no ambiente de deploy.

As migrations ficam em `src/db/migrations/` e são versionadas. Para aplicar
migrations em um banco remoto:

```bash
DATABASE_URL="libsql://..." DATABASE_AUTH_TOKEN="..." npm run db:migrate
```

Não execute `db:push` em produção. O fluxo é sempre gerar a migration,
revisá-la e aplicá-la.

## Modelo atual

- `eventos`: dados do evento, carga horária, publicação e responsável.
- `inscricoes`: dados do participante, presença e código do certificado.
  O e-mail é único por evento (comparação sem diferenciar maiúsculas).

A presença é registrada por evento, não por atividade/palestra. Essa é uma
decisão de escopo do MVP.

## Decisões técnicas

- **Cache Components desabilitado:** o app é dinâmico por natureza (listas e
  presença sempre atuais). As páginas que consultam o banco devem declarar
  `export const dynamic = "force-dynamic"`. Isso evita as regras de
  `Suspense`/PPR e mantém o código compreensível.
- **PDF gerado sob demanda:** não haverá armazenamento de certificados; a
  elegibilidade será verificada no servidor em cada download.
- **Autenticação única da coordenação:** senha em variável de ambiente e
  cookie de sessão. Não haverá cadastro de usuários no MVP.

## Deploy (a confirmar)

Plano principal: Vercel com Root Directory `app/` e Turso como banco.
Variáveis de ambiente necessárias no deploy:

- `DATABASE_URL`
- `DATABASE_AUTH_TOKEN`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`
- `APP_URL`

O deploy será validado na Etapa 1B.
