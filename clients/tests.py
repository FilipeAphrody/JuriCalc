import pytest
from rest_framework.test import APIClient
from users.models import CustomUser, Office, Plan, Role, Membership
from clients.models import Client

@pytest.fixture
def setup_data():
    plan = Plan.objects.create(name="Pro", price=100, features={"users": 10})
    office_a = Office.objects.create(name="Office A", cnpj="111", plan=plan)
    office_b = Office.objects.create(name="Office B", cnpj="222", plan=plan)
    
    user_a = CustomUser.objects.create_user(username="usera", email="usera@lex.com", password="pwd")
    user_b = CustomUser.objects.create_user(username="userb", email="userb@lex.com", password="pwd")
    
    role = Role.objects.create(name="Lawyer", permissions={"all": True})
    Membership.objects.create(user=user_a, office=office_a, role=role)
    Membership.objects.create(user=user_b, office=office_b, role=role)
    
    client_a = Client.objects.create(office=office_a, name="Client A", type="PF", document_number="123")
    client_b = Client.objects.create(office=office_b, name="Client B", type="PF", document_number="456")
    
    return {
        "office_a": office_a, "office_b": office_b,
        "user_a": user_a, "user_b": user_b,
        "client_a": client_a, "client_b": client_b
    }

@pytest.mark.django_db
class TestClientAPI:
    def test_tenant_isolation(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data['user_a'])
        
        # User A requests Office A data -> Should see only Client A
        response = client.get('/api/v1/clients/', HTTP_X_OFFICE_ID=str(setup_data['office_a'].id))
        assert response.status_code == 200
        assert response.data['count'] == 1
        assert response.data['results'][0]['name'] == "Client A"
        
    def test_access_denied_to_other_tenant(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data['user_a'])
        
        # User A tries to request Office B data -> Should be forbidden by IsTenantLawyerOrAbove
        response = client.get('/api/v1/clients/', HTTP_X_OFFICE_ID=str(setup_data['office_b'].id))
        assert response.status_code == 403
