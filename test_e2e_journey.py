import os
import django
from django.test import Client
import json
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lexcalc.settings')
django.setup()

client = Client()

unique_id = str(uuid.uuid4())[:8]
email = f"user_{unique_id}@vademath.com"
password = "securepassword123"

print("--- ETAPA 1: Registro (Mock Frontend -> API Real) ---")
res_reg = client.post('/api/v1/auth/register/', {
    'name': 'Advogado E2E',
    'email': email,
    'company': 'Escritorio E2E',
    'password': password
}, content_type='application/json')
print("Registro Status:", res_reg.status_code)

print("\n--- ETAPA 2: Login (Obtencao de JWT + Office ID) ---")
res_login = client.post('/api/v1/auth/token/', {
    'username': email,
    'password': password
}, content_type='application/json')
print("Login Status:", res_login.status_code)
login_data = res_login.json()
token = login_data.get('access')
user_data = login_data.get('user', {})
office_id = user_data.get('officeId')
print("Obtido Access Token e User Payload:", user_data)

print("\n--- ETAPA 3: Motor de Calculo (API Autenticada + Multi-Tenant) ---")
res_calc = client.post('/api/v1/civil/calculate/', {
    "client_id": 1,
    "title": "Cálculo Trabalhista Teste",
    "principal": 1000.00,
    "start_date": "2023-01-01",
    "end_date": "2023-12-31",
    "index_name": "INPC",
    "interest_rate": 0.01,
    "honorarium_rate": 0.20
}, content_type='application/json', HTTP_AUTHORIZATION=f"Bearer {token}", HTTP_X_OFFICE_ID=str(office_id))

print("Calc Status:", res_calc.status_code)
if res_calc.status_code == 200:
    print("Resultado do Calculo E2E:", json.dumps(res_calc.json(), indent=2))
else:
    print("Erro no calculo:", res_calc.content.decode())

print("\n=== JORNADA E2E CONCLUIDA COM SUCESSO ===")
