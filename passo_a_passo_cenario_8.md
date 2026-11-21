# Exemplo de Passo a Passo — Cenário 8: *"Será que dá mesmo em uma semana?"*

> **Base documental:** Este guia prático foi elaborado a partir das regras, critérios de avaliação e orientações de [enunciado.pdf](file:///home/tatiana/trabalho_final/enunciado.pdf) e da especificação do **Cenário 8** em [cenarios.pdf](file:///home/tatiana/trabalho_final/cenarios.pdf) (disciplina **Programação Agêntica**, Prof. Élder F. F. Bernardi, IFSul — Campus Passo Fundo).
>
> **Importante:** O foco do trabalho final não é apenas o software entregue, mas **observar em primeira pessoa como você e seu grupo desenvolvem com agentes**. O produto pode ficar incompleto — desde que tudo esteja registrado com honestidade e evidência no histórico do Git.

---

## Visão Geral do Cenário 8

No Cenário 8, **o próprio cenário já é o experimento**: você não precisa comparar duas metodologias diferentes. Basta executar o desafio e observar o que acontece com o grupo e com você.

- **Curiosidade:** Dá para conceber e desenvolver um produto em uma semana? O que acontece na semana seguinte?
- **Cenário:** A coordenação de um curso organiza a semana acadêmica usando formulário, planilha e certificado feito à mão.
  - *Pedido (na voz da pessoa):* `"Queria inscrição, presença e certificado num lugar só."`
- **Dinâmica central:** Tentar conceber, construir e entregar o produto completo na **Semana 2** e usar a **Semana 3** para viver com o que foi construído — **corrigir, mudar e entender**.
- **Hipótese de partida (exemplo base):** *"Espero ter algo funcionando em uma semana, e que a semana seguinte seja de descobrir o que eu não entendia no que foi construído."*
- **O que observar em você:**
  1. A sua **previsão de prazo** contra o que realmente aconteceu.
  2. O que você teve de **entender só depois de pronto**.
- **Onde aperta:** A vontade de *"só mais um dia"* na Semana 2. **Combinem antes o que conta como entregue.**
- **Tecnologias e ferramentas sugeridas (exemplos intercambiáveis):**
  - Stack web simples (ex.: framework full-stack + SQLite ou Postgres), biblioteca de geração de PDF para os certificados, serviço de hospedagem/deploy.
  - Harness/ferramentas: OpenCode (ou agente equivalente), `git`, serviço de deploy.
- **Tópicos trabalhados:** estimativa, MVP, dívida técnica, compreensão de código gerado, manutenção.

---

## Estrutura Sugerida do Repositório Git

Crie o repositório do grupo já na **Semana 1**, dê acesso ao professor e mantenha todo o trabalho versionado desde o primeiro dia (a data dos commits comprova que previsões e hipóteses vieram antes dos resultados).

```text
trabalho-final-cenario8/
├── .gitignore                 # Ignorar .env, chaves, node_modules/venv, banco local
├── proposta.md                # Proposta de meia página (commit anterior a qualquer código!)
├── registro/
│   ├── diario_grupo.md        # Decisões, cortes de escopo, gastos de API e checkpoints
│   ├── diario_integrante1.md  # Previsões antes de cada etapa e observações individuais
│   ├── diario_integrante2.md
│   └── diario_integrante3.md
├── app/                       # Código do sistema da Semana Acadêmica (criado só na Semana 2)
└── artigos/                   # Entregue até a segunda-feira após a Semana 4
    ├── artigo_integrante1.pdf # Modelo SBC, até 6 páginas
    ├── artigo_integrante2.pdf
    └── artigo_integrante3.pdf
```

### Regras de Segurança e Cuidados Obrigatórios (antes de qualquer passo)
1. **Nunca** faça commit de senhas, tokens ou credenciais de API no repositório.
2. **Nunca** envie dados pessoais reais (nomes, CPFs, e-mails reais de alunos ou professores) para o modelo ou para o repositório — use dados **100% fictícios** nos testes.
3. **Ambiente descartável:** se forem testar skills, distribuições ou código de terceiros, rodem antes em contêiner ou VM descartável.
4. **Teto de gasto:** definam um limite máximo de gasto com modelos/APIs antes de começar e registrem cada gasto no diário.

---

## Semana 1 — Curiosidade, Cenário, Hipótese e Preparação

### Passo 1.1: Escrever a proposta (`proposta.md`) respondendo às 6 perguntas
Respondam de forma enxuta (cerca de meia página) às 6 perguntas da seção *"Monte o seu"* de [cenarios.pdf](file:///home/tatiana/trabalho_final/cenarios.pdf).

**Exemplo preenchido de `proposta.md`:**

```markdown
# Proposta — Cenário 8: Será que dá mesmo em uma semana?
Data original: AAAA-MM-DD (Semana 1)
Integrantes: [Nome 1], [Nome 2], [Nome 3]

## 1. Curiosidade
Queremos descobrir se é possível conceber e colocar no ar, em apenas uma semana
(Semana 2), um sistema funcional para gerenciar uma semana acadêmica usando agentes
de programação, e o que acontece na semana seguinte (Semana 3) quando precisamos
corrigir bugs, adaptar regras e entender o código que o agente escreveu.

## 2. Hipótese de partida (e por quê)
- Hipótese do grupo (ou individual): Esperamos conseguir colocar uma versão básica
  funcionando até o final da Semana 2, mas desconfiamos que vamos subestimar o tempo
  de ajustes finos (como geração de PDF e deploy) e que, na Semana 3, descobriremos
  partes críticas do código que aceitamos sem entender durante a pressa da entrega.
- Motivo: Agentes geram código rapidamente na fase inicial, o que cria sensação de
  progresso acelerado, mas decisões implícitas tendem a cobrar juros na manutenção.

## 3. A pessoa do cenário e o pedido
- Pessoa: Coordenadora de curso organizando a Semana Acadêmica de Computação.
- Pedido (nas palavras dela, sem detalhes técnicos):
  "Toda edição é a mesma correria: faço um formulário para inscrição, passo tudo para
  uma planilha na mão para conferir quem veio nas palestras e depois fico o fim de
  semana inteiro gerando certificado um por um e mandando por e-mail. Queria
  inscrição, presença e certificado num lugar só."

## 4. O que vamos construir e o que conta como "entregue" (corte do MVP)
Vamos construir uma aplicação web simples (ex.: [framework escolhido] + SQLite +
geração de PDF) hospedada em [serviço de deploy].
Critério objetivo do que conta como entregue ao fim da Semana 2:
1. Página pública para participante fictício se inscrever na semana acadêmica;
2. Painel simples (protegido por senha básica de administração) para a coordenação
   visualizar inscritos e marcar presença;
3. Botão que gera e baixa o certificado em PDF apenas para participantes com presença
   confirmada;
4. Aplicação publicada em URL acessível (fora de `localhost`).
Fica explicitamente FORA da Semana 2 (se não sobrar tempo): envio automático de
e-mails, QR Code de presença, edição de layout do certificado pela interface.

## 5. O que cada integrante vai observar e onde vai registrar
- [Nome 1]: estimativa de horas vs. tempo real na parte de banco/inscrição e deploy;
- [Nome 2]: quantas vezes precisou intervir manualmente na geração do PDF;
- [Nome 3]: quanto do código aceito na Semana 2 conseguiu explicar sem reler tudo na Semana 3.
- Onde registrar: arquivos individuais em `registro/` + histórico de sessões/prompts +
  commits diários com previsão escrita ANTES de cada bloco de trabalho.
- Teto de gasto combinado: US$ [valor] no provedor de API / [plano].
- Harness e modelos previstos: [ex.: OpenCode + modelo X].

## 6. Onde aperta
A tentação de estender a Semana 2 com "só mais um dia" para terminar funcionalidades
que atrasaram, e a falta de clareza no pedido original sobre regras de presença
(ex.: presença no evento todo ou por palestra?).
```

### Passo 1.2: Commit da proposta e conversa com o professor
1. Faça o commit de `proposta.md` e da pasta `registro/` **antes de escrever qualquer linha de código do produto**.
2. Converse com o professor em aula para alinhar:
   - Se o recorte do que conta como "entregue" na Semana 2 faz sentido;
   - Como vocês farão o registro das observações e previsões;
   - Qual é o teto de gasto.
3. Se a conversa com o professor ajustar a hipótese ou o recorte, **faça um novo commit atualizando `proposta.md`** — essa versão combinada passa a valer como a hipótese original.

### Passo 1.3: Criar o modelo padrão de registro diário
Em `registro/diario_integranteX.md`, adote um bloco fixo de **Antes** e **Depois** para toda etapa de trabalho. **Nunca preencha o "Antes" depois que a etapa terminar.**

```markdown
## Etapa [N] — [Ex.: Fluxo de inscrição e banco SQLite]
**Data:** AAAA-MM-DD | **Integrante:** [Nome]
**Harness / Modelo / Versão:** [Ex.: OpenCode vX.Y + Modelo Z]

### ANTES da etapa (commitar antes de rodar o agente!)
- **Previsão de tempo:** [Ex.: 1h30min]
- **O que vou delegar ao agente:** [Ex.: criação do schema SQLite, rota de inscrição e formulário]
- **O que NÃO vou delegar:** [Ex.: revisão das validações de campos obrigatórios]
- **Onde acho que vai dar problema:** [Ex.: validação de e-mail duplicado e configuração do SQLite]

### DEPOIS da etapa
- **Tempo real gasto:** [Ex.: 2h45min] (Diferença: +1h15min)
- **Gasto com modelo / tokens:** [Ex.: US$ 0,18]
- **O que o agente fez e eu aceitei direto:** [Descrever]
- **O que eu tive de refazer ou corrigir:** [Descrever]
- **Onde travei / o que precisei aprender:** [Descrever]
- **O que surpreendeu:** [Ex.: o agente criou um sistema inteiro de autenticação que eu não pedi]
```

---

## Semana 2 — O Sprint de 1 Semana ("Entregar tudo na semana 2")

O objetivo da Semana 2 é simular a pressão real de conceber, construir e publicar um sistema funcional em **uma semana corrida**, medindo a distância entre suas estimativas e a realidade.

### Passo 2.1: Dia 1 — Estrutura inicial e modelagem mínima
1. **Antes de abrir o agente:** Cada integrante registra sua previsão para a criação do esqueleto do projeto e banco de dados, e faz commit no `registro/`.
2. Decidam em grupo as entidades mínimas (ex.: `Evento`, `Inscricao` com campo `presente: boolean`).
3. Peçam ao agente para inicializar o projeto com uma stack simples (sem arquitetura superdimensionada).
4. **Depois:** Anotem no registro se o agente escolheu bibliotecas que vocês conhecem ou se introduziu complexidade desnecessária, e quanto tempo levou para subir o ambiente local.

### Passo 2.2: Dia 2 — Inscrição e Painel de Presença (com dados fictícios)
1. **Antes:** Prevejam tempo e pontos de falha (ex.: validação de formulário, proteção mínima do painel administrativo). Commit do registro.
2. Construam com o agente:
   - Formulário de inscrição (nome fictício, e-mail fictício, curso/turma).
   - Painel da coordenação listando inscritos e permitindo marcar/desmarcar presença.
3. **Observação chave:** Reparem nas decisões que a coordenadora *não* disse no pedido original e que vocês (ou o agente!) tiveram que assumir no escuro — por exemplo: *"E se alguém tentar se inscrever duas vezes?"*, *"A presença é única ou por atividade?"*. Registrem isso!
4. **Depois:** Anotem o que aceitaram sem ler direito por causa da pressa (candidato forte a dar dor de cabeça na Semana 3).

### Passo 2.3: Dia 3 — Geração de Certificado em PDF
1. **Antes:** Estimem quanto tempo levará para gerar um PDF apresentável (ex.: nome do participante, nome do evento, carga horária, data, regra de só liberar se `presente == true`). Commit do registro.
2. Implementem com o agente usando uma biblioteca de PDF compatível com a stack (ex.: WeasyPrint/ReportLab em Python, PDFKit/Puppeteer/jsPDF em Node, etc.).
3. **Atenção:** Essa etapa costuma quebrar estimativas por causa de layout, fontes, caracteres acentuados do português (`ç`, `ã`, `é`) e dependências do sistema operacional.
4. **Depois:** Registrem exatamente onde travaram e se precisaram trocar de biblioteca ou assumir o código na mão.

### Passo 2.4: Dia 4 — Hospedagem (Deploy) e Teste Ponta a Ponta
1. **Antes:** Estimem o tempo de deploy (muitas vezes subestimado quando tudo "funciona na minha máquina"). Commit do registro.
2. Publiquem a aplicação em um serviço de hospedagem real (com banco persistente configurado ou volume para SQLite, sem credenciais commitadas).
3. Testem o fluxo completo em produção com dados fictícios:
   - Inscrever 5 participantes fictícios;
   - Marcar presença para 3 deles;
   - Tentar baixar certificado de quem veio (deve gerar PDF válido) e de quem faltou (deve bloquear).
4. **Depois:** Anotem diferenças entre ambiente local e deploy (ex.: biblioteca de sistema ausente para gerar PDF, perda de dados do SQLite ao reiniciar container).

### Passo 2.5: Dia 5 — Fechamento da Semana 2 (Sem "só mais um dia"!)
1. **Pare no prazo combinado.** Resistam à tentação de pedir *"só mais um dia"* na Semana 2.
2. Comparem o sistema publicado com os critérios de "entregue" definidos na `proposta.md`:
   - Tudo que **não entrou** deve ser formalmente **cortado** e documentado em `registro/diario_grupo.md` (*o que foi cortado e por quê*).
   - Façam uma tag ou anotação de commit marcando o estado final da Semana 2 (ex.: `git tag fim-semana-2`).
3. **Checkpoint da Semana 2 (em aula — 2 minutos):**
   - Apresentem em 2 minutos: o que conseguiram colocar no ar, o que ficou de fora, a diferença entre a previsão de prazo e o tempo real, e as primeiras surpresas com o agente.
   - **Todos os integrantes** precisam estar prontos para responder perguntas do professor sobre o código gerado até aqui.

---

## Semana 3 — Viver com o que foi Construído ("Corrigir, Mudar e Entender")

Na Semana 3, o foco muda de *velocidade de entrega* para **manutenção, compreensão e dívida técnica**. É aqui que vocês respondem à segunda metade da curiosidade do Cenário 8: *"O que acontece na semana seguinte?"*

### Passo 3.1: Simular o uso real pela coordenação (Teste de Estresse)
Criem situações realistas de "semana do evento" — de preferência com um integrante que **não escreveu** determinado módulo tentando dar manutenção nele:

- **Cenário de correção 1 (Bug de dados):** *"Um participante digitou o nome todo em minúsculo / com erro de digitação na inscrição, e o certificado saiu feio. Preciso editar o nome sem apagar a presença."*
- **Cenário de mudança 2 (Regra esquecida):** *"A coordenação lembrou que palestrantes e ouvintes têm textos diferentes no certificado (ou que há mais de uma palestra e precisa somar horas)."*
- **Cenário de uso 3 (Operação):** *"No dia do evento vieram 30 pessoas juntas; marcar presença uma por uma e recarregar a página toda hora está impossível, precisa de busca por nome."*
- **Cenário de auditoria 4 (Segurança/Integridade):** *"Descobrimos que dá para acessar `/certificado/2` direto pela URL e baixar o PDF de quem não teve presença."*

### Passo 3.2: Praticar a "arqueologia" do código gerado
Antes de pedir para o agente consertar tudo automaticamente:
1. Tentem localizar **manualmente** onde o agente implementou a regra ou o bug (leiam rotas, queries, templates).
2. Registrem no diário o momento exato em que vocês pensaram: *"Eu não fazia ideia de que o agente tinha feito isso assim!"*
3. Meçam o tempo para entender o código + corrigir, comparando com a previsão de tempo que vocês anotaram **antes** de mexer.
4. Experimentem pelo menos uma alteração **sem agente** (na mão) e outra **com agente**, anotando quando o agente ajudou a corrigir e quando ele quebrou outra parte por falta de contexto.

### Passo 3.3: Revisar a hipótese (se necessário)
Se durante a Semana 3 vocês perceberem que a hipótese inicial não fazia sentido ou mudou de direção:
- **Não apaguem a hipótese original!**
- Escrevam a nova hipótese **abaixo da antiga**, com a **data** e o **motivo da mudança**, tanto em `proposta.md` quanto no registro. (Lembrando: hipótese que não se confirma é resultado válido e **não perde nota**.)

### Passo 3.4: Checkpoint da Semana 3 (em aula — 2 minutos)
- Contem ao professor em 2 minutos o que aconteceu quando tentaram corrigir e mudar o sistema da Semana 2:
  - Onde a dívida técnica da pressa apareceu?
  - Que partes do código vocês só entenderam na Semana 3?
  - O que o grupo decidiu refazer na mão em vez de delegar novamente?

---

## Semana 4 — Fechamento, Apresentação e Artigo ("O Mapa")

### Passo 4.1: Fechamento da construção (até quinta-feira da Semana 4)
1. Encerrem alterações de código do sistema.
2. Verifiquem o repositório:
   - Nenhuma chave, `.env` ou dado pessoal real commitado;
   - Registro consolidado com horas totais, gasto total de API/modelos (comparado ao teto) e tags/datas claras entre Semana 2 e Semana 3.
3. Reúnam os números concretos a partir dos registros (nada inventado de memória!):
   - Total de etapas com previsão vs. tempo real;
   - Quantos cortes de escopo foram feitos na Semana 2;
   - Quantos bugs/dívidas técnicas surgiram na Semana 3;
   - O que foi aceito, refeito ou feito 100% sem agente.

### Passo 4.2: Apresentação do grupo (sexta-feira da Semana 4 — 5 minutos)
Montem uma apresentação enxuta de **5 minutos** focada nos **aprendizados** (mostrar o produto rodando é desejável, mas não obrigatório). Ordem sugerida pelo [enunciado.pdf](file:///home/tatiana/trabalho_final/enunciado.pdf):

1. **0:00 – 0:45 | Curiosidade e Hipótese:** *"Nossa pergunta era se dá para conceber e construir um sistema de semana acadêmica em uma semana, e o que acontece na semana seguinte. Esperávamos que..."*
2. **0:45 – 1:30 | Cenário e o que construíram:** *"Atendemos ao pedido da coordenação ('inscrição, presença e certificado num lugar só') com a stack X, cortando Y para caber na Semana 2."*
3. **1:30 – 3:00 | O que aconteceu e se a hipótese se sustentou:** Mostrar dados reais do registro — tempo previsto vs. realizado na Semana 2, e os sustos de manutenção na Semana 3.
4. **3:00 – 4:15 | O que aprenderam que não esperavam:** Cada integrante pode citar uma descoberta pessoal rápida (ex.: o que delegar/não delegar, onde o código gerado enganou).
5. **4:15 – 5:00 | Recado para o próximo grupo:** *"Se alguém começar o Cenário 8 no próximo semestre, nossa recomendação é..."*

> **Dica:** Anotem as perguntas feitas pela turma e pelo professor após a apresentação — vocês podem incorporá-las e discuti-las no artigo!

### Passo 4.3: Escrita do Artigo Individual (até segunda-feira seguinte pela manhã)
Cada pessoa do grupo escreve o **próprio artigo**, em **PDF**, no **modelo de artigos da SBC**, com **até 6 páginas**, salvo na pasta `artigos/` no último commit do repositório.

Escrevam pensando em um **colega do próximo semestre** que vai tentar fazer algo parecido: o artigo é o **mapa** mostrando por onde você passou, onde se perdeu e até onde esse mapa vale.

#### Estrutura sugerida para o artigo (baseada na Seção 7 do enunciado)
1. **Curiosidade e Hipótese**
   - Transcreva a pergunta e a hipótese exatamente como estavam na `proposta.md`, com a **data** (e eventual revisão datada).
2. **Cenário e Como Você Observou**
   - Descreva o pedido da coordenação, o recorte do que contava como entregue na Semana 2, a stack/harness/modelos utilizados e como o grupo registrou previsões e resultados no Git.
   - Deixe explícito **o que foi feito em grupo** e **o que foi feito por você**.
3. **O que Aconteceu (Semana 2 vs. Semana 3)**
   - Relato em **primeira pessoa**, apoiado exclusivamente em fatos e métricas presentes no registro do Git (previsões vs. tempos reais, cortes da Semana 2, problemas ao viver com o código na Semana 3).
4. **O que Você Aprendeu — *Seção mais longa do artigo***
   - O que você **delegaria** ao agente de novo (e em que condições);
   - O que você **não delegaria** (ou revisaria linha a linha antes de aceitar);
   - **Onde você se perdeu** (ex.: confiar na sensação de velocidade da Semana 2, aceitar abstrações que não entendia, subestimar deploy/PDF).
5. **Limites, Uso de IA na Escrita e Recado**
   - **Limites:** o que a sua evidência **não sustenta** (ex.: tamanho da amostra, um único projeto pequeno, dependência do modelo/harness usado na época, ausência de usuários reais da coordenação).
   - **Uso de IA no artigo:** explique transparentemente como usou IA para escrever/revisar o artigo.
   - **Recado:** orientação direta ao colega que for começar o Cenário 8.
6. **Referências**

---

## Checklist Final de Avaliação (para conferir antes do último commit)

Confira se o trabalho atende aos **4 critérios de avaliação (25% cada)** descritos em [enunciado.pdf](file:///home/tatiana/trabalho_final/enunciado.pdf):

- [ ] **Coerência (25%):** O sistema da semana acadêmica, o sprint da Semana 2 e a manutenção na Semana 3 respondem diretamente à pergunta sobre "desenvolver em uma semana e o que acontece depois"?
- [ ] **Evidência (25%):** Toda afirmação feita no seu artigo tem lastro em commits/registros datados na pasta `registro/` (e não foi reconstruída de memória)?
- [ ] **Primeira pessoa (25%):** O texto traz descobertas sobre *você* e *como você desenvolve com agentes* (em vez de ser apenas um manual técnico do produto)?
- [ ] **Domínio (25%):** Você explicou com segurança nos checkpoints e na apresentação a parte do código que construiu e as escolhas técnicas registradas no artigo?

### Cuidados que evitam conceito insuficiente
- Nunca escrever ou retrodatar a hipótese depois de já ter visto o resultado.
- Nunca afirmar no artigo algo que não está documentado no registro do Git.
- Nunca declarar como sua uma parte do código ou escolha técnica que você não sabe explicar.
