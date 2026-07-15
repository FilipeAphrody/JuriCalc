import pytest
from rest_framework.test import APIClient
from users.models import CustomUser, Office, Plan, Role, Membership
from clients.models import Client
from lawsuits.models import Lawsuit

@pytest.fixture
def setup_data():
    plan = Plan.objects.create(name="Pro", price=100, features={"users": 10})
    office_a = Office.objects.create(name="Office A", cnpj="111", plan=plan)
    
    user_a = CustomUser.objects.create_user(username="usera", email="usera@lex.com", password="pwd")
    role = Role.objects.create(name="Lawyer", permissions={"all": True})
    Membership.objects.create(user=user_a, office=office_a, role=role)
    
    client_a = Client.objects.create(office=office_a, name="Client A", type="PF", document_number="123")
    
    lawsuit_a = Lawsuit.objects.create(
        office=office_a, 
        client=client_a, 
        cnj_number="0000000-00.0000.0.00.0000",
        status="ACTIVE"
    )
    
    return {
        "office_a": office_a, "user_a": user_a, "client_a": client_a, "lawsuit_a": lawsuit_a
    }

@pytest.mark.django_db
class TestLawsuitAPI:
    def test_lawsuit_creation_with_valid_client(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data['user_a'])
        
        payload = {
            "client": setup_data['client_a'].id,
            "cnj_number": "1111111-11.1111.1.11.1111",
            "status": "ACTIVE"
        }
        
        response = client.post('/api/v1/lawsuits/', data=payload, format='json', HTTP_X_OFFICE_ID=str(setup_data['office_a'].id))
        assert response.status_code == 201
        assert response.data['cnj_number'] == "1111111-11.1111.1.11.1111"

    def test_soft_delete(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data['user_a'])
        
        lawsuit_id = setup_data['lawsuit_a'].id
        
        # Soft delete
        response = client.delete(f'/api/v1/lawsuits/{lawsuit_id}/', HTTP_X_OFFICE_ID=str(setup_data['office_a'].id))
        assert response.status_code == 204
        
        # Verifica que não é mais listado
        response = client.get('/api/v1/lawsuits/', HTTP_X_OFFICE_ID=str(setup_data['office_a'].id))
        assert response.data['count'] == 0
        
        # Mas ainda existe no DB com deleted_at preenchido
        setup_data['lawsuit_a'].refresh_from_db()
        assert setup_data['lawsuit_a'].deleted_at is not None
