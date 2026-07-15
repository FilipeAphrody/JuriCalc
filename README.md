# VadeMath

Plataforma SaaS Multi-Tenant para cálculos judiciais abrangendo as áreas: Trabalhista, Previdenciária, Tributária, Cível, Família e Bancária. Construído com Django e Django REST Framework.

## Tecnologias
- Django 6.0+
- Django REST Framework
- OpenAPI / Swagger (drf-spectacular)
- SQLite (Local) / PostgreSQL (Produção)

## Configuração do Ambiente Local

1. Crie e ative o ambiente virtual:
```bash
python -m venv venv
venv\Scripts\activate
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Execute as migrações do banco de dados:
```bash
python manage.py migrate
```

4. Rode os testes automatizados da suíte:
```bash
python manage.py test
```

5. Inicie o servidor:
```bash
python manage.py runserver
```

Acesse a documentação da API em `http://localhost:8000/api/docs/`.

## Arquitetura (Monólito Modular)

O projeto é dividido em domínios específicos para garantir manutenibilidade:

- **Auth & SaaS (`users`)**: Autenticação via JWT (SimpleJWT). Implementa o modelo de Multi-Tenancy através da entidade `Office` (Escritório), além de `Role` e `Membership` para controle de acesso (RBAC).
- **Versionamento e Auditoria (`core`)**: Modelo `Calculation` unificado, e snapshots imutáveis (`CalculationVersion`) das entradas e saídas. Integração com Django Signals para geração automática e inviolável de logs no modelo `AuditLog`.
- **Gestão de Clientes (`clients`)**: Cadastro centralizado de pessoas físicas e jurídicas atrelados ao escritório.
- **Gestão de Processos (`lawsuits`)**: Controle de processos (com `cnj_number` indexado) vinculados aos clientes do escritório.
- **Gestão de Documentos (`documents`)**: Upload e versionamento de arquivos vinculados a processos ou clientes.
- **Motores de Cálculo (`engines.*`)**: Regras de negócio isoladas (Cível, Trabalhista, Tributário, Bancário, Família, Previdenciário).
- **Isolamento de Dados (`core.filters`)**: Todas as rotas de gestão são protegidas pelo `TenantFilterBackend`, que exige o cabeçalho `X-Office-ID` para evitar vazamento de dados.

## Frontend (React + Vite)

O front-end foi construído seguindo os padrões do FSA (Feature-Sliced Architecture), oferecendo uma experiência premium (UX/UI):
- **React 19** + **Vite**
- **TypeScript** rigoroso para type-safety de ponta a ponta.
- **Zustand** para gerenciamento de estado global da autenticação.
- **React Hook Form** + **Zod** para validação robusta de formulários.
- **Axios** com interceptadores automáticos de JWT e `X-Office-ID`.
- **CSS Modules** para estilos locais de altíssimo padrão, design *Glassmorphism* e Dark Mode.

### Executando o Frontend
1. Acesse o diretório do front-end:
```bash
cd frontend
```
2. Instale as dependências:
```bash
npm install
```
3. Rode o servidor de desenvolvimento:
```bash
npm run dev
```

## Quality Assurance & Testes E2E (MSW)

O projeto possui altíssima cobertura de código e isolamento para garantia de qualidade.
- No **Back-end**, utilizamos `pytest` e `django-pytest` testando Rate Limiting, Roles (RBAC) e Engine de Cálculos exatos.
- No **Front-end**, utilizamos **Vitest** + **React Testing Library** + **JSDOM**. 
- A rede do Front-end é completamente interceptada pelo **Mock Service Worker (MSW)**, garantindo E2E limpo, mockando *Unhappy Paths* (ex: HTTP 401 Unauthorized, HTTP 504 Gateway Timeout) e validando o comportamento de resiliência da interface gráfica sem tocar no servidor real. 

Para rodar os testes do Frontend com relatório de cobertura (Coverage):
```bash
npm run coverage
```
