# Semana Acadêmica — aplicação web

MVP para centralizar inscrição, presença e certificados de eventos acadêmicos.

**Status atual:** autenticação administrativa implementada (login, logout, sessão
e proteção de `/admin`). CRUD de eventos, inscrição pública, presença e
certificados ainda serão implementados nas próximas etapas.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- SQLite local via libSQL (`@libsql/client`)
- Drizzle ORM + drizzle-kit
- `iron-session` para a sessão administrativa
- Vitest
- Produção prevista: Vercel + Turso (SQLite gerenciado)

## Requisitos

- Node.js 22.13 ou superior (versão declarada em `package.json`; os scripts de
  banco usam `--env-file-if-exists`)
- npm

## Instalação e configuração local

```bash
cd app
npm install
cp .env.example .env.local
```

Edite `.env.local` e preencha as variáveis descritas abaixo. Depois, aplique as
migrations e, se quiser, carregue o evento fictício de desenvolvimento:

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Acesse:

- aplicação: <http://localhost:3000>
- login da coordenação: <http://localhost:3000/login>
- área administrativa: <http://localhost:3000/admin>
- health check do banco: <http://localhost:3000/api/health>

O arquivo `.env.local` não é versionado. Nunca commite senhas, tokens ou
credenciais.

## Variáveis de ambiente

| Variável | Obrigatória | Função | Valor local de exemplo |
| --- | --- | --- | --- |
| `DATABASE_URL` | Sim (há fallback local) | URL do banco libSQL/SQLite. Sem a variável, o código usa `file:local.db`; em produção use a URL do Turso. | `file:local.db` |
| `DATABASE_AUTH_TOKEN` | Apenas em banco remoto | Token de acesso do Turso. Deve ficar vazio no banco local. | vazio |
| `ADMIN_PASSWORD` | Sim | Senha única da coordenação, comparada no login. Não possui valor padrão. | valor forte, somente em `.env.local` |
| `SESSION_SECRET` | Sim | Segredo usado para selar o cookie de sessão. Precisa ter no mínimo 32 caracteres. | gerado localmente, somente em `.env.local` |
| `APP_URL` | Não (reservada) | URL pública da aplicação, reservada para os links de certificados em etapas futuras. A autenticação atual não a utiliza. | `http://localhost:3000` |

As variáveis são lidas no servidor em tempo de execução. Elas não devem ser
prefixadas com `NEXT_PUBLIC_`.

### Gerar um `SESSION_SECRET`

Use um gerador criptográfico e mantenha o valor apenas em `.env.local` ou no
painel do ambiente de produção:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Trocar o `SESSION_SECRET` invalida todas as sessões existentes. O
`ADMIN_PASSWORD` deve ser forte e exclusivo deste aplicativo; não reutilize
senhas pessoais.

## Execução local

```bash
npm run dev
```

Para testar o build de produção localmente:

```bash
npm run build
npm start
```

O `npm start` exige que `npm run build` tenha sido executado antes.

## Autenticação

A autenticação é única para a coordenação: não há cadastro de usuários nem
perfis individuais no MVP.

### Fluxo

1. A coordenação acessa `/login` e informa a senha administrativa.
2. O formulário envia `POST /api/auth/login` com o campo `senha`.
3. Se a senha estiver correta, o servidor cria a sessão e define o cookie
   `admin_session`; a resposta redireciona para `/admin`.
4. O proxy valida a sessão antes de permitir o acesso a `/admin` e a suas
   subrotas.
5. A própria página `/admin` valida a sessão novamente no servidor.
6. O logout envia `POST /api/auth/logout`, encerra a sessão e redireciona para
   `/login`.

### Rotas

| Rota | Método | Comportamento |
| --- | --- | --- |
| `/login` | GET | Página de login. Se a sessão já for válida, redireciona para `/admin`. |
| `/api/auth/login` | POST | Autentica com o campo de formulário `senha`. Sucesso: `303` para `/admin`. Senha inválida ou corpo inválido: `303` para `/login?erro=1`. Falha de configuração: `303` para `/login?erro=2`. |
| `/api/auth/logout` | POST | Encerra a sessão e responde com `303` para `/login`. Também remove o cookie quando a configuração de sessão está indisponível. |
| `/admin` | GET | Área protegida. Sem sessão válida, redireciona para `/login`. |

As respostas de erro do login são genéricas para não revelar se o problema foi
a senha ou a configuração interna.

### Cookie e sessão

- Nome do cookie: `admin_session`.
- Conteúdo selado/criptografado pelo `iron-session`; os dados não são legíveis
  pelo navegador.
- `HttpOnly`, `SameSite=Lax`, `Path=/`.
- `Secure` é habilitado quando `NODE_ENV=production`; em desenvolvimento local
  via HTTP o cookie não usa `Secure`.
- Duração da sessão: 8 horas. O `Max-Age` do cookie é definido um minuto antes
  do vencimento do selo.
- A sessão só é considerada válida quando contém a marca `autenticado: true`.
- Cookies adulterados, expirados ou selados com outro segredo são rejeitados e
  tratados como sessão ausente.

### Proxy e validação de sessão

O arquivo `src/proxy.ts` usa a convenção de Proxy do Next.js 16 (antigo
`middleware`) e cobre o matcher `/admin/:path*`.

- Com sessão válida, a requisição continua para a página.
- Sem cookie, com cookie inválido/expirado ou com configuração ausente, o proxy
  responde com `303` para `/login`.
- Ao redirecionar, query string e hash da URL original são descartados, evitando
  redirecionamentos para destinos externos (open redirect).
- A validação usa `obterSessaoAdminDoProxy`, que adapta o cookie do proxy para o
  `iron-session` por meio de `nextProxyCookies`.

A página `/admin` repete a validação com `exigirSessaoAdmin(await cookies())`.
Essa dupla verificação é intencional: o proxy faz a proteção preliminar e a
página não depende exclusivamente dele para autorizar o acesso.

### Falha fechada

`ADMIN_PASSWORD` ausente e `SESSION_SECRET` ausente ou com menos de 32
caracteres geram `ConfiguracaoAutenticacaoError`. Nesses casos:

- o login não autentica e retorna `/login?erro=2`;
- o proxy e a página administrativa redirecionam para `/login`;
- o logout ainda remove o cookie, quando possível.

### Limitações conhecidas da autenticação

- **Não há rate limiting nem bloqueio por tentativas no login.** Um atacante
  pode tentar senhas repetidamente; a proteção contra força bruta deve ser
  adicionada antes de um ambiente público de alto risco (por exemplo, na borda,
  no proxy ou no provedor de hospedagem).
- Não há usuários individuais, papéis ou trilha de auditoria; existe uma única
  senha compartilhada pela coordenação.
- Não há token CSRF explícito nos formulários. As rotas usam `POST` e o cookie
  usa `SameSite=Lax`; ainda assim, uma proteção CSRF dedicada pode ser
  necessária se o escopo crescer.
- A sessão é stateless: não há revogação individual no servidor. Trocar o
  `SESSION_SECRET` invalida todas as sessões; o logout remove o cookie do
  navegador atual.
- O cookie só recebe `Secure` em produção. Produção deve ser servida por HTTPS,
  caso contrário o navegador não enviará o cookie.
- O proxy não deve ser tratado como a única barreira de autorização; rotas
  futuras que executem ações administrativas devem validar a sessão no próprio
  servidor, como `/admin` já faz.

## Scripts

| Comando | Função |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Executa o build de produção |
| `npm run lint` | Análise estática com ESLint |
| `npm run typecheck` | Verificação de tipos com TypeScript |
| `npm test` | Testes automatizados (Vitest) |
| `npm run test:watch` | Testes em modo watch |
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

`npm test` executa a suíte do Vitest. Os testes de banco usam um SQLite
temporário e aplicam as migrations; os testes de autenticação usam um armazém
de cookies em memória e não precisam de banco.

A suíte cobre:

- configuração da sessão, cookie seguro em produção, segredo ausente/curto e
  senha ausente;
- comparação de senha com tamanhos diferentes;
- criação, leitura, expiração, adulteração e encerramento da sessão;
- login com sucesso, senha incorreta, corpo inválido e configuração ausente;
- logout com e sem configuração válida;
- proxy liberando sessão válida e bloqueando sessão ausente, adulterada,
  expirada ou sem configuração;
- redirecionamento sem preservar parâmetros de URL;
- proteção dupla da página `/admin`;
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
  presença sempre atuais). As páginas que consultam o banco ou a sessão devem
  declarar `export const dynamic = "force-dynamic"`. Isso evita as regras de
  `Suspense`/PPR e mantém o código compreensível.
- **PDF gerado sob demanda:** não haverá armazenamento de certificados; a
  elegibilidade será verificada no servidor em cada download.
- **Autenticação única da coordenação:** senha em variável de ambiente e
  cookie de sessão. Não haverá cadastro de usuários no MVP.
- **Proxy + validação na página:** o proxy protege `/admin` antes da renderização
  e a página repete a checagem no servidor.

## Configuração de produção (Vercel + Turso)

Plano principal: Vercel com Root Directory `app/` e Turso como banco.

1. Crie o banco no Turso e gere um token de acesso.
2. Configure no projeto da Vercel as variáveis `DATABASE_URL`,
   `DATABASE_AUTH_TOKEN`, `ADMIN_PASSWORD` e `SESSION_SECRET`. Quando a geração
   de certificados for implementada, configure também `APP_URL` com a URL
   pública. Use valores reais somente no painel do provedor, nunca no
   repositório.
3. Aplique as migrations no banco de produção com `npm run db:migrate` a partir
   de um ambiente confiável e com as credenciais corretas.
4. Publique com Root Directory `app/` e valide `/api/health`, `/login` e
   `/admin`. O acesso administrativo exige HTTPS para que o cookie `Secure` seja
   enviado.
5. Após um novo deploy, confirme a persistência dos dados e o health check.

O deploy não é executado automaticamente pelos scripts deste repositório.
Credenciais reais nunca devem ser gravadas em `.env.example`, no README ou em
qualquer arquivo versionado. Use `.env.local` (ignorado) ou o painel da Vercel.

## Riscos e pendências conhecidas

- `npm audit` registra vulnerabilidades moderadas em dependências de
  desenvolvimento, transitivas do `drizzle-kit` (`esbuild`). Elas não afetam o
  runtime e não foram corrigidas com `--force` para evitar quebra/downgrade.
- O deploy deve ser validado manualmente nos provedores; o repositório não
  contém credenciais nem automação de publicação.
- Pendentes de implementação: CRUD de eventos, inscrição pública, listagem de
  inscritos, presença, certificados PDF e consulta pública por código.
- A autenticação ainda não possui rate limiting, contas individuais, auditoria
  ou proteção CSRF explícita.
