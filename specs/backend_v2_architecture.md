# Especificação de Arquitetura Backend V2 (Microserviços & DDD)

Este documento guarda as especificações futuras para a refatoração completa do núcleo do sistema.

## 1. Arquitetura Geral
Separar o sistema em módulos independentes (Microserviços):
- Authentication Service
- User & Tenant Service
- Process Service
- Client Service
- Document Service
- Calculation Service
- Rule Engine
- Formula Engine
- Index Service
- Tribunal Service
- Government Sync Service
- Audit Service
- Notification Service
- Billing Service

Cada serviço deve possuir responsabilidades bem definidas e ser desacoplado dos demais.

## 2. Rule Engine
Criar um Motor de Regras Jurídicas. O backend nunca deve utilizar estruturas `if estado == ...` no código.
Toda regra jurídica deve ser carregada do banco de dados contendo no mínimo:
Tribunal, Estado, Área do Direito, Tipo de cálculo, Índice aplicável, Juros, Multas, Honorários, Datas de vigência, Versão, Status, Fonte oficial, Fundamentação legal.
O Calculation Service apenas consulta o Rule Engine.

## 3. Formula Engine
Separar fórmulas matemáticas das regras jurídicas.
A fórmula para hora extra permanece fixa. Os parâmetros são definidos pelas regras.
Fluxo: Formula → Rule → Execution → Resultado

## 4. Index Service
Serviço exclusivo para gerenciamento de índices econômicos (IPCA, INPC, IGP-M, SELIC, CDI, TR, TJLP, UFIR).
Todos os cálculos devem consumir esse serviço. Nunca armazenar valores diretamente no código.

## 5. Government Sync Service
Sincronizar dados oficiais com a seguinte arquitetura:
Scheduler → Providers → Validação → Persistência → Versionamento
Fontes: Banco Central, IBGE, CNJ, TJs, TRTs, TRFs, STJ, STF, Receita Federal, Caixa, INSS.

## 6. Provider Pattern
Toda fonte externa deve implementar uma interface comum (IndexProvider, TribunalProvider, GovernmentProvider).
O restante do sistema nunca deve depender diretamente de APIs externas.

## 7. Versionamento
Nunca sobrescrever informações. Versionar: Índices, Regras, Fórmulas, Fontes, Jurisprudências, Configurações.
Cada cálculo deve ser reproduzível no futuro registrando as versões exatas utilizadas.

## 8. Auditoria
Gerar memória completa do cálculo registrando: usuário, data, parâmetros, regra aplicada, fórmula utilizada, índice, fonte oficial, versão, resultado.

## 9. Cache (Redis)
Implementar cache entre os serviços e os dados oficiais.
Fluxo: Fonte Oficial → Sync → Banco → Redis → Backend.

## 10. Legal Knowledge Base (LKB)
Camada responsável por armazenar todo o conhecimento jurídico do sistema (leis, súmulas, OJs, jurisprudências, regras, índices, fórmulas, vigências, histórico, fontes oficiais).

## 11. Arquitetura Final
Frontend ↓ API Gateway ↓ Calculation Service ↓ Rule Engine 
├── Formula Engine 
├── Index Service 
├── Tribunal Service 
├── Legal Knowledge Base 
├── Government Sync Service 
└── Audit Service

## 12. Planos do SaaS
Feature flags e liberação de funcionalidades por plano:
- **Starter**: Atualização monetária, Cíveis básicos, 50 processos, 1 usuário.
- **Professional**: Trabalhista, Previdenciário, Bancário, Simulações, 5 usuários, API básica.
- **Business**: Usuários ilimitados, Multi-filiais, RBAC, API completa, Dashboards avançados, Auditoria.
- **Enterprise**: Banco dedicado, White Label, Alta disponibilidade, SLA, Backup avançado.

**Objetivo:** Arquitetura modular, DDD, preparada para microserviços, altamente testável, auditável e escalável (data-driven).
