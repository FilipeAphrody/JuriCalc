# LexCalc Pro

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
- **Gestão de Clientes (`clients`)**: Cadastro centralizado de pessoas físicas e jurídicas atrelados ao escritório.
- **Gestão de Processos (`lawsuits`)**: Controle de processos (com `cnj_number` indexado) vinculados aos clientes do escritório.
- **Gestão de Documentos (`documents`)**: Upload e versionamento de arquivos vinculados a processos ou clientes.
- **Motores de Cálculo (`engines.*`)**: Regras de negócio isoladas (Cível, Trabalhista, Tributário, Bancário, Família, Previdenciário).
- **Isolamento de Dados (`core.filters`)**: Todas as rotas de gestão são protegidas pelo `TenantFilterBackend`, que exige o cabeçalho `X-Office-ID` para evitar vazamento de dados.
