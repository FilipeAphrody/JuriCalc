# Tarefas Futuras: Refatoração Backend V2 (Microserviços & DDD)

Este roadmap documenta os passos necessários para transicionar o MVP atual para a arquitetura alvo.

## Fase 1: Fundação do Legal Knowledge Base (LKB)
- `[ ]` Task V2-01: Modelagem do Banco de Dados para LKB (Tabelas de Leis, Súmulas, Jurisprudências).
- `[ ]` Task V2-02: Implementação do **Rule Engine** (Tabelas de Regras, Vigências e Condições dinâmicas).
- `[ ]` Task V2-03: Implementação do **Formula Engine** (Módulo avaliador matemático AST/Dinâmico).

## Fase 2: Serviços de Domínio e Sincronização
- `[ ]` Task V2-04: Criação do **Index Service** (Tabelas e APIs exclusivas para INPC, IPCA, SELIC, etc).
- `[ ]` Task V2-05: Implementação do **Provider Pattern** (Interfaces abstratas `IndexProvider`, `GovernmentProvider`).
- `[ ]` Task V2-06: Configuração do **Government Sync Service** com Celery e Redis (Cronjobs noturnos para BCB/IBGE/TRTs).

## Fase 3: Cache e Escalabilidade
- `[ ]` Task V2-07: Implementação do Redis como camada de Cache intermediária entre o Banco e as requisições.
- `[ ]` Task V2-08: Estruturação do API Gateway (Kong ou Nginx) para roteamento de serviços.

## Fase 4: Desacoplamento do Monolito (Microserviços)
- `[ ]` Task V2-09: Extração do **Authentication & User/Tenant Service**.
- `[ ]` Task V2-10: Extração do **Calculation Service**.
- `[ ]` Task V2-11: Extração do **Process & Document Service**.
- `[ ]` Task V2-12: Configuração de comunicação Inter-Service (gRPC ou RabbitMQ/Event Bus).

## Fase 5: SaaS Enterprise e Feature Flags
- `[ ]` Task V2-13: Restrições duras (Hard Limits) por `Plan` (Starter, Pro, Business, Enterprise) acopladas ao Gateway.
- `[ ]` Task V2-14: Monitoramento e Tracing Distribuído (OpenTelemetry / Jaeger).
