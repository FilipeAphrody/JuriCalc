import pytest
from rest_framework.test import APIClient
from users.models import CustomUser, Office, Plan, Role, Membership
from clients.models import Client
from lawsuits.models import Lawsuit

@pytest.fixture
def security_setup():
    plan = Plan.objects.create(name="Pro", price=100)
    office_a = Office.objects.create(name="Office A", cnpj="1111", plan=plan)
    office_b = Office.objects.create(name="Office B", cnpj="2222", plan=plan)
    
    # Roles
    role_lawyer = Role.objects.create(name="Lawyer", permissions={"all": True})
    role_assistant = Role.objects.create(name="Assistant", permissions={"all": False})
    
    # Users
    user_a = CustomUser.objects.create_user(username="usera", email="usera@lex.com", password="pwd")
    user_b = CustomUser.objects.create_user(username="userb", email="userb@lex.com", password="pwd")
    user_assistant = CustomUser.objects.create_user(username="assistant", email="assist@lex.com", password="pwd")
    
    # Memberships
    Membership.objects.create(user=user_a, office=office_a, role=role_lawyer)
    Membership.objects.create(user=user_b, office=office_b, role=role_lawyer)
    Membership.objects.create(user=user_assistant, office=office_a, role=role_assistant)
    
    # Data
    client_b = Client.objects.create(office=office_b, name="Client B", type="PF")
    lawsuit_b = Lawsuit.objects.create(office=office_b, client=client_b, cnj_number="123")
    
    return {
        "office_a": office_a, "office_b": office_b,
        "user_a": user_a, "user_b": user_b, "user_assistant": user_assistant,
        "client_b": client_b, "lawsuit_b": lawsuit_b
    }

@pytest.mark.django_db
class TestSecurityAPI:
    def test_rbac_assistant_access_denied(self, security_setup):
        """
        Teste de Controle de Acesso Baseado em Papel (RBAC).
        Assistant não deve ter permissão para acessar endpoints restritos a Advogados.
        """
        client = APIClient()
        client.force_authenticate(user=security_setup['user_assistant'])
        
        response = client.get('/api/v1/clients/', HTTP_X_OFFICE_ID=str(security_setup['office_a'].id))
        assert response.status_code == 403
        assert "permission" in str(response.data).lower()
        
    def test_idor_lawsuit_access(self, security_setup):
        """
        Teste de Insecure Direct Object Reference (IDOR).
        Usuário A tenta ler um Processo passando a ID do Processo do Usuário B.
        O TenantFilterBackend deve ocultar o dado, retornando 404.
        """
        client = APIClient()
        client.force_authenticate(user=security_setup['user_a'])
        
        lawsuit_b_id = security_setup['lawsuit_b'].id
        
        response = client.get(f'/api/v1/lawsuits/{lawsuit_b_id}/', HTTP_X_OFFICE_ID=str(security_setup['office_a'].id))
        assert response.status_code == 404
        
    def test_idor_cross_tenant_header(self, security_setup):
        """
        Teste de Falsificação de Tenant Header.
        Usuário A tenta enviar X-Office-ID do Escritório B para burlar o acesso.
        IsTenantLawyerOrAbove deve cruzar User vs Office e retornar 403.
        """
        client = APIClient()
        client.force_authenticate(user=security_setup['user_a'])
        
        response = client.get('/api/v1/clients/', HTTP_X_OFFICE_ID=str(security_setup['office_b'].id))
        assert response.status_code == 403
