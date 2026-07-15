import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lexcalc.settings')
django.setup()

from users.models import CustomUser, Office, Plan, Role, Membership

def setup():
    plan, _ = Plan.objects.get_or_create(name="Pro", defaults={"price": 100})
    role_lawyer, _ = Role.objects.get_or_create(name="Lawyer", defaults={"permissions": {"all": True}})
    
    office_a, _ = Office.objects.get_or_create(name="Office QA A", cnpj="QA111", defaults={"plan": plan})
    user_1, created_1 = CustomUser.objects.get_or_create(username="agent1", email="agent1@lex.com")
    if created_1:
        user_1.set_password("pwd_agent1")
        user_1.save()
    Membership.objects.get_or_create(user=user_1, office=office_a, role=role_lawyer)
    
    office_b, _ = Office.objects.get_or_create(name="Office QA B", cnpj="QA222", defaults={"plan": plan})
    user_2, created_2 = CustomUser.objects.get_or_create(username="agent2", email="agent2@lex.com")
    if created_2:
        user_2.set_password("pwd_agent2")
        user_2.save()
    Membership.objects.get_or_create(user=user_2, office=office_b, role=role_lawyer)

    print("=== DATA SETUP SUCCESS ===")
    print(f"OFFICE_A_ID={office_a.id}")
    print(f"OFFICE_B_ID={office_b.id}")
    with open('qa_data.txt', 'w') as f:
        f.write(f"{office_a.id},{office_b.id}")

if __name__ == '__main__':
    setup()
