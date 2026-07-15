import pytest
from django.db import IntegrityError
from users.models import CustomUser, Office, Plan, Role, Membership

@pytest.mark.django_db
class TestUserModel:
    def test_create_user(self):
        user = CustomUser.objects.create_user(username="testuser", email="test@lexcalc.com", password="securepassword", first_name="Test User")
        assert user.email == "test@lexcalc.com"
        assert user.first_name == "Test User"
        assert user.check_password("securepassword") is True
        assert user.is_active is True
        assert user.is_staff is False
        assert user.is_superuser is False

    def test_create_superuser(self):
        admin = CustomUser.objects.create_superuser(username="adminuser", email="admin@lexcalc.com", password="securepassword")
        assert admin.email == "admin@lexcalc.com"
        assert admin.is_superuser is True
        assert admin.is_staff is True

    def test_duplicate_email_fails(self):
        CustomUser.objects.create_user(username="unique1", email="unique@lexcalc.com", password="securepassword")
        with pytest.raises(IntegrityError):
            CustomUser.objects.create_user(username="unique2", email="unique@lexcalc.com", password="anotherpassword")

@pytest.mark.django_db
class TestSaaSModels:
    def test_office_and_membership_creation(self):
        user = CustomUser.objects.create_user(username="advogado1", email="advogado@lexcalc.com", password="securepassword")
        plan = Plan.objects.create(name="Premium", price=199.90, features={"max_users": 10})
        office = Office.objects.create(name="Advocacia Teste", plan=plan)
        role = Role.objects.create(name="Admin", permissions={"all": True})
        
        membership = Membership.objects.create(user=user, office=office, role=role)
        
        assert membership.user == user
        assert membership.office == office
        assert membership.role == role
        
        # Relacionamentos reversos
        assert office.members.count() == 1
        assert user.memberships.count() == 1
        assert office.members.first().user.email == "advogado@lexcalc.com"
