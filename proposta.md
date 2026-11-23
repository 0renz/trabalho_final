# Proposta — Cenário 8: *Será que dá mesmo em uma semana?*

- **Data original:** 2026-11-21 (Semana 1)
- **Grupo:** Lorenzo Costa Schauenberg e Nícolas Pelizari Scopel
- **Status:** Rascunho inicial — revisar com o grupo e validar com o professor antes de iniciar o código na Semana 2.

---

## 1. Curiosidade (o que queremos descobrir)

Dá para conceber e desenvolver um produto em uma semana usando agentes de programação? E o que acontece na semana seguinte, quando precisamos viver com o que foi construído (corrigir, mudar e entender)?

## 2. Hipóteses de partida (escritas antes de começar)

> *Preencham ou ajustem abaixo com as expectativas reais de cada integrante antes de iniciar o desenvolvimento.*

- **Lorenzo Costa Schauenberg:** Espero ter algo funcionando ao fim de uma semana (Semana 2), e que na semana seguinte (Semana 3) eu descubra partes do sistema construído pelo agente que não entendi bem durante a entrega rápida. *(Ajustar com seu "por quê" antes da conversa com o professor.)*
- **Nícolas Pelizari Scopel:** Espero ter algo funcionando ao fim de uma semana (Semana 2), e que na semana seguinte (Semana 3) eu descubra partes do sistema construído pelo agente que não entendi bem durante a entrega rápida. *(Ajustar com seu "por quê" antes da conversa com o professor.)*

<!--
Caso a hipótese mude no caminho, NÃO apague a original acima.
Escreva a nova hipótese abaixo da antiga, com a data e o motivo:
### Revisão da hipótese — Data: AAAA-MM-DD
- Motivo: ...
- Nova hipótese: ...
-->

## 3. A pessoa do cenário e o pedido

- **Pessoa:** Coordenação de um curso organizando a semana acadêmica (hoje faz tudo com formulário, planilha e certificado à mão).
- **Pedido (com as palavras dela, sem detalhes técnicos):**
  > "Queria inscrição, presença e certificado num lugar só."

## 4. O que vamos construir e o que conta como "entregue" (Semana 2)

Vamos construir uma aplicação web simples (stack a definir: framework full-stack + SQLite ou Postgres + geração de PDF para certificados + hospedagem) usando dados **100% fictícios**.

**Critério combinado do que conta como entregue no fim da Semana 2 (para evitar o "só mais um dia"):**
1. Formulário de inscrição funcionando com dados fictícios.
2. Tela da coordenação para listar inscritos e registrar presença.
3. Geração de certificado em PDF apenas para quem teve presença confirmada.
4. Aplicação publicada e acessível em serviço de deploy (`[definir plataforma]`).

**Fora do escopo inicial da Semana 2 (se não der tempo, cortar formalmente no registro):**
- Envio automático de certificados por e-mail;
- Leitura de QR Code para presença;
- Editor visual de layout do certificado.

## 5. O que cada um vai observar em si e onde vai registrar

- **O que observar:**
  - Previsão de prazo antes de cada etapa contra o tempo real acontecido;
  - O que precisou entender só depois que o sistema ficou pronto;
  - O que o agente gerou e foi aceito, o que precisou refazer e o que não foi delegado;
  - Horas trabalhadas e gasto com modelos.
- **Onde registrar:**
  - [registros/diario_grupo.md](registros/diario_grupo.md) (decisões de arquitetura, cortes de escopo, teto e gastos de API, checkpoints);
  - [registros/registro_lorenzo.md](registros/registro_lorenzo.md) (observações individuais de Lorenzo);
  - [registros/registro_nicolas.md](registros/registro_nicolas.md) (observações individuais de Nícolas).
- **Teto de gasto combinado:** `[definir valor máximo antes de começar]`
- **Harness / modelos previstos:** `[ex.: OpenCode + modelo X]`

## 6. Onde aperta

- A vontade de pedir *"só mais um dia"* na Semana 2 para terminar funcionalidades atrasadas.
- Detalhes implícitos que a coordenação esqueceria de dizer (ex.: inscrição duplicada, correção de nome para o certificado, presença única vs. por palestra).
