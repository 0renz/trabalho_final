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

- Node.js 22.9 ou superior (os scripts de banco usam `--env-file-if-exists`)
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

As migrations ficam em `src/db/migrations/` e são versionadas. Os scripts
`db:migrate` e `db:seed` carregam automaticamente `.env.local` quando ele
existe. Para aplicar migrations em um banco remoto, preencha
`DATABASE_URL`/`DATABASE_AUTH_TOKEN` nesse arquivo e execute:

```bash
npm run db:migrate
```

Também é possível passar as variáveis apenas para o comando, sem criar o
arquivo:

```bash
DATABASE_URL="libsql://..." DATABASE_AUTH_TOKEN="..." npm run db:migrate
```

Não execute `db:push` em produção. O fluxo é sempre gerar a migration,
revisá-la e aplicá-la.

## Testes

`npm test` executa testes de integração contra um banco SQLite temporário.
A suíte cobre:

- leitura de eventos e inscrições;
- unicidade de e-mail por evento sem diferenciar maiúsculas/minúsculas;
- permissão do mesmo e-mail em eventos diferentes;
- unicidade global do código de certificado;
- consistência entre `presente` e `presente_em`;
- carga horária válida nos limites 1 e 200 e rejeição de 0/201.

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

## Deploy (pendente)

Plano principal: Vercel com Root Directory `app/` e Turso como banco.

**Status:** ainda não validado. O ambiente não possui Vercel CLI, Turso CLI,
tokens ou sessões autenticadas; nenhum recurso externo foi criado.

Passos previstos:

1. criar o banco no Turso e gerar um token de acesso;
2. configurar `DATABASE_URL` e `DATABASE_AUTH_TOKEN` em `.env.local`
   (desenvolvimento remoto) e nas variáveis do projeto na Vercel;
3. aplicar a migration com `npm run db:migrate`;
4. configurar também `ADMIN_PASSWORD`, `SESSION_SECRET` e `APP_URL` na Vercel;
5. publicar com Root Directory `app/` e validar `/api/health` e a persistência
   após um novo deploy.

Credenciais reais nunca devem ser gravadas em `.env.example`, no README ou em
qualquer arquivo versionado. Use `.env.local` (ignorado) ou o painel da Vercel.

## Riscos e pendências conhecidas

- `npm audit` registra 4 vulnerabilidades moderadas em dependências de
  desenvolvimento, transitivas do `drizzle-kit` (`esbuild`). Elas não afetam o
  runtime e não foram corrigidas com `--force` para evitar quebra/downgrade.
- Deploy remoto bloqueado até haver autenticação nos provedores.
- Pendentes de implementação: autenticação administrativa, CRUD de eventos,
  inscrição pública, listagem de inscritos, presença, certificados PDF e
  consulta pública por código.
