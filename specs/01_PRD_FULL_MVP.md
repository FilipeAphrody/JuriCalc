# PRD: LexCalc Pro - Full MVP
## 1. Visão Geral
Plataforma SaaS para cálculos judiciais abrangendo 12 domínios jurídicos. O sistema processa cálculos complexos atualizados por índices oficiais (IPCA, INPC, SELIC, etc.) de forma auditável e com versionamento.

## 2. Motores de Cálculo Requeridos (Domínios)
- **Civil & Contratos:** Atualização de dívidas, execução de sentença, liquidação de danos, condomínio, aluguel, devolução do consumidor. (Base: Valor + Índice + Juros + Multas + Honorários).
- **Trabalhista:** Integração de verbas (Horas extras, adicional noturno, insalubridade, FGTS 40%, 13º, férias, multas 467/477, INSS, IRRF).
- **Bancário:** Sistemas de amortização (Tabela Price, SAC, SACRE) e apuração de juros abusivos.
- **Previdenciário:** Cálculo de tempo de contribuição, RMI e benefícios atrasados.
- **Família & Sucessões:** Pensão alimentícia (parcelas vencidas/vincendas) e Inventário (Partilha, ITCMD).
- **Tributário:** Restituições, repetição de indébito e compensações (foco em SELIC).

## 3. Core e Requisitos Não-Funcionais
- **Base de Índices:** Tabela única centralizada alimentando todos os motores.
- **Auditoria e Segurança:** Histórico de alterações (Log) e versionamento de cada cálculo gerado (V1, V2).
- **Tipagem:** Obrigatório o uso do tipo `Decimal` (sem arredondamentos imprecisos de `float`).