# Registro Individual — Lorenzo Costa Schauenberg

> **Regra de ouro:** Sempre faça o commit da seção **ANTES da etapa** antes de começar a implementar ou rodar o agente. A data do commit comprova que a previsão veio antes do resultado.

---

## Modelo para Novas Etapas (copie e cole abaixo)

```markdown
## Etapa [N] — [Nome da etapa]
**Data:** AAAA-MM-DD
**Harness / Modelo / Versão:** [ex.: OpenCode vX.Y / Modelo Z]

### ANTES da etapa (commitar antes de rodar!)
- **Previsão de tempo:** [ex.: 2h]
- **O que vou delegar ao agente:** [...]
- **O que NÃO vou delegar:** [...]
- **Onde acho que vai dar problema:** [...]

### DEPOIS da etapa
- **Tempo real gasto:** [...]
- **Gasto com modelo:** [...]
- **O que o agente fez e eu aceitei direto:** [...]
- **O que eu tive de refazer ou corrigir:** [...]
- **Onde travei / o que precisei aprender:** [...]
- **O que surpreendeu:** [...]
- **O que só entendi depois (preencher na Semana 3, se aplicável):** [...]
```


## Semana 1 — Setup inicial

## Etapa [1] — [Estruturação do repositório e definição de arquitetura]

**Data:** 23/11/2026
**Hora inicial:** 15:01
**Hora final:** 15:22 (6 min modelo + 15 min revisão)

**Harness / Modelo / Versão:** [OpenCode v1.18.15 / Modelo DeepSeek V4.1 Flash max]

## 1. Situação atual do repositório
O agente identificou que o repositório está organizado adequadamente, mas ainda não possui implementação.
Diretório/arquivo	Finalidade
app/	Aplicação web (atualmente vazia).
docs/	Enunciado e cenários do trabalho.
registros/	Diário do grupo e registros individuais.
artigos/	Artigos individuais em PDF.
proposta.md	Proposta acadêmica.
README.md	Documentação principal.

Pendências antes de programar:
- [ ] Fazer commit das alterações de organização de diretórios.
- [ ] Corrigir referências de registro/ para registros/ no README e na proposta.
- [ ] Corrigir o .gitignore para permitir versionar .env.example.
- [ ] Remover o diretório tests/ vazio da raiz e utilizar app/tests/.
- [ ] Adicionar arquivos e diretórios de testes, cobertura e deploy ao .gitignore.
- [ ] Definir o fluxo de branches com o restante do grupo.

## 2. Arquitetura recomendada
Recomendação aprovada conceitualmente
O agente propôs uma arquitetura de monólito full-stack.

Isso significa que frontend, backend, autenticação, regras de negócio e geração de certificados ficarão dentro de uma única aplicação Next.js.

O fluxo será:
1. A coordenação acessa o sistema e faz login.
2. Cadastra e publica um evento.
3. Os participantes acessam a página pública e realizam suas inscrições.
4. A coordenação consulta os inscritos e registra presenças.
5. O participante consulta seu certificado por um código único.
6. Se tiver presença confirmada, pode baixar o certificado em PDF.
Por que essa arquitetura é interessante?
- Um único projeto para desenvolver e hospedar.
- Menos configurações de infraestrutura.
- Não exige API REST independente.
- Menos componentes para o agente gerenciar.
- Menor complexidade para compreender e manter o código na terceira semana.

## 3. Stack

* **Next.js + React:** Framework full-stack com App Router.
* **TypeScript:** Linguagem com tipagem estática.
* **Tailwind CSS:** Estilização da interface.
* **SQLite / libSQL:** Banco de dados local e remoto.
* **Turso:** Banco libSQL gerenciado para produção.
* **Drizzle ORM:** Mapeamento e operações com banco de dados.
* **Zod:** Validação dos dados recebidos.
* **Vitest:** Testes automatizados.
* **Vercel:** Hospedagem e deploy.
* **OpenCode:** Agente de desenvolvimento.

## 4. Requisitos
O agente identificou 15 requisitos e os dividiu em três prioridades.
ID	Funcionalidade	Prioridade
RF01	Criar e editar eventos	Must
RF02	Publicar/despublicar eventos	Must
RF03	Listar eventos públicos	Must
RF04	Inscrever participantes	Must
RF05	Validar inscrições e e-mails duplicados	Must
RF06	Gerar código de certificado	Must
RF07	Login e logout administrativo	Must
RF08	Listar participantes inscritos	Must
RF09	Registrar presença	Must
RF10	Gerar PDF para participantes presentes	Must
RF11	Consultar e baixar certificados	Must
RF12	Exibir contadores de inscritos e presentes	Should
RF13	Pesquisar participantes	Should
RF14	Corrigir nome de participante	Out
RF15	Excluir ou arquivar evento	Out

---

## Semana 2 - Implementação da estrutura do projeto

**Data:** 23/11/2026
**Hora inicial:** 15:15
**Hora final:** 15:37 (11 min modelo + 11 min revisão)

**Harness / Modelo / Versão:** [OpenCode v1.18.15 / Modelo DeepSeek V4.1 Flash max / até agora 150k tokens]

## Etapa [2] — [Implementação da fundação técnica do MVP]

Nesta etapa, o OpenCode foi responsável pela criação da fundação técnica da aplicação, utilizando Next.js, TypeScript, Drizzle ORM e libSQL.

Foram implementados o schema inicial do banco de dados, a migration, um seed com dados explicitamente fictícios e um endpoint de health check que realiza uma consulta real ao banco.

Durante a implementação, surgiram problemas relacionados à compatibilidade de dependências e à configuração ESM do Vitest. O agente identificou e corrigiu essas questões, além de optar pela remoção de recursos de cache do scaffold para reduzir a complexidade da aplicação.

Apesar da validação local bem-sucedida, o deploy permaneceu pendente devido à ausência de autenticação e credenciais dos provedores de hospedagem.

Até o encerramento desta etapa, nenhuma funcionalidade central do produto havia sido implementada. Portanto, o resultado representa a preparação da infraestrutura necessária para o desenvolvimento do MVP, e não a entrega de uma versão funcional do sistema de gerenciamento de eventos.

24/11/2026 ~8:30

**PROCEDIMENTO MANUAL** - Como o deploy não pôde ser realizado, o agente recomendou que a equipe execute manualmente os seguintes passos para validar a fundação técnica:
1. autenticação de credenciais no Vercel e Turso;
2. criação de um projeto no Vercel e configuração do domínio;
3. criação de um banco de dados no Turso e configuração do acesso remoto;
4. configuração das variáveis de ambiente na Vercel e em `.env.local`, sem gravar credenciais reais no `.env.example`.

24/11/2026 9:32

**ATUALIZAÇÃO - PROCEDIMENTO MANUAL**: Após a execução dos passos acima, o deploy foi realizado com sucesso. No entanto, o agente detectou que as configurações de Build (Next.js) e Root Directory (`app/`) não estavam sendo salvas corretamente na Vercel.

- Problema: configurações de build e diretório raiz não estavam salvas.
- Causa identificada: configuração incorreta na Vercel.
- Intervenção: ajuste manual das configurações.
- Resultado: novo deployment para validação.

Corrigi ambas as configurações e realizei um novo deployment.

Agora, o agente deve prosseguir com a validação do ambiente de produção:

1. Testar a rota `/`.
2. Testar `/api/health`.
3. Confirmar a conexão com o banco remoto Turso.
4. Verificar se as migrations estão aplicadas.
5. Validar a persistência dos dados após um novo deployment.

Objetivo atual: apresentar os resultados de cada teste e, caso tudo esteja funcionando, considerar concluída a etapa de infraestrutura e apresente o planejamento da próxima funcionalidade do MVP.

