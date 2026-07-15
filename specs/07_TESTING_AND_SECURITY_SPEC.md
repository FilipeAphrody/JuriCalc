# 07 - Estratégia de Testes e Segurança

Este documento define a arquitetura de Quality Assurance (QA) e Segurança da plataforma, garantindo que o sistema seja testável, resiliente e blindado contra ameaças externas e vazamento de dados (Multi-Tenant).

## 1. Estratégia de Testes de Software

### 1.1. Testes Unitários (Unit Tests)
- **Foco**: Funções isoladas, métodos de models e services (ex: motores de cálculo matemáticos).
- **Ferramentas**: `django.test.TestCase` e `pytest-django`.
- **Alvo**: Testar lógica de formatação de JSON, cálculo financeiro e métodos estáticos.

### 1.2. Testes de Integração (Integration Tests)
- **Foco**: Interação entre Módulos (ex: Quando um Processo é criado, o Cliente existe? Quando a Versão de Cálculo é salva, o AuditLog é acionado via Signals?).
- **Alvo**: Serializers (DRF) conectados com os Models e Signals.

### 1.3. Testes Funcionais / Sistema
- **Foco**: Comportamento dos Endpoints da API REST.
- **Ferramentas**: `APIClient` do Django REST Framework.
- **Alvo**: Validar retorno de Status HTTP (200 OK, 400 Bad Request, 403 Forbidden).

### 1.4. Testes de Regressão
- **Foco**: Garantir que alterações novas (ex: mudar o CustomUser) não quebrem os motores de cálculo desenvolvidos nas fases 1 a 3. Automatizado via GitHub Actions CI.

### 1.5. Testes End-to-End (E2E)
- **Foco**: Simular o fluxo completo de um Escritório: Criar Plano -> Criar Office -> Criar Advogado -> Logar com JWT -> Criar Cliente -> Criar Processo -> Realizar Cálculo Trabalhista -> Verificar Auditoria.
- **Ferramentas**: Pode ser automatizado localmente via `APIClient` simulando jornadas inteiras.

## 2. Estratégia de Segurança

### 2.1. Teste de Configuração (Security Check)
- **Foco**: Validar as configurações do Django (`settings.py`) para ambiente de produção (CORS, CSRF, Secure Cookies, HSTS).
- **Ferramenta**: `python manage.py check --deploy`.

### 2.2. Análise Estática de Segurança (SAST)
- **Foco**: Encontrar código perigoso sem rodar o projeto (ex: senhas *hardcoded*, SQL Injection, uso de métodos inseguros).
- **Ferramenta**: `bandit`.

### 2.3. Análise de Dependências (SCA - Software Composition Analysis)
- **Foco**: Encontrar vulnerabilidades (CVEs) em bibliotecas listadas no `requirements.txt`.
- **Ferramentas**: `pip-audit` ou `safety`.

### 2.4. Testes de Segurança Isolada (Tenant & RBAC)
- **Foco**: Testar se os *TenantFilters* realmente bloqueiam vazamentos (IDOR). Tentar acessar um processo do Office A usando o Token de um Usuário do Office B. Validar os papéis (ex: Assistant tentando deletar cálculo).
- **Implementação**: Testes em `TestCase` focados puramente em Auth/Permissões.

### 2.5. Análise Dinâmica de Segurança (DAST)
- **Foco**: Mapeamento ativo de vulnerabilidades (XSS, Auth bypass).
- **Plano**: A API exporá o Swagger OpenAPI, que pode ser importado diretamente no OWASP ZAP para fuzzing dinâmico.
