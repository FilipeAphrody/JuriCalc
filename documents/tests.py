import pytest
from rest_framework.test import APIClient
from users.models import CustomUser, Office, Plan, Role, Membership
from clients.models import Client
from lawsuits.models import Lawsuit
from documents.models import Document
from django.core.files.uploadedfile import SimpleUploadedFile

@pytest.fixture
def setup_data():
    plan = Plan.objects.create(name="Pro", price=100, features={"users": 10})
    office_a = Office.objects.create(name="Office A", cnpj="111", plan=plan)
    
    user_a = CustomUser.objects.create_user(username="usera", email="usera@lex.com", password="pwd")
    role = Role.objects.create(name="Lawyer", permissions={"all": True})
    Membership.objects.create(user=user_a, office=office_a, role=role)
    
    client_a = Client.objects.create(office=office_a, name="Client A", type="PF")
    lawsuit_a = Lawsuit.objects.create(office=office_a, client=client_a, cnj_number="123")
    
    return {
        "office_a": office_a, "user_a": user_a, "client_a": client_a, "lawsuit_a": lawsuit_a
    }

@pytest.mark.django_db
class TestDocumentAPI:
    def test_document_upload(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data['user_a'])
        
        # Simulando um arquivo
        dummy_file = SimpleUploadedFile("test_doc.pdf", b"file_content", content_type="application/pdf")
        
        payload = {
            "client": setup_data['client_a'].id,
            "lawsuit": setup_data['lawsuit_a'].id,
            "file": dummy_file,
            "filename": "test_doc.pdf"
        }
        
        response = client.post('/api/v1/documents/', data=payload, format='multipart', HTTP_X_OFFICE_ID=str(setup_data['office_a'].id))
        
        assert response.status_code == 201, response.data
        assert response.data['filename'] == "test_doc.pdf"
        assert response.data['uploaded_by'] == setup_data['user_a'].id
        
        # Verifica se o arquivo foi atrelado ao Office correto
        doc = Document.objects.get(id=response.data['id'])
        assert doc.office == setup_data['office_a']
