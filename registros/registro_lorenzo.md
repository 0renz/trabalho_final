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

---

## Semana 1 — Setup inicial

```markdown
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
```

---

## Semana 2 - Implementação da estrutura do projeto 

```markdown

```

---

## Semana 1 — Setup inicial
