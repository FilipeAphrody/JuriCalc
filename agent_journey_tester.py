import os
import sys
import django
from django.test import Client
import json
import uuid

os.environ['DATABASE_URL'] = 'postgresql://neondb_owner:npg_3pANijdnVk4r@ep-quiet-glitter-ac1q0j3j.sa-east-1.aws.neon.tech/neondb?sslmode=require'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lexcalc.settings')
django.setup()

def run_tests(agent_id):
    client = Client()
    unique_id = str(uuid.uuid4())[:8]
    email = f"agent_{agent_id}_{unique_id}@vademath.com"
    password = "securepassword123"

    print(f"[Agent {agent_id}] ETAPA 1: Registro")
    res_reg = client.post('/api/v1/auth/register/', {
        'name': f'Agent {agent_id}',
        'email': email,
        'company': f'Agency {agent_id}',
        'password': password
    }, content_type='application/json')
    assert res_reg.status_code in [200, 201], f"Registro falhou: {res_reg.status_code} {res_reg.content}"

    print(f"[Agent {agent_id}] ETAPA 2: Login")
    res_login = client.post('/api/v1/auth/token/', {
        'username': email,
        'password': password
    }, content_type='application/json')
    assert res_login.status_code == 200, "Login falhou"
    login_data = res_login.json()
    token = login_data['access']
    office_id = str(login_data['user']['officeId'])

    headers = {'HTTP_AUTHORIZATION': f"Bearer {token}", 'HTTP_X_OFFICE_ID': office_id}

    print(f"[Agent {agent_id}] ETAPA 3: Calculo Civel")
    res_civil = client.post('/api/v1/civil/calculate/', {
        "principal": 1000.00, "start_date": "2023-01-01", "end_date": "2023-12-31",
        "index_name": "INPC", "interest_rate": 0.01
    }, content_type='application/json', **headers)
    assert res_civil.status_code == 200, f"Civel falhou: {res_civil.content}"

    print(f"[Agent {agent_id}] ETAPA 4: Calculo Trabalhista (Horas Extras)")
    res_labor = client.post('/api/v1/labor/overtime/', {
        "base_salary": 3000.00, "overtime_hours": 20, "overtime_percentage": 0.50
    }, content_type='application/json', **headers)
    assert res_labor.status_code == 200, f"Trabalhista falhou: {res_labor.content}"

    print(f"[Agent {agent_id}] ETAPA 5: Calculo Tributario (Restituicao)")
    res_tax = client.post('/api/v1/tax/calculate/', {
        "principal": 5000.00, "start_date": "2023-01-01", "end_date": "2023-12-31", "fine_percentage": 0.0
    }, content_type='application/json', **headers)
    assert res_tax.status_code == 200, f"Tributario falhou: {res_tax.content}"

    print(f"[Agent {agent_id}] ETAPA 6: Calculo Bancario (Amortizacao)")
    res_banking = client.post('/api/v1/banking/amortization/', {
        "principal": 10000.00, "rate": 0.02, "periods": 12, "system": "PRICE"
    }, content_type='application/json', **headers)
    assert res_banking.status_code == 200, f"Bancario falhou: {res_banking.content}"

    print(f"[Agent {agent_id}] ETAPA 7: Calculo Previdenciario (Atrasados)")
    res_pension = client.post('/api/v1/pension/delayed/', {
        "monthly_benefit": 1500.00, "start_date": "2023-01-01", "end_date": "2023-12-31"
    }, content_type='application/json', **headers)
    assert res_pension.status_code == 200, f"Previdenciario falhou: {res_pension.content}"

    print(f"[Agent {agent_id}] ETAPA 8: Calculo Familia (Alimentos)")
    res_family = client.post('/api/v1/family/alimony/', {
        "monthly_alimony": 2000.00, "start_date": "2023-01-01", "end_date": "2023-12-31"
    }, content_type='application/json', **headers)
    assert res_family.status_code == 200, f"Familia falhou: {res_family.content}"

    print(f"[Agent {agent_id}] Todos os 6 motores testados com sucesso!")

if __name__ == '__main__':
    agent_idx = sys.argv[1] if len(sys.argv) > 1 else '0'
    run_tests(agent_idx)
