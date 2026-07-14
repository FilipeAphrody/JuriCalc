# Especificação de Módulos do Sistema (LexCalc Pro)

Este documento detalha todos os módulos funcionais, motores de cálculo e requisitos não-funcionais que compõem a arquitetura do sistema LexCalc Pro.

---

## 1. Módulos Core de Gestão

### 1.1. Cadastro de Clientes
Gestão centralizada de pessoas físicas (PF) e jurídicas (PJ).
- **Campos Base:** Nome, CPF/CNPJ, RG, OAB (opcional para partes advogadas), Endereço, Telefone, Email, Observações.
- **Relacionamentos:** Um cliente pode estar atrelado a múltiplos processos (1:N).

### 1.2. Cadastro de Processos
Módulo de acompanhamento do ciclo de vida processual.
- **Campos:** Número CNJ, Tribunal, Vara, Classe Processual, Área (Trabalhista, Cível, Previdenciária, Tributária, Bancária, Família, Consumidor), Status, Datas Importantes.
- **Vínculos:** Partes envolvidas, Advogados, Arquivos anexos e Observações.

### 1.3. Gestão de Documentos
Repositório isolado (Tenant-based) para documentos do processo.
- **Formatos suportados:** PDF, DOCX, XLSX, CSV, Imagens.
- **Recursos:** Organização em pastas, Versionamento, Tags e Comentários.

---

## 2. Base Matemática e Índices

### 2.1. Base de Índices
Tabela única e centralizada para todos os motores.
- **Estrutura:** Nome, Origem, Fonte Oficial, Data/Competência, Valor (Mensal/Diário), Periodicidade, Histórico.
- **Exemplos de Cobertura:** IPCA, INPC, IGP-M, SELIC, TR, CDI, UFIR, TJLP, INPC Previdenciário.

### 2.2. Atualização Monetária (Motor Parametrizável)
Motor flexível para atualização de qualquer valor genérico.
- **Entradas:** Valor Inicial, Data Inicial, Data Final, Índice de Correção.
- **Acionadores:** Juros (capitalização), Multas, Honorários.
- **Saídas:** Tabela completa, Resultado final e Memória de Cálculo.

### 2.3. Motor de Juros
- **Suporte:** Simples e Compostos.
- **Periodicidade:** Mensal, Diário, Anual.
- **Tipos:** Percentual fixo, Percentual variável, SELIC (que atua como juros e correção simultaneamente em áreas tributárias).

---

## 3. Motores de Cálculo Independentes (O Coração)
Cada cálculo roda em um módulo isolado, mas compartilhando as bases matemáticas.

### 3.1. Módulo Trabalhista
- **Campos:** Salário, Data admissão, Data demissão, Jornada.
- **Verbas:** Horas extras, DSR, Adicional noturno, Insalubridade, Periculosidade, Férias, 13º, FGTS, Multa FGTS (40%), Aviso prévio, INSS, IRRF.
- **Saída:** Reflexos cruzados, Resultado e Memória Detalhada.

### 3.2. Módulo Previdenciário
- **Escopo:** Tempo de contribuição, Carência, Salários de contribuição, RMI (Renda Mensal Inicial), Atrasados (parcelas vencidas), Revisões.
- **Incidências:** Correção monetária e Juros específicos da Fazenda Pública.

### 3.3. Módulo Bancário
- **Sistemas de Amortização:** Tabela Price, SAC, SACRE.
- **Indicadores:** Parcelas, Amortização, Saldo Devedor, Taxa Efetiva, CET (Custo Efetivo Total).
- **Análises:** Apuração de Juros abusivos e Simulações de renegociação.

### 3.4. Módulo Tributário
- **Escopo:** Atualização exclusiva via SELIC (acumulada simples).
- **Ações:** Compensações, Restituições e Repetição do indébito (com ou sem multas de ofício).

### 3.5. Módulos Cíveis Diversos
- **Família:** Pensão alimentícia, Parcelas atrasadas, Correção, Execução.
- **Inventário:** Herança, ITCMD, Partilha, Percentuais ideais, Bens, Dívidas.
- **Consumidor:** Restituição, Repetição do indébito em dobro, Danos Morais.
- **Condomínio:** Taxas atrasadas, Juros (1% a.m.), Multas (limite 2%), Correção.
- **Aluguéis:** Reajustes (IGP-M/IPCA), Correção de inadimplência, Multas contratuais.
- **Execução de Sentença:** Principal, Honorários sucumbenciais (Art. 523), Custas, Correção, Juros.

---

## 4. Funcionalidades Transversais

### 4.1. Simulações e Comparação
- Capacidade de alterar índices e taxas de juros "on-the-fly" para comparar diferentes cenários jurídicos (ex: Tese IPCA-E vs TR).

### 4.2. Relatórios e Exportação
- **Formatos:** PDF (com validade visual para anexar aos autos), Excel, CSV e Impressão nativa.
- **Tipos:** Memória de cálculo descritiva e Laudo Técnico pericial.

### 4.3. Dashboard e Agenda
- **Dashboard:** KPIs do escritório (Processos ativos, Clientes, Montantes calculados em litígio), Alertas e Gráficos analíticos.
- **Agenda:** Gestão de Prazos, Audiências, Lembretes (Roadmap: Integração Google Calendar).

### 4.4. Busca Global (Omnisearch)
- Indexação para busca rápida por: Cliente, Processo, CPF, CNJ e Tags.

---

## 5. Requisitos Não-Funcionais (Core Tech)

### 5.1. Auditoria e Versionamento
- **Logs Imutáveis:** Toda alteração no banco gera log (Quem alterou, Quando, Valor antigo, Valor novo).
- **Controle de Versões:** Cada cálculo gera snapshots (V1, V2, V3) permitindo comparação entre versões de um mesmo parecer.

### 5.2. Segurança e Conformidade
- **LGPD:** Dados sensíveis mascarados/protegidos.
- **Criptografia:** AES-256 (dados em repouso) e TLS 1.3 (dados em trânsito).
- **Acesso:** Autenticação 2FA, RBAC (Role-Based Access Control) por papéis de escritório.
- **Infraestrutura:** Backups automáticos diários e Rate Limiting nas APIs contra ataques de força bruta.

### 5.3. Camada de Integração (API)
- **Tecnologia:** REST API purista documentada via OpenAPI/Swagger.
- **Autenticação de Máquina:** Suporte a OAuth2 e API Keys.
- **Webhooks:** Para disparo de eventos assíncronos.

### 5.4. Integrações Futuras (Roadmap Jurídico)
- **Tribunais:** PJe, e-SAJ, Projudi, Eproc, integrações CNJ e Diários Estaduais.
- **Órgãos Federais:** Receita Federal (CNPJ/Restituições), INSS (Meu INSS) e Banco Central (BacenJud/Sisbajud, APIs de cotações).
