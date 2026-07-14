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
