# Especificação do Banco de Dados (SaaS Multi-Tenant)

Baseado nas melhores práticas de engenharia de software para plataformas SaaS (Software as a Service) B2B, a arquitetura de dados do LexCalc Pro utilizará o padrão **Shared Database, Shared Schema com Isolamento Lógico (Tenant ID)**. 

Este modelo garante um excelente custo-benefício, performance e escalabilidade. O isolamento de dados entre os escritórios é garantido a nível de aplicação (Filtros no ORM do Django) e segurança a nível de banco (ex: *Row-Level Security* no PostgreSQL).

---

## 1. Regras de Ouro (Best Practices Aplicadas)
1. **Isolamento via `office_id`:** Todas as tabelas que contêm dados de clientes e cálculos possuem uma chave estrangeira obrigatória para o Escritório (`office_id`), funcionando como o `tenant_id`. 
2. **Soft Deletes:** Registros críticos (Clientes, Processos, Cálculos) não são deletados fisicamente com `DELETE`. Eles recebem um carimbo `deleted_at` para recuperação em caso de erros e para manter a integridade da auditoria.
3. **JSONB para Flexibilidade:** O uso de colunas JSON (nativas do PostgreSQL/Modern SQLite) será extensivo para armazenar dados variáveis, como os inputs dinâmicos de diferentes cálculos (Cível vs Trabalhista), evitando criar centenas de colunas nulas.

---

## 2. Modelagem de Entidades (Alto Nível)

### 2.1. Núcleo SaaS e Autenticação (Global)

**`Plan` (Plano)**
- `id` (PK)
- `name` (Ex: Basic, Pro)
- `price` (Decimal)
- `features_json` (Limites de usuários, acesso a motores)

**`Office` (Escritório / Tenant Principal)**
- `id` (PK)
- `name` (String)
- `cnpj` (String, Unique)
- `plan_id` (FK -> Plan)
- `is_active` (Boolean)
- `created_at` (Timestamp)

**`User` (Usuário)**
- `id` (PK)
- `email` (String, Unique)
- `password_hash` (String)
- `is_global_admin` (Boolean)
- `two_factor_enabled` (Boolean)

**`Role` (Permissão/Papel)**
- `id` (PK)
- `name` (Owner, Lawyer, Assistant, Expert)
- `permissions_json` (Lista de grants)

**`Membership` (Vínculo Usuário <> Escritório)**
*Um usuário pode pertencer a mais de um escritório (ex: peritos terceirizados).*
- `id` (PK)
- `user_id` (FK -> User)
- `office_id` (FK -> Office)
- `role_id` (FK -> Role)

---

### 2.2. Gestão Jurídica (Isolada por `office_id`)

**`Client` (Cliente)**
- `id` (PK)
- `office_id` (FK -> Office) **[Isolamento]**
- `type` (Enum: PF / PJ)
- `name` (String)
- `document_number` (CPF/CNPJ)
- `contact_info_json` (Email, Telefones, Endereço)
- `deleted_at` (Soft Delete)

**`Lawsuit` (Processo)**
- `id` (PK)
- `office_id` (FK -> Office) **[Isolamento]**
- `client_id` (FK -> Client)
- `cnj_number` (String, Indexed)
- `status` (Enum: Ativo, Arquivado, etc)
- `metadata_json` (Vara, Comarca, Classe Processual)
- `deleted_at` (Soft Delete)

**`Document` (Documento)**
- `id` (PK)
- `office_id` (FK -> Office)
- `lawsuit_id` (FK -> Lawsuit)
- `file_url` (String/S3 Bucket)
- `version` (Integer)
- `uploaded_by` (FK -> User)
- `tags` (Array)

---

### 2.3. Motores de Cálculo e Matemática

**`EconomicIndex` (Índice Econômico)**
*Tabela Global. Não possui `office_id` pois é compartilhada.*
- `id` (PK)
- `name` (String - Ex: IPCA)
- `date` (Date - Competência)
- `value` (Decimal - Percentual)

**`CalculationType` (Tipo de Cálculo)**
*Tabela Global.*
- `id` (PK)
- `name` (String - Ex: "Trabalhista - Rescisão")
- `schema_validation_json` (Regras de campos obrigatórios)

**`Calculation` (Cálculo Cabeçalho)**
- `id` (PK)
- `office_id` (FK -> Office) **[Isolamento]**
- `lawsuit_id` (FK -> Lawsuit, Nullable para simulações soltas)
- `title` (String)
- `type_id` (FK -> CalculationType)
- `deleted_at` (Soft Delete)

**`CalculationVersion` (Versão do Cálculo)**
*Cada vez que um advogado recalcula, gera-se uma nova versão imutável para histórico.*
- `id` (PK)
- `calculation_id` (FK -> Calculation)
- `version_number` (Integer, Auto-incrementável por cálculo)
- `input_data_json` (Os parâmetros exatos que geraram este cálculo)
- `output_data_json` (A memória de cálculo gerada pelo motor)
- `created_by` (FK -> User)
- `created_at` (Timestamp)

**`Simulation` (Cenário de Simulação)**
- `id` (PK)
- `office_id` (FK -> Office)
- `base_calculation_version_id` (FK -> CalculationVersion)
- `override_params_json` (Quais parâmetros foram alterados. Ex: Juros de 1% para 0.5%)

**`Report` (Relatório / Laudo)**
- `id` (PK)
- `office_id` (FK -> Office)
- `calculation_version_id` (FK -> CalculationVersion)
- `pdf_url` (String)
- `generated_by` (FK -> User)
- `generated_at` (Timestamp)

---

### 2.4. Segurança e Rastreabilidade

**`AuditLog` (Auditoria Imutável)**
*Grava absolutamente todas as mutações no banco (Insert, Update, Delete) de forma assíncrona.*
- `id` (PK)
- `office_id` (FK -> Office)
- `user_id` (FK -> User)
- `action` (Enum: CREATE, UPDATE, DELETE)
- `table_name` (String)
- `record_id` (Integer)
- `old_values_json` (Snapshot antes da alteração)
- `new_values_json` (Snapshot após a alteração)
- `timestamp` (Timestamp)

---

## 3. Próximos Passos Sugeridos (ORM Django)
Para implementar essa estrutura no Django sem correr risco de vazar dados entre escritórios, a recomendação é construir um **Custom Manager** ou **Middleware** genérico que intercepte todas as queries do banco e aplique automaticamente o filtro `.filter(office_id=request.user.current_office_id)`.
