# Especificação de Perfis de Acesso (RBAC) e SaaS

Esta especificação define a hierarquia de usuários, controle de acesso baseado em funções (RBAC - Role-Based Access Control) e o modelo multi-tenant (Escritórios) para a plataforma LexCalc Pro.

## 1. Modelo Multi-Tenant (Escritórios)
O sistema operará sob um modelo Multi-Tenant. O **Escritório** (Tenant) atua como a entidade isoladora. Os dados (processos, clientes, simulações) são encapsulados dentro de um Escritório, garantindo privacidade e segurança. 

## 2. Perfis de Usuários (Roles) e Permissões

### 2.1. Administrador (Global Admin)
Perfil de gestão geral da plataforma SaaS. Possui acesso transversal a todos os dados se necessário (Superuser).
**Permissões (Pode):**
- **Gerenciar usuários:** Criar, bloquear ou auditar qualquer conta na plataforma.
- **Gerenciar planos:** Criar tiers (ex: Basic, Pro, Enterprise), configurar limites e integrações de pagamento.
- **Gerenciar índices econômicos:** Alimentar a base (`EconomicIndex`) com IPCA, INPC, SELIC.
- **Atualizar tabelas oficiais:** Manter tabelas do IRRF, INSS, Salário Mínimo, etc.
- **Logs e Auditoria:** Rastrear todas as ações no sistema (`AuditLog`).
- **Assinaturas:** Gerenciar faturamentos, inadimplência e renovações dos Escritórios.
- **Permissões:** Ajustar as regras de acesso globais.

### 2.2. Escritório (Tenant Owner / Gestor)
Administrador da sua própria instância corporativa dentro da plataforma.
**Permissões (Pode):**
- **Criar equipes:** Segmentar usuários internamente (ex: Equipe Trabalhista, Equipe Cível).
- **Convidar usuários:** Adicionar Advogados, Assistentes e Peritos ao seu workspace.
- **Compartilhar processos:** Definir níveis de visibilidade de processos dentro do escritório.
- **Gerenciar clientes:** Cadastro unificado de clientes do escritório.
- **Relatórios:** Extrair relatórios de produtividade (quantos cálculos feitos) e relatórios financeiros do escritório.

### 2.3. Advogado
Usuário central, responsável pela produção jurídica.
**Permissões (Pode):**
- **Criar processos:** Iniciar novos fluxos processuais e atrelar a clientes.
- **Fazer cálculos:** Acesso completo aos motores (Civil, Trabalhista, Tributário, etc).
- **Exportar documentos:** Gerar PDFs com as memórias de cálculo.
- **Simulações:** Realizar rascunhos e simulações sem precisar salvar oficialmente no histórico de um processo.

### 2.4. Assistente Jurídico
Perfil operacional e de alimentação de dados.
**Permissões (Pode):**
- **Inserir dados:** Cadastro inicial de clientes, partes e qualificação.
- **Atualizar processos:** Mudar status, inserir movimentações processuais.
- **Gerar relatórios:** Emitir relatórios de andamento e extratos para prestação de contas.
- *Nota técnica:* Suas permissões de cálculo podem ser restritas apenas a leitura ou dependentes de validação de um Advogado.

### 2.5. Contador/Perito
Perfil focado estritamente na auditoria e complexidade matemática.
**Permissões (Pode):**
- **Elaborar laudos:** Criar pareceres técnicos em cima dos cálculos gerados pelos motores.
- **Memórias de cálculo:** Auditar e ajustar parâmetros avançados.
- **Relatórios técnicos:** Exportar documentos com rigor pericial.
- *Nota técnica:* Geralmente, o acesso deste perfil é limitado aos processos em que ele foi explicitamente alocado, sem acesso à gestão do escritório.

## 3. Diretrizes Técnicas para Implementação (Arquitetura IAM)
- **Extensão do User Model:** Utilizar um modelo `CustomUser` estendendo `AbstractUser` do Django.
- **Estrutura de Banco de Dados:**
  - `Office` (Escritório): Representa o Tenant (Nome, CNPJ, Plano Ativo).
  - `Membership` (Vínculo): Tabela pivô entre `User` e `Office`, onde o campo `role` define se ele é *Owner* (Escritório), *Lawyer*, *Assistant* ou *Expert*.
- **Controle de Acesso:** Implementar as permissões a nível de API utilizando o sistema de `permissions` do Django REST Framework (ex: `IsGlobalAdmin`, `IsOfficeOwner`, `IsLawyer`).
