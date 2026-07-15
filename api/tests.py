import pytest
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile
from users.models import CustomUser, Office, Plan, Role, Membership
from core.models import Calculation, CalculationVersion, AuditLog

@pytest.fixture
def setup_e2e():
    plan = Plan.objects.create(name="Pro", price=100, features={"users": 10})
    office = Office.objects.create(name="Office E2E", cnpj="9999999", plan=plan)
    
    user = CustomUser.objects.create_user(username="e2euser", email="e2e@lexcalc.com", password="securepassword")
    role = Role.objects.create(name="Lawyer", permissions={"all": True})
    Membership.objects.create(user=user, office=office, role=role)
    
    return {"office": office, "user": user, "password": "securepassword"}

@pytest.mark.django_db
class TestEndToEndJourney:
    def test_full_lawyer_journey(self, setup_e2e):
        client = APIClient()
        
        # 1. Login (Obter JWT)
        response = client.post('/api/v1/auth/token/', {
            "username": "e2euser",
            "password": "securepassword"
        })
        assert response.status_code == 200
        token = response.data['access']
        
        # Injeta o Token e o cabeçalho Multi-Tenant
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}', HTTP_X_OFFICE_ID=str(setup_e2e['office'].id))
        
        # 2. Cadastrar Cliente
        client_payload = {"name": "Cliente E2E", "type": "PF", "document_number": "123456"}
        response = client.post('/api/v1/clients/', client_payload)
        assert response.status_code == 201
        client_id = response.data['id']
        
        # 3. Cadastrar Processo
        lawsuit_payload = {"client": client_id, "cnj_number": "0000000-00.0000.0.00.0000", "status": "ACTIVE"}
        response = client.post('/api/v1/lawsuits/', lawsuit_payload)
        assert response.status_code == 201
        lawsuit_id = response.data['id']
        
        # 4. Upload de Documento do Processo
        dummy_file = SimpleUploadedFile("procuracao.pdf", b"file_content", content_type="application/pdf")
        doc_payload = {"client": client_id, "lawsuit": lawsuit_id, "file": dummy_file, "filename": "procuracao.pdf"}
        response = client.post('/api/v1/documents/', doc_payload, format='multipart')
        assert response.status_code == 201
        
        # 5. Executar Cálculo (Engatilhado ao Processo e ao Cliente)
        calc_payload = {
            "title": "Cálculo de Indenização - Cliente E2E",
            "client_id": client_id,
            "lawsuit_id": lawsuit_id,
            "principal": 10000,
            "interest_rate": 1.0,
            "index_name": "INPC",
            "start_date": "2023-01-01",
            "end_date": "2023-12-31"
        }
        response = client.post('/api/v1/civil/calculate/', calc_payload, format='json')
        assert response.status_code == 200, response.data
        
        meta = response.data['meta']
        assert meta['version_number'] == 1
        assert "result" in response.data
        
        # 6. Verificar Banco de Dados e Auditoria (Rastreabilidade)
        assert Calculation.objects.count() == 1
        assert CalculationVersion.objects.count() == 1
        assert AuditLog.objects.count() == 1
        
        log = AuditLog.objects.first()
        assert log.calculation_version.id == meta['version_id']
        assert "e2e@lexcalc.com" in log.details
        assert "Cálculo de Indenização - Cliente E2E" in log.details
